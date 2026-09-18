# 连体功能总览 · 第一批

来源：[Figma 51:213896](https://www.figma.com/design/LLvI9vd66VLNuAltAWJFJw?node-id=51-213896)，2026-09-18 读取。用户已授权第一批实现，视觉验收尚待确认。

## 拆分与复用

| 层级 | API | 可复用场景 |
|---|---|---|
| 连体容器 | `Card variant="divided"` + `CardGrid divided columns={1…4}` | 功能介绍、说明分区、服务能力集合 |
| 功能清单 | `FeatureList items tone` | 权益、能力、要求、说明列表 |
| 紧凑信息条 | `StatCardGroup variant="compact"` + `StatCard` | 配额、频率、限制、图标能力 |
| 完整组合 | `FeatureOverview sections columns` | 产品功能或权益总览 |

标题中的图标、Badge、Tooltip 使用已有组件与插槽，不额外建立标题组件。平台图标条只在 Demo 中组合，留到下一批评估；旧 PlanCard 的价格、周期和购买行为继续保留。

## API

- `FeatureListItem`：`id`、`content` 必需；`supporting`、`trailing`、`icon` 可选，内容为 ReactNode。`tone` 可用 analysis / growth / engage / publish / neutral。使用 ul / li 信息语义，没有选中状态。
- `StatCardGroup variant="compact"`：所有直接 StatCard 子项继承紧凑外观，`value` 支持数值、文字或图标。保留现有 label / footer 能力。原默认统计组外观不变。
- `FeatureOverviewSection`：`id`、`title`、`items` 必需；可提供 `icon`、`badges`、`description`、`summary`、`tone`、`footer`。
- `FeatureOverview` 默认两列；`sections` 不限定为四个，`columns` 支持 1–4。

```tsx
import { FeatureOverview, StatCardGroup, StatCard } from '@aisee/design-system';
import '@aisee/design-system/styles.css';

<FeatureOverview sections={[{
  id: 'monitoring',
  title: 'Monitoring',
  description: 'Review your connected sources.',
  summary: <StatCardGroup variant="compact" aria-label="Monitoring limits">
    <StatCard value="30" label="Tracked keywords" />
    <StatCard value="24h" label="Scan frequency" />
  </StatCardGroup>,
  items: [{ id: 'coverage', content: <>Track <strong>all connected sources</strong>.</> }],
}]} />
```

## 外观与边界

- 单张白色卡片、24px 外圆角、共享浅色分隔线；分区内容内距为上下 24px / 左右 16px，内部不重复外框。
- 连体容器宽度 ≤900px 时 3/4 列降为 2 列；≤600px 时变为单列，分隔线同步切换。
- 紧凑信息条 value 可使用纯文字或纯图标，下方标签保留；示例标题右侧提供 Text only / Icon only 切换。图标统一 16px，帮助图标 12px 并与标签文字居中对齐。
- 紧凑信息条等分列，宽度 ≤340px 时纵向排列。标签可换行，不裁掉关键信息。
- 标题、清单、数值均沿用 Karla；功能图标、勾选装饰、平台图标来自 Figma 原始资源，资源来源记录在 `assets/feature-overview/manifest.json`。
- 静态卡片不增加整卡 hover 或点击动作；仅 Tooltip 等真实交互提供对应反馈。
- 配额、支持平台、文案均由调用方提供。Demo 展示设计稿中的示例数据，不代表已接入产品业务。

预览入口：`components/FeatureOverview/FeatureOverview.html`。Card 和 Stat Card 页面也提供对应独立示例。
