# Components

## 组件导航

门户中的 Components 采用 **Category → Component** 层级；只有真实存在且可复用的组件才进入导航，variants、states、sizes 和 specs 保留在组件页面内部。

- **Overview**：当前 dApp v6 组件总览。
- **Actions**：Button（Current）。
- **Inputs & Controls**：Input、Select / Dropdown、Toggle（Current）。
- **Navigation**：Tabs（Current）、Sidebar Navigation（Legacy）。
- **Content & Status**：PlanCard — Current、Tag（Current）、Badge（Legacy）。
- **Data Display**：Stat Card、Post Card、Credit Bar（Legacy）。
- **Feedback & Overlays**：Dialog、Confirmation Dialog（Current）。

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

现行可发布 React + TypeScript 组件位于 [`../src/components/`](../src/components/)：Button、Input、Toggle、Tabs、Card、Tag、ModuleToggle、Dialog、ConfirmationDialog。

旧组件没有被删除。与 v6 同职责的基础控件以 `src/components` 为现行实现；尚未迁移的业务组件继续从原目录使用，后续逐项升级。
