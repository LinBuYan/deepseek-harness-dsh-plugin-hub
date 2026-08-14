# deepseek-harness-dsh-plugin-hub · DSH 插件中心

> DeepSeek Harness 插件中心：右下角悬浮面板，聚合 GitHub 生态扫描、社区插件热榜与已装插件管理，内置五维风险检查与一键安装。

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）的一个客户端（web）插件：在一个 🐙 小窗里，把「找插件 → 看热度 → 查风险 → 装/管」这条链路串起来。

- **纯浏览器端**：node 半部为空，直接调 GitHub REST API 与 npm registry（支持 CORS），不依赖主机侧服务即可浏览热榜、扫描生态、做风险检查。
- **不占 GitHub 额度**：精心规避了未认证 60 次/小时的核心接口限额（见下方「优化点」）。

## 为什么做这个

dsh 生态插件散落在不同作者的仓库里，装之前不知道它热不热、有没有维护、有没有已知漏洞，装完也不好统一管理。这个面板把这些都收进右下角一个小窗，顺手就查、就装、就管。

## 优化点（我的优化，欢迎一起完善）

1. **速率限制友好**：扫描只调 GitHub `search` 接口、不碰 `core`；热榜用 shields.io 徽章 + jsDelivr CDN，几乎不消耗 GitHub API 额度。
2. **三级镜像降级**：热榜目录 `jsDelivr → raw.githubusercontent → GitHub API` 自动降级，国内可达。
3. **缓存与节流**：扫描结果 30 分钟 TTL（先显示缓存、后台静默刷新），热榜目录 24 小时缓存；手动重扫 30 秒、热榜刷新 5 分钟节流。
4. **npm 包名智能解析**：热榜只给 GitHub 仓库，安装却要 npm 包名——按「同名 > 名称包含 > 描述含 dsh/deepseek/harness」匹配，宁缺毋滥，避免装错包。
5. **五维风险检查**：npm 漏洞库（audit bulk）+ 维护状态 + 依赖 + 星数 + 许可证，给出高/中/低风险评级（漏洞 > 维护 > 依赖 > 星数 > 许可）。
6. **个性化安装建议**：结合本机整体情况（用途 / 约束 / 已装插件）给出带理由的建议与命令。
7. **顺手的交互**：面板可拖拽、可四角缩放、双击复位，收起成小 chip；官方仓库有新提交时绿点提示。

## 功能

| 标签 | 说明 |
| --- | --- |
| **扫描** | 扫描 `deepseek-ai` 组织内 dsh / DeepSeek Harness 相关仓库，按「官方 / 精确 / 名称 / 缩写 / 描述」分级，监控官方仓库新提交 |
| **插件热榜** | 读取 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) 中文目录，分类筛选、关键词搜索、星数与最近提交 |
| **已装插件** | 列出当前 profile 已装插件，支持启用 / 禁用 / 卸载（需配套服务端） |

选中热榜插件后，可 **检查风险 / 一键安装 / 安装建议**。

## 安装

### 方式一：手动复制（无需发布 npm）

```bash
# 假设 DSH_HOME 为 ~/.dsh，目标 profile 为 web
cp -r deepseek-harness-dsh-plugin-hub "$DSH_HOME/profiles/web/node_modules/deepseek-harness-dsh-plugin-hub"
```

在 `$DSH_HOME/profiles/web/cordis.patch.yml` 中新增：

```yaml
- id: plugin-hub
  name: 'deepseek-harness-dsh-plugin-hub'
```

重启 dsh web，右下角出现 🐙 悬浮面板。

### 方式二：dsh plugin（发布到 npm 后）

```bash
dsh plugin --profile web add deepseek-harness-dsh-plugin-hub
```

> 客户端插件安装后，仍需按方式一在 `cordis.patch.yml` 登记一次才会注入 `shell.overlay`。

## 使用

1. 打开右下角 🐙，切到「插件热榜」。
2. 按分类/关键词浏览，点一个插件选中它。
3. 先「检查风险」看评级，再「一键安装」（或复制「安装建议」里的命令）。
4. 「已装插件」里统一启停 / 卸载。

## 可选：GitHub Token

「扫描」未认证走 search 接口 10 次/分钟；在右上角 ⚙ 填 GitHub PAT（`public_repo` 即可）后升到 5000 次/小时。Token 只存本机浏览器 `localStorage`，不上传。

## 配套服务端（可选）

「一键安装」「已装插件」「安装建议」「停止服务」需本机同源服务端接口：

```
GET  /api/gh-watch/overview    读取整体情况
POST /api/gh-watch/install     一键安装
GET  /api/gh-watch/installed   已装列表
POST /api/gh-watch/toggle      启用 / 禁用
POST /api/gh-watch/uninstall   卸载
POST /api/gh-watch/restart     重启
POST /api/gh-watch/stop        停止
```

未装服务端时这几个功能会提示「服务端插件需重启 dsh web 后生效」，其余（扫描 / 热榜 / 风险检查 / 复制命令）不受影响。服务端与个人 `dsh-overview.yaml` 强耦合，属个人定制，暂未开源；有需要可自行实现上述同源端点。

## 参与协作

欢迎提 issue / PR，一起把这套优化打磨得更好。

- **提 issue**：bug、建议、新功能想法都行，描述清楚现象/期望即可。
- **提 PR**：fork → 改 → 提 PR。改动聚焦一点、说明动机，更好合并。
- **本地开发调试**：核心逻辑全在 `lib/client.js` 一个文件里。按「方式一」装好后，直接改 `$DSH_HOME/profiles/web/node_modules/deepseek-harness-dsh-plugin-hub/lib/client.js`，刷新 dsh web 页面即生效；稳定后再同步回本仓库。

## 数据来源

- 热榜目录：`cdn.jsdelivr.net/gh/awesome-dsh-plugin/awesome-dsh-plugin@main/README.zh.md`
- 星数 / 最近提交徽章：[shields.io](https://shields.io)
- npm 包解析与漏洞：[registry.npmjs.org](https://registry.npmjs.org)

## License

[MIT](./LICENSE)
