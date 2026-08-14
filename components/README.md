# Components

## 组件导航

设计系统门户中的 Components 按职责分组，Current 始终排在 Legacy 之前：

- **Overview**（原 `dApp v6 Components`）：当前组件总览页，集中展示共享控件、状态、弹窗和交互规则。
- **Actions**：`Buttons & Badges`（Legacy，保留历史按钮/徽章样例）。
- **Inputs & Controls**：`Nav, Inputs & Toggles`（Legacy，保留历史输入、下拉、切换和导航控件样例）。
- **Content & Status**：`PlanCard — Current`、`IntentTag`（Legacy）、`StatusBadge`（Legacy）。
- **Data Display**：`Cards & Data`（Legacy，保留历史数据卡片样例）。

当前没有真实内容的 Navigation、Feedback & Overlays 分类不会在门户中显示。完整业务页面继续留在 UI Kits 或原有业务页面目录中。

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
