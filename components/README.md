# Components

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
