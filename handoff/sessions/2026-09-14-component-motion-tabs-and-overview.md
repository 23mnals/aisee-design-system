# 2026-09-14 组件动效、Tabs 与 Overview 同步

## 本轮目标

- 将用户已确认的 Button 与 Steps 动效同步到正式 Demo。
- 更新 Stat Card、Credit Bar、Dialog、Toast、UI Kit 等组件实现和交互。
- 删除用户明确指出的重复 Legacy Stat Card 页面。
- 给 Tabs 两个组合示例增加显示/隐藏内容的演示控制。
- 建立 Components Overview 与组件页同步机制。

## 本轮完成

- Button 正式组件接入双向覆盖动效，按 primary、secondary、dark analysis/post、danger 处理 hover 色和描边；已修正圆角边缘露底。
- Steps 正式组件新增可选 `titleMotion="wave"`，思考处理中标题逐字轻微波浪；完成、失败、关闭动画和 reduced-motion 状态保持静止。
- Tabs 在对应示例标题右侧增加紧凑 Toggle：`Show icons` 与 `Show counts`。默认开启，关闭时隐藏对应内容，现有 ResizeObserver 自动重算选中指示器。
- 删除 `components/StatCard/StatCard.html` 及门户 Legacy 入口，保留并更新 `components/StatCardCurrent/`。
- Components Overview 新增完整 Current 组件索引；测试从门户读取全部 Current 路径并与 Overview 的 `data-current-component` 链接做一致性比较。
- Overview 的 Current 标签改为门户内快捷入口：点击会打开完整组件页并同步左侧导航；页面明确说明可用左侧 Overview 或浏览器返回键返回。
- Dialog 按 Standard / Centered / Split 三类 Shell 与 Form / Choice / Details / Summary 内容结构重构，补齐 7 个可交互示例；功能名称仅作为场景文案。
- Platform Tabs 新增 `platformLabelDisplay="auto" | "active" | "all"`。默认 `auto` 按真实可用宽度决定显示全部名称或仅当前项名称；Tab 不再横向收缩，名称不会被切断。Demo 显示当前自动判断结果，并保留显式策略供特殊页面覆盖。
- Credit Bar、Dialog、Toast、Confirmation Dialog、Empty State、Badge、Toggle Selection Group、Web App UI Kit 侧边栏等同批组件与生成 bundle 已更新。
- Toast 倒计时调整为 5 秒；Dialog 改为按钮点击后打开并修正 footer 上下间距；Confirmation Dialog 的 Toast 图标改为 SVG。
- 更新组件 README、可组合组件文档、团队决策与 gap report。

## 修改范围

- 生产源码：`src/components/`、`src/styles/`、`src/index.ts`
- 组件 Demo：`components/`
- Overview / 门户：`preview/dapp-v6-components.html`、`aisee-design-system-preview.html`
- Web App UI Kit：`ui_kits/webapp/`
- 构建与测试：`scripts/build-component-demos.mjs`、`tests/`
- 文档：`components/README.md`、`docs/`

## Git / 发布

- 分支：`ai/desktop/design-system-current`
- 当前 HEAD：`9fe4b23 docs: record PR 8 merge`
- 本轮修改均未提交、未推送；没有创建或合并 PR。
- 工作区中包含此前同一批组件更新，后续提交时应整体复核，避免混入无关修改或遗漏生成 bundle。

## 本轮确认的设计决策

- 用户已确认 Button 动效可以同步正式 Demo。
- 用户已确认 Steps 文字波浪效果可以同步正式 Demo。
- 用户明确授权删除重复的 Legacy Stat Card 页面。
- 组件页有更新时，Components Overview 也必须同步；本轮增加自动一致性测试。
- Tabs 的 icon/count 为可选内容；标题右侧开关用于演示组合，不要求业务用户手动配置组件主题。
- Platform Tabs 默认使用自适应名称策略：完整名称集能放下时全部显示，空间不足时仅显示当前项名称；不让业务用户手动计算布局。
- Dialog 以结构分类，业务场景通过同一套槽位组合；破坏性二选一继续使用 Confirmation Dialog。
- Overview 标签是组件详情页快捷入口，不是当前页锚点。

## 验收

- `npm run build:component-demos`：通过。
- `npm test`：65/65 通过。
- `npm run typecheck`：通过。
- `npm run build`：通过，生产包与全部组件 Demo 已重新生成。
- `git diff --check`：通过。
- 本轮尝试通过浏览器接管做最后视觉检查，但接口返回无法读取 browser tabs；未影响本地构建和结构验收。

## 未完成 / 下一步

- 用户视觉确认 Tabs 的 icon/count 两个演示开关、平台自适应名称模式及 Dialog 分类示例。
- 用户确认本批后，再按指令 commit / push；同步 `main` 时走 PR，merge 仍需明确授权。
- 后续继续处理 Card 业务变体及仍失效的 Legacy Engage 内嵌引用。
