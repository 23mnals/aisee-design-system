# 通用组合组件

所有组件从 `@aisee/design-system` 导入，并加载 `@aisee/design-system/styles.css`。组件与 Demo 使用同一实现，统一 Karla。

## Steps 与 TutorialSteps

| 使用意图 | 组件/参数 | 调用方式 |
|---|---|---|
| 只解释流程 | Steps，mode="static" | 传稳定 id、label、icon/iconSrc；忽略 status，不闪烁、不宣布任务状态。 |
| 展示任务进度 | Steps，mode="progress" | 由业务将每项 status 更新为 pending → active → complete；错误为 error，重试恢复 active。 |
| 展示思考明细 | Steps，thinkingSteps | 传 id/content/status；可加 title、description、illustration；明细更新礼貌播报。 |
| 新功能教程 | TutorialSteps | 每项 id/title，选填 description、icon/iconSrc、action；无 icon 时显示序号。 |

Steps 的 `animated=false` 和系统 reduced-motion 都会关闭闪烁/旋转。静态模式始终无动画。StepStatus 文案用 statusLabels 本地化；无步骤时不生成空列表。长流程在组件内横向滚动，不挤压标签；业务可传任意数量步骤。

TutorialSteps 的 orientation 接受 auto / horizontal / vertical；auto 在容器不超过 560px 时竖排。每一步的标题与描述各保持单行，宽度不足显示省略号，完整内容仍保留在 DOM 中。普通教程不强加当前步骤、完成状态或下一步按钮；需要跳转时传 action，显示/关闭教程由业务控制。新功能介绍、初次配置、操作说明均可复用。

```tsx
<Steps mode="static" items={workflow} />
<Steps mode="progress" items={progress} thinkingSteps={activity} animated />
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

## 设计来源

- Steps：LLvI9vd66VLNuAltAWJFJw / 75:26072、38:42672。
- TutorialSteps：同文件 / 38:83251；首个眼睛动效沿用 Figma 2 秒眨眼和视线位移，Demo 在 reduced-motion 下关闭。
- Badge：同文件 / 75:31848，来源图标为嵌套行 31894 / 31895 / 31904；状态见各行 status-v5.3-table。
- EmptyState：tv7gTsQn6OipGVwHG8z0mX / 9551:122351、9191:263484、10236:177226；插图库 LLvI9vd66VLNuAltAWJFJw / 42:11679，节点清单见 assets/empty-state/library/manifest.json。
- ToggleSelectionGroup：tv7gTsQn6OipGVwHG8z0mX / 9704:256746。稿件四个选项，Demo 的数量按四项真实数据计算。
