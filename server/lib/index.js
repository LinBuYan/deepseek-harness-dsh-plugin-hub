/**
 * deepseek-harness-dsh-plugin-hub-server —— DSH 插件中心服务端
 *
 * 能力：
 *   1. GET  /api/gh-watch/overview
 *      读取 dsh-overview.yaml（DSH 整体情况），并把「自动采集区」
 *      用真实环境状态实时刷新后写回文件——保证涉及 dsh 的任何改动
 *      （装插件/改配置/MCP/模型/预设/技能）都会反映在文件里。
 *   2. POST /api/gh-watch/install  { pkg }
 *      校验 npm 包名后执行 `dsh plugin --profile web add <pkg>`，
 *      成功后自动向 dsh-overview.yaml 的「变更记录」追加一条并刷新自动采集区。
 *
 * 安装：作为本地插件包放在 profiles/node_modules 树内（Cordis 插件即包），
 *       profile patch 用包名 deepseek-harness-dsh-plugin-hub-server 引用。
 *       ⚠️ npm 升级 @deepseek-ai/dsh 后需重新复制本目录（源副本见本仓库 server/）。
 */
import { spawn } from "node:child_process";
import { readFile, writeFile, readdir } from "node:fs/promises";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import * as mcpClient from "@deepseek-ai/dsh-mcp-client";
import { load as yamlLoad } from "js-yaml";

export const name = "plugin-hub-server";

const HOME = process.env.DSH_HOME || join(homedir(), ".dsh");
const PROFILE = process.env.DSH_PROFILE || "web";
const PORT = process.env.DSH_WEB_PORT || "8093";
const OVERVIEW = join(HOME, "dsh-overview.yaml");
const PATCH = join(HOME, "profiles", PROFILE, "cordis.patch.yml");
const SETTINGS = join(HOME, "settings.yaml");
const PROFILE_PKG = join(HOME, "profiles", PROFILE, "package.json");
const DSH_PKG = join(HOME, "profiles", "node_modules", "@deepseek-ai", "dsh", "package.json");
const BIN = fileURLToPath(new URL("../../dsh/lib/bin.js", import.meta.url));
const PKG_RE = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/; const GIT_RE = /^(?:git\+https?:\/\/|git:\/\/|git@|https?:\/\/|github:)/; const isValidSpec = (s) => PKG_RE.test(s) || GIT_RE.test(s);
const INSTALL_TIMEOUT_MS = 5 * 60 * 1000;
const MCP_FILE = join(HOME, "mcp-servers.yml");

/* dsh-overview.yaml 分区块标记（行级定位，避免依赖 yaml 库） */
const MARK_AUTO = "# ===== 自动采集区";
const MARK_MANUAL = "# ===== 手动维护区";
const MARK_CHANGE = "# ===== 变更记录";

function nowDate() {
	return new Date().toISOString().slice(0, 10);
}

/* ------------------------------------------------------------------ */
/* 自动采集：从真实环境读取 dsh 状态                                    */
/* ------------------------------------------------------------------ */
async function collectAuto() {
	const lines = [];
	/* dsh 版本 */
	let version = "unknown";
	try {
		const pkg = JSON.parse(await readFile(DSH_PKG, "utf8"));
		version = pkg.version || version;
	} catch { /* ignore */ }
	lines.push("dsh_version: " + version);

	/* web 端口：沿用文件已有值（启动参数决定），无则默认 8093 */
	lines.push("web_port: " + PORT);
	lines.push("web_profile: " + PROFILE);
	lines.push("dsh_home: " + HOME);
	lines.push("workspace: " + (process.env.DSH_WORKSPACE || process.cwd() || ""));

	/* 默认模型（settings.yaml） */
	let provider = "", model = "", effort = "";
	try {
		const raw = await readFile(SETTINGS, "utf8");
		const m = raw.match(/agent-default-model:[\s\S]*?provider:\s*(\S+)[\s\S]*?model:\s*(\S+)[\s\S]*?reasoningEffort:\s*(\S+)/);
		if (m) { provider = m[1]; model = m[2]; effort = m[3]; }
	} catch { /* ignore */ }
	lines.push("default_model:");
	lines.push("  provider: " + (provider || "unknown"));
	lines.push("  model: " + (model || "unknown"));
	lines.push("  reasoning_effort: " + (effort || "max"));

	/* 已装插件：cordis.patch.yml 的 id 列表（MCP 附带 serverName） */
	const plugins = [];
	try {
		const raw = await readFile(PATCH, "utf8");
		const idRe = /^\s*- id:\s*(\S+)\s*$/gm;
		let m;
		while ((m = idRe.exec(raw)) !== null) {
			const id = m[1];
			const sn = raw.slice(m.index).match(/serverName:\s*(\S+)/);
			plugins.push(sn ? (id + " (" + sn[1] + ")") : id);
		}
	} catch { /* ignore */ }
	lines.push("installed_plugins:");
	if (plugins.length === 0) lines.push("  - (none)");
	for (const p of plugins) lines.push("  - " + p);

	/* 业务预设 + 技能目录 */
	lines.push("agent_presets:");
	for (const dir of [".agent-presets"]) {
		try {
			const names = await readdir(join(HOME, dir));
			if (names.length === 0) lines.push("  - (none)");
			for (const n of names.sort()) lines.push("  - " + n);
		} catch { lines.push("  - (none)"); }
	}
	lines.push("skills:");
	try {
		const names = await readdir(join(HOME, "skills"));
		if (names.length === 0) lines.push("  - (none)");
		for (const n of names.sort()) lines.push("  - " + n);
	} catch { lines.push("  - (none)"); }

	return lines.join("\n") + "\n";
}

/* ------------------------------------------------------------------ */
/* dsh-overview.yaml 区块编辑                                          */
/* ------------------------------------------------------------------ */
async function readOverviewText() {
	try {
		return await readFile(OVERVIEW, "utf8");
	} catch {
		return null;
	}
}

/* 替换 startMark 与 endMark 之间的内容（含 endMark 行保留） */
function replaceSection(text, startMark, endMark, newBlock) {
	const startIdx = text.indexOf(startMark);
	const endIdx = text.indexOf(endMark, startIdx >= 0 ? startIdx : 0);
	if (startIdx === -1 || endIdx === -1) return text;
	const head = text.slice(0, startIdx);
	const startLineEnd = text.indexOf("\n", startIdx);
	const tail = text.slice(endIdx); /* 保留 endMark 起的后续所有行 */
	return head + text.slice(startIdx, startLineEnd) + "\n" + newBlock + "\n" + tail;
}

/* 在 mark 行后插入一行（保持两空格列表缩进风格） */
function insertAfterMark(text, mark, entry) {
	const idx = text.indexOf(mark);
	if (idx === -1) return text;
	const lineEnd = text.indexOf("\n", idx);
	if (lineEnd === -1) return text + "\n" + entry + "\n";
	return text.slice(0, lineEnd + 1) + entry + "\n" + text.slice(lineEnd + 1);
}

/* 提取区块文本（供客户端规则引擎使用） */
function extractSection(text, startMark, endMark) {
	const startIdx = text.indexOf(startMark);
	if (startIdx === -1) return "";
	const s = text.indexOf("\n", startIdx);
	if (s === -1) return "";
	let e = text.length;
	if (endMark) {
		const endIdx = text.indexOf(endMark, startIdx + 1);
		if (endIdx !== -1) e = text.lastIndexOf("\n", endIdx);
	}
	return text.slice(s + 1, e);
}

/* ------------------------------------------------------------------ */
/* MCP 一键热启停：读 mcp-servers.yml + ctx.plugin()/fiber.dispose()     */
/* ------------------------------------------------------------------ */
/* $ENV_VAR 引用 → process.env 解析（敏感凭据不落明文） */
function resolveEnvRef(v) {
	if (typeof v === "string" && v.startsWith("$")) return process.env[v.slice(1)] ?? "";
	return v;
}
function resolveEnvMap(obj) {
	if (!obj || typeof obj !== "object") return obj;
	const out = {};
	for (const [k, v] of Object.entries(obj)) out[k] = resolveEnvRef(v);
	return out;
}
function normalizeMcpConfig(cfg) {
	if (!cfg || typeof cfg !== "object") return cfg;
	const out = { ...cfg };
	if (out.env) out.env = resolveEnvMap(out.env);
	if (out.headers) out.headers = resolveEnvMap(out.headers);
	return out;
}
function readMcpServers() {
	try {
		const doc = yamlLoad(readFileSync(MCP_FILE, "utf8")) || {};
		return Array.isArray(doc.servers) ? doc.servers : [];
	} catch {
		return null;
	}
}
/* 只翻转某个 server 块的 enabled 行，保留其余内容与注释 */
function writeMcpEnabled(id, enabled) {
	try {
		const lines = readFileSync(MCP_FILE, "utf8").split("\n");
		let start = -1;
		for (let i = 0; i < lines.length; i++) if (lines[i].trim() === "- id: " + id) { start = i; break; }
		if (start === -1) return;
		for (let i = start + 1; i < lines.length; i++) {
			const t = lines[i].trim();
			if (t.startsWith("- id: ")) break;
			if (/^enabled:/.test(t)) {
				lines[i] = lines[i].replace(/^(\s*enabled:\s*)(?:true|false)(\s*)$/, "$1" + String(enabled) + "$2");
				break;
			}
		}
		writeFileSync(MCP_FILE, lines.join("\n"), "utf8");
	} catch { /* ignore */ }
}
/* 生成一条 MCP 的 YAML 文本（缩进 2 空格，config 内 4 空格；JSON 值本就是合法 YAML） */
function mcpEntryYaml(s) {
	const cfg = s.config || {};
	const lines = [];
	lines.push("  - id: " + (s.id || ("mcp-" + cfg.serverName)));
	lines.push("    desc: " + JSON.stringify(s.desc || ""));
	lines.push("    enabled: true");
	lines.push("    config:");
	lines.push("      serverName: " + JSON.stringify(cfg.serverName));
	lines.push("      transport: " + cfg.transport);
	if (cfg.transport === "stdio") {
		lines.push("      command: " + JSON.stringify(cfg.command));
		if (cfg.args && cfg.args.length) lines.push("      args: " + JSON.stringify(cfg.args));
		if (cfg.env && Object.keys(cfg.env).length) {
			lines.push("      env:");
			for (const [k, v] of Object.entries(cfg.env)) lines.push("        " + k + ": " + JSON.stringify(v));
		}
	} else if (cfg.transport === "streamable-http") {
		lines.push("      url: " + JSON.stringify(cfg.url));
		if (cfg.headers && Object.keys(cfg.headers).length) {
			lines.push("      headers:");
			for (const [k, v] of Object.entries(cfg.headers)) lines.push("        " + k + ": " + JSON.stringify(v));
		}
	}
	return lines.join("\n");
}
/* 往 mcp-servers.yml 末尾追加一条（servers 是唯一顶层键，条目都在文件末尾） */
function appendMcpEntry(s) {
	try {
		let raw = readFileSync(MCP_FILE, "utf8");
		if (!raw.endsWith("\n")) raw += "\n";
		raw += "\n" + mcpEntryYaml(s) + "\n";
		writeFileSync(MCP_FILE, raw, "utf8");
	} catch { /* ignore */ }
}

/* MCP 管理器：持有 ctx 引用 + 运行中的 fiber 表 */
function createMcpManager(ctx) {
	const fibers = new Map();
	async function start(id, cfg) {
		if (fibers.has(id)) return;
		const fiber = ctx.plugin(mcpClient, normalizeMcpConfig(cfg));
		fibers.set(id, fiber);
		try { await fiber; } catch (e) { fibers.delete(id); throw e; }
	}
	async function stop(id) {
		const fiber = fibers.get(id);
		if (!fiber) return;
		fibers.delete(id);
		try { await fiber.dispose(); } catch (e) { ctx.logger.warn("mcp 卸载失败 " + id + ": " + String(e)); }
	}
	async function add(entry) {
		const cfg = (entry && entry.config) ? entry.config : {};
		if (!cfg.serverName) return { ok: false, error: "缺少 config.serverName" };
		if (cfg.transport !== "stdio" && cfg.transport !== "streamable-http") return { ok: false, error: "config.transport 必须是 stdio 或 streamable-http" };
		if (cfg.transport === "stdio" && !cfg.command) return { ok: false, error: "stdio 需要 config.command" };
		if (cfg.transport === "streamable-http" && !cfg.url) return { ok: false, error: "streamable-http 需要 config.url" };
		const id = String(entry.id || ("mcp-" + cfg.serverName)).trim();
		const servers = readMcpServers() || [];
		for (const x of servers) {
			if (x && ((x.id && x.id === id) || (x.config && x.config.serverName === cfg.serverName))) {
				return { ok: false, error: "已存在相同 id 或 serverName 的 MCP：" + (x.id || x.config.serverName) };
			}
		}
		appendMcpEntry({ id: id, desc: entry.desc || "", config: cfg });
		try { await start(id, cfg); } catch (e) {
			return { ok: false, error: "已写入配置但热加载失败：" + String(e && e.message ? e.message : e) };
		}
		return { ok: true, id: id, running: fibers.has(id) };
	}
	return {
		boot() {
			const servers = readMcpServers();
			if (servers === null) { ctx.logger.warn("mcp: 无法读取 " + MCP_FILE + "，跳过热启动"); return; }
			for (const s of servers) {
				if (s && s.enabled && s.config) {
					start(s.id, s.config).catch((e) => ctx.logger.error("mcp 启动失败 " + (s.id || "?") + ": " + String(e)));
				}
			}
		},
		list() {
			const servers = readMcpServers() || [];
			return servers.map((s) => ({
				id: s.id,
				desc: s.desc || "",
				serverName: s.config && s.config.serverName,
				enabled: !!s.enabled,
				running: fibers.has(s.id),
			}));
		},
		async toggle(id, enabled) {
			const servers = readMcpServers() || [];
			const s = servers.find((x) => x && x.id === id);
			if (!s) return { ok: false, error: "mcp-servers.yml 中未找到 " + id };
			if (enabled) await start(id, s.config); else await stop(id);
			writeMcpEnabled(id, enabled);
			return { ok: true, id: id, enabled: enabled, running: fibers.has(id) };
		},
		add,
	};
}

/* 刷新自动采集区并写回；文件不存在则用自动采集区创建骨架 */
async function refreshAutoSection() {
	const auto = await collectAuto();
	let text = await readOverviewText();
	if (text === null) {
		text = [
			"# DSH 整体情况（DSH Overview）—— 自动生成骨架，请补充「手动维护区」",
			"",
			MARK_AUTO + "（自动刷新，勿手改） =====",
			auto,
			"",
			MARK_MANUAL + "（涉及 dsh 改动时请同步更新） =====",
			"usage:",
			"  主要用途: （请填写）",
			"  语言偏好: 中文",
			"constraints:",
			"  - （请填写）",
			"",
			MARK_CHANGE + "（安装经插件自动追加；其他改动请手动追加一行） =====",
			"changelog:",
			"",
			""
		].join("\n");
	} else {
		text = replaceSection(text, MARK_AUTO, MARK_MANUAL, auto);
	}
	await writeFile(OVERVIEW, text, "utf8");
	return text;
}

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* 已装插件管理：启动 / 关闭 / 卸载                                     */
/* ------------------------------------------------------------------ */
function tailText(s, n) {
	const t = String(s || "").trim();
	return t.length > n ? "…" + t.slice(-n) : t;
}

/* 把安装/卸载记录的 target 归一成可读名（git 地址 → 短包名） */
function changelogTarget(p) {
	const s = String(p || "").trim();
	const m = s.match(/^(?:github:|git\+https?:\/\/github\.com\/)[^\/]+\/([^\/#?.]+?)(?:\.git)?$/);
	if (m) return m[1];
	return s;
}

/* 在 loader 条目中按包名定位（先精确，再短名后缀回退） */
function findEntry(inventory, pkg) {
	const entries = (inventory && inventory.entries) || [];
	for (const e of entries) if (e.moduleName === pkg) return e;
	for (const e of entries) if (e.moduleName && e.moduleName.endsWith(pkg)) return e;
	return null;
}

/* 判断已装包的类型：bundle（cordis 插件，可启停）/ skill（技能，装完即用）/ other */
function pkgTypeOf(pkg) {
	try {
		const pj = JSON.parse(readFileSync(join(HOME, "profiles", PROFILE, "node_modules", pkg, "package.json"), "utf8"));
		if (pj.dsh && (pj.dsh.profile || pj.dsh.bundle || pj.dsh.client)) return "bundle";
		if (pj.dsh && pj.dsh.skill) return "skill";
		if (existsSync(join(HOME, "profiles", PROFILE, "node_modules", pkg, "skills"))) return "skill";
		return "other";
	} catch {
		return "unknown";
	}
}
/* 解析 cordis.patch.yml 里的插件条目（id + name） */
function readPatchEntries() {
	try {
		const raw = readFileSync(PATCH, "utf8");
		const out = [];
		const re = /- id:\s*(\S+)\s*\n\s*name:\s*'?([^'\n]+)'?/g;
		let m;
		while ((m = re.exec(raw)) !== null) out.push({ id: m[1], name: m[2].trim() });
		return out;
	} catch {
		return [];
	}
}
/* 读取插件的 description（用于用途说明） */
function readPkgDesc(name) {
	try {
		const pj = JSON.parse(readFileSync(join(HOME, "profiles", PROFILE, "node_modules", name, "package.json"), "utf8"));
		return pj.description || "";
	} catch {
		return "";
	}
}

/* cordis.patch.yml：直接编辑条目的 disabled 标记（启用/停用，幂等） */
function setEntryDisabled(text, id, disabled) {
	const lines = text.split("\n");
	let start = -1;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].trim() === "- id: " + id) { start = i; break; }
	}
	if (start === -1) return text;
	const indent = (lines[start].match(/^\s*/) || [""])[0];
	let end = start + 1;
	while (end < lines.length) {
		const t = lines[end].trim();
		const ind = (lines[end].match(/^\s*/) || [""])[0];
		if (t === "" || t.startsWith("#")) break;
		if (t.startsWith("- ") && ind === indent) break;
		if (ind.length < indent.length) break;
		end++;
	}
	const hasDisabled = lines.slice(start, end).some((l) => /^\s+disabled:\s*true\s*$/.test(l));
	if (disabled && !hasDisabled) {
		let nameIdx = start;
		for (let i = start; i < end; i++) if (/^\s+name:/.test(lines[i])) { nameIdx = i; break; }
		lines.splice(nameIdx + 1, 0, indent + "  disabled: true");
		return lines.join("\n");
	}
	if (!disabled && hasDisabled) {
		return lines.slice(0, start)
			.concat(lines.slice(start, end).filter((l) => !/^\s+disabled:\s*true\s*$/.test(l)))
			.concat(lines.slice(end))
			.join("\n");
	}
	return text;
}

/* 通用：执行 dsh plugin 子命令（add / remove） */
function runPluginCmd(args, onLine) {
	return new Promise((resolve, reject) => {
		const child = spawn(process.execPath, [BIN, "plugin", "--profile", PROFILE].concat(args), {
			cwd: HOME,
			windowsHide: true,
			stdio: ["ignore", "pipe", "pipe"],
		});
		let out = "";
		let err = "";
		let buf = "";
		function handle(data, isErr) {
			const s = String(data);
			if (isErr) err += s;
			else out += s;
			if (onLine) {
				buf += s;
				const lines = buf.split("\n");
				buf = lines.pop();
				for (const line of lines) if (line.trim()) onLine(line, isErr);
			}
		}
		child.stdout.on("data", (d) => { handle(d, false); });
		child.stderr.on("data", (d) => { handle(d, true); });
		const timer = setTimeout(() => {
			try { child.kill(); } catch { /* ignore */ }
			reject(new Error("命令超时（5 分钟）"));
		}, INSTALL_TIMEOUT_MS);
		child.on("error", (e) => { clearTimeout(timer); reject(e); });
		child.on("close", (code) => {
			clearTimeout(timer);
			if (onLine && buf.trim()) onLine(buf, false);
			resolve({ code, stdout: out, stderr: err });
		});
	});
}

/* ------------------------------------------------------------------ */
/* HTTP handler                                                        */
/* ------------------------------------------------------------------ */
function json(res, status, obj) {
	res.writeHead(status, {
		"Content-Type": "application/json; charset=utf-8",
		"Cache-Control": "no-store",
	});
	res.end(JSON.stringify(obj));
}

function readBody(req) {
	return new Promise((resolve, reject) => {
		let d = "";
		req.on("data", (c) => {
			d += c;
			if (d.length > 64 * 1024) {
				reject(new Error("请求体过大"));
				req.destroy();
			}
		});
		req.on("end", () => {
			try {
				resolve(d ? JSON.parse(d) : {});
			} catch {
				reject(new Error("请求体不是合法 JSON"));
			}
		});
		req.on("error", reject);
	});
}

export function apply(ctx) {
	/* MCP 一键热启停：读 mcp-servers.yml，把 enabled 的 MCP 用 ctx.plugin() 热加载。 */
	const mcp = createMcpManager(ctx);
	mcp.boot();

	/* 只注入 webServer：callback 收到的是注入上下文（serverCtx.webServer 才是服务）。
	 * pluginInventory 按需获取（带超时降级），避免服务依赖把本插件 fiber 挂起。 */
	ctx.inject(["webServer"], (serverCtx) => {
		const server = serverCtx.webServer;
		/* 直接读底层 loader 服务，绕开 pluginInventory 这个 Typert remote service
		 *（服务端 ctx.pluginInventory 属性访问拿不到，会超时导致 present 恒为 false）。
		 * 返回与 pluginInventory.list() 相同形状，供 findEntry 使用。 */
		const FIBER_PHASE = ["pending", "loading", "active", "failed", null, "unloading"];
		async function getInventory() {
			try {
				const loader = await Promise.race([
					ctx.loader,
					new Promise((_, reject) => setTimeout(() => reject(new Error("loader timeout")), 3000)),
				]);
				const entries = [];
				for (const entry of loader.entries()) {
					if (entry.options && entry.options.group) continue;
					const st = entry.fiber ? entry.fiber.state : -1;
					entries.push({
						entryId: entry.id,
						moduleName: entry.options && entry.options.name,
						enabled: !entry.disabled,
						fiberPhase: (st >= 0 && st < FIBER_PHASE.length) ? FIBER_PHASE[st] : null,
					});
				}
				return { list: () => ({ entries }) };
			} catch {
				return null;
			}
		}
		server.register({
			kind: "prefix",
			path: "/api/gh-watch",
			handler: async (req, res) => {
				const url = new URL(req.url ?? "/", "http://localhost");
				const pathname = url.pathname;
				try {
					if (req.method === "GET" && pathname === "/api/gh-watch/overview") {
						const text = await refreshAutoSection();
						json(res, 200, {
							ok: true,
							raw: text,
							auto: extractSection(text, MARK_AUTO, MARK_MANUAL),
							manual: extractSection(text, MARK_MANUAL, MARK_CHANGE),
							changelog: extractSection(text, MARK_CHANGE, ""),
						});
						return;
					}
					if (req.method === "GET" && pathname === "/api/gh-watch/installed") {
						/* 已装插件 = package.json 依赖 + cordis.patch.yml 条目（权威清单）+ loader 状态 + description */
						const inventory = await getInventory();
						const deps = [];
						try {
							const pj = JSON.parse(await readFile(PROFILE_PKG, "utf8"));
							for (const k of Object.keys(pj.dependencies || {})) deps.push(k);
						} catch { /* ignore */ }
						const patchEntries = readPatchEntries();
						const installed = [];
						const seen = {};
						const shortName = (p) => String(p || "").replace(/^@[^/]+\//, "").toLowerCase();
						const addItem = (moduleName, displayName, type) => {
							const key = shortName(displayName);
							if (seen[key]) return;
							seen[key] = true;
							const entry = inventory ? findEntry(inventory.list(), moduleName) : null;
							installed.push({
								pkg: displayName,
								type: type,
								entryId: entry ? entry.entryId : null,
								moduleName: moduleName,
								enabled: entry ? entry.enabled : false,
								fiberPhase: entry ? entry.fiberPhase : null,
								present: entry !== null,
								desc: readPkgDesc(moduleName),
							});
						};
						for (const pkg of deps) addItem(pkg, pkg, pkgTypeOf(pkg));
						for (const pe of patchEntries) {
							const isMcp = pe.name === "@deepseek-ai/dsh-mcp-client";
							addItem(pe.name, isMcp ? pe.id : pe.name, isMcp ? "mcp" : "bundle");
						}
						json(res, 200, { ok: true, installed: installed, inventoryReady: inventory !== null });
						return;
					}
					if (req.method === "POST" && pathname === "/api/gh-watch/toggle") {
						const body = await readBody(req);
						const pkg = String(body.pkg || "").trim();
						const enabled = !!body.enabled;
						if (!isValidSpec(pkg)) {
							json(res, 400, { ok: false, error: "非法包名或仓库地址：" + pkg });
							return;
						}
						const inventory = await getInventory();
						if (!inventory) {
							json(res, 503, { ok: false, error: "插件目录服务（pluginInventory）暂不可用，请稍后重试" });
							return;
						}
						const entry = findEntry(inventory.list(), pkg);
						if (!entry) {
							json(res, 404, { ok: false, error: "loader 中未找到插件 " + pkg + "（可能未安装或已卸载）" });
							return;
						}
						const text = await readFile(PATCH, "utf8");
						const next = setEntryDisabled(text, entry.entryId, !enabled);
						if (next !== text) await writeFile(PATCH, next, "utf8");
						json(res, 200, {
							ok: true,
							action: enabled ? "start" : "stop",
							target: pkg,
							note: (enabled ? "已标记启动" : "已标记关闭") + "，重启 dsh web 后生效。",
						});
						return;
					}
					if (req.method === "POST" && pathname === "/api/gh-watch/uninstall") {
						const body = await readBody(req);
						const pkg = String(body.pkg || "").trim();
						if (!isValidSpec(pkg)) {
							json(res, 400, { ok: false, error: "非法包名或仓库地址：" + pkg });
							return;
						}
						const result = await runPluginCmd(["remove", pkg]);
						const output = tailText(result.stdout + "\n" + result.stderr, 4000);
						/* 无论 pnpm 是否成功（依赖可能已被移除），都清理 managed 块与变更记录 */
						try {
							const inventory = await getInventory();
							let text = await readFile(PATCH, "utf8");
							const entry = inventory ? findEntry(inventory.list(), pkg) : null;
							if (entry) text = setEntryDisabled(text, entry.entryId, false);
							await writeFile(PATCH, text, "utf8");
						} catch { /* patch 清理失败不阻塞卸载结果 */ }
						let ov = await readOverviewText();
						if (ov !== null) {
							ov = insertAfterMark(ov, "changelog:",
								"  - at: " + nowDate() + ", action: uninstall, target: " + changelogTarget(pkg) + ", via: plugin-ui, note: 热榜卸载");
							ov = replaceSection(ov, MARK_AUTO, MARK_MANUAL, await collectAuto());
							await writeFile(OVERVIEW, ov, "utf8");
						}
						json(res, 200, {
							ok: true,
							code: result.code,
							output: output,
							note: result.code === 0 ? "卸载成功；重启 dsh web 后生效，变更记录已写入 dsh-overview.yaml。" : "已从清单移除（该包已不是 pnpm 依赖）；重启 dsh web 后生效。",
						});
						return;
					}
					if (req.method === "POST" && pathname === "/api/gh-watch/install") {
						const body = await readBody(req);
						const pkg = String(body.pkg || "").trim();
						if (!isValidSpec(pkg)) {
							json(res, 400, { ok: false, error: "非法包名或仓库地址：" + pkg });
							return;
						}
						/* 流式 NDJSON：实时转发 pnpm 输出，前端据此渲染进度条 */
						res.writeHead(200, {
							"Content-Type": "application/x-ndjson; charset=utf-8",
							"Cache-Control": "no-store",
							"X-Accel-Buffering": "no",
						});
						const send = (obj) => { try { res.write(JSON.stringify(obj) + "\n"); } catch { /* ignore */ } };
						send({ type: "start", pkg: pkg });
						const result = await runPluginCmd(["add", pkg], (line) => {
							send({ type: "out", data: line.replace(/\x1b\[[0-9;]*m/g, "") });
						});
						let note = "";
						if (result.code === 0) {
							/* 安装成功：追加变更记录 + 刷新自动采集区 */
							let text = await readOverviewText();
							if (text !== null) {
								text = insertAfterMark(text, "changelog:",
									"  - at: " + nowDate() + ", action: install, target: " + changelogTarget(pkg) + ", via: plugin-ui, note: 热榜一键安装");
								text = replaceSection(text, MARK_AUTO, MARK_MANUAL, await collectAuto());
								await writeFile(OVERVIEW, text, "utf8");
							}
							note = "安装成功；重启 dsh web 后插件生效。";
						}
						send({ type: "done", ok: result.code === 0, code: result.code, note: note });
						res.end();
						return;
					}
					if (req.method === "POST" && pathname === "/api/gh-watch/websearch") {
						const body = await readBody(req);
						const query = String(body.query || "").trim();
						if (!query) { json(res, 400, { ok: false, error: "缺少搜索关键词" }); return; }
						const key = process.env.EXA_API_KEY || "";
						if (!key) { json(res, 503, { ok: false, error: "未配置 EXA_API_KEY（请在 .env 中设置）" }); return; }
						try {
							const r = await fetch("https://api.exa.ai/search", {
								method: "POST",
								headers: { "Content-Type": "application/json", "x-api-key": key },
								body: JSON.stringify({ query: query, numResults: 10, contents: { text: { maxCharacters: 400 } }, includeDomains: ["github.com", "www.npmjs.com", "npmjs.com", "registry.npmjs.org", "awesome-dsh-plugin.com", "deepseek.com"] })
							});
							if (!r.ok) { json(res, 502, { ok: false, error: "exa 返回 HTTP " + r.status }); return; }
							const j = await r.json();
							const results = (j.results || []).map(function (x) {
								return { title: x.title || "", url: x.url || "", text: x.text || "", publishedDate: x.publishedDate || "" };
							});
							json(res, 200, { ok: true, query: query, results: results });
						} catch (e) {
							json(res, 502, { ok: false, error: "exa 请求失败：" + (e && e.message ? e.message : String(e)) });
						}
						return;
					}
					if (req.method === "GET" && pathname === "/api/gh-watch/updates") {
						const deps = [];
						try {
							const pj = JSON.parse(await readFile(PROFILE_PKG, "utf8"));
							for (const k of Object.keys(pj.dependencies || {})) deps.push(k);
						} catch { /* ignore */ }
						const updates = [];
						for (const pkg of deps) {
							let installed = "?";
							try {
								const ip = JSON.parse(await readFile(join(HOME, "profiles", PROFILE, "node_modules", pkg, "package.json"), "utf8"));
								installed = ip.version || "?";
							} catch { /* ignore */ }
							let latest = null;
							try {
								const enc = pkg.charAt(0) === "@" ? pkg.replace("/", "%2F") : pkg;
								const r = await fetch("https://registry.npmmirror.com/" + enc);
								if (r.ok) {
									const j = await r.json();
									latest = (j["dist-tags"] && j["dist-tags"].latest) || null;
								}
							} catch { /* ignore */ }
							updates.push({ pkg: pkg, installed: installed, latest: latest, hasUpdate: !!(latest && installed !== "?" && latest !== installed) });
						}
						json(res, 200, { ok: true, updates: updates });
						return;
					}
					if (req.method === "POST" && pathname === "/api/gh-watch/restart") {
						/* 强制重启：/force 才会真正杀+启（幂等脚本默认跳过运行中的服务） */
						const script = process.env.DSH_RESTART_SCRIPT || join(HOME, "restart-dsh-web.cmd");
						setTimeout(() => {
							try {
								spawn("cmd", ["/c", script, "/force"], {
									cwd: HOME,
									windowsHide: true,
									stdio: "ignore",
									detached: true,
								}).unref();
							} catch { /* ignore */ }
						}, 1500);
						json(res, 200, { ok: true, note: "即将强制重启 dsh web（约 1 分钟），完成后请刷新页面，会话会自动恢复。" });
						return;
					}
					if (req.method === "POST" && pathname === "/api/gh-watch/stop") {
						/* 停止服务：延迟 1.5 秒杀掉 8093 监听进程（= 本进程），先返回响应。
						 * ⚠️ 不能用 detached:true —— Windows 下 detached 的 powershell 会启动失败、杀不掉进程
						 *（实测 detached+ignore / detached+pipe 均失效，非 detached 才生效）。 */
						setTimeout(() => {
							try {
								const child = spawn("powershell", ["-NoProfile", "-Command",
									"Get-NetTCPConnection -LocalPort " + PORT + " -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }"],
									{ windowsHide: true, stdio: "ignore" });
								child.on("error", (e) => ctx.logger.error("停止服务 spawn 失败: " + (e && e.message ? e.message : String(e))));
								child.unref();
							} catch (e) { ctx.logger.error("停止服务异常: " + (e && e.message ? e.message : String(e))); }
						}, 1500);
						json(res, 200, { ok: true, note: "服务已停止。双击桌面「DeepSeek Harness」重新启动并打开页面。" });
						return;
					}
					if (req.method === "GET" && pathname === "/api/gh-watch/mcp") {
						json(res, 200, { ok: true, servers: mcp.list() });
						return;
					}
					if (req.method === "POST" && pathname === "/api/gh-watch/mcp/toggle") {
						const body = await readBody(req);
						const id = String(body.id || "").trim();
						const enabled = !!body.enabled;
						if (!id) { json(res, 400, { ok: false, error: "缺少 id" }); return; }
						const r = await mcp.toggle(id, enabled);
						json(res, r.ok ? 200 : 404, r);
						return;
					}
					if (req.method === "POST" && pathname === "/api/gh-watch/mcp/add") {
						const body = await readBody(req);
						const r = await mcp.add(body || {});
						json(res, r.ok ? 200 : 400, r);
						return;
					}
					json(res, 404, { ok: false, error: "not found" });
				} catch (e) {
					json(res, 500, { ok: false, error: (e && e.message) ? e.message : String(e) });
				}
			},
		});
	});
}
