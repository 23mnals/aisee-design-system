# 通用组合组件

所有组件从 `@aisee/design-system` 导入，并加载 `@aisee/design-system/styles.css`。组件与 Demo 使用同一实现，统一 Karla。

## Steps 与 TutorialSteps

### 加载动画

`AiseeLoadingAnimation` 是 Thinking Steps 和其他页面加载状态共用的动画。默认 `tone="auto"`：普通、Analysis、Engage 及未声明主题的页面均显示柠檬绿；只有祖先容器为 `data-aisee-theme="post-agent"` 时自动显示黄色。真实页面不需要手动选颜色，只有脱离页面主题的独立预览才使用 `tone` 覆盖。SVG 可无损缩放，`animated={false}` 或系统 reduced-motion 会显示静止状态。

```tsx
<AiseeLoadingAnimation />
<section data-aisee-theme="post-agent"><AiseeLoadingAnimation /></section>
```

| 使用意图 | 组件/参数 | 调用方式 |
|---|---|---|
| 只解释流程 | Steps，mode="static" | 传稳定 id、label、icon/iconSrc；忽略 status，不闪烁、不宣布任务状态。 |
| 展示任务进度 | Steps，mode="progress" | 由业务将每项 status 更新为 pending → active → complete；错误为 error，重试恢复 active。 |
| 展示思考明细 | Steps，thinkingSteps | 传 id/content/status；可加 title、description、illustration；短加载标题可设 titleMotion="wave"；明细更新礼貌播报。 |
| 新功能教程 | TutorialSteps | 每项 id/title，选填 description、icon/iconSrc、action；无 icon 时显示序号。 |

Steps 的 `animated=false` 和系统 reduced-motion 都会关闭闪烁、旋转及标题波浪。静态模式始终无动画。`titleMotion="wave"` 只用于进行中的短加载标题，文字保持原内容和可访问名称；完成或失败后改回 `none`。StepStatus 文案用 statusLabels 本地化；无步骤时不生成空列表。长流程在组件内横向滚动，不挤压标签；业务可传任意数量步骤。

TutorialSteps 的 orientation 接受 auto / horizontal / vertical；auto 在容器不超过 560px 时竖排。每一步的标题与描述各保持单行，宽度不足显示省略号，完整内容仍保留在 DOM 中。普通教程不强加当前步骤、完成状态或下一步按钮；需要跳转时传 action，显示/关闭教程由业务控制。新功能介绍、初次配置、操作说明均可复用。

Steps 与 TutorialSteps 页面中的图标只说明 icon/iconSrc 槽位的尺寸、容器和排版，不是生成内容时必须复用的固定图标。调用方或 AI 应根据每个真实步骤的业务语义，从已批准的图标库选择对应图标；只有业务含义相同时才复用 Demo 图标。没有合适图标时可省略，组件显示步骤序号，禁止因参考示例而把 Report、Growth tasks 或教程眼睛图标复制到无关流程。

```tsx
<Steps mode="static" items={workflow} />
<Steps mode="progress" items={progress} thinkingSteps={activity} title="正在分析品牌…" titleMotion="wave" animated />
<TutorialSteps items={[
  { id: 'watch', title: '添加关注内容', description: '关键词、账号或社区', icon: <WatchIcon /> },
  { id: 'feed', title: '查看结果', description: '匹配内容进入信息流', action: <a href="/feed">打开列表</a> },
]} />
```

## EmptyState

`illustration`、`title`、`description`、`action` 均为可选 ReactNode。未提供槽位不渲染其容器，四项都为空返回 null。titleAs 控制 h2/h3/h4，size 为 default/compact，variant 为 plain/inset。

```tsx
<EmptyState illustrationName="no-event" title="暂无内容" description="创建第一条内容后会显示在这里" action={<Button onClick={onCreate}>创建内容</Button>} />
<EmptyState illustrationName="no-account" description="尚未关联账号" />
<EmptyState description="暂无活动记录" />
```

Demo 的 Full composition 与 No action 均可独立下拉选择插图，同时更新对应标题、描述及 action 文案；图库联动 composer。场景文案只属于 Demo，组件仍由业务传入内容。

Empty State 的主 action 颜色默认根据内置插图的主背景填充自动判断，不需要额外选择：浅黄色背景使用发布功能黄，柠檬绿背景使用 Analysis 绿，其他颜色使用 `#111111` 黑色按钮。插图库通过 `backgroundTone` 元数据记录主背景分类；切换 `illustrationName` 时 action 色自动联动。自定义插图、无插图状态无法可靠识别主背景，默认使用黑色；只有明确业务例外才传 `actionTone="analysis" | "post-agent" | "neutral"` 覆盖。

14 个预置插图见 `emptyStateIllustrations`。自定义 illustration 优先；显式 illustration={null} 可隐藏预置图。独立 EmptyStateIllustration 支持 name、size、alt。装饰插图默认空 alt。双按钮、禁用按钮或链接直接由 action 组合；组件不触发网络操作。

首次使用可提供创建 action；搜索无结果可提供清除筛选；等待采集结果不必加 action；已有区块标题时可以省略 title；窄卡片可仅保留插图和描述。

## ToggleSelectionGroup

完整八类场景与边界见 [TOGGLE_SELECTION_GROUP_SCENARIOS.md](TOGGLE_SELECTION_GROUP_SCENARIOS.md)。value/onChange 为受控配置，defaultValue 为组件本地配置；关闭不会清空 selectedIds。跨刷新持久化由业务保存 value，不由通用组件写浏览器存储。

## Badge

保留 solid / dot / colour；新增 source / status：

```tsx
<Badge variant="source" iconName="from-plan">From plan</Badge>
<Badge variant="source" icon={<PlatformLogo />}>自定义来源</Badge>
<Badge variant="status" status="scheduled">已排期</Badge>
```

来源预置 iconName：from-plan / manual / rewritten。状态预置 scheduled / published / draft / failed / removed，自动提供图标与英文默认 label；children 可替换为业务文案。icon 提供自定义 React 内容，优先于 iconName。Badge 仅描述信息，不默认作为可点击按钮。

来源：灰色 #f5f5f5、无描边、16px icon、Karla 14/18、padding 3px 8px、圆角 8px。状态：12px icon、Karla 12/14、padding 5px 8px、圆角 12px、统一 6% 灰色描边；各状态填充沿用稿件。

## Tabs

`layout="platform"` 默认使用 `platformLabelDisplay="auto"`：组件会测量全部 Logo + name 的实际宽度；完整内容能放下时显示所有名称，空间不足时自动退回为只有当前选项显示名称。名称不会被压缩或截断。`"active"` 和 `"all"` 保留为特殊页面的显式覆盖，其中 `"all"` 在空间不足时允许横向滚动。

```tsx
<Tabs layout="platform" platformLabelDisplay="auto" items={platforms} value={platform} onValueChange={setPlatform} />
<Tabs layout="platform" platformLabelDisplay="active" items={platforms} value={platform} onValueChange={setPlatform} />
<Tabs layout="platform" platformLabelDisplay="all" items={platforms} value={platform} onValueChange={setPlatform} />
```

## Dialog

Dialog 按可复用结构分类，业务功能只作为使用示例，避免为“创建”“升级”“编辑”分别复制一套组件。

| 维度 | 类型 | 适用情况 |
|---|---|---|
| Shell | `standard` | 短表单、选择、详情与管理操作。 |
| Shell | `centered` | 插图居中的单一决策、额度或权限提示。 |
| Shell | `split` | 同一项短任务包含数个局部区段；持续导航或长任务改用页面或 Drawer。 |
| Content | Form / Choice / Details / Summary | 通过 children、`DialogDetails`、`DialogSummary` 与可选 `notice` 组合。 |
| Footer | `inline` / `split` / `stacked` | 根据操作数量与层级排列，不按业务名称创建变体。 |

`illustration`、`notice`、`sidebar`、关闭按钮和 footer 均可独立组合。破坏性的二选一确认继续使用 `ConfirmationDialog`。

```tsx
<Dialog open={open} onClose={close} title="Create analysis" footer={actions}>…</Dialog>
<Dialog layout="centered" illustration={<UpgradeIllustration />} title="Not enough credits" footerLayout="stacked" footer={actions}>…</Dialog>
<Dialog layout="split" sidebar={<LocalSections />} title="Edit tracking rule" footer={actions}>…</Dialog>
```

## 设计来源

- Steps：LLvI9vd66VLNuAltAWJFJw / 75:26072、38:42672。
- TutorialSteps：同文件 / 38:83251；首个眼睛动效沿用 Figma 2 秒眨眼和视线位移，Demo 在 reduced-motion 下关闭。
- Badge：同文件 / 75:31848，来源图标为嵌套行 31894 / 31895 / 31904；状态见各行 status-v5.3-table。
- EmptyState：tv7gTsQn6OipGVwHG8z0mX / 9551:122351、9191:263484、10236:177226；插图库 LLvI9vd66VLNuAltAWJFJw / 42:11679，节点清单见 assets/empty-state/library/manifest.json。
- ToggleSelectionGroup：tv7gTsQn6OipGVwHG8z0mX / 9704:256746。稿件四个选项，Demo 的数量按四项真实数据计算。
- Dialog：LLvI9vd66VLNuAltAWJFJw / 38:221904、38:211503、38:211687、38:211960、38:212010、38:212300。
