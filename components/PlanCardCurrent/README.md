# PlanCard — Current

当前展示依据 [Figma 51:329855](https://www.figma.com/design/LLvI9vd66VLNuAltAWJFJw?node-id=51-329855) 更新为单套餐订阅确认（2026-09-18）。

- 512px 白色卡片、16px 圆角，居中插图 / 套餐标签 / 价格 / 标题说明。
- 简单浅底信息行展示完整功能权限与 credits；品牌区展示公司名称与网站。
- 复用 Badge、Button、DialogDetails；复杂外框只保留一层。
- Maybe later 调用 onDismiss；Subscribe & Start Analysis 调用 onAction，由产品接入购买流程。Demo 不执行支付或启动分析。
- 弹窗组合复用 Dialog 的焦点约束、Escape 和动画；长内容内部滚动，窄屏按钮纵排。

```tsx
import { PlanCard, Dialog } from '@aisee/design-system';
import '@aisee/design-system/styles.css';

<Dialog open={open} onClose={dismiss} title="Subscription confirmation"
  closeable={false} className="aisee-plan-subscription-dialog">
  <PlanCard variant="subscription" name="Growth Loop" title="Unlock full analysis"
    description="Subscribe to start your full AI visibility report, growth plan, and publishing workflow."
    price="$99" credits="8,000" companyName="Aisee" website="https://aisee.live"
    onDismiss={dismiss} onAction={startCheckout} />
</Dialog>
```

priceUnit 默认 /month，creditsUnit 默认 cr /mo。支持 accessTitle / accessDescription / creditsDescription、companyIcon、illustration、actionLabel / dismissLabel、disabled。价格、额度、品牌和购买接口由业务传入；disabled 只禁用订阅按钮。

[独立预览](PlanCardCurrent.html) · [此前三档比较](PlanCardPrevious.html) · [更早 Legacy](../PlanCard/PlanCard.html)

旧 PlanCard 比较 API 兼容保留（variant 省略或 comparison），不删除其 Monthly / Yearly 及 Current Plan 等既有展示。新的 FeatureOverview 仍负责四区功能总览，不与订阅确认混用。
