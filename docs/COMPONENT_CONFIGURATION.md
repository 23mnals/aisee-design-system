# Current 组件配置契约

所有带变量的组件：先选择，再点门户的 **Copy for AI**，复制点击时的最新配置。此规则不只适用于 Sidebar。更改选择后需要重新复制；复制结果不会自动同步到其他 AI，也不会自动改变产品默认布局。

## 当前覆盖

| 页面 | 复制的设计控制 |
| --- | --- |
| Sidebar Navigation | 当前布局；对应的内部 / 外部按钮或 hover / click 展开方式 |
| Button | 显示图标、显示时的左右位置 |
| Toggle | 颜色、表面、尺寸、演示开关 / 禁用状态 |
| Input | 演示状态，禁用和错误参数 |
| Checkbox | 模块主题 |
| Quantity Stepper | 可输入或仅按钮模式 |
| Tabs | 两个独立示例的图标与计数插槽 |
| Select / Dropdown | 当前组合；仅对应组合的图标开关或演示展开状态 |
| Toggle Selection Group | 当前使用场景组合 |
| Empty State | 三个独立示例的插图、尺寸、表面与内容插槽 |
| Steps | 思考步骤的动画开关 |
| Card | 当前内容组合 |
| Feature Overview | 连体容器列数、紧凑信息条文字 / 图标模式 |
| Avatar | 两个头像示例的资源选择、网站头像眼睛动画 |
| Notification | 铃铛圆点模式、面板状态、图标 / 状态 / 操作 / 错误详情 |

其余 13 个已提供 Copy for AI 的 Current 页面为固定展示：Segmented Choice、PlanCard Current、TagInput、TreeNav、Badge、StatCard Current、Table、Chart、ScoreGauge、CreditBar、Dialog、ConfirmationDialog、TooltipToast。它们复制组件规范，并明确没有通过变量控制器选定某个展示例。业务单选、多选、标签输入和打开弹窗不等于设计变量选择。

## 格式与边界

复制结果包含规范和 `schemaVersion: 1` 的 JSON 快照：`reference` 定位组件页，`status` 为 `selected` 或 `no-variable-controls`，`sections` 按 `scope` 指明各个独立示例。

- `props` 使用实际组件参数；`slots`、`composition`、`theme`、`motion` 描述组合要求，不能作为不存在的属性直接展开传入组件。
- `previewState` 为演示状态；生产环境由实际业务驱动。演示用错误文字须替换为真实校验提示。
- 关闭图标后不携带无效的位置选择；切换组合后不携带隐藏控制器的旧值。
- 不读取业务搜索词、表单值、账号身份、通知内容或进度等数据。未批准的头像扩展仍不能进入自动分配池。
- 同页多个示例是独立配置，不能合并成单个组件。需要选用其中哪一个时依照目标任务。
- 预览未加载完成、路径不符、配置未注册或状态缺失时停止复制并显示原因，不静默复制默认值或上一页状态。

## AI 使用规则

收到目标截图或可访问的设计链接后，先匹配已有 Current 组件的用途、结构和交互。有合适组件就复用并设置对应变量；不为视觉近似而复用行为不相符的组件。截图能表达可见布局，隐藏交互仍须依据规范或用户要求。

明确用户选择优先（含复制的配置），否则依次跟随目标设计、产品已确定配置、组件文档默认值。出现冲突应指出差异。这些规则也适用于直接交付完整设计系统的场景；记录产品选用配置并沿用，不能每个页面随机重选。

## 新增变量时的维护要求

React 示例从实际状态生成 `data-aisee-config` JSON；静态示例在 `assets/component-config.js` 注册显式读取函数。门户只在复制按钮被点击时读取当前 iframe。不得用通用遍历所有 input 的方式代替配置声明。

新增 Current 复制入口时必须注册读取器或明确为无变量展示页；新增变量时同步快照、本文覆盖表和验证。检查切换后再次复制、独立示例归属、失效控制器排除、真实 props 映射与不泄漏业务输入。
