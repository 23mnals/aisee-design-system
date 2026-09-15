# AISEE Design System 当前交接

> 当前状态覆盖更新；工作纪律见 [AGENTS.md](AGENTS.md)，长期决策见 [docs/TEAM_DECISIONS.md](docs/TEAM_DECISIONS.md)，历史见 [handoff/sessions/](handoff/sessions/)。

## 当前 Git

- 开发分支：`ai/desktop/design-system-current`。
- 最新功能提交：`e0aac7d feat: add component AI prompts and bilingual readme`，已推送到 `origin/ai/desktop/design-system-current`。
- 本轮 Copy for AI、README 中英切换、文档、Overview、测试和交接记录均已同步远端开发分支。
- `main` 最近一次正式同步为已合并的 [PR #9](https://github.com/23mnals/aisee-design-system/pull/9)。

## 正在做

- 用户已要求把 Input 页试用的 `Copy for AI` 同步到其余组件，并更新 README 与中文切换；实现和本地验收已经完成，等待用户查看。
- 本地预览入口：`http://127.0.0.1:4173`；当前交付预览停留在 README 中文版。

## 最近完成

- 22 个 Current 组件详情页均接入双星 `Copy for AI`，每个组件有独立用途、交互、视觉边界和无障碍规则。
- Overview、Legacy、Brand 与 UI Kit 不显示组件复制入口，避免把汇总页或历史页面当成单一 Current 组件规范。
- Prompt 明确 Demo 的文案、数据、图标和插图是可替换参考；Steps 等组件继续要求根据真实业务语义选择图标。
- 双星按钮与 `Open HTML` 统一为 40px 高，使用更明显的浅柠檬绿表面。
- 门户 README 增加持久化 English / 中文切换，并完成整页主要章节的中文内容。
- README 新增“无需写代码也能使用组件”流程；根 `README.md` 和 `docs/AI_HANDOFF.md` 同步说明单组件使用方式。
- Components Overview 同步加入 Current 详情页 Copy for AI 说明，遵守组件更新时 Overview 一并更新的规则。
- 之前已进入 `main` 的 Current 组件批次包括 Tabs 自适应名称、Steps 波浪标题、Stat Card Current、Credit Bar、Dialog、Toast、Empty State、Badge、Toggle Selection Group 与 Button 动效等。

## 验收证据

- `npm run check` 通过：token outputs current、TypeScript 通过、67/67 测试通过、组件 Demo 与生产构建通过。
- `git diff --check` 通过。
- 浏览器验证：README 中文版可见；Current Tabs 显示 `Copy Tabs guidance for AI`；Copy 与 Open HTML 均为 40px；README 隐藏复制按钮。
- 自动测试核对门户中的 22 个 Current 组件路径与 22 份组件指引一一对应。

## 关键决策

- 非开发人员做单组件任务时，优先使用详情页 `Copy for AI`，无需上传整套 Design System Demo。
- 完整页面或跨组件任务仍应提供门户/仓库与权威规范；`Open HTML` 用于需要完整渲染实现或源码结构的场景。
- 组件 Demo 负责展示结构、状态和交互，不规定真实业务的文案、数据、图标或插图。
- 组件页有更新时，Components Overview 与相关 README 必须同步，避免上下内容不一致。
- 普通开发继续使用 `ai/desktop/design-system-current`；正式同步 `main` 通过 PR，merge 需要用户明确授权。

## 待确认 / 未完成

- 等待用户确认各 Current 组件的 Copy for AI 文案和 README 中英切换效果。
- Card 业务变体 Figma `10374:435175` 尚未实现。
- Plugin Entry Options 的三个 Legacy Engage 内嵌页面仍引用不存在的 JSX 路径。

## 发布状态 / 下一步

- 本轮改动已提交并推送到 `ai/desktop/design-system-current`。
- 如需正式同步 `main`，创建 `ai/desktop/design-system-current → main` PR；只有用户明确要求时才 merge。
- 新对话先读 `AGENTS.md` 与本文件，再检查 branch/status/log，并从当前工作区继续。

## 最近一次 Session

- [2026-09-15-copy-for-ai-readme-localization.md](handoff/sessions/2026-09-15-copy-for-ai-readme-localization.md)
