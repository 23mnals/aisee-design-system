# PlanCard 订阅确认 · 2026-09-18

## 目标与来源

用户要求按 Figma 51:329855 更新 PlanCard。已读取 design context 与截图，实际为单套餐订阅弹窗，区别于此前 FeatureOverview 四区功能总览。

## 完成

- PlanCard 增加 subscription 判别变体，保留 comparison / 省略 variant 的旧 API。新增 SubscriptionPlanCard 实现单套餐价格、权益、额度、品牌资料与操作。
- 复用 Badge、Button、DialogDetails、Dialog；支持业务回调、disabled 及文案 / 图像插槽。
- 原稿插图复用已存在的完整 unlock 资产；权益图标下载 Figma 原文件；品牌小图标从 51:329928 导出。manifest 记录来源。原稿明显拼写错误 Al / ine 修正为 AI / the。
- Current 页面改为 React 实际组件的静态示例 + Open dialog，旧 HTML 原样保存在 PlanCardPrevious.html（仅更名来源标识），旧 Legacy 未变。
- Current registry、Overview、Copy for AI、NEW 日期、README 最近更新与交付文档同步；README 保留最近三批。

## 验证

- 95 项测试通过；增加订阅字段 / 操作语义、禁用 / 转义、旧比较兼容验证，保留原三档历史页面测试。
- typecheck、定向 Vite Demo、React 库与类型声明、静态站点构建通过；git diff --check 通过。
- 实际浏览器验证 Maybe later 关闭、Escape 关闭、Subscribe 回调反馈；无真实支付。
- 桌面 512px 弹窗对照设计稿检查。浏览器 viewport API 未对当前页生效，因此使用临时 390×620 iframe 验证真实窄视口：内容 715px、可见 586px，操作可滚动访问，文档 clientWidth / scrollWidth 均 390px。验证后删除本轮临时测试页，恢复视口。

## 主要文件

src/components/PlanCard.tsx、SubscriptionPlanCard.tsx；src/styles/subscription-plan.css、components.css；components/PlanCardCurrent/；assets/plan-card/subscription/；tests/plan-card.test.mjs、preview.test.mjs；scripts/build-component-demos.mjs、tsconfig.json；门户 / Overview / README / AI_HANDOFF / 当前交接。

## Git 与下一步

分支 ai/desktop/design-system-current；HEAD 25c8f9f。保留全部其他未确认修改，未 commit / push / merge。新版 PlanCard 待用户视觉验收，业务 checkout 尚未接入（组件库不负责支付）。FeatureOverview 及第二批拆分状态保持原样。
