# AISEE Design System 当前交接

> 当前状态覆盖更新；工作纪律见 [AGENTS.md](AGENTS.md)，长期决策见 [docs/TEAM_DECISIONS.md](docs/TEAM_DECISIONS.md)，历史见 [handoff/sessions/](handoff/sessions/)。

## 当前 Git

- 开发分支：`ai/desktop/design-system-current`，本轮功能提交：`f5344f9 feat: add composable status components`。
- PR #7 已合并；本轮 [PR #8](https://github.com/23mnals/aisee-design-system/pull/8) 也已合并，`origin/main` 最新关键提交为 `13cf93e`。
- 用户已授权并完成当前开发分支推送；远端 `origin/ai/desktop/design-system-current` 已包含功能提交 `f5344f9`、交接提交 `cf968ef` 与网络故障记录 `92bcffe`。
- 用户已明确授权合并 PR #8；GitHub 返回 `merged: true`，功能代码已进入 `main`。

## 正在做

- 本轮组件实现和技术验收完成，等待用户检查视觉及场景是否遗漏。
- 本地预览服务曾停止，现已重新启动为独立后台进程：`http://127.0.0.1:4173`，PID 94710（运行时值，使用前检查端口），日志 `/tmp/aisee-preview-4173.log`；无待发布动作。

## 最近完成

- 最新视觉反馈：EmptyState 删除重复 No event alternate，14 个独立 SVG；完整/无 action 示例各有独立下拉选择，联动插图、标题、描述和对应 action，图库联动 composer 文案。
- TutorialSteps 第二/三步修正为原始循环箭头/评论气泡 SVG；整块 Figma context 错误解析实例交换，需要读取确切子节点。标题/描述仍各自单行省略，首个眼睛动效保留。
- 使用场景说明复用白底和示例卡片同色完整灰色描边；3px #EC5212 强调线贴合卡片内部左侧并贯穿上下边缘，偏移均为 0px，共享 aisee-usage-note。
- ToggleSelectionGroup 修正基础 Checkbox 样式覆盖：SVG 不旋转，勾选框黑底白勾，选项底色 #CFFF29，左右 padding 13px；关闭恢复行为保留。
- Tag Input 标签与输入框同排，窄容器内容可横向滚动，按钮保持可见。React 样式和 HTML Demo 同步。

- Tag 与 Badge Legacy 独立页面及门户入口按用户要求删除，Tag React API 保留。
- Steps：纯静态流程、动态进度（初始/进行中/完成/错误）、思考明细；进行中闪烁，支持关闭及 reduced-motion。教程 `TutorialSteps` 在同页展示，支持图标/标题/描述/action 与窄容器纵排。
- EmptyState：四个槽位自由组合，14 个 Figma 原始插图可选，自定义插图优先；composer 用共享 Dropdown/Checkbox。
- ToggleSelectionGroup：首次开启全选，关闭只禁用并保留，再次开启恢复，空选不重置；支持受控/非受控、All 半选、不可用/只读/空列表。
- Badge：新增来源灰底无边和状态低饱和底+灰边的 icon + label；保留原三类。
- 全设计系统统一本地 Karla，包括 Brand、Legacy、Score Gauge、代码提示。Table 原本已用 Karla，本轮进一步统一入口和规范。
- 下拉箭头与 Sidebar 同款，按钮左右 padding 12px。
- 新 Demo 由真实 React 源组件构建，门户 57 页；`npm run build:component-demos` 更新生成的 JS/CSS，不手改 bundle。
- 前一批 Sidebar Navigation 已通过 PR #7 进入 main；Tabs 520ms 回弹、Tag Input、基础 Toggle/Dropdown 等保留。

## 验收证据

- 最终 `npm test` 60/60，typecheck、build、site、tokens:check、git diff --check 全通过。
- 浏览器已验证联动选择首开全选、部分/空选恢复、关闭禁用和键盘 Space；Steps 每步状态与 active 动画；EmptyState 14 图标和槽位组合；Badge 图标与背景/边框。
- 390px 容器八个代表页面均无页面横向溢出、真实 Karla 已加载、可见文字计算字体无异项；教程自动纵排。Steps 内部保留流程横向滚动。
- 最新四页（TagInput、EmptyState、Steps、ToggleSelectionGroup）390px 浏览器复验 scrollWidth=390；Tag Input 控件仍 40px，标签与输入框垂直居中同排。
- 浏览器确认两下拉均 14 项、独立选择无互相覆盖、无 action 示例无按钮、图库改图同步 composer 文案；图片均 SVG 且成功加载。教程两个 SVG 正确，场景说明计算样式白底/3px 橙边/12px padding。
- 联动多选浏览器确认 #CFFF29、#111、transform none，关闭禁用和重开恢复部分选中通过。
- 临时字体/窄屏检查页面已删除，不在交付中。

## 关键决策

- 普通开发在当前开发分支；未经授权不做 Git 发布。同步 main 通过 PR，merge 需明确授权。
- Current 内容宽度 640px；variants / states 放同组件页，NEW 为静态 updated:true。
- 字体全部 Karla，覆盖早期 Gotu / Digital Numbers 例外；原字体资产无需删除。
- Steps 静态模式不展示任务状态；动态由业务传入状态；TutorialSteps 用于新功能说明。
- 空状态四槽位独立可选，不产生空白占位；联动多选区分首次 undefined 与已保存空数组。
- 用户已明确授权删 Tag/Badge Legacy，未授权删除其他 Legacy 资产。
- 组件持久化、网络请求和教程显示/隐藏由业务负责，通用组件不自行触发。

## 待确认 / 未完成

- 用户视觉验收：Steps/TutorialSteps、EmptyState、ToggleSelectionGroup、Badge；联动组件八场景查漏见 [场景说明](docs/TOGGLE_SELECTION_GROUP_SCENARIOS.md)。
- Card 业务变体 Figma `10374:435175` 尚未实现。
- Plugin Entry Options 的三个 Legacy Engage 内嵌页面仍引用不存在的 JSX 路径，尚未修复。

## 发布状态 / 下一步

- 本轮组件、资产、字体统一、页面删除、测试、Demo bundle 与文档已通过 PR #8 同步到 `main`；合并提交为 `13cf93e`。
- 当前开发分支继续保留，未删除；后续普通开发仍在 `ai/desktop/design-system-current` 进行。
- 新对话读取 AGENTS.md 与本文件，检查 branch/status/log，再读直接相关源码。
- API 与设计来源见 [COMPOSABLE_COMPONENTS.md](docs/COMPOSABLE_COMPONENTS.md)。

## 最近一次 Session

- [2026-09-11-composable-components-main-pr.md](handoff/sessions/2026-09-11-composable-components-main-pr.md)

- [2026-09-11-composable-components-remote-sync.md](handoff/sessions/2026-09-11-composable-components-remote-sync.md)

- [2026-09-11-component-visual-feedback.md](handoff/sessions/2026-09-11-component-visual-feedback.md)

- [2026-09-11-tutorial-single-line.md](handoff/sessions/2026-09-11-tutorial-single-line.md)

- [2026-09-11-preview-recovery.md](handoff/sessions/2026-09-11-preview-recovery.md)

- [2026-09-11-composable-components.md](handoff/sessions/2026-09-11-composable-components.md)
- 页面删除记录：[2026-09-11-remove-tag-and-legacy-badge.md](handoff/sessions/2026-09-11-remove-tag-and-legacy-badge.md)
