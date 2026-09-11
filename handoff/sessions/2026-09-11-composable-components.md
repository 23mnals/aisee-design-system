# 2026-09-11 通用组件与字体完善

## 本轮目标

用户连续提出：删除 Tag / Badge Legacy 展示页；新增步骤和思考步骤、可自由组合空状态及全部 Figma 插图、开关联动多选；统一 Karla；修正下拉箭头与按钮左右留白；补齐来源/状态 Badge；将步骤拆为静态/动态场景并加入新功能教程步骤。

## 本轮完成

- 删除两个旧页与导航已在上一份 remove-tag-and-legacy-badge session 单独记录；本轮保留该改动，不删除 Tag React API。
- Steps：mode=static 仅展示流程；mode=progress 支持 pending/active/complete/error，active 1.6 秒闪烁与 loading 旋转，支持关闭动画与 reduced-motion。思考明细可组合 title/description/illustration。业务持有状态，不内置任务请求。
- Steps Demo：静态流程、动态逐步状态、教程、思考明细四类；动态控制完整演示每步等待→进行中→完成。
- TutorialSteps：复刻 Figma 38:83251，36px 图标底、22px 图标、14/600 标题、12/14 说明、箭头连接；任意数量教程条目，description/icon/action 可选，auto 在 560px 以下容器纵排。首个原始 eye 在 Demo 保留稿件 2 秒眨眼/视线位移，reduced-motion 关闭。
- EmptyState：插图/标题/描述/action 任意组合，缺失槽位不生成空容器，四项为空不渲染；plain/inset、default/compact、标题层级与自定义 React 槽位。15 个原始 Figma SVG 注册到 EmptyStateIllustration，两种 no-event 均保留；Demo gallery 可选择并应用到 composer。
- ToggleSelectionGroup：首次开启全选可用项；手动取消后关闭禁用而保留；再次开启恢复，包括有意空选。All 半选/全选/清空、单项禁用、整组只读、空列表、动态增删、受控与非受控。跨刷新保存由业务负责。
- Badge：保留 solid/dot/colour；追加 source 和 status，支持 iconName / 自定义 icon。From plan、Manual、Rewritten 灰色实色无描边；Scheduled、Published、Draft、Failed、Removed 低饱和填充统一灰色描边。使用 Figma 原始资产，文本可本地化。
- Typography：真实字体文件内部名称确认 Karla；Table 原本就为 Karla。新增公共本地字体策略覆盖全部门户注册 HTML，去除 Score Gauge 数字字体例外、更新 Brand display 文案和字体规则。保留旧字体文件供历史追溯。
- 空状态 composer 复用通用 Dropdown/Checkbox；箭头与 Sidebar 相同，左右 padding 均 12px。
- 新的 Demo 均由真实 React 源组件通过 scripts/build-component-demos.mjs 构建；build/dev/site 自动重建。门户当前 57 个页面。

## 关键文件

- src/components/{Steps,TutorialSteps,EmptyState,EmptyStateIllustration,ToggleSelectionGroup,Badge}.tsx
- src/styles/{steps,tutorial-steps,empty-state,toggle-selection-group}.css、components.css、base.css；src/index.ts 导出。
- components/{Steps,EmptyState,ToggleSelectionGroup}/ 中 HTML、demo.tsx、demo.css 与生成的 JS/CSS；Badge 原页追加 React icon 示例。
- assets/{steps,tutorial-steps,empty-state,toggle-selection-group,badge}/，原始 Figma 图标，empty-state/library/manifest.json 保存 15 项节点。
- fonts/karla-face.css / karla.css；所有门户注册页面引入，tokens gauge 指向 Karla。
- docs/COMPOSABLE_COMPONENTS.md：API 与设计来源；docs/TOGGLE_SELECTION_GROUP_SCENARIOS.md：八类应用场景与边界。
- components/README.md、docs/TEAM_DECISIONS.md、fonts/README.md、package.json、tsconfig.json、tests。

## 设计依据与处理

- Steps：LLvI9vd66VLNuAltAWJFJw / 75:26072、38:42672；教程 / 38:83251。
- EmptyState 结构：tv7gTsQn6OipGVwHG8z0mX / 9551:122351、9191:263484、10236:177226；全部插图：LLvI9vd66VLNuAltAWJFJw / 42:11679。
- ToggleSelectionGroup：tv7gTsQn6OipGVwHG8z0mX / 9704:256746。稿里是四个选项，数量按真实数据计算 2/4。
- Badge：LLvI9vd66VLNuAltAWJFJw / 75:31848；get_design_context 对整页返回稀疏元数据，使用只读 Plugin API 定位嵌套图标/标签，再读取子节点设计。来源填充实际为 #111 的 4% opacity，按用户“灰色纯色”要求落为 #f5f5f5。Failed/Removed 描边按用户要求统一为灰色，覆盖稿件淡红描边。
- Figma 文件未做任何编辑。

## 验证

- 最终 npm test：60/60；npm run typecheck、npm run build、npm run site、npm run tokens:check、git diff --check 全通过。
- 本地浏览器：联动选择首开全选、取消单项、关后禁用保留、重开恢复、空选恢复、键盘 Space 操作通过；All 半选逻辑在测试与浏览器确认。
- Steps：等待→active 闪烁→complete 静止→下一步 active；思考失败/重试/关闭动画已验证。
- EmptyState：15 插图全部加载、gallery 切换、关闭 title/action 无空槽位、Size/Surface 选择和左右 12px padding 已验证。
- Badge：3 个来源与 5 个状态图标、真实背景/描边/字体计算样式及截图已验收。
- 390px iframe：Badge、联动多选、Table、ScoreGauge、Steps、EmptyState、Brand Logo、Webapp 八页均加载真实 Karla，可见文字无异字体，页面 scrollWidth=390；教程自动 column。
- 修复了 Steps sr-only 绝对定位文字撑宽窄屏页面的问题，限定到 pill / log 的定位容器。
- 临时 typography audit HTML 已删除，未进入 site 产物。
- 静态 site 脚本按原有逻辑清除产物内 3 个失效软链接；未删除源仓库文件。

## Git / 未完成

- 分支 ai/desktop/design-system-current，HEAD ee2891a；原有 AGENTS.md 和之前 session/交接改动保留。
- 本轮未 commit、push、PR 或 merge，所有实现仅本地。
- 本轮请求实现与验收已完成，待用户视觉验收与场景查漏；不自动发布。
- 原有待办仍为 Card 业务变体 10374:435175 和 Plugin Entry Options 内的失效 Legacy JSX 路径，本轮未扩展处理。
