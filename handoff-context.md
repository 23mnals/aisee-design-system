# AISEE Design System 当前交接

> 本文件只表示项目此刻的最新状态，采用覆盖更新，不作为历史日志追加。工作纪律见 [`AGENTS.md`](AGENTS.md)，长期决策见 [`docs/TEAM_DECISIONS.md`](docs/TEAM_DECISIONS.md)，历史记录见 [`handoff/sessions/`](handoff/sessions/)。

## 当前 Git 状态

- 当前开发分支：`ai/desktop/design-system-current`。
- 当前本地 HEAD / 远端开发分支为本次交接更新提交；其父提交为 `91636d0 docs: restructure project handoff`。
- 最新 Managed Automation 内容提交：`f6e4341 fix(brand): sync Managed Automation eye demo`，已包含在当前开发分支历史中。
- `origin/main`：`3bdccf4 Merge pull request #3 from 23mnals/ai/desktop/design-system-current`；其后开发分支包含 Managed Automation 与本次交接机制重构提交。
- 本地 `main` 仍停在 `2358f97`，不是当前正式版本判断依据；需要先核对远端再更新本地指针。
- 工作区已与远端开发分支对齐且干净；本轮没有修改 UI 或重新生成设计文件。

## 当前正在做

- 当前没有进行 UI、组件或 Design System 功能开发；本地 Demo 运行于 `http://127.0.0.1:4174/`。

## 最近已完成

- 用户已确认并提交旧累加式交接向“工作纪律 + 当前仪表盘 + 长期决策 + 独立 session 历史”四层结构的迁移。
- 已将远端 `f6e4341` 同步到本地，并在 `Brand → Automation → Managed Automation` 验证最新 Keep-open / eye demo 正常显示、控制台无错误。
- `npm run check` 已通过：39 项测试、typecheck、token 检查与 build 全部成功，Git 工作区无新增修改。
- Brand 侧边栏已按 AIsee 功能模块重分类，Legacy 标签已统一为标题旁的轻量灰色小写样式；该批次已通过 `npm run check`（39 项）并合并到 `main`，merge commit 为 `3bdccf4`。
- Managed Automation Web 预览已加入 `brand/pages/managed-automation/`，并在 `brand/pages/index.json` 注册；commit 为 `c6ace77`，目前位于开发分支，尚未进入 `main`。
- 旧 Web 临时分支与 worktree `ai/web/brand-source-status` 已清理；`ai/desktop/design-system-checkpoint` 仍保留。

## 当前关键决策

- `main` 是正式稳定版本；Web ChatGPT 与 Desktop Codex 统一在 `ai/desktop/design-system-current` 延续开发。
- Web 产物默认 `source: ChatGPT`、`surface: Web`、`designStatus: Draft`；状态只允许 `Draft / Selected`，未经用户确认不能升级为 `Selected`。
- 新会话默认只读 `AGENTS.md` 与本文件，再核对 branch、status 和 recent commits；历史问题才查 session。
- 交接更新采用“新增 session + 刷新当前仪表盘”，不再向本文件末尾追加历史总结。
- 组件、视觉、资产、Figma 与 Brand 的长期规范统一以 `docs/TEAM_DECISIONS.md` 为准。
- Canonical dApp 规范为 `docs/aisee-dapp-design.v6.md`，主预览入口为 `aisee-design-system-preview.html`。

## 当前未完成

- 将开发分支当前的 `f6e4341` Managed Automation 与交接文档提交按用户要求同步到 `main`，随后检查 Actions / Pages，并实测线上 `Brand → Automation → Managed Automation`。
- Components 后续仍需完成真实组件清单与导航收尾、Button 模块色 hover、Select / Dropdown 示例与交互、功能页 Banner 清晰资产替换。
- 继续核对 Figma 5.5 / 5.6 / 5.7 与 `docs/aisee-dapp-design.v6.md` 的差异；冲突先记录并交由用户确认。
- 核对字体文件、Legacy 清理范围与独立 Dembrandt 扫描目录；未经确认不删除历史资产。

## 下一步

1. 按用户确认的发布流程处理当前开发分支进入 `main`，并验证 GitHub Pages 与真实页面资源。
2. 之后按用户优先级继续未完成的 Design System 工作，不因换会话重做已有实现。

## 最近一次 Session

- [`handoff/sessions/2026-08-24-local-sync.md`](handoff/sessions/2026-08-24-local-sync.md)
