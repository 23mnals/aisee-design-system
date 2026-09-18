# Sidebar 验收与 Toggle 变量更新

## 本轮目标

读取 AGENTS.md 与当前交接，从 Sidebar Navigation 开始逐项验收本地未提交内容；按用户给出的 Figma 参考补充 Toggle 柠檬绿 / 黄色、深浅背景、24 / 16 尺寸。其他未确认内容不改动、不提交。

## Git 与范围

- 分支：`ai/desktop/design-system-current`。
- HEAD：`546faba docs: record completed sync and pending review`，与跟踪远端一致。
- 未执行 commit、push、PR 或 merge。
- 工作开始时已有 README、portal、Overview、共享样式、测试、Sidebar / Webapp、Notification、Select 等多处本地变更。使用本轮前文件哈希比对确认未触碰 Sidebar、Webapp、Notification、Select 和其他组件现有文件。
- 本轮修改：`src/components/Toggle.tsx`、`src/styles/components.css` 的 Toggle 区域、`components/Toggle/Toggle.html`、portal 中 Toggle 的 Copy for AI / 摘要、Overview 中 Toggle 链接说明、README 最近更新、既有测试中的两条旧静态尺寸断言，以及交接文档。
- 未重建其他组件的已跟踪 demo bundle，避免将未确认内容混入生成文件。

## Sidebar 验收结果（只读）

已在本地浏览器验证：

- Growth 可展开 Opportunities / Recommendations / Tasks。
- Engage 可展开 Signal Feed / Keywords & Accounts / Replies。
- Engage 引用 `assets/stemui/nav-engage.svg`，计算尺寸为 13×13px。
- 展开状态可独立保留；选择子项会更新内容标题。
- Sidebar 可收起 / 展开，收起时 Engage 浮层可选 Replies，选择后关闭浮层并更新内容。

仍未通过最终验收：

1. 组件页初始 `selected='summary'`，但静态内容标题为 Signal Feed，初始选中与内容不一致。
2. `ui_kits/webapp/WebAppSidebar.demo.tsx` 当前 Growth / Engage 没有 children，而组件页有完整子级，两份预览层级不一致。先记录，未自行改动其他待确认内容。

Notification、Select / Dropdown 继续保持上一轮待验收状态，本轮未进入它们的逐项验收。

## Toggle 更新

- React API 增加 `color?: 'lime' | 'yellow'`、`surface?: 'light' | 'dark'`、`size?: 16 | 24`；未指定 color 时继续继承模块色，默认 16 / light。
- 用组件级 CSS 变量控制轨道、圆钮、位移、颜色与 focus；所有状态保留既有 hover 拉伸、按压压缩、弹性移动和 disabled 限制；组件本身补充 reduced-motion 规则，不依赖外围 root。
- 16px 保留既有 24×16px 轨道、10px 圆钮和 1px 深色边。
- 24px 参考 Figma `75:10427`：轨道 43.636364×24px、圆钮 17.454546px、描边 1.309091px；启用填充为 #CFFF29 / #FFE253，描边与圆钮为 #111。
- Figma `75:10422` 直接证明深色背景上的黄色 24px 启用态；绿色、16px 和其他状态按用户要求与现有组件规则扩展。深色关闭态的白色透明轨道和 focus / label 适配属于本轮扩展，不宣称它们是该 Figma 节点提供的状态。
- 组件页复用正式共享 CSS，提供颜色、背景、尺寸、开关 / 禁用状态选择及 8 组变体对照。
- README、Overview、Copy for AI 和 NEW 已同步。
- 只读取 Figma，未写入或更改 Figma 文件。

## 验证

- TypeScript、75 项现有测试、tokens:check、git diff --check 通过。
- Vite 库构建输出到 `/tmp/aisee-toggle-build-20260917`，成功；现有 Notification 的 CommonJS `import.meta` 警告保留，未修改该待验收组件。
- 浏览器验证全部 16 个 on/off 对照的高度、填充、描边、圆钮颜色；24px 实际宽度约 43.63px、16px 轨道宽 24px。
- 验证 Playground 的 yellow / dark / 24 组合、空格键切换、状态联动以及 disabled。
- 本地服务 `http://127.0.0.1:4173` 已有进程可用；复用现有服务。

## 下一步

1. 用户确认 Sidebar 验收中的两处差异后，按指定范围处理。
2. 用户验收 Toggle 变体。
3. 继续 Notification，然后 Select / Dropdown。
4. 没有明确发布授权时继续保留本地变更，不自动提交或推送。
