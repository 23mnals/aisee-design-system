# 2026-09-16 Notification 组件

## 本轮目标

- 按 Figma `77:17878` 增加 Notification Bell、通知下拉面板和通知条目。
- 使用 Figma 实心铃铛图标，并区分新通知与 hover / focus 两种动画触发。
- 修正 Bell states 标题换行和通知变量控件样式。
- 修复 Select / Dropdown 组合预览随内容变高及菜单越界，并把 Icon action menu 换成正式 StemUI 图标。
- 修复 Quantity Stepper 已有实现未注册到 Demo、因此用户无法发现的问题。

## 本轮完成

- 新增可复用 `NotificationBell`、`NotificationPanel` 与 `NotificationItem`。
- 铃铛默认使用 `colour/bg/hover`，hover / focus 使用黄色；未读数字和圆点使用 Feedback 红色。
- 新通知触发白色铃铛摆动与未读徽章滚动；hover / focus 只触发白色铃铛摆动，32px 按钮和黑色圆形底保持静止。
- 通知面板支持 populated、empty、loading、error，All / Unread 筛选、已读状态、状态图标、操作和错误详情等变量。
- Bell states 使用 `Default`、`Hover / focus`、`Unread count`、`Unread dot` 四个单行标题；界面不再显示冗长的 Feedback 说明。
- 面板配置控件改为 AISEE Toggle 样式，避免浏览器默认蓝色 checkbox。
- Notification 面板状态选择器移到标题右侧，使用 AISEE Dropdown；加入 Reset demo，点击消息正文或操作会清除该条未读红点并同步未读数。
- Empty 状态同步 Figma `77:17940` 的标题与说明文案，并直接引用 Empty State 插图库中的 `no-event.svg` 清晰矢量插图；新通知红点只在事件发生时播放一次动画，不持续闪烁。
- Select / Dropdown 的 5 种组合统一使用 580px 固定预览舞台；Playground 高度在切换组合时保持不变，Filter、Grouped account 与 Icon action menu 均不再越界。
- Icon action menu 的复制、加入客户、时段、禁用和删除图标分别改为 `@stemui/icons@0.1.40` 的 `LineFileCopyIcon`、`LinePeopleAddContactIcon`、`LineClockTimeIcon`、`LineProhibitedNotClickableIcon` 与 `LineTrashDeleteIcon`，HTML 通过只读 SVG 快照渲染。
- Quantity Stepper 已加入 `Components → Inputs & Controls`，并同步 Overview、Copy for AI、NEW 标识与 README；支持直接输入或仅加减按钮、三种尺寸、单位、边界限制及越界抖动。
- 同步组件目录、Overview、Copy for AI、README 最近更新、长期决策和测试。

## 验收

- `node --test tests/preview.test.mjs`：57/57 通过。
- TypeScript 检查与组件 Demo 构建通过。
- 浏览器确认空状态直接加载 68×68 的 `no-event.svg` 原始矢量资源并按 40×40 显示，高分屏边缘清晰。
- 本地 Demo 浏览器验收：点击未读消息后计数从 4 变 3且该条红点消失；Reset demo 恢复 4 条未读；Toggle 可真实切换变量。
- 浏览器逐项测量 Select 的 5 个组合：Playground 高度一致、舞台均为 580px、全部内容无越界；5 个 StemUI 图标均以 16px 官方快照渲染。
- Quantity Stepper 导航、Overview 与 Copy for AI 注册回归通过；`node --test tests/preview.test.mjs` 56/56、`npm run typecheck` 与 `git diff --check` 均通过。

## Git / 工作区

- 当前分支：`ai/desktop/design-system-current`。
- 当前 HEAD：`5787654 feat: add tree nav and checkbox celebration`，本地领先远端 1 个提交。
- Notification 及同批 Quantity Stepper、Dialog、Tabs 等改动仍在工作区，尚未 commit / push；未覆盖或丢弃其他协作者修改。

## 下一步

- 等用户继续验收 Notification 面板、Toggle 动画和 Select 固定预览布局。
- 用户明确要求同步远端后，再按独立任务范围整理 commit 并推送开发分支。
