# AISEE Design System 当前交接

> 本文件只表示项目此刻的最新状态，采用覆盖更新，不作为历史日志追加。工作纪律见 [`AGENTS.md`](AGENTS.md)，长期决策见 [`docs/TEAM_DECISIONS.md`](docs/TEAM_DECISIONS.md)，历史记录见 [`handoff/sessions/`](handoff/sessions/)。

## 当前 Git 状态

- 当前开发分支：`ai/desktop/design-system-current`。
- 当前本地 HEAD 与 `origin/ai/desktop/design-system-current` 为 `d0b7c57 feat(brand): package logo animation delivery`；`origin/main` 仍为 `7bf67eea6c675e019bc514f504daf3a47deb51aa`（PR #4 merge commit）。
- 最新 Managed Automation 内容提交：`f6e4341 fix(brand): sync Managed Automation eye demo`，已包含在当前开发分支历史中。
- 本地 `main` 仍停在 `2358f97`，不是当前正式版本判断依据；需要先核对远端再更新本地指针。
- PR #4 已合并，合并后的 GitHub CI 已通过。
- 本地工作区已干净；Logo Animation 交付入口、动画节奏、空白状态标签修复、教程分类、测试与交接文档已推送到开发分支 commit `d0b7c57`，未创建新的 main 发布 PR。

## 当前正在做

- Logo Animation 交付入口与节奏优化已提交并 push 到开发分支；等待用户在本地 pull 验收。
- 本地 Demo 运行于 `http://127.0.0.1:4174/`。

## 最近已完成

- PR #4 已按用户明确指令合并到 `main`，merge commit 为 `7bf67ee`；远端开发分支已快进对齐正式版，合并后 CI 成功。
- 修复 Current 页面标题旁的空白胶囊：`hidden` 状态现在强制不占位，Legacy 页面仍显示小写 `legacy`。
- Logo 闲置左右查看加快到约 2.6 秒一轮，眨眼加快到约 2.2–3.2 秒；TSX、HTML、SVG 已同步。
- Logo Animation Demo 头部提供 TSX 复制按钮，开发交付区提供包含三份真实文件的 ZIP 一键下载和三个独立下载入口；按钮文字居中并使用 5% 黑色描边，本地浏览器实测通过。
- 全局共用的 Update / Install 插件教程已从 Automation 调整到 `Brand → Common`，本地刷新后分类正确。
- 交付功能与相关修复已通过 `d0b7c57` 推送到 `ai/desktop/design-system-current`。
- `npm test` 已通过：41 项测试；`npm run site` 已成功构建，并将 Logo Animation 的 canonical TSX 交付源放入静态站点。
- 用户已确认并提交旧累加式交接向“工作纪律 + 当前仪表盘 + 长期决策 + 独立 session 历史”四层结构的迁移。
- 已将远端 `f6e4341` 同步到本地，并在 `Brand → Automation → Managed Automation` 验证最新 Keep-open / eye demo 正常显示、控制台无错误。
- 已更新 main 发布规则：用户明确要求“发布正式版 / 同步到 main / 这版可以进 main”时授权创建 PR；PR 只有在用户同时明确要求时才允许 merge。
- Brand 侧边栏已按 AIsee 功能模块重分类，Legacy 标签已统一为标题旁的轻量灰色小写样式；该批次已通过 `npm run check`（39 项）并合并到 `main`，merge commit 为 `3bdccf4`。
- Managed Automation Web 预览已加入 `brand/pages/managed-automation/`，并在 `brand/pages/index.json` 注册；commit 为 `c6ace77`，目前位于开发分支，尚未进入 `main`。
- 旧 Web 临时分支与 worktree `ai/web/brand-source-status` 已清理；`ai/desktop/design-system-checkpoint` 仍保留。

## 当前关键决策

- `main` 是正式稳定版本；Web ChatGPT 与 Desktop Codex 统一在 `ai/desktop/design-system-current` 延续开发。
- Web 产物默认 `source: ChatGPT`、`surface: Web`、`designStatus: Draft`；状态只允许 `Draft / Selected`，未经用户确认不能升级为 `Selected`。
- Brand 中全局共用的插件安装与更新教程归入 Common；Automation 只承载该功能自身的页面、流程和说明。
- 新会话默认只读 `AGENTS.md` 与本文件，再核对 branch、status 和 recent commits；历史问题才查 session。
- 交接更新采用“新增 session + 刷新当前仪表盘”，不再向本文件末尾追加历史总结。
- 组件、视觉、资产、Figma 与 Brand 的长期规范统一以 `docs/TEAM_DECISIONS.md` 为准。
- Canonical dApp 规范为 `docs/aisee-dapp-design.v6.md`，主预览入口为 `aisee-design-system-preview.html`。

## 当前未完成

- 本轮修改已 commit / push；没有新的 main 发布 PR。
- 线上 Pages 的 Logo Animation 新交付入口需等本轮修改后续发布到 `main` 才会更新。
- `Plugin Entry Options` 外层可加载，但三个内嵌 Engage 页面仍请求已不存在的 `legacy/pages/engage-aisee-v2/*.jsx`，React 根节点未挂载而呈现空白；本轮只诊断，尚未改动该 Legacy 页面。
- Components 后续仍需完成真实组件清单与导航收尾、Button 模块色 hover、Select / Dropdown 示例与交互、功能页 Banner 清晰资产替换。
- 继续核对 Figma 5.5 / 5.6 / 5.7 与 `docs/aisee-dapp-design.v6.md` 的差异；冲突先记录并交由用户确认。
- 核对字体文件、Legacy 清理范围与独立 Dembrandt 扫描目录；未经确认不删除历史资产。

## 下一步

1. 用户要求修复时，先决定 `Plugin Entry Options` 是恢复旧 JSX、改接现有 bundle，还是替换为当前可运行的 Engage 预览；不直接重建 Legacy UI。
2. 用户在本地工作区检查 `git status` 后 pull `ai/desktop/design-system-current`，刷新 Demo 验收本轮交付。
3. 只有用户明确授权正式发布时，创建新的 `ai/desktop/design-system-current → main` PR；不自动 merge。

## 最近一次 Session

- [`handoff/sessions/2026-08-24-logo-animation-delivery.md`](handoff/sessions/2026-08-24-logo-animation-delivery.md)
