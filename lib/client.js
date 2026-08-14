window.__ModuleLoader__.load({
	id: "deepseek-harness-dsh-plugin-hub",
	factory: (require) => {
		"use strict";
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		var React = require("react");

		/* ------------------------------------------------------------------ */
		/* 样式（材质化时注入，模块系统负责按 data-plugin 回收）                 */
		/* ------------------------------------------------------------------ */
		var CSS = [
			".hub-dock { position: fixed; right: 12px; bottom: 12px; z-index: 60;",
			"  font-family: var(--dsw-font-family, system-ui, -apple-system, 'Segoe UI', sans-serif);",
			"  font-size: 12px; line-height: 1.45; color: var(--dsw-alias-label-primary, #1f2329);",
			"  pointer-events: auto; }",
			".hub-card { width: 310px; max-height: min(64vh, 580px); display: flex; flex-direction: column;",
			"  background: var(--dsw-alias-bg-overlay, rgba(255,255,255,0.94));",
			"  border: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,0.08));",
			"  border-radius: var(--dsl-web-radius, 10px);",
			"  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);",
			"  box-shadow: 0 8px 28px rgba(0,0,0,0.14); overflow: hidden; }",
			".hub-head { display: flex; align-items: center; gap: 8px; padding: 9px 12px;",
			"  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,0.08)); cursor: grab; }",
			".hub-head:active { cursor: grabbing; }",
			".hub-head .hub-ico { font-size: 14px; }",
			".hub-head .hub-title { font-weight: 600; font-size: 13px; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }",
			".hub-btn { border: none; background: transparent; color: var(--dsw-alias-label-secondary, #4b5563);",
			"  cursor: pointer; font-size: 13px; line-height: 1; padding: 4px; border-radius: 6px; }",
			".hub-btn:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,0.06)); }",
			".hub-btn:disabled { opacity: 0.45; cursor: default; }",
			".hub-spin { animation: hub-rotate 0.9s linear infinite; display: inline-block; }",
			"@keyframes hub-rotate { to { transform: rotate(360deg); } }",
			".hub-tabs { display: flex; gap: 4px; padding: 7px 12px 0; }",
			".hub-tab { flex: 1; border: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,0.1));",
			"  background: var(--dsw-alias-bg-layer-1, rgba(0,0,0,0.02)); color: var(--dsw-alias-label-secondary, #4b5563);",
			"  font-size: 11.5px; font-weight: 600; padding: 5px 0; border-radius: 7px 7px 0 0; cursor: pointer; }",
			".hub-tab.on { background: var(--dsw-alias-bg-overlay, #fff); color: var(--dsw-alias-brand-primary, #4d6bfe);",
			"  border-bottom-color: transparent; }",
			".hub-body { overflow-y: auto; padding: 10px 12px 12px; display: flex; flex-direction: column; gap: 9px; }",
			".hub-body::-webkit-scrollbar { width: var(--dsh-scrollbar-width, 8px); }",
			".hub-verdict { display: flex; gap: 8px; align-items: flex-start; padding: 8px 10px; border-radius: 8px;",
			"  font-size: 12.5px; font-weight: 600; border: 1px solid; }",
			".hub-verdict.found { color: var(--dsw-alias-state-success-primary, #15803d);",
			"  background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #16a34a) 10%, transparent);",
			"  border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary, #16a34a) 30%, transparent); }",
			".hub-verdict.partial { color: var(--dsw-alias-state-warn-primary, #b45309);",
			"  background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 12%, transparent);",
			"  border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 32%, transparent); }",
			".hub-verdict.none { color: var(--dsw-alias-state-error-primary, #b91c1c);",
			"  background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #dc2626) 10%, transparent);",
			"  border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #dc2626) 30%, transparent); }",
			".hub-verdict .hub-v-txt { flex: 1; font-weight: 500; }",
			".hub-meta { display: flex; flex-wrap: wrap; gap: 4px 10px; font-size: 11px; color: var(--dsw-alias-label-tertiary, #9ca3af); }",
			".hub-meta b { color: var(--dsw-alias-label-secondary, #4b5563); font-weight: 600; }",
			".hub-sec { font-size: 11px; font-weight: 600; color: var(--dsw-alias-label-tertiary, #9ca3af); text-transform: uppercase; letter-spacing: 0.04em; }",
			".hub-list { display: flex; flex-direction: column; gap: 6px; }",
			".hub-item { border: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,0.08)); border-radius: 8px; padding: 7px 9px;",
			"  background: var(--dsw-alias-bg-layer-1, rgba(0,0,0,0.02)); display: flex; flex-direction: column; gap: 3px; }",
			".hub-item:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,0.04)); }",
			".hub-item-top { display: flex; align-items: center; gap: 6px; }",
			".hub-item-name { font-weight: 600; color: var(--dsw-alias-brand-text, var(--dsw-alias-brand-primary, #4d6bfe));",
			"  text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }",
			".hub-item-name:hover { text-decoration: underline; }",
			".hub-stars { margin-left: auto; flex: none; font-size: 11px; color: var(--dsw-alias-label-tertiary, #9ca3af); font-variant-numeric: tabular-nums; }",
			".hub-badge { flex: none; font-size: 10px; padding: 1px 6px; border-radius: 999px; border: 1px solid; }",
			".hub-badge.official { color: var(--dsw-alias-state-success-primary, #15803d); border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary, #16a34a) 45%, transparent); font-weight: 700; }",
			".hub-badge.exact { color: var(--dsw-alias-state-success-primary, #15803d); border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary, #16a34a) 40%, transparent); }",
			".hub-badge.name { color: var(--dsw-alias-brand-primary, #4d6bfe); border-color: color-mix(in srgb, var(--dsw-alias-brand-primary, #4d6bfe) 40%, transparent); }",
			".hub-badge.acronym { color: var(--dsw-alias-state-warn-primary, #b45309); border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 40%, transparent); }",
			".hub-badge.desc { color: var(--dsw-alias-label-tertiary, #6b7280); border-color: var(--dsw-alias-border-l1, rgba(0,0,0,0.2)); }",
			".hub-badge.cat { color: var(--dsw-alias-brand-primary, #4d6bfe); border-color: color-mix(in srgb, var(--dsw-alias-brand-primary, #4d6bfe) 35%, transparent); }",
			".hub-desc { font-size: 11px; color: var(--dsw-alias-label-secondary, #4b5563);",
			"  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }",
			".hub-desc mark { background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #f59e0b) 30%, transparent); color: inherit; border-radius: 2px; padding: 0 1px; }",
			".hub-wmeta { display: flex; gap: 4px 10px; font-size: 10.5px; color: var(--dsw-alias-label-tertiary, #9ca3af); flex-wrap: wrap; }",
			".hub-empty { color: var(--dsw-alias-label-tertiary, #9ca3af); text-align: center; padding: 16px 0; }",
			".hub-err { color: var(--dsw-alias-state-error-primary, #b91c1c); font-size: 11.5px; word-break: break-all; }",
			".hub-note { font-size: 10.5px; color: var(--dsw-alias-label-tertiary, #9ca3af); }",
			".hub-stale { font-size: 10.5px; color: var(--dsw-alias-state-warn-primary, #b45309); }",
			".hub-new { font-size: 10.5px; color: var(--dsw-alias-state-success-primary, #15803d); font-weight: 600; }",
			/* 热榜筛选行 */
			".hub-filters { display: flex; gap: 6px; align-items: center; }",
			".hub-filters select { flex: 1; min-width: 0; padding: 3px 6px; font-size: 11px; border-radius: 6px;",
			"  border: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,0.12)); background: var(--dsw-alias-bg-layer-1, transparent);",
			"  color: inherit; font-family: inherit; }",
			".hub-filters select:focus { outline: 2px solid var(--dsw-alias-brand-primary, #4d6bfe); outline-offset: 0; }",
			".hub-search { width: 100%; box-sizing: border-box; padding: 4px 9px; font-size: 11px; border-radius: 7px;",
			"  border: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,0.12)); background: var(--dsw-alias-bg-layer-1, transparent);",
			"  color: inherit; font-family: inherit; }",
			".hub-search:focus { outline: 2px solid var(--dsw-alias-brand-primary, #4d6bfe); outline-offset: 0; }",
			/* token 设置区 */
			".hub-set { display: flex; flex-direction: column; gap: 6px; padding: 8px 10px; border: 1px dashed var(--dsw-alias-border-l1, rgba(0,0,0,0.15)); border-radius: 8px; }",
			".hub-set-row { display: flex; gap: 6px; }",
			".hub-set input { flex: 1; min-width: 0; padding: 4px 8px; font-size: 11px; border-radius: 6px;",
			"  border: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,0.12)); background: var(--dsw-alias-bg-layer-1, transparent);",
			"  color: inherit; font-family: inherit; }",
			".hub-set input:focus { outline: 2px solid var(--dsw-alias-brand-primary, #4d6bfe); outline-offset: 0; }",
			".hub-set .hub-set-ok { color: var(--dsw-alias-state-success-primary, #15803d); font-size: 10.5px; }",
			".hub-chip { display: flex; align-items: center; gap: 6px; padding: 6px 10px;",
			"  background: var(--dsw-alias-bg-overlay, rgba(255,255,255,0.94));",
			"  border: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,0.08));",
			"  border-radius: 999px; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);",
			"  box-shadow: 0 6px 20px rgba(0,0,0,0.12); cursor: grab; user-select: none; }",
			".hub-chip:active { cursor: grabbing; }",
			".hub-chip .hub-chip-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; }",
			".hub-chip .hub-chip-dot.ok { background: var(--dsw-alias-state-success-primary, #16a34a); }",
			".hub-chip .hub-chip-dot.no { background: var(--dsw-alias-state-error-primary, #dc2626); }",
			".hub-chip .hub-chip-dot.mid { background: var(--dsw-alias-state-warn-primary, #d97706); }",
			/* 选中插件操作区 */
			".hub-item.sel { border-color: var(--dsw-alias-brand-primary, #4d6bfe);",
			"  box-shadow: 0 0 0 1px color-mix(in srgb, var(--dsw-alias-brand-primary, #4d6bfe) 35%, transparent); }",
			".hub-actions { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 2px; }",
			".hub-act { border: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,0.12)); background: var(--dsw-alias-bg-layer-1, rgba(0,0,0,0.03));",
			"  color: var(--dsw-alias-label-primary, #1f2329); font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 999px; cursor: pointer; }",
			".hub-act:hover { border-color: var(--dsw-alias-brand-primary, #4d6bfe); color: var(--dsw-alias-brand-primary, #4d6bfe); }",
			".hub-act:disabled { opacity: 0.5; cursor: default; }",
			".hub-panel { display: flex; flex-direction: column; gap: 6px; padding: 7px 9px; border-radius: 8px;",
			"  background: var(--dsw-alias-bg-layer-1, rgba(0,0,0,0.02)); border: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,0.08)); font-size: 11px; }",
			".hub-risklvl { display: inline-flex; align-items: center; gap: 4px; font-weight: 700; padding: 1px 8px; border-radius: 999px; border: 1px solid; }",
			".hub-risklvl.high { color: #b91c1c; border-color: rgba(220,38,38,0.4); background: rgba(220,38,38,0.08); }",
			".hub-risklvl.mid { color: #b45309; border-color: rgba(217,119,6,0.4); background: rgba(217,119,6,0.08); }",
			".hub-risklvl.low { color: #15803d; border-color: rgba(22,163,74,0.4); background: rgba(22,163,74,0.08); }",
			".hub-issues { display: flex; flex-direction: column; gap: 2px; }",
			".hub-issues .ok { color: var(--dsw-alias-state-success-primary, #15803d); }",
			".hub-issues .warn { color: var(--dsw-alias-state-warn-primary, #b45309); }",
			".hub-issues .bad { color: var(--dsw-alias-state-error-primary, #b91c1c); }",
			".hub-cmd { font-family: var(--dsw-font-mono, ui-monospace, Consolas, monospace); font-size: 10.5px;",
			"  background: rgba(0,0,0,0.05); border-radius: 5px; padding: 3px 6px; word-break: break-all; }",
			".hub-out { font-size: 10.5px; color: var(--dsw-alias-label-secondary, #4b5563); white-space: pre-wrap;",
			"  word-break: break-all; max-height: 120px; overflow-y: auto; }",
			".hub-adv { display: flex; flex-direction: column; gap: 4px; }",
			".hub-adv .t { font-weight: 700; font-size: 12px; }",
			".hub-adv .t.ok { color: var(--dsw-alias-state-success-primary, #15803d); }",
			".hub-adv .t.warn { color: var(--dsw-alias-state-warn-primary, #b45309); }",
			".hub-adv .t.no { color: var(--dsw-alias-state-error-primary, #b91c1c); }",
			/* 视窗缩放（八方向：四边 + 四角） */
			".hub-card { position: relative; min-width: 280px; min-height: 300px; max-height: calc(100vh - 40px); }",
			".hub-rs { position: absolute; z-index: 3; touch-action: none; }",
			".hub-rs-e { right: 0; top: 0; bottom: 0; width: 6px; cursor: ew-resize; }",
			".hub-rs-w { left: 0; top: 0; bottom: 0; width: 6px; cursor: ew-resize; }",
			".hub-rs-n { left: 0; right: 0; top: 0; height: 6px; cursor: ns-resize; }",
			".hub-rs-s { left: 0; right: 0; bottom: 0; height: 6px; cursor: ns-resize; }",
			".hub-rs-ne { right: 0; top: 0; width: 14px; height: 14px; cursor: nesw-resize; }",
			".hub-rs-sw { left: 0; bottom: 0; width: 14px; height: 14px; cursor: nesw-resize; }",
			".hub-rs-nw { left: 0; top: 0; width: 14px; height: 14px; cursor: nwse-resize; }",
			".hub-rs-se { right: 0; bottom: 0; width: 16px; height: 16px; cursor: nwse-resize;",
			"  background: linear-gradient(135deg, transparent 50%, var(--dsw-alias-label-tertiary, #9ca3af) 50%);",
			"  background-size: 9px 9px; background-position: right bottom; background-repeat: no-repeat; opacity: 0.45; }",
			".hub-rs-se:hover { opacity: 1; }",
			/* 已装插件面板 */
			".hub-st { flex: none; font-size: 10px; padding: 1px 6px; border-radius: 999px; border: 1px solid; }",
			".hub-st.on { color: #15803d; border-color: rgba(22,163,74,0.4); }",
			".hub-st.off { color: #b45309; border-color: rgba(217,119,6,0.4); }",
			".hub-st.na { color: #6b7280; border-color: rgba(0,0,0,0.15); }",
			".hub-item-sub { font-size: 10px; color: var(--dsw-alias-label-tertiary, #9ca3af); word-break: break-all; }",
			/* 官方仓库更新提醒绿点 */
			".hub-upd-dot { flex: none; width: 9px; height: 9px; border-radius: 50%; background: #22c55e;",
			"  box-shadow: 0 0 0 0 rgba(34,197,94,0.55); animation: hub-pulse 1.8s infinite; cursor: pointer; }",
			"@keyframes hub-pulse { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.55); } 70% { box-shadow: 0 0 0 7px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }",
			/* 安装进度条 */
			".hub-progress { height: 6px; border-radius: 3px; background: var(--dsw-alias-bg-layer-1, rgba(0,0,0,0.06)); overflow: hidden; }",
			".hub-progress-fill { height: 100%; background: linear-gradient(90deg, #4d6bfe, #14b8a6); transition: width .3s ease; }",
			".hub-prog-txt { font-size: 10.5px; color: var(--dsw-alias-label-tertiary, #9ca3af); font-variant-numeric: tabular-nums; }"
		].join("\n");
		(function installStyle() {
			if (typeof document === "undefined" || !document.head) return;
			if (document.getElementById("dsh-hub-style")) return;
			var el = document.createElement("style");
			el.id = "dsh-hub-style";
			el.setAttribute("data-plugin", "deepseek-harness-dsh-plugin-hub");
			el.setAttribute("data-plugin-css", "deepseek-harness-dsh-plugin-hub");
			el.textContent = CSS;
			document.head.appendChild(el);
		})();

		/* ------------------------------------------------------------------ */
		/* 配置与常量                                                           */
		/* ------------------------------------------------------------------ */
		var inject = ["slots"];
		var ORG = "deepseek-ai";
		/* GitHub 搜索接口（search）与核心接口（core）独立计费：
		 * 未认证 search = 10 次/分钟，core = 60 次/小时。
		 * 扫描只调用 search，不碰 core，从根上避免打爆 60 次/小时额度。 */
		var SEARCH_QUERIES = [
			{ q: "org:" + ORG + " dsh", label: "dsh" },
			{ q: "org:" + ORG + " deepseek-harness", label: "deepseek-harness" }
		];
		/* 扫描结果缓存：30 分钟 TTL（页面加载先显示缓存，后台静默刷新） */
		var SCAN_CACHE_KEY = "deepseek-harness-dsh-plugin-hub:result:v2";
		var SCAN_CACHE_TTL = 30 * 60 * 1000;
		/* 手动重扫节流：30 秒 */
		var SCAN_THROTTLE_MS = 30 * 1000;
		/* 可选 GitHub Token（localStorage 本机保存，额度 5000 次/小时） */
		var TOKEN_KEY = "deepseek-harness-dsh-plugin-hub:token:v1";
		/* 热榜：数据源为社区维护的中文插件目录（jsDelivr CDN 静态文件，无限量，国内可达）
		 * + shields.io 徽章（免费、有 CDN 缓存），几乎不消耗 GitHub API 额度。
		 * 镜像降级链：jsDelivr → raw.githubusercontent → GitHub API readme
		 *（末级每 24 小时缓存周期最多 1 个 core 请求，可承受）。 */
		var WATCH_README_URLS = [
			"https://cdn.jsdelivr.net/gh/awesome-dsh-plugin/awesome-dsh-plugin@main/README.zh.md",
			"https://raw.githubusercontent.com/awesome-dsh-plugin/awesome-dsh-plugin/main/README.zh.md",
			null /* GitHub API 镜像（特殊处理） */
		];
		var WATCH_CACHE_KEY = "deepseek-harness-dsh-plugin-hub:watch:v1";
		var WATCH_CACHE_TTL = 2 * 60 * 60 * 1000; /* 目录与星数缓存 2 小时 */
		var WATCH_REFRESH_THROTTLE = 5 * 60 * 1000; /* 手动刷新节流 5 分钟 */
		var WATCH_CONCURRENCY = 8; /* shields.io 请求并发 */
		var TAB_KEY = "deepseek-harness-dsh-plugin-hub:tab:v1";

		/* ------------------------------------------------------------------ */
		/* Token 存取                                                           */
		/* ------------------------------------------------------------------ */
		function getToken() {
			try { return localStorage.getItem(TOKEN_KEY) || ""; } catch (e) { return ""; }
		}
		function setToken(t) {
			try {
				if (t) localStorage.setItem(TOKEN_KEY, t);
				else localStorage.removeItem(TOKEN_KEY);
			} catch (e) { /* ignore */ }
		}

		/* ------------------------------------------------------------------ */
		/* 通用工具                                                             */
		/* ------------------------------------------------------------------ */
		function formatStars(n) {
			if (n === null || n === undefined || isNaN(n)) return "—";
			if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
			if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
			return String(n);
		}
		/* shields.io 数值（如 "1.2k"、"48"）→ 数字 */
		function parseShieldsNum(s) {
			var lower = String(s || "").toLowerCase().replace(/,/g, "").trim();
			var m = lower.match(/^([\d.]+)\s*([km]?)$/);
			if (!m) return NaN;
			var n = parseFloat(m[1]);
			if (m[2] === "k") n *= 1000;
			if (m[2] === "m") n *= 1000000;
			return Math.round(n);
		}
		var MONTHS = { january: "1月", february: "2月", march: "3月", april: "4月", may: "5月", june: "6月",
			july: "7月", august: "8月", september: "9月", october: "10月", november: "11月", december: "12月" };
		/* shields.io last-commit（如 "august 2026"）→ "2026年8月" */
		function parseCommitDate(s) {
			var m = String(s || "").toLowerCase().match(/([a-z]+)\s+(\d{4})/);
			if (!m) return String(s || "").trim();
			return m[2] + "年" + (MONTHS[m[1]] || m[1]);
		}
		/* 简易并发池 */
		function runPool(items, worker, concurrency, signal) {
			var out = new Array(items.length);
			var next = 0;
			async function pump() {
				while (next < items.length) {
					var idx = next++;
					out[idx] = await worker(items[idx], signal);
				}
			}
			var runners = [];
			var n = Math.min(concurrency, items.length);
			for (var i = 0; i < n; i++) runners.push(pump());
			return Promise.all(runners).then(function () { return out; });
		}

		/* ------------------------------------------------------------------ */
		/* 选中插件的操作：npm 解析 / 风险检查 / 服务端调用 / 安装建议            */
		/* ------------------------------------------------------------------ */
		/* npm 包名解析：热榜只有 GitHub 仓库，安装需要 npm 包名。
		 * 匹配策略：同名 > 名称包含 > 描述含 dsh/deepseek/harness 相关；均无则 null
		 *（宁缺毋滥，避免装错包；确认面板里包名可手改） */
		function resolveNpmPackage(repo) {
			return fetch("https://registry.npmjs.org/-/v1/search?text=" + encodeURIComponent(repo) + "&size=10")
				.then(function (r) { return r.ok ? r.json() : null; })
				.then(function (j) {
					if (!j || !Array.isArray(j.objects)) return null;
					var objs = j.objects;
					var repoLower = repo.toLowerCase();
					var nameHits = [];
					var descHits = [];
					for (var i = 0; i < objs.length; i++) {
						var p = objs[i].package;
						if (!p) continue;
						if (p.name === repo) return p.name;
						if (p.name.toLowerCase().indexOf(repoLower) !== -1) nameHits.push(p.name);
						else if (/dsh|deepseek|harness/i.test(p.description || "")) descHits.push(p.name);
					}
					if (nameHits.length > 0) return nameHits[0];
					if (descHits.length > 0) return descHits[0];
					return null;
				})
				.catch(function () { return null; });
		}
		/* npm registry 包元数据（免费无限量） */
		function fetchPkgMeta(pkg) {
			var enc = pkg.charAt(0) === "@" ? pkg.replace("/", "%2F") : pkg;
			return fetch("https://registry.npmjs.org/" + enc)
				.then(function (r) { return r.ok ? r.json() : null; })
				.catch(function () { return null; });
		}
		/* npm 漏洞库（audit bulk，免费） */
		function fetchAudit(pkg) {
			var body = {};
			body[pkg] = {};
			return fetch("https://registry.npmjs.org/-/npm/v1/security/advisories/bulk", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body)
			}).then(function (r) {
				if (!r.ok) return null;
				return r.json();
			}).then(function (j) {
				var arr = (j && Array.isArray(j[pkg])) ? j[pkg] : [];
				return arr.map(function (a) {
					return { severity: a.severity || "unknown", title: a.title || "", url: a.url || "" };
				});
			}).catch(function () { return null; });
		}
		/* 风险评分：漏洞 > 维护 > 依赖 > 星数 > 许可 */
		function assessRisk(plugin, meta, audit, pkgName) {
			var level = "low";
			var issues = [];
			var counts = { critical: 0, high: 0, moderate: 0, low: 0 };
			(audit || []).forEach(function (a) {
				if (counts[a.severity] !== undefined) counts[a.severity]++;
			});
			if (counts.critical > 0) {
				level = "high";
				issues.push({ cls: "bad", text: "发现 " + counts.critical + " 个严重(critical)漏洞，请勿安装！" });
			}
			if (counts.high > 0) {
				if (level === "low") level = "high";
				issues.push({ cls: "bad", text: "发现 " + counts.high + " 个高危(high)漏洞" });
			}
			if (counts.moderate > 0) {
				if (level === "low") level = "mid";
				issues.push({ cls: "warn", text: "发现 " + counts.moderate + " 个中危(moderate)漏洞" });
			}
			if (counts.low > 0) issues.push({ cls: "warn", text: "发现 " + counts.low + " 个低危漏洞" });
			if (audit && audit.length === 0) issues.push({ cls: "ok", text: "npm 漏洞库：无已知漏洞 ✓" });
			if (audit === null) issues.push({ cls: "warn", text: "npm 漏洞库查询不可用" });
			var lic = meta && (typeof meta.license === "string" ? meta.license : (meta.license && meta.license.type));
			if (lic) issues.push({ cls: "ok", text: "许可证：" + lic });
			else issues.push({ cls: "warn", text: "npm 元数据无许可证信息" });
			var latest = meta && meta["dist-tags"] && meta["dist-tags"].latest;
			var pub = latest && meta.time && meta.time[latest];
			if (pub) {
				var ageDays = (Date.now() - new Date(pub).getTime()) / 86400000;
				if (ageDays > 365) {
					if (level === "low") level = "mid";
					issues.push({ cls: "warn", text: "最近发布距今 " + Math.round(ageDays) + " 天，可能维护不活跃" });
				} else {
					issues.push({ cls: "ok", text: "最近发布：" + Math.round(ageDays) + " 天前 ✓" });
				}
			} else {
				issues.push({ cls: "warn", text: "无法确认最近发布版本" });
			}
			var deps = meta && meta.dependencies ? Object.keys(meta.dependencies).length : 0;
			if (deps > 50) {
				if (level === "low") level = "mid";
				issues.push({ cls: "warn", text: "依赖 " + deps + " 个包，体积较大（注意你的约束：优先轻量插件）" });
			} else {
				issues.push({ cls: "ok", text: "依赖 " + deps + " 个包" });
			}
			if (plugin.stars !== null && plugin.stars !== undefined) {
				if (plugin.stars < 10) {
					if (level === "low") level = "mid";
					issues.push({ cls: "warn", text: "星数仅 " + formatStars(plugin.stars) + "，社区采用度低" });
				} else {
					issues.push({ cls: "ok", text: "星数 " + formatStars(plugin.stars) + "，社区活跃 ✓" });
				}
			}
			if (plugin.owner === "deepseek-ai" || plugin.owner === "awesome-dsh-plugin") {
				issues.push({ cls: "ok", text: "作者/组织可信：" + plugin.owner + " ✓" });
			}
			return { level: level, issues: issues, counts: counts, pkg: pkgName };
		}
		/* 解析整体情况文件区块（行级，兼容手改） */
		function parseOverviewSections(auto, manual) {
			var out = { installed: [], usage: {}, usageText: "", constraints: [] };
			var cur = null;
			function feed(block) {
				var lines = String(block || "").split("\n");
				for (var i = 0; i < lines.length; i++) {
					var line = lines[i];
					var t = line.trim();
					if (t === "") continue;
					if (t.charAt(0) === "#") continue;
					if (t === "installed_plugins:") { cur = "installed"; continue; }
					if (t === "usage:") { cur = "usage"; continue; }
					if (t === "constraints:") { cur = "constraints"; continue; }
					/* 其他顶层键（非缩进且以冒号结尾）→ 重置当前区 */
					if (/^\S/.test(line) && /:$/.test(t)) { cur = null; continue; }
					if (cur === "installed" && /^-\s+/.test(t)) out.installed.push(t.replace(/^-\s+/, ""));
					if (cur === "constraints" && /^-\s+/.test(t)) out.constraints.push(t.replace(/^-\s+/, ""));
					if (cur === "usage" && /^\s+/.test(line)) {
						var kv = t.match(/^(\S+):\s*(.*)$/);
						if (kv) { out.usage[kv[1]] = kv[2]; out.usageText += " " + kv[2]; }
					}
				}
			}
			feed(auto);
			feed(manual);
			return out;
		}
		/* 安装建议规则引擎（读取整体情况 + 插件特征） */
		function buildAdvice(plugin, ov, risk) {
			var conclusion = { level: "ok", text: "可以考虑安装" };
			var reasons = [];
			var conflict = null;
			var lowerName = plugin.name.toLowerCase();
			for (var i = 0; i < ov.installed.length; i++) {
				var inst = ov.installed[i].toLowerCase().replace(/\(.*\)/, "").trim();
				if (inst === lowerName || inst.indexOf(lowerName) !== -1 || lowerName.indexOf(inst) !== -1) {
					conflict = ov.installed[i];
					break;
				}
			}
			if (conflict) {
				conclusion = { level: "no", text: "可能已安装，请先确认" };
				reasons.push("当前 profile 中已有相近条目：" + conflict + "——重复安装可能导致冲突");
			}
			if (risk) {
				if (risk.level === "high") {
					conclusion = { level: "no", text: "不建议安装（风险过高）" };
					reasons.push("风险检查为「高风险」：存在严重/高危漏洞");
				} else if (risk.level === "mid") {
					if (conclusion.level === "ok") conclusion = { level: "warn", text: "谨慎安装（存在中风险项）" };
					reasons.push("风险检查为「中风险」，安装前请查看检查项明细");
				} else {
					reasons.push("风险检查通过（低风险）✓");
				}
			}
			var catKeys = {
				"UI 增强": ["界面", "ui", "外观", "面板", "输入框"],
				"主题与外观": ["主题", "外观", "皮肤", "界面"],
				"会话与消息": ["对话", "会话", "消息", "聊天"],
				"记忆": ["记忆", "笔记", "知识库"],
				"工具与能力": ["pdf", "文档", "图片", "ocr", "表格", "文件", "数据", "视觉"],
				"工作流与自动化": ["自动化", "流程", "工作流", "巡查", "看板"],
				"通知与集成": ["通知", "企业微信", "腾讯文档", "集成", "推送"],
				"模型与账号接入": ["模型", "账号", "余额", "api", "token"],
				"开发与运行时": ["开发", "终端", "cli", "运行时"],
				"娱乐": ["宠物", "娱乐", "趣味"]
			};
			var matched = false;
			var kws = catKeys[plugin.category];
			if (kws && ov.usageText) {
				var lower = ov.usageText.toLowerCase();
				for (var k = 0; k < kws.length; k++) {
					if (lower.indexOf(kws[k]) !== -1) {
						reasons.push("分类「" + plugin.category + "」与你常用功能匹配（命中：" + kws[k] + "）");
						matched = true;
						break;
					}
				}
			}
			if (!matched) reasons.push("分类「" + plugin.category + "」与当前记录的用途关联不大，按需决定");
			if (plugin.stars !== null && plugin.stars !== undefined) {
				reasons.push(plugin.stars >= 100 ? "社区热度高（★" + formatStars(plugin.stars) + "）" : "星数 " + formatStars(plugin.stars) + "，属早期插件");
			}
			if (plugin.commit) reasons.push("最近提交：" + plugin.commit);
			var cons = ov.constraints.join(" ");
			if (/轻量/.test(cons)) reasons.push("注意你的约束「优先轻量插件」：安装后留意 UI 占用与依赖体积");
			if (/风险/.test(cons)) reasons.push("注意你的约束「新插件先检查风险」：建议先点「检查风险」再安装");
			var cmdPkg = (risk && risk.pkg) || plugin.repo;
			return {
				conclusion: conclusion,
				reasons: reasons,
				cmd: "dsh plugin --profile web add " + cmdPkg,
				note: "未检查风险时命令中的包名可能不准确，建议先「检查风险」；安装后自动写入 dsh-overview.yaml 变更记录，重启 dsh web 后生效。"
			};
		}
		/* 调用本机服务端插件（同源） */
		function callServer(path, body) {
			return fetch(path, {
				method: body ? "POST" : "GET",
				headers: body ? { "Content-Type": "application/json" } : undefined,
				body: body ? JSON.stringify(body) : undefined
			}).then(function (r) {
				if (!r.ok) throw new Error("HTTP " + r.status);
				return r.json();
			});
		}

		/* ------------------------------------------------------------------ */
		/* 扫描逻辑（tab 1：deepseek-ai 组织内 dsh 相关仓库）                     */
		/* ------------------------------------------------------------------ */
		function fetchJson(url, signal) {
			var headers = { "Accept": "application/vnd.github+json" };
			var tok = getToken();
			if (tok) headers["Authorization"] = "Bearer " + tok;
			return fetch(url, {
				method: "GET",
				headers: headers,
				signal: signal
			}).then(function (res) {
				var remaining = res.headers.get("x-ratelimit-remaining");
				var limit = res.headers.get("x-ratelimit-limit");
				if (res.status === 403) {
					if (remaining === "0") {
						var isSearch = url.indexOf("/search/") !== -1;
						var quota = tok
							? "认证 " + (limit || "5000") + " 次/小时"
							: (isSearch ? "未认证 10 次/分钟" : "未认证 60 次/小时");
						throw new Error("GitHub " + (isSearch ? "搜索" : "核心") + "接口速率限制已用尽（" + quota + "），请稍后再试。");
					}
				}
				if (res.status === 404) return { data: { __notFound: true }, remaining: remaining, limit: limit };
				if (!res.ok) throw new Error("GitHub API 请求失败：HTTP " + res.status);
				return res.json().then(function (json) {
					return { data: json, remaining: remaining, limit: limit };
				});
			});
		}

		/* 匹配分级：官方仓库 > 名称 = dsh > 名称含 dsh/harness > DSH 缩写 > 描述提及 */
		function kindOf(repoName, description, fullName) {
			var name = String(repoName || "").toLowerCase();
			var desc = String(description || "").toLowerCase();
			if (fullName === ORG + "/deepseek-harness") return "official";
			if (name === "dsh") return "exact";
			if (name.indexOf("dsh") !== -1 || name.indexOf("deepseek-harness") !== -1) return "name";
			if (/deep[-_\s]?seek[-_\s]?harness/.test(name)) return "acronym";
			if (desc.indexOf("dsh") !== -1 || desc.indexOf("deepseek harness") !== -1) return "desc";
			return null;
		}

		function highlight(text, needle) {
			if (!text) return null;
			var lower = text.toLowerCase();
			var idx = lower.indexOf(needle.toLowerCase());
			if (idx === -1) return text;
			return React.createElement(React.Fragment, null,
				text.slice(0, idx),
				React.createElement("mark", null, text.slice(idx, idx + needle.length)),
				text.slice(idx + needle.length)
			);
		}

		async function runScan(signal) {
			var matches = [];
			var seen = new Set();
			var notes = [];
			var remaining = null;
			var limit = null;
			var officialFound = false;
			var dshExact = false;
			var totalHits = 0;
			var officialPushedAt = null;
			for (var i = 0; i < SEARCH_QUERIES.length; i++) {
				var q = SEARCH_QUERIES[i];
				try {
					var url = "https://api.github.com/search/repositories?q=" + encodeURIComponent(q.q) + "&per_page=30";
					var r = await fetchJson(url, signal);
					if (r.remaining != null) { remaining = r.remaining; limit = r.limit; }
					var data = r.data || {};
					if (data.__notFound) continue;
					var items = Array.isArray(data.items) ? data.items : [];
					totalHits += Number(data.total_count) || 0;
					for (var j = 0; j < items.length; j++) {
						var repo = items[j];
						if (!repo || seen.has(repo.id)) continue;
						seen.add(repo.id);
						var k = kindOf(repo.name, repo.description, repo.full_name);
						if (!k) continue;
						if (repo.full_name === ORG + "/deepseek-harness") {
							officialFound = true;
							officialPushedAt = repo.pushed_at || null;
						}
						if (repo.name === "dsh") dshExact = true;
						matches.push({
							id: repo.id,
							name: repo.name,
							fullName: repo.full_name,
							htmlUrl: repo.html_url,
							description: repo.description,
							stars: repo.stargazers_count || 0,
							updatedAt: repo.updated_at || null,
							kind: k
						});
					}
				} catch (e) {
					if (e && e.name === "AbortError") throw e;
					notes.push("「" + q.label + "」" + ((e && e.message) ? e.message : String(e)));
				}
			}
			matches.sort(function (a, b) {
				var rank = { official: 0, exact: 1, name: 2, acronym: 3, desc: 4 };
				return (rank[a.kind] - rank[b.kind]) || ((b.stars || 0) - (a.stars || 0));
			});
			return {
				ok: true,
				official: officialFound,
				exact: dshExact,
				totalHits: totalHits,
				matches: matches,
				officialPushedAt: officialPushedAt,
				remaining: remaining,
				limit: limit,
				hasToken: !!getToken(),
				at: new Date(),
				note: notes.length ? notes.join("；") : null
			};
		}

		/* 扫描缓存（stale-while-revalidate） */
		function loadScanCache() {
			try {
				var raw = localStorage.getItem(SCAN_CACHE_KEY);
				if (!raw) return null;
				var c = JSON.parse(raw);
				if (!c || !c.result || !c.at) return null;
				if (Date.now() - new Date(c.at).getTime() > SCAN_CACHE_TTL) return null;
				return c.result;
			} catch (e) { return null; }
		}
		function saveScanCache(result) {
			try {
				localStorage.setItem(SCAN_CACHE_KEY, JSON.stringify({ at: result.at, result: result }));
			} catch (e) { /* ignore */ }
		}

		/* ------------------------------------------------------------------ */
		/* 热榜逻辑（tab 2：dsh 生态插件榜）                                     */
		/* ------------------------------------------------------------------ */
		/* 解析 awesome-dsh-plugin 的中文 README：
		 *   ### 🎨 UI 增强
		 *   - [插件名](https://github.com/owner/repo) — 中文介绍 */
		function parseWatchReadme(text) {
			var lines = String(text || "").split("\n");
			var plugins = [];
			var category = "未分类";
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i].trim();
				if (/^###\s+/.test(line)) {
					category = line.replace(/^###\s+/, "")
						.replace(/[^\u4e00-\u9fa5A-Za-z0-9\u00b7&()（）\/\s-]/g, "").trim() || "未分类";
					continue;
				}
				var m = line.match(/^-\s+\[([^\]]+)\]\((https?:\/\/[^)]+)\)\s*(?:[—–-]\s*)?(.*)$/);
				if (!m) continue;
				var url = m[2].trim();
				var rm = url.match(/^https?:\/\/github\.com\/([^\/\s]+)\/([^\/\s?#]+)/);
				if (!rm) continue;
				plugins.push({
					name: m[1].trim(),
					owner: rm[1],
					repo: rm[2].replace(/\.git$/, ""),
					url: "https://github.com/" + rm[1] + "/" + rm[2].replace(/\.git$/, ""),
					desc: (m[3] || "").trim(),
					category: category
				});
			}
			return plugins;
		}

		/* shields.io：星数与最近提交（免费、无限量、不占 GitHub API 额度） */
		function fetchShield(path, signal) {
			return fetch("https://img.shields.io/" + path + ".json", { signal: signal })
				.then(function (res) { if (!res.ok) return null; return res.json(); })
				.catch(function () { return null; });
		}
		function fetchStars(plugin, signal) {
			return fetchShield("github/stars/" + plugin.owner + "/" + plugin.repo, signal)
				.then(function (j) {
					if (!j || j.value === undefined) return null;
					var n = parseShieldsNum(String(j.value));
					return isNaN(n) ? null : n;
				});
		}
		function fetchCommit(plugin, signal) {
			return fetchShield("github/last-commit/" + plugin.owner + "/" + plugin.repo, signal)
				.then(function (j) {
					if (!j || j.value === undefined) return null;
					return parseCommitDate(String(j.value));
				});
		}

		/* 拉取插件目录 README：按镜像降级链逐个尝试 */
		function fetchReadmeText(signal) {
			var lastErr = null;
			function attempt(u) {
				if (u === null) {
					var headers = { "Accept": "application/vnd.github.raw" };
					var tok = getToken();
					if (tok) headers["Authorization"] = "Bearer " + tok;
					return fetch("https://api.github.com/repos/awesome-dsh-plugin/awesome-dsh-plugin/readme", {
						headers: headers,
						signal: signal
					}).then(function (res) {
						if (!res.ok) throw new Error("GitHub API HTTP " + res.status);
						return res.text();
					});
				}
				return fetch(u, { signal: signal }).then(function (res) {
					if (!res.ok) throw new Error("HTTP " + res.status);
					return res.text();
				});
			}
			function next(i) {
				if (i >= WATCH_README_URLS.length) {
					return Promise.reject(lastErr || new Error("插件目录所有镜像均不可用。"));
				}
				return attempt(WATCH_README_URLS[i]).catch(function (e) {
					lastErr = e;
					return next(i + 1);
				});
			}
			return next(0);
		}

		async function runWatch(signal) {
			var text = await fetchReadmeText(signal);
			var plugins = parseWatchReadme(text);
			if (plugins.length === 0) throw new Error("插件目录解析失败（格式可能已变化）。");
			/* 星数 + 更新时间（并发拉取，单项失败置空不阻塞） */
			var stars = await runPool(plugins, fetchStars, WATCH_CONCURRENCY, signal);
			var commits = await runPool(plugins, fetchCommit, WATCH_CONCURRENCY, signal);
			for (var i = 0; i < plugins.length; i++) {
				plugins[i].stars = stars[i];
				plugins[i].commit = commits[i];
			}
			var cats = [];
			for (var j = 0; j < plugins.length; j++) {
				if (cats.indexOf(plugins[j].category) === -1) cats.push(plugins[j].category);
			}
			return {
				ok: true,
				plugins: plugins,
				categories: cats,
				at: new Date()
			};
		}

		function loadWatchCache() {
			try {
				var raw = localStorage.getItem(WATCH_CACHE_KEY);
				if (!raw) return null;
				var c = JSON.parse(raw);
				if (!c || !c.result || !c.at) return null;
				if (Date.now() - new Date(c.at).getTime() > WATCH_CACHE_TTL) return null;
				return c.result;
			} catch (e) { return null; }
		}
		function saveWatchCache(result) {
			try {
				localStorage.setItem(WATCH_CACHE_KEY, JSON.stringify({ at: result.at, result: result }));
			} catch (e) { /* ignore */ }
		}
		/* 新插件发现：对比上次缓存的名称集合 */
		function diffNewPlugins(prev, next) {
			if (!prev || !prev.plugins) return 0;
			var names = {};
			for (var i = 0; i < prev.plugins.length; i++) names[prev.plugins[i].name] = true;
			var n = 0;
			for (var j = 0; j < next.plugins.length; j++) {
				if (!names[next.plugins[j].name]) n++;
			}
			return n;
		}

		/* ------------------------------------------------------------------ */
		/* 拖动                                                                 */
		/* ------------------------------------------------------------------ */
		var POS_KEY = "deepseek-harness-dsh-plugin-hub:pos:v1";
		var SIZE_KEY = "deepseek-harness-dsh-plugin-hub:size:v1";
		function loadSize() {
			try {
				var raw = JSON.parse(localStorage.getItem(SIZE_KEY) || "null");
				if (raw && Number.isFinite(Number(raw.w)) && Number.isFinite(Number(raw.h))) {
					return {
						w: Math.max(280, Math.min(window.innerWidth - 24, Number(raw.w))),
						h: Math.max(300, Math.min(window.innerHeight - 40, Number(raw.h)))
					};
				}
			} catch (e) { /* ignore */ }
			return { w: 310, h: 560 };
		}
		function saveSize(s) {
			try { localStorage.setItem(SIZE_KEY, JSON.stringify(s)); } catch (e) { /* ignore */ }
		}
		/* 官方仓库更新提醒：记录已读基准（pushed_at），有新提交亮绿点 */
		var OFFICIAL_KEY = "deepseek-harness-dsh-plugin-hub:official:v1";
		function loadOfficialSeen() {
			try {
				var raw = JSON.parse(localStorage.getItem(OFFICIAL_KEY) || "null");
				if (raw && typeof raw.pushedAt === "string" && raw.pushedAt) return raw;
			} catch (e) { /* ignore */ }
			return null;
		}
		function saveOfficialSeen(rec) {
			try { localStorage.setItem(OFFICIAL_KEY, JSON.stringify(rec)); } catch (e) { /* ignore */ }
		}
		function loadPos() {
			try {
				var raw = JSON.parse(localStorage.getItem(POS_KEY) || "null");
				if (raw && typeof raw === "object" && Number.isFinite(Number(raw.dx)) && Number.isFinite(Number(raw.dy))) {
					return { dx: Number(raw.dx), dy: Number(raw.dy) };
				}
			} catch (e) { /* ignore */ }
			return { dx: 0, dy: 0 };
		}
		function savePos(p) {
			try { localStorage.setItem(POS_KEY, JSON.stringify(p)); } catch (e) { /* ignore */ }
		}
		/**
		 * 通用拖动：在 dock 根元素上按住（来自标题栏/胶囊）即可拖动，
		 * 边界限制在视口内（留 4px），up 时经 hooks.persist 持久化。
		 * hooks: { el, pos, setPos, moved?(bool), persist }
		 */
		function startDrag(e, hooks) {
			if (e.button !== 0) return;
			if (e.target && e.target.closest && e.target.closest("button, a, input, select")) return;
			var el = hooks.el();
			if (!el) return;
			var rect = el.getBoundingClientRect();
			var startX = e.clientX;
			var startY = e.clientY;
			var orig = hooks.pos();
			if (hooks.moved) hooks.moved(false);
			var onMove = function (ev) {
				var dx = orig.dx + ev.clientX - startX;
				var dy = orig.dy + ev.clientY - startY;
				if (hooks.moved && (Math.abs(dx - orig.dx) > 3 || Math.abs(dy - orig.dy) > 3)) hooks.moved(true);
				dx = Math.min(window.innerWidth - 4 - rect.right, Math.max(4 - rect.left, dx));
				dy = Math.min(window.innerHeight - 4 - rect.bottom, Math.max(4 - rect.top, dy));
				hooks.setPos({ dx: dx, dy: dy });
			};
			var onUp = function () {
				window.removeEventListener("pointermove", onMove);
				window.removeEventListener("pointerup", onUp);
				document.body.style.cursor = "";
				document.body.style.userSelect = "";
				if (hooks.persist) hooks.persist();
			};
			window.addEventListener("pointermove", onMove);
			window.addEventListener("pointerup", onUp);
			document.body.style.cursor = "grabbing";
			document.body.style.userSelect = "none";
			e.preventDefault();
		}

		/* ------------------------------------------------------------------ */
		/* 热榜面板                                                             */
		/* ------------------------------------------------------------------ */
		function WatchPanel() {
			var phaseState = React.useState("loading"); /* loading | done | error */
			var phase = phaseState[0];
			var setPhase = phaseState[1];
			var resultState = React.useState(null);
			var result = resultState[0];
			var setResult = resultState[1];
			var errState = React.useState(null);
			var err = errState[0];
			var setErr = errState[1];
			var seqRef = React.useRef(0);
			var lastRef = React.useRef(0);
			var staleRef = React.useRef(false);
			var newCountRef = React.useRef(0);
			var filterState = React.useState("__all__");
			var filter = filterState[0];
			var setFilter = filterState[1];
			var sortState = React.useState("stars");
			var sort = sortState[0];
			var setSort = sortState[1];
			var searchState = React.useState("");
			var search = searchState[0];
			var setSearch = searchState[1];

			/* 选中插件与操作状态 */
			var selState = React.useState(null);
			var sel = selState[0];
			var setSel = selState[1];
			var riskState = React.useState(null); /* { phase, pkg, report, error } */
			var risk = riskState[0];
			var setRisk = riskState[1];
			var installState = React.useState(null); /* { phase, pkg, output, ok, error, note } */
			var install = installState[0];
			var setInstall = installState[1];
			var adviceState = React.useState(null); /* { phase, result, error } */
			var advice = adviceState[0];
			var setAdvice = adviceState[1];
			var opSeqRef = React.useRef(0);
			/* 安装确认面板的包名草稿（可手改） */
			var draftState = React.useState("");
			var draftPkg = draftState[0];
			var setDraftPkg = draftState[1];

			var load = React.useCallback(function (force) {
				var now = Date.now();
				/* 显式刷新不再节流：点击「刷新」总是重新拉取最新数据 */
				var seq = ++seqRef.current;
				var prev = resultState.current;
				setPhase("loading");
				var ctl = new AbortController();
				runWatch(ctl.signal).then(function (r) {
					if (seq !== seqRef.current) return;
					newCountRef.current = diffNewPlugins(prev, r);
					saveWatchCache(r);
					lastRef.current = Date.now();
					staleRef.current = false;
					setResult(r);
					setErr(null);
					setPhase("done");
				}).catch(function (e) {
					if (seq !== seqRef.current) return;
					if (e && e.name === "AbortError") return;
					setErr((e && e.message) ? e.message : String(e));
					setPhase("error");
				});
			}, []);

			React.useEffect(function () {
				var cached = loadWatchCache();
				if (cached) {
					staleRef.current = true;
					newCountRef.current = 0;
					setResult(cached);
					setPhase("done");
					/* 有缓存：静默后台刷新（即使 TTL 未到也刷新一次，保持监督新鲜度） */
					load(false);
				} else {
					load(true);
				}
				return function () { seqRef.current++; };
			}, [load]);

			/* ---- 操作处理 ---- */
			var selectPlugin = function (p) {
				var isSame = sel && sel.owner === p.owner && sel.repo === p.repo;
				opSeqRef.current++;
				setSel(isSame ? null : p);
				setRisk(null);
				setInstall(null);
				setAdvice(null);
			};
			var doCheckRisk = async function (p) {
				var seq = ++opSeqRef.current;
				setRisk({ phase: "resolving" });
				setInstall(null);
				setAdvice(null);
				try {
					var pkg = await resolveNpmPackage(p.repo);
					if (seq !== opSeqRef.current) return;
					if (!pkg) {
						setRisk({ phase: "done", pkg: null, report: { level: "low", pkg: null, issues: [{ cls: "warn", text: "未在 npm 找到该包（可能未发布或为私有）" }, { cls: "ok", text: "GitHub 仓库：" + p.owner + "/" + p.repo }, { cls: "ok", text: "星数：" + (p.stars != null ? formatStars(p.stars) : "—") }, p.commit ? { cls: "ok", text: "最近提交：" + p.commit } : { cls: "warn", text: "最近提交：未知" }, { cls: "warn", text: "建议点击「安装」走 git 方式安装" }] } });
						return;
					}
					setRisk({ phase: "checking", pkg: pkg });
					var meta = await fetchPkgMeta(pkg);
					var audit = await fetchAudit(pkg);
					if (seq !== opSeqRef.current) return;
					var report = assessRisk(p, meta, audit, pkg);
					setRisk({ phase: "done", pkg: pkg, report: report });
				} catch (e) {
					if (seq !== opSeqRef.current) return;
					setRisk({ phase: "error", error: (e && e.message) ? e.message : String(e) });
				}
			};
			var startInstall = async function (p, pkg) {
				var seq = ++opSeqRef.current;
				setInstall({ phase: "installing", pkg: pkg, progress: 3, log: "" });
				var t0 = Date.now();
				var prog = 3;
				var logText = "";
				/* 根据 pnpm 输出关键词推进进度（单调递增）+ 时间兜底 */
				function advance(line) {
					var target = prog;
					if (/resolv|lockfile|lock file/i.test(line)) target = Math.max(target, 15);
					if (/fetch|download|reused|already present/i.test(line)) target = Math.max(target, 45);
					if (/link|patch|write|dependency/i.test(line)) target = Math.max(target, 72);
					if (/add|build|install|complete|done/i.test(line)) target = Math.max(target, 92);
					var timeBased = Math.min(92, Math.round(((Date.now() - t0) / 90000) * 92));
					prog = Math.max(target, timeBased, prog);
					return prog;
				}
				try {
					var res = await fetch("/api/gh-watch/install", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ pkg: pkg })
					});
					if (!res.ok) throw new Error("HTTP " + res.status);
					var reader = res.body.getReader();
					var decoder = new TextDecoder();
					var buf = "";
					while (true) {
						var chunk = await reader.read();
						if (chunk.done) break;
						buf += decoder.decode(chunk.value, { stream: true });
						var lines = buf.split("\n");
						buf = lines.pop();
						for (var i = 0; i < lines.length; i++) {
							var line = lines[i];
							if (!line.trim()) continue;
							var evt;
							try { evt = JSON.parse(line); } catch (e) { continue; }
							if (evt.type === "out") {
								var clean = String(evt.data || "").replace(/\x1b\[[0-9;]*m/g, "").trim();
								if (!clean) continue;
								logText = (logText + "\n" + clean).slice(-2000);
								if (seq === opSeqRef.current) {
									setInstall({ phase: "installing", pkg: pkg, progress: advance(clean), log: logText });
								}
							} else if (evt.type === "done") {
								if (seq !== opSeqRef.current) return;
								setInstall({ phase: "done", pkg: pkg, ok: !!evt.ok, output: logText, note: evt.note });
								return;
							}
						}
					}
				} catch (e) {
					if (seq !== opSeqRef.current) return;
					setInstall({
						phase: "error", pkg: pkg,
						error: "无法连接服务端（" + ((e && e.message) ? e.message : e) + "）——服务端插件 gh-watch-server 需重启 dsh web 后生效。"
					});
				}
			};
			var doInstall = async function (p) {
				var seq = ++opSeqRef.current;
				setRisk(null);
				setAdvice(null);
				var pkg = (risk && risk.phase === "done" && risk.pkg) || null;
				if (pkg) {
					setDraftPkg(pkg);
					setInstall({ phase: "confirm", pkg: pkg });
					return;
				}
				setInstall({ phase: "resolving" });
				pkg = await resolveNpmPackage(p.repo);
				if (seq !== opSeqRef.current) return;
				if (!pkg) {
					pkg = "github:" + p.owner + "/" + p.repo; setDraftPkg(pkg); setInstall({ phase: "confirm", pkg: pkg, via: "git" });
					return;
				}
				setDraftPkg(pkg);
				setInstall({ phase: "confirm", pkg: pkg });
			};
			var doAdvice = async function (p) {
				var seq = ++opSeqRef.current;
				setAdvice({ phase: "loading" });
				setInstall(null);
				try {
					var j = await callServer("/api/gh-watch/overview");
					if (seq !== opSeqRef.current) return;
					var ov = parseOverviewSections(j.auto || "", j.manual || "");
					var rpt = (risk && risk.phase === "done" && risk.report) || null;
					var adv = buildAdvice(p, ov, rpt);
					setAdvice({ phase: "done", result: adv });
				} catch (e) {
					if (seq !== opSeqRef.current) return;
					setAdvice({
						phase: "error",
						error: "无法读取整体情况文件（" + ((e && e.message) ? e.message : e) + "）——服务端插件 gh-watch-server 需重启 dsh web 后生效。"
					});
				}
			};

			/* ---- 操作结果面板 ---- */
			function riskView() {
				if (!risk) return null;
				if (risk.phase === "resolving" || risk.phase === "checking") {
					return React.createElement("div", { className: "hub-panel" },
						React.createElement("span", { className: "hub-spin" }, "⟳"),
						React.createElement("span", null, risk.phase === "resolving" ? "正在解析 npm 包名…" : "正在检查风险（" + risk.pkg + "）…"));
				}
				if (risk.phase === "error") {
					return React.createElement("div", { className: "hub-panel" },
						React.createElement("div", { className: "hub-err" }, risk.error));
				}
				if (risk.phase === "done" && risk.report) {
					var r = risk.report;
					var lvlText = { high: "高风险", mid: "中风险", low: "低风险" }[r.level] || r.level;
					return React.createElement("div", { className: "hub-panel" },
						React.createElement("div", null,
							React.createElement("span", { className: "hub-risklvl " + r.level }, lvlText),
							React.createElement("span", { style: { marginLeft: "6px", fontWeight: 600 } }, r.pkg ? "npm 包：" + r.pkg : "来源：GitHub（git 安装）")
						),
						React.createElement("div", { className: "hub-issues" },
							r.issues.map(function (it, i) {
								return React.createElement("div", { key: i, className: it.cls },
									(it.cls === "ok" ? "✓ " : it.cls === "bad" ? "✗ " : "⚠ ") + it.text);
							})
						)
					);
				}
				return null;
			}
			function installView() {
				if (!install) return null;
				if (install.phase === "resolving") {
					return React.createElement("div", { className: "hub-panel" },
						React.createElement("span", { className: "hub-spin" }, "⟳"),
						React.createElement("span", null, "正在解析 npm 包名…"));
				}
				if (install.phase === "confirm") {
					return React.createElement("div", { className: "hub-panel" },
						React.createElement("div", null, install.via === "git" ? "该插件未发布到 npm，将用 git 方式安装（web profile，可修改）：" : "将执行（web profile，包名可修改）："),
						React.createElement("div", { className: "hub-set-row" },
							React.createElement("input", {
								type: "text",
								value: draftPkg,
								onChange: function (e) { setDraftPkg(e.target.value); },
								onKeyDown: function (e) { if (e.key === "Enter" && draftPkg.trim()) startInstall(sel, draftPkg.trim()); }
							})
						),
						React.createElement("div", { className: "hub-actions" },
							React.createElement("button", {
								className: "hub-act",
								style: { borderColor: "rgba(220,38,38,.45)", color: "#b91c1c" },
								disabled: !draftPkg.trim(),
								onClick: function (e) { e.stopPropagation(); startInstall(sel, draftPkg.trim()); }
							}, "确认安装"),
							React.createElement("button", { className: "hub-act", onClick: function (e) { e.stopPropagation(); setInstall(null); } }, "取消")
						)
					);
				}
				if (install.phase === "installing") {
					var pct = install.progress || 0;
					return React.createElement("div", { className: "hub-panel" },
						React.createElement("div", null,
							React.createElement("span", { className: "hub-spin" }, "⟳"),
							React.createElement("span", null, " 正在安装 " + install.pkg + "…")),
						React.createElement("div", { className: "hub-progress" },
							React.createElement("div", { className: "hub-progress-fill", style: { width: pct + "%" } })),
						React.createElement("div", { className: "hub-prog-txt" }, pct + "% · pnpm 安装通常需 1-2 分钟，请稍候"),
						install.log ? React.createElement("div", { className: "hub-out" }, install.log) : null
					);
				}
				if (install.phase === "done") {
					return React.createElement("div", { className: "hub-panel" },
						React.createElement("div", { className: "hub-verdict " + (install.ok ? "found" : "none"), style: { padding: "5px 8px", fontSize: "11.5px" } },
							React.createElement("span", null, install.ok ? "✓" : "✗"),
							React.createElement("span", { className: "hub-v-txt" }, install.ok ? "安装成功" : "安装失败")
						),
						install.output ? React.createElement("div", { className: "hub-out" }, install.output) : null,
						install.note ? React.createElement("div", { className: "hub-note" }, install.note) : null
					);
				}
				if (install.phase === "error") {
					return React.createElement("div", { className: "hub-panel" },
						React.createElement("div", { className: "hub-err" }, install.error));
				}
				return null;
			}
			function adviceView() {
				if (!advice) return null;
				if (advice.phase === "loading") {
					return React.createElement("div", { className: "hub-panel" },
						React.createElement("span", { className: "hub-spin" }, "⟳"),
						React.createElement("span", null, "正在读取 dsh-overview.yaml 整体情况…"));
				}
				if (advice.phase === "error") {
					return React.createElement("div", { className: "hub-panel" },
						React.createElement("div", { className: "hub-err" }, advice.error));
				}
				if (advice.phase === "done" && advice.result) {
					var r = advice.result;
					var cls = r.conclusion.level;
					var icon = cls === "ok" ? "✅" : cls === "warn" ? "⚠️" : "⛔";
					return React.createElement("div", { className: "hub-panel" },
						React.createElement("div", { className: "hub-adv" },
							React.createElement("div", { className: "t " + cls }, icon + " " + r.conclusion.text),
							r.reasons.map(function (x, i) {
								return React.createElement("div", { key: i }, "· " + x);
							}),
							React.createElement("div", { className: "hub-cmd" }, r.cmd),
							React.createElement("div", { className: "hub-note" }, r.note)
						)
					);
				}
				return null;
			}

			var shown = [];
			if (result && result.plugins) {
				shown = result.plugins.slice();
				if (filter !== "__all__") {
					shown = shown.filter(function (p) { return p.category === filter; });
				}
				if (search.trim()) {
					var sq = search.trim().toLowerCase();
					shown = shown.filter(function (p) {
						return p.name.toLowerCase().indexOf(sq) !== -1 ||
							(p.desc && p.desc.toLowerCase().indexOf(sq) !== -1) ||
							p.category.toLowerCase().indexOf(sq) !== -1 ||
							(p.owner + "/" + p.repo).toLowerCase().indexOf(sq) !== -1;
					});
				}
				if (sort === "stars") {
					shown.sort(function (a, b) {
						var sa = (a.stars === null || a.stars === undefined) ? -1 : a.stars;
						var sb = (b.stars === null || b.stars === undefined) ? -1 : b.stars;
						return sb - sa;
					});
				} else {
					shown.sort(function (a, b) { return a.name.localeCompare(b.name); });
				}
			}

			var head = null;
			var filters = null;
			var list = null;
			var note = null;

			if (phase === "loading" && !result) {
				head = React.createElement("div", { className: "hub-verdict partial" },
					React.createElement("span", { className: "hub-spin" }, "⟳"),
					React.createElement("span", { className: "hub-v-txt" }, "正在拉取 dsh 生态插件目录…")
				);
			} else if (phase === "error") {
				head = React.createElement("div", { className: "hub-verdict none" },
					React.createElement("span", null, "✗"),
					React.createElement("span", { className: "hub-v-txt" }, "热榜加载失败"),
					React.createElement("button", { className: "hub-btn", title: "重试", onClick: function () { load(true); } }, "↻")
				);
				head = React.createElement(React.Fragment, null,
					head,
					React.createElement("div", { className: "hub-err" }, err)
				);
			} else if (result && result.ok) {
				var cats = result.categories || [];
				var opts = [React.createElement("option", { key: "__all__", value: "__all__" }, "全部分类")];
				for (var i = 0; i < cats.length; i++) {
					opts.push(React.createElement("option", { key: cats[i], value: cats[i] }, cats[i]));
				}
				head = React.createElement("div", { className: "hub-meta" },
					React.createElement("span", null, "插件总数 ", React.createElement("b", null, String(result.plugins.length))),
					React.createElement("span", null, "更新于 ", React.createElement("b", null,
						result.at ? new Date(result.at).toLocaleTimeString() : "—")),
					staleRef.current ? React.createElement("span", { className: "hub-stale" }, "（缓存）") : null,
					newCountRef.current > 0
						? React.createElement("span", { className: "hub-new" }, "🆕 新增 " + newCountRef.current + " 个")
						: null
				);
				filters = React.createElement(React.Fragment, null,
					React.createElement("input", {
						className: "hub-search",
						type: "text",
						placeholder: "搜索插件（名称 / 介绍 / 分类 / 作者）",
						value: search,
						onChange: function (e) { setSearch(e.target.value); }
					}),
					React.createElement("div", { className: "hub-filters" },
						React.createElement("select", {
							value: filter,
							title: "按分类筛选",
							onChange: function (e) { setFilter(e.target.value); }
						}, opts),
						React.createElement("select", {
							value: sort,
							title: "排序方式",
							onChange: function (e) { setSort(e.target.value); }
						},
							React.createElement("option", { value: "stars" }, "按星数"),
							React.createElement("option", { value: "name" }, "按名称")
						),
						React.createElement("button", {
							className: "hub-btn", title: "刷新（5 分钟节流）", disabled: phase === "loading",
							onClick: function () { load(true); }
						}, phase === "loading" ? React.createElement("span", { className: "hub-spin" }, "⟳") : "↻")
					)
				);
				list = shown.length > 0
					? React.createElement("div", { className: "hub-list" },
						shown.map(function (p) {
							var isSel = sel && sel.owner === p.owner && sel.repo === p.repo;
							return React.createElement("div", {
								key: p.owner + "/" + p.repo,
								className: "hub-item" + (isSel ? " sel" : ""),
								onClick: function () { selectPlugin(p); },
								title: "点击选中：检查风险 / 安装 / 安装建议"
							},
								React.createElement("div", { className: "hub-item-top" },
									React.createElement("a", {
										className: "hub-item-name",
										href: p.url,
										target: "_blank", rel: "noreferrer noopener",
										title: p.owner + "/" + p.repo,
										onClick: function (e) { e.stopPropagation(); }
									}, p.name),
									React.createElement("span", { className: "hub-badge cat" }, p.category),
									React.createElement("span", { className: "hub-stars", title: "GitHub Stars" },
										"★ " + formatStars(p.stars))
								),
								p.desc ? React.createElement("div", { className: "hub-desc" }, p.desc) : null,
								React.createElement("div", { className: "hub-wmeta" },
									React.createElement("span", null, p.owner + "/" + p.repo),
									p.commit ? React.createElement("span", null, "最近提交 " + p.commit) : null
								),
								isSel ? React.createElement(React.Fragment, null,
									React.createElement("div", { className: "hub-actions" },
										React.createElement("button", {
											className: "hub-act",
											disabled: risk && (risk.phase === "resolving" || risk.phase === "checking"),
											onClick: function (e) { e.stopPropagation(); doCheckRisk(p); }
										}, "⚠ 检查风险"),
										React.createElement("button", {
											className: "hub-act",
											disabled: install && (install.phase === "installing" || install.phase === "resolving"),
											onClick: function (e) { e.stopPropagation(); doInstall(p); }
										}, "⬇ 安装"),
										React.createElement("button", {
											className: "hub-act",
											disabled: advice && advice.phase === "loading",
											onClick: function (e) { e.stopPropagation(); doAdvice(p); }
										}, "💡 安装建议")
									),
									riskView(),
									installView(),
									adviceView()
								) : null
							);
						})
					)
					: React.createElement("div", { className: "hub-empty" }, "该分类暂无插件");
				note = React.createElement("div", { className: "hub-note" },
					"数据源：awesome-dsh-plugin 中文目录 + shields.io 星数（免费，不占 GitHub API 额度）· 缓存 24 小时。点击插件可「检查风险 / 安装 / 安装建议」。");
			}

			return React.createElement(React.Fragment, null, head, filters, list, note);
		}

		/* ------------------------------------------------------------------ */
		/* 已装插件面板（tab 3）：本插件安装的插件目录 + 启动/关闭/卸载          */
		/* ------------------------------------------------------------------ */
		function InstalledPanel() {
			var phaseState = React.useState("loading"); /* loading | done | error */
			var phase = phaseState[0];
			var setPhase = phaseState[1];
			var listState = React.useState(null);
			var list = listState[0];
			var setList = listState[1];
			var errState = React.useState(null);
			var err = errState[0];
			var setErr = errState[1];
			var busyState = React.useState(null); /* 操作中的 pkg */
			var busy = busyState[0];
			var setBusy = busyState[1];
			var outState = React.useState(null); /* 最近操作输出 */
			var out = outState[0];
			var setOut = outState[1];
			var confirmState = React.useState(null); /* 待确认卸载的 pkg */
			var confirmPkg = confirmState[0];
			var setConfirmPkg = confirmState[1];
			var restartState = React.useState(null); /* { phase: confirm|sent|error, note } */
			var restart = restartState[0];
			var setRestart = restartState[1];
			var doRestart = function (pkg) {
				setRestart({ phase: "sent", pkg: pkg });
				callServer("/api/gh-watch/restart", {}).then(function (j) {
					setRestart({ phase: "sent", pkg: pkg, note: j.note });
				}).catch(function (e) {
					setRestart({ phase: "error", pkg: pkg, note: "重启失败：" + ((e && e.message) ? e.message : e) + "（服务端插件需重启 dsh web 后生效）" });
				});
			};

			var load = React.useCallback(function () {
				setPhase("loading");
				callServer("/api/gh-watch/installed").then(function (j) {
					setList(j.installed || []);
					setErr(null);
					setPhase("done");
				}).catch(function (e) {
					setErr("无法连接服务端（" + ((e && e.message) ? e.message : e) + "）——服务端插件 gh-watch-server 需重启 dsh web 后生效。");
					setPhase("error");
				});
			}, []);

			React.useEffect(function () { load(); }, [load]);

			var doToggle = function (item, enabled) {
				setBusy(item.pkg);
				setOut(null);
				callServer("/api/gh-watch/toggle", { pkg: item.pkg, enabled: enabled }).then(function (j) {
					setOut(j.note ? j.note : (j.ok ? "操作成功" : "操作失败：" + (j.error || "")));
					return load();
				}).catch(function (e) {
					setOut("操作失败：" + ((e && e.message) ? e.message : e));
				}).finally(function () { setBusy(null); });
			};
			var doUninstall = function (item) {
				setBusy(item.pkg);
				setOut(null);
				setConfirmPkg(null);
				callServer("/api/gh-watch/uninstall", { pkg: item.pkg }).then(function (j) {
					setOut(j.note ? j.note : (j.ok ? "卸载成功" : "卸载失败：" + (j.output || j.error || "")));
					return load();
				}).catch(function (e) {
					setOut("卸载失败：" + ((e && e.message) ? e.message : e));
				}).finally(function () { setBusy(null); });
			};

			var head = null;
			var listView = null;
			var outView = null;

			if (phase === "loading" && !list) {
				head = React.createElement("div", { className: "hub-verdict partial" },
					React.createElement("span", { className: "hub-spin" }, "⟳"),
					React.createElement("span", { className: "hub-v-txt" }, "正在读取已装插件目录…"));
			} else if (phase === "error") {
				head = React.createElement("div", { className: "hub-verdict none" },
					React.createElement("span", null, "✗"),
					React.createElement("span", { className: "hub-v-txt" }, "已装目录读取失败"),
					React.createElement("button", { className: "hub-btn", title: "重试", onClick: load }, "↻"));
				head = React.createElement(React.Fragment, null, head,
					React.createElement("div", { className: "hub-err" }, err));
			} else if (list) {
				head = React.createElement("div", { className: "hub-meta" },
					React.createElement("span", null, "本插件安装 ", React.createElement("b", null, String(list.length))),
					React.createElement("span", null, "个插件"),
					React.createElement("button", {
						className: "hub-btn", title: "刷新", disabled: phase === "loading",
						onClick: load
					}, phase === "loading" ? React.createElement("span", { className: "hub-spin" }, "⟳") : "↻"));
				if (list.length === 0) {
					listView = React.createElement("div", { className: "hub-empty" },
						"暂无记录——在「插件热榜」中选中插件点「安装」后，会出现在这里。");
				} else {
					listView = React.createElement("div", { className: "hub-list" },
						list.map(function (item) {
							var isBundle = item.type === "bundle";
							var stCls = "na";
							var stTxt = "未加载";
							var rightTxt = "待重启";
							var subHint = null;
							if (isBundle) {
								if (item.present && item.enabled && item.fiberPhase === "active") { stCls = "on"; stTxt = "运行中"; rightTxt = "启用"; }
								else if (item.present && !item.enabled) { stCls = "off"; stTxt = "已停用"; rightTxt = "禁用"; }
								else if (item.present) { stCls = "na"; stTxt = item.fiberPhase || "待启动"; rightTxt = "加载中"; }
								else { stCls = "off"; stTxt = "待重启"; rightTxt = "待重启"; }
								if (!item.present) subHint = "已安装但尚未加载：重启 dsh web 后自动运行（运行 D:\\dsh\\restart-dsh-web.cmd）。";
							} else {
								stCls = "on"; stTxt = "已安装";
								rightTxt = item.type === "skill" ? "技能类" : "依赖包";
								subHint = item.type === "skill"
									? "技能(skill)类：装进 node_modules 后经 skills 目录提供能力，装完即用，无「启动/关闭/重启」概念。"
									: "普通依赖包：作为 profile 依赖安装，无独立的启动/关闭。";
							}
							var isBusy = busy === item.pkg;
							var isConfirm = confirmPkg === item.pkg;
							var uninstallBtn = isConfirm
								? React.createElement(React.Fragment, null,
									React.createElement("button", {
										className: "hub-act",
										style: { borderColor: "rgba(220,38,38,.5)", color: "#b91c1c" },
										disabled: isBusy,
										onClick: function () { doUninstall(item); }
									}, "确认卸载"),
									React.createElement("button", {
										className: "hub-act", disabled: isBusy,
										onClick: function () { setConfirmPkg(null); }
									}, "取消"))
								: React.createElement("button", {
									className: "hub-act",
									disabled: isBusy,
									title: "从 profile 移除该包",
									onClick: function () { setConfirmPkg(item.pkg); setOut(null); }
								}, "🗑 卸载");
							return React.createElement("div", { key: item.pkg, className: "hub-item" },
								React.createElement("div", { className: "hub-item-top" },
									React.createElement("span", { className: "hub-item-name", style: { cursor: "default" }, title: item.pkg }, item.pkg),
									React.createElement("span", { className: "hub-st " + stCls }, stTxt),
									React.createElement("span", { className: "hub-stars" }, rightTxt)
								),
								item.entryId ? React.createElement("div", { className: "hub-item-sub" },
									"entry: " + item.entryId + (item.fiberPhase ? " · " + item.fiberPhase : "")) : null,
								subHint ? React.createElement("div", { className: "hub-item-sub" }, subHint) : null,
								isBundle
									? React.createElement("div", { className: "hub-actions" },
										React.createElement("button", {
											className: "hub-act",
											disabled: isBusy || !item.present,
											title: item.present
												? (item.enabled ? "关闭后重启不加载" : "启动后重启加载")
												: "已安装但尚未加载——重启 dsh web 后自动运行，届时可关闭",
											onClick: function () { doToggle(item, !item.enabled); }
										}, item.enabled ? "⏸ 关闭" : "▶ 启动"),
										uninstallBtn,
										restart && restart.pkg === item.pkg && restart.phase === "confirm"
											? React.createElement(React.Fragment, null,
												React.createElement("button", {
													className: "hub-act",
													style: { borderColor: "rgba(220,38,38,.5)", color: "#b91c1c" },
													onClick: function () { doRestart(item.pkg); }
												}, "确认重启"),
												React.createElement("button", {
													className: "hub-act",
													onClick: function () { setRestart(null); }
												}, "取消"))
											: React.createElement("button", {
												className: "hub-act",
												title: "重启 dsh web，使安装/卸载/启停生效",
												onClick: function () { setRestart({ phase: "confirm", pkg: item.pkg }); }
											}, "↻ 重启生效"))
									: React.createElement("div", { className: "hub-actions" }, uninstallBtn),
								restart && restart.pkg === item.pkg && (restart.phase === "sent" || restart.phase === "error")
									? React.createElement("div", { className: "hub-note" }, restart.note)
									: null
							);
						})
					);
				}
				outView = out
					? React.createElement("div", { className: "hub-panel" },
						React.createElement("div", { className: "hub-note" }, out))
					: null;
			}

			return React.createElement(React.Fragment, null, head, listView, outView,
				list && list.length > 0
					? React.createElement("div", { className: "hub-note" },
						"启动/关闭通过 cordis.patch.yml 的 disabled 标记实现，卸载执行 dsh plugin remove——均重启 dsh web 后生效，操作自动写入 dsh-overview.yaml 变更记录。")
					: null);
		}

		/* ------------------------------------------------------------------ */
		/* 主卡片                                                                 */
		/* ------------------------------------------------------------------ */
				/* ------------------------------------------------------------------ */
		/* exa 全网搜索面板（tab 4）                                              */
		/* ------------------------------------------------------------------ */
		function SearchPanel() {
			var phaseState = React.useState("idle");
			var phase = phaseState[0];
			var setPhase = phaseState[1];
			var queryState = React.useState("");
			var query = queryState[0];
			var setQuery = queryState[1];
			var resultsState = React.useState(null);
			var results = resultsState[0];
			var setResults = resultsState[1];
			var errState = React.useState(null);
			var err = errState[0];
			var setErr = errState[1];
			var seqRef = React.useRef(0);
			var doSearch = function () {
				var q = String(query || "").trim();
				if (!q) return;
				var seq = ++seqRef.current;
				setPhase("loading");
				setErr(null);
				fetch("/api/gh-watch/websearch", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ query: q })
				}).then(function (r) { return r.json(); }).then(function (j) {
					if (seq !== seqRef.current) return;
					if (j && j.ok) { setResults(j.results || []); setPhase("done"); }
					else { setErr((j && j.error) ? j.error : "搜索失败"); setPhase("error"); }
				}).catch(function (e) {
					if (seq !== seqRef.current) return;
					setErr("无法连接服务端（" + ((e && e.message) ? e.message : e) + "）——服务端插件 gh-watch-server 需重启 dsh web 后生效。");
					setPhase("error");
				});
			};
			var head = React.createElement("div", { className: "hub-meta" },
				React.createElement("span", null, "exa 全网搜索：检索 dsh / DeepSeek Harness 相关插件与资料"));
			var box = React.createElement("div", { className: "hub-set" },
				React.createElement("div", { className: "hub-set-row" },
					React.createElement("input", {
						type: "text",
						placeholder: "输入关键词，如 dsh 插件 / deepseek harness…",
						value: query,
						onChange: function (e) { setQuery(e.target.value); },
						onKeyDown: function (e) { if (e.key === "Enter") doSearch(); }
					}),
					React.createElement("button", { className: "hub-btn", disabled: phase === "loading", onClick: doSearch },
						phase === "loading" ? React.createElement("span", { className: "hub-spin" }, "⟳") : "搜索")
				)
			);
			var body = null;
			if (phase === "error") {
				body = React.createElement("div", { className: "hub-err" }, err);
			} else if (phase === "loading") {
				body = React.createElement("div", { className: "hub-panel" },
					React.createElement("span", { className: "hub-spin" }, "⟳"),
					React.createElement("span", null, " 正在通过 exa 搜索…"));
			} else if (phase === "done") {
				if (!results || results.length === 0) {
					body = React.createElement("div", { className: "hub-empty" }, "没有搜到结果");
				} else {
					body = React.createElement("div", { className: "hub-list" },
						results.map(function (x, i) {
							return React.createElement("div", { key: i, className: "hub-item" },
								React.createElement("div", { className: "hub-item-top" },
									React.createElement("a", {
										className: "hub-item-name",
										href: x.url, target: "_blank", rel: "noreferrer noopener",
										title: x.url
									}, x.title || x.url)),
								x.text ? React.createElement("div", { className: "hub-desc" }, x.text) : null,
								x.publishedDate ? React.createElement("div", { className: "hub-wmeta" },
									React.createElement("span", null, "发布 " + x.publishedDate)) : null
							);
						})
					);
				}
			}
			return React.createElement(React.Fragment, null, head, box, body,
				React.createElement("div", { className: "hub-note" },
					"数据源：exa 全网搜索（经服务端转发，需在 .env 配置 EXA_API_KEY）。"));
		}

		function GhScanCard() {
			var collapsedRef = React.useRef(null);
			if (collapsedRef.current === null) {
				try { collapsedRef.current = localStorage.getItem("deepseek-harness-dsh-plugin-hub:collapsed:v1") === "1"; } catch (e) { collapsedRef.current = false; }
			}
			var collapsedState = React.useState(collapsedRef.current);
			var collapsed = collapsedState[0];
			var setCollapsed = collapsedState[1];
			React.useEffect(function () {
				try { localStorage.setItem("deepseek-harness-dsh-plugin-hub:collapsed:v1", collapsed ? "1" : "0"); } catch (e) { /* ignore */ }
			}, [collapsed]);

			/* tab：scan | watch | installed */
			var tabRef = React.useRef(null);
			if (tabRef.current === null) {
				try {
					var _t = localStorage.getItem(TAB_KEY);
					tabRef.current = (_t === "watch" || _t === "installed") ? _t : "scan";
				} catch (e) { tabRef.current = "scan"; }
			}
			var tabState = React.useState(tabRef.current);
			var tab = tabState[0];
			var setTab = tabState[1];
			React.useEffect(function () {
				try { localStorage.setItem(TAB_KEY, tab); } catch (e) { /* ignore */ }
			}, [tab]);

			/* 拖动位置（持久化） */
			var dockRef = React.useRef(null);
			var posRef = React.useRef(null);
			if (posRef.current === null) posRef.current = loadPos();
			var posState = React.useState(posRef.current);
			var pos = posState[0];
			var setPosRaw = posState[1];
			var setPos = React.useCallback(function (next) {
				posRef.current = next;
				setPosRaw(next);
			}, []);
			var movedRef = React.useRef(false);
			/* 视窗尺寸（可拖拽缩放，持久化） */
			var sizeRef = React.useRef(null);
			if (sizeRef.current === null) sizeRef.current = loadSize();
			var sizeState = React.useState(sizeRef.current);
			var size = sizeState[0];
			var setSizeRaw = sizeState[1];
			var setSize = React.useCallback(function (next) {
				sizeRef.current = next;
				setSizeRaw(next);
			}, []);
			/* 八方向缩放：dir 含 e/w 调宽（w 同时移左边）、含 n/s 调高（n 同时移顶边） */
			var RESIZE_CURSOR = { e: "ew-resize", w: "ew-resize", n: "ns-resize", s: "ns-resize", ne: "nesw-resize", sw: "nesw-resize", nw: "nwse-resize", se: "nwse-resize" };
			var startResize = function (e, dir) {
				if (e.button !== 0) return;
				e.preventDefault();
				e.stopPropagation();
				var startX = e.clientX;
				var startY = e.clientY;
				var oW = sizeRef.current.w;
				var oH = sizeRef.current.h;
				var oDx = posRef.current.dx;
				var oDy = posRef.current.dy;
				var VW = window.innerWidth;
				var VH = window.innerHeight;
				var onMove = function (ev) {
					var dX = ev.clientX - startX;
					var dY = ev.clientY - startY;
					var w = oW;
					var h = oH;
					if (dir.indexOf("e") !== -1) w = oW + dX;
					if (dir.indexOf("w") !== -1) w = oW - dX;
					if (dir.indexOf("s") !== -1) h = oH + dY;
					if (dir.indexOf("n") !== -1) h = oH - dY;
					w = Math.max(280, Math.min(VW - 40, w));
					h = Math.max(300, Math.min(VH - 40, h));
					/* 左/上边拖动时保持对边固定：dx/dy 随尺寸补偿 */
					var dx = dir.indexOf("w") !== -1 ? oDx + (oW - w) : oDx;
					var dy = dir.indexOf("n") !== -1 ? oDy + (oH - h) : oDy;
					/* 卡片左/上边不越出视口（相对 right:12/bottom:12 定位 + translate） */
					dx = Math.max(w + 16 - VW, Math.min(12, dx));
					dy = Math.max(h + 16 - VH, Math.min(12, dy));
					setSize({ w: w, h: h });
					setPos({ dx: dx, dy: dy });
				};
				var onUp = function () {
					window.removeEventListener("pointermove", onMove);
					window.removeEventListener("pointerup", onUp);
					document.body.style.cursor = "";
					document.body.style.userSelect = "";
					saveSize(sizeRef.current);
					savePos(posRef.current);
				};
				window.addEventListener("pointermove", onMove);
				window.addEventListener("pointerup", onUp);
				document.body.style.cursor = RESIZE_CURSOR[dir] || "nwse-resize";
				document.body.style.userSelect = "none";
			};
			/* 装载后把持久化位置夹回视口内 */
			React.useEffect(function () {
				var el = dockRef.current;
				if (!el) return;
				var rect = el.getBoundingClientRect();
				var dx = posRef.current.dx;
				var dy = posRef.current.dy;
				var ndx = Math.min(window.innerWidth - 4 - rect.right, Math.max(4 - rect.left, dx));
				var ndy = Math.min(window.innerHeight - 4 - rect.bottom, Math.max(4 - rect.top, dy));
				if (ndx !== dx || ndy !== dy) setPos({ dx: ndx, dy: ndy });
			}, []);
			var dragHooks = {
				el: function () { return dockRef.current; },
				pos: function () { return posRef.current; },
				setPos: setPos,
				persist: function () { savePos(posRef.current); }
			};
			var resetPos = function () {
				posRef.current = { dx: 0, dy: 0 };
				setPosRaw({ dx: 0, dy: 0 });
				savePos({ dx: 0, dy: 0 });
				setSize({ w: 310, h: 560 });
				saveSize({ w: 310, h: 560 });
			};

			/* 扫描视图状态 */
			var phaseState = React.useState("loading"); /* loading | done | error */
			var phase = phaseState[0];
			var setPhase = phaseState[1];
			var resultState = React.useState(null);
			var result = resultState[0];
			var setResult = resultState[1];
			var seqRef = React.useRef(0);
			var lastScanRef = React.useRef(0);
			var staleRef = React.useRef(false);

			/* 官方仓库更新提醒：已读基准 + 绿点 */
			var officialSeenRef = React.useRef(null);
			if (officialSeenRef.current === null) officialSeenRef.current = loadOfficialSeen();
			var updState = React.useState(false);
			var hasUpdate = updState[0];
			var setHasUpdate = updState[1];
			var markUpdateSeen = function () {
				if (resultState.current && resultState.current.officialPushedAt) {
					officialSeenRef.current = { pushedAt: resultState.current.officialPushedAt };
					saveOfficialSeen(officialSeenRef.current);
				}
				setHasUpdate(false);
			};

			/* token 设置 UI */
			var setOpenState = React.useState(false);
			var setOpen = setOpenState[0];
			var setSetOpen = setOpenState[1];
			var tokenDraftState = React.useState(getToken());
			var tokenDraft = tokenDraftState[0];
			var setTokenDraft = tokenDraftState[1];
			var tokenOkState = React.useState(false);
			var tokenOk = tokenOkState[0];
			var setTokenOk = tokenOkState[1];
			/* 停止服务 */
			var stopConfirmState = React.useState(false);
			var stopConfirm = stopConfirmState[0];
			var setStopConfirm = stopConfirmState[1];
			var stopNoteState = React.useState(null);
			var stopNote = stopNoteState[0];
			var setStopNote = stopNoteState[1];
			var doStop = function () {
				setStopConfirm(false);
				callServer("/api/gh-watch/stop", {}).then(function (j) {
					setStopNote(j.note || "服务已停止。");
				}).catch(function (e) {
					setStopNote("停止失败：" + ((e && e.message) ? e.message : e) + "（服务端插件需重启 dsh web 后生效）");
				});
			};

			var doScan = React.useCallback(function (force) {
				var now = Date.now();
				if (!force && now - lastScanRef.current < SCAN_THROTTLE_MS && resultState.current) {
					/* 节流：不重复扫 */
					return;
				}
				lastScanRef.current = now;
				var seq = ++seqRef.current;
				setPhase("loading");
				var ctl = new AbortController();
				runScan(ctl.signal).then(function (r) {
					if (seq !== seqRef.current) return;
					if (r.ok) saveScanCache(r);
					/* 官方仓库更新检测（仅真实扫描，缓存不计） */
					if (r.ok && r.officialPushedAt) {
						var seen = officialSeenRef.current;
						if (seen && seen.pushedAt && r.officialPushedAt > seen.pushedAt) {
							setHasUpdate(true);
						}
						if (!seen || r.officialPushedAt > (seen.pushedAt || "")) {
							officialSeenRef.current = { pushedAt: r.officialPushedAt };
							saveOfficialSeen(officialSeenRef.current);
						}
					}
					lastScanRef.current = Date.now();
					staleRef.current = false;
					setResult(r);
					setPhase(r.ok ? "done" : "error");
				});
			}, []);

			/* 挂载：先渲染缓存（如有），再后台静默刷新 */
			React.useEffect(function () {
				var cached = loadScanCache();
				if (cached) {
					staleRef.current = true;
					setResult(cached);
					setPhase("done");
				}
				doScan(true);
				return function () { seqRef.current++; };
			}, [doScan]);

			var saveToken = function () {
				setToken(tokenDraft.trim());
				setTokenOk(true);
				window.setTimeout(function () { setTokenOk(false); }, 2000);
				doScan(true);
			};
			var clearToken = function () {
				setToken("");
				setTokenDraft("");
				setTokenOk(false);
				doScan(true);
			};

			/* ---- 扫描视图渲染 ---- */
			var scanVerdict = null;
			var chipDot = "no";
			var scanMeta = null;
			var scanList = null;

			if (phase === "loading" && !result) {
				scanVerdict = React.createElement("div", { className: "hub-verdict partial" },
					React.createElement("span", { className: "hub-spin" }, "⟳"),
					React.createElement("span", { className: "hub-v-txt" }, "正在扫描 deepseek-ai 组织…")
				);
			} else if (phase === "error") {
				scanVerdict = React.createElement("div", { className: "hub-verdict none" },
					React.createElement("span", null, "✗"),
					React.createElement("span", { className: "hub-v-txt" }, "扫描失败"),
					React.createElement("button", { className: "hub-btn", title: "重试", onClick: function () { doScan(true); } }, "↻")
				);
				scanVerdict = React.createElement(React.Fragment, null,
					scanVerdict,
					React.createElement("div", { className: "hub-err" }, result && result.error),
					(result && (result.matches || []).length > 0)
						? React.createElement("div", { className: "hub-stale" }, "以下为上次成功扫描的缓存结果：")
						: null
				);
			} else if (result && result.ok) {
				var matches = result.matches || [];
				var exact = result.exact === true;
				var official = result.official === true;
				var nameHits = matches.filter(function (m) { return m.kind === "name" || m.kind === "acronym"; }).length;
				var cls = "none";
				var vTxt;
				if (official) {
					cls = "found"; chipDot = "ok";
					vTxt = "已找到官方仓库 deepseek-ai/deepseek-harness（DeepSeek Harness）。";
				} else if (exact) {
					cls = "found"; chipDot = "ok";
					vTxt = "已找到名为 dsh 的仓库。";
				} else if (matches.length > 0 && nameHits > 0) {
					cls = "partial"; chipDot = "mid";
					vTxt = "未发现官方仓库，但 " + nameHits + " 个仓库名称含 dsh / deepseek-harness：";
				} else if (matches.length > 0) {
					cls = "partial"; chipDot = "mid";
					vTxt = "未发现名称匹配的仓库，但 " + matches.length + " 个仓库描述提及 dsh：";
				} else {
					cls = "none"; chipDot = "no";
					vTxt = "deepseek-ai 组织内未发现 dsh 相关公开仓库。";
				}
				scanVerdict = React.createElement("div", { className: "hub-verdict " + cls },
					React.createElement("span", null, official || exact ? "✓" : (matches.length > 0 ? "◐" : "✗")),
					React.createElement("span", { className: "hub-v-txt" }, vTxt)
				);
				var quotaTxt = result.remaining != null
					? (result.hasToken ? ("额度 " + result.remaining + "/" + (result.limit || "5000")) : ("搜索额度 " + result.remaining + "/" + (result.limit || "10")))
					: "额度未知";
				scanMeta = React.createElement("div", { className: "hub-meta" },
					React.createElement("span", null, "命中 ", React.createElement("b", null, String(result.totalHits != null ? result.totalHits : matches.length))),
					React.createElement("span", null, "相关仓库 ", React.createElement("b", null, String(matches.length))),
					React.createElement("span", null, "模式 ", React.createElement("b", null, result.hasToken ? "已认证" : "搜索接口")),
					React.createElement("span", null, quotaTxt),
					React.createElement("span", null, "扫描于 ", React.createElement("b", null,
						result.at ? new Date(result.at).toLocaleTimeString() : "—")),
					staleRef.current ? React.createElement("span", { className: "hub-stale" }, "（缓存）") : null
				);
				scanList = matches.length > 0 ? React.createElement(React.Fragment, null,
					React.createElement("div", { className: "hub-sec" }, "相关仓库"),
					React.createElement("div", { className: "hub-list" },
						matches.map(function (m) {
							var badgeText = m.kind === "official" ? "官方仓库"
								: m.kind === "exact" ? "名称 = dsh"
								: m.kind === "name" ? "名称含 dsh/harness"
								: m.kind === "acronym" ? "DSH 缩写"
								: "描述提及";
							return React.createElement("div", { key: String(m.id), className: "hub-item" },
								React.createElement("div", { className: "hub-item-top" },
									React.createElement("a", {
										className: "hub-item-name",
										href: m.htmlUrl || ("https://github.com/" + ORG + "/" + m.name),
										target: "_blank", rel: "noreferrer noopener",
										title: m.fullName
									}, m.name),
									React.createElement("span", { className: "hub-badge " + m.kind }, badgeText),
									React.createElement("span", { className: "hub-stars" }, "★ " + m.stars)
								),
								m.description ? React.createElement("div", { className: "hub-desc" }, highlight(m.description, "dsh")) : null
							);
						})
					)
				) : null;
				if (result.note) {
					scanList = scanList ? React.createElement(React.Fragment, null, scanList,
						React.createElement("div", { className: "hub-note" }, result.note)) : null;
				}
			}

			var setArea = null;
			if (setOpen) {
				setArea = React.createElement("div", { className: "hub-set" },
					React.createElement("div", { className: "hub-set-row" },
						React.createElement("input", {
							type: "password",
							placeholder: "GitHub Personal Access Token（可选）",
							value: tokenDraft,
							onChange: function (e) { setTokenDraft(e.target.value); },
							onKeyDown: function (e) { if (e.key === "Enter") saveToken(); }
						}),
						React.createElement("button", { className: "hub-btn", title: "保存 Token", onClick: saveToken }, "保存"),
						React.createElement("button", { className: "hub-btn", title: "清除 Token", onClick: clearToken }, "清除")
					),
					React.createElement("div", { className: "hub-note" },
						"填 Token 后额度提升至 5000 次/小时；不填则用未认证搜索接口（10 次/分钟，独立计费）。仅存于本机浏览器。"),
					tokenOk ? React.createElement("div", { className: "hub-set-ok" }, "已保存并重新扫描 ✓") : null
				);
			}

			var bodyContent = tab === "watch"
				? React.createElement(WatchPanel, null)
				: tab === "installed"
					? React.createElement(InstalledPanel, null)
					: tab === "search"
						? React.createElement(SearchPanel, null)
						: React.createElement(React.Fragment, null,
						hasUpdate
							? React.createElement("div", {
								className: "hub-new",
								style: { cursor: "pointer" },
								title: "点击标记已读",
								onClick: markUpdateSeen
							}, "🟢 官方仓库 deepseek-harness 有新提交，点击标记已读")
							: null,
						setArea, scanVerdict, scanMeta, scanList,
						React.createElement("div", { className: "hub-note" },
							"数据源：GitHub 搜索接口（未认证 10 次/分钟，与核心接口独立计费）· 结果缓存 30 分钟 · dsh = DeepSeek Harness。"));

			var card = React.createElement("div", {
				className: "hub-card",
				style: { width: size.w + "px", height: size.h + "px" }
			},
				React.createElement("div", {
					className: "hub-head",
					title: "按住拖动 · 双击复位位置与大小",
					onPointerDown: function (e) { startDrag(e, dragHooks); },
					onDoubleClick: function (e) {
						if (e.target && e.target.closest && e.target.closest("button")) return;
						resetPos();
					}
				},
					React.createElement("span", { className: "hub-ico" }, "🐙"),
					tab === "scan" && hasUpdate
						? React.createElement("span", {
							className: "hub-upd-dot",
							title: "官方仓库 deepseek-harness 有新提交（点击标记已读）",
							onPointerDown: function (e) { e.stopPropagation(); },
							onClick: function (e) { e.stopPropagation(); markUpdateSeen(); }
						})
						: null,
					React.createElement("span", { className: "hub-title", title: "DSH 插件中心：扫描 + 插件热榜 + 已装插件管理" },
						tab === "watch" ? "dsh 插件热榜" : tab === "installed" ? "已装插件" : tab === "search" ? "exa 全网搜索" : "GitHub dsh 扫描 · " + ORG),
					React.createElement("button", {
						className: "hub-btn", title: "Token 设置", onClick: function () { setSetOpen(!setOpen); }
					}, "⚙"),
					stopConfirm
						? React.createElement(React.Fragment, null,
							React.createElement("button", {
								className: "hub-btn",
								style: { color: "#b91c1c", fontWeight: 700 },
								title: "确认停止服务",
								onClick: doStop
							}, "确认停止"),
							React.createElement("button", {
								className: "hub-btn", title: "取消",
								onClick: function () { setStopConfirm(false); }
							}, "取消"))
						: React.createElement("button", {
							className: "hub-btn",
							title: "停止 dsh 服务（双击桌面 DeepSeek Harness 可重新启动）",
							onClick: function () { setStopConfirm(true); setStopNote(null); }
						}, "⏻"),
					React.createElement("button", {
						className: "hub-btn", title: "收起", onClick: function () { setCollapsed(true); }
					}, "—")
				),
				stopNote ? React.createElement("div", { className: "hub-note", style: { padding: "6px 12px 0" } }, stopNote) : null,
				React.createElement("div", { className: "hub-tabs" },
					React.createElement("button", {
						className: "hub-tab" + (tab === "scan" ? " on" : ""),
						onClick: function () { setTab("scan"); }
					}, "扫描"),
					React.createElement("button", {
						className: "hub-tab" + (tab === "watch" ? " on" : ""),
						onClick: function () { setTab("watch"); }
					}, "插件热榜"),
					React.createElement("button", {
						className: "hub-tab" + (tab === "installed" ? " on" : ""),
						onClick: function () { setTab("installed"); }
					}, "已装插件"),
					React.createElement("button", {
						className: "hub-tab" + (tab === "search" ? " on" : ""),
						onClick: function () { setTab("search"); }
					}, "搜索")
				),
				React.createElement("div", { className: "hub-body" }, bodyContent),
				["n", "s", "e", "w", "ne", "nw", "se", "sw"].map(function (dir) {
					return React.createElement("div", {
						key: dir,
						className: "hub-rs hub-rs-" + dir,
						title: "拖拽调整大小（" + dir + "）",
						onPointerDown: function (ev) { startResize(ev, dir); }
					});
				})
			);

			var chip = React.createElement("div", {
				className: "hub-chip",
				title: "DSH 插件中心（点击展开 · 按住拖动 · 双击复位）",
				onPointerDown: function (e) { startDrag(e, Object.assign({ moved: function (v) { movedRef.current = v; } }, dragHooks)); },
				onDoubleClick: resetPos,
				onClick: function () {
					if (movedRef.current) { movedRef.current = false; return; }
					setCollapsed(false);
				}
			},
				React.createElement("span", null, "🐙"),
				React.createElement("span", { className: "hub-chip-dot " + chipDot }),
				React.createElement("span", null, "dsh")
			);

			return React.createElement("div", {
				className: "hub-dock",
				ref: dockRef,
				style: { transform: "translate(" + pos.dx + "px," + pos.dy + "px)" }
			},
				collapsed ? chip : card
			);
		}

		function apply(ctx) {
			ctx.slots.inject("shell.overlay", function () {
				return ctx.slots.register(
					{ name: "shell.overlay", id: "deepseek-harness-dsh-plugin-hub", order: 20, label: "DSH 插件中心" },
					GhScanCard
				);
			});
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
