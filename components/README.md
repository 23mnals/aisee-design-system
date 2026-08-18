# Components

## 组件导航

门户中的 Components 采用 **Category → Component** 层级；只有真实存在且可复用的组件才进入导航，variants、states、sizes 和 specs 保留在组件页面内部。

- **Overview**：当前 dApp v6 组件总览。
- **Actions**：Button（Current）。
- **Inputs & Controls**：Input、Checkbox、Select / Dropdown、Toggle（Current）。
- **Navigation**：Tabs（Current）、Sidebar Navigation（Legacy）。
- **Content & Status**：PlanCard — Current、Tag（Current）、Badge（Legacy）。
- **Data Display**：Card、Stat Card — Current、Table、Chart、Score Gauge（Current）；Stat Card、Post Card、Credit Bar（Legacy）。
- **Feedback & Overlays**：Dialog、Confirmation Dialog、Tooltip / Toast（Current）。

旧的 `Buttons & Badges`、`Nav, Inputs & Toggles`、`Cards & Data` 仍保留在 `preview/` 作为历史页面，但不再作为组件入口。`IntentTag` 与 `StatusBadge` 的源文件也保留，但因当前门户预览为空/未验证，不再显示在 Components 导航中。完整业务页面继续留在 UI Kits 或原有业务页面目录中。

## 当前业务组件

- [`PlanCardCurrent/`](PlanCardCurrent/)：Figma v5.4 Upgrade Plan 当前套餐卡；React 实现位于 [`../src/components/PlanCard.tsx`](../src/components/PlanCard.tsx)

## 旧系统组件（完整保留）

- [`IntentTag/`](IntentTag/)
- [`StatusBadge/`](StatusBadge/)
- [`PlanCard/`](PlanCard/)
- 动画图标：[`../animated/`](../animated/)
- Engage 业务组件：`../engage*`、`../aisee-agent-test/`

## v6 基础组件

现行可发布 React + TypeScript 组件位于 [`../src/components/`](../src/components/)：Button、Input、Checkbox、Toggle、Tabs、Card、PlanCard、Tag、ModuleToggle、Dialog、ConfirmationDialog、Dropdown、Tooltip、Toast、StatCard、Table、ScoreGauge、LineChart。

`Dropdown` 的 Current API 覆盖单选、多选、菜单过滤和可输入建议；静态详情页与发布 API 使用同一 36px trigger、8px 菜单间距、黑色内边与模块色 focus ring。多选菜单项在文字左侧显示复选框，不使用右侧尾部对勾。

其中 `ModuleToggle` 仅保留给仍使用旧三模块切换的历史/兼容场景；当前 5.5 Growth Loop Shell 不把它作为主导航入口。

旧组件没有被删除。与 v6 同职责的基础控件以 `src/components` 为现行实现；尚未迁移的业务组件继续从原目录使用，后续逐项升级。
