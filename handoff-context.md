# AISEE Design System 当前交接

> 本文件只表示项目此刻的最新状态，采用覆盖更新，不作为历史日志追加。工作纪律见 [`AGENTS.md`](AGENTS.md)，长期决策见 [`docs/TEAM_DECISIONS.md`](docs/TEAM_DECISIONS.md)，历史记录见 [`handoff/sessions/`](handoff/sessions/)。

## 当前 Git 状态

- 当前开发分支：`ai/desktop/design-system-current`。
- 最新功能批次 commit：`d475f36 feat: refresh component docs and tab interactions`。
- 本轮组件批次与交接记录已推送到 `origin/ai/desktop/design-system-current`；未创建或更新 `main` PR。
- 工作区仍不干净：Sidebar Navigation 新版实现、规范、测试和资产按用户要求保留为本地未提交修改，等待视觉确认。

## 当前正在做

- Sidebar Navigation 正在本地确认阶段，未进入远端版本。
- 最新本地方案使用无中间竖线的双向箭头 cursor：展开态 hover 顶部按钮时左侧高亮、右侧低透明度并显示 `Close sidebar`；收起态整条侧栏右侧高亮、左侧低透明度，顶部按钮显示 `Open sidebar`。
- 收起态维持 56px，点击空白 rail 展开；点击带子项的功能 icon 仍打开 flyout，不被整栏展开点击覆盖。

## 最近已完成并已提交

- 实测并采用 Fluid Functionalism 的静态 `NEW` 规则：点击、选中或刷新不会消失，不使用 localStorage，也不按组件版本记录已读。
- Current 组件详情页统一为 640px 居中内容区，并补齐内容框、窄屏换行与横向滚动。
- 组件标题区新增 32×32 上一项 / 下一项导航，图标 16×16；随标题滚动且不与描述重叠，hover / focus 显示相邻组件名称。
- 新增可复用 Tag Input：虚线输入预览、Enter / Add 提交、空输入 Backspace 删除最后一项；Add 的 `+` 与文字同色。
- Toggle 补齐 hover、press、checked 弹性反馈和 reduced-motion。
- Tabs 补齐 underline、三类 segmented 与平台 Logo + 文字组合；正式 Demo 的 segmented 已同步 520ms 拉伸、越位、轻压回弹动效。
- Badge 已拆为 Current 通用组件，旧 Tag / Badge 保留 Legacy；Dropdown 选项统一 Karla 14px / 20px。
- 本次不含 Sidebar 的远端提交快照已通过 `npm test` 48/48、`npm run build` 与 `git diff --check --cached`。

## 当前关键决策

- 日常开发统一在 `ai/desktop/design-system-current`；正式版通过该分支到 `main` 的 PR，未经同时授权不 merge。
- `NEW` 是静态发布清单标记，由显式 `updated: true` 控制，不是个人已读提示。
- Current 组件页内容宽度统一为 640px；Legacy 页面保持原样。
- Tag Input 是 `Inputs & Controls` 的独立组件，不扩张基础 Input API。
- Tabs 同时维护 underline 与 segmented；下划线 hover 只改变文字，segmented hover 使用 4% 黑色填充。
- Sidebar Navigation 必须是数据驱动、可复用、带完整交互的 Current 组件；但当前新版尚未获得用户确认，因此远端仍保留 Legacy 入口和实现。

## 当前未完成

- 等待用户验收 Sidebar Navigation 的方向 cursor、Open / Close tooltip、收起后整栏展开与 icon flyout；确认后再单独 commit / push。
- Tabs 回弹已同步 Demo 与 React 组件；后续只需继续产品侧视觉验收。
- 用户提供的 Figma `10374:435175` 倾向归入 `Data Display → Card` 的业务 Card 变体，尚未实现；现有 Default / Elevated 示例仍是通用占位。
- `Plugin Entry Options` 的三个 Legacy Engage 内嵌页面仍引用已不存在的 JSX 路径，问题尚未修复。

## 下一步

1. 用户确认 Sidebar 后，对本地 Sidebar 文件重新跑完整测试与浏览器验收，再单独提交并推送。
2. 单独评估并实现 Figma `10374:435175` 的 Card 业务变体。
3. 用户明确要求正式发布时，再创建 `ai/desktop/design-system-current → main` PR；不自动 merge。

## 最近一次 Session

- [`handoff/sessions/2026-09-11-component-batch-remote-checkpoint.md`](handoff/sessions/2026-09-11-component-batch-remote-checkpoint.md)
