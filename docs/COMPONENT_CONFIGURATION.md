# Current 组件配置契约

所有带变量的组件：先选择，再点门户的 **Copy for AI**，复制点击时的最新配置。此规则不只适用于 Sidebar。更改选择后需要重新复制；复制结果不会自动同步到其他 AI，也不会自动改变产品默认布局。

所有入口使用 [生产交付契约](PRODUCTION_DELIVERY.md)。页面配置快照仅是读取层；复制前必须经过各组件 manifest 的真实 props / slots / theme 白名单。布局、方向、动效可保留，previewState、mock 内容、演示计数和 showcase composition 不进入指令，更不能改变生产文件范围。NotificationBell 的所有演示控件均忽略；真实 count / onClick 来自业务项目。

## 当前覆盖

| 页面 | 复制的设计控制 |
| --- | --- |
| Sidebar Navigation | 当前布局；对应的内部 / 外部按钮或 hover / click 展开方式 |
| Button | 显示图标、显示时的左右位置 |
| Toggle | 颜色、表面、尺寸；排除演示开关 / 禁用状态 |
| Input | 输入类型；排除演示禁用、错误与 hover/focus 状态 |
| Checkbox | 模块主题 |
| Quantity Stepper | 可输入或仅按钮模式 |
| Tabs | 两个独立示例的图标与计数插槽 |
| Select / Dropdown | 仅当前适用的图标插槽；排除示例组合与演示展开状态 |
| Toggle Selection Group | 交付生产组件；场景选择仅用于演示，不复制 |
| Empty State | 三个独立示例的插图、尺寸、表面与内容插槽 |
| Steps | 思考步骤的动画开关 |
| Tooltip / Toast | Tooltip 动画：subtle / playful / none；定位保持 auto |
| Card | 交付生产 Card；内容组合选择是演示，不复制 |
| Feature Overview | 连体容器列数与 divided；另一独立 StatCard 展示不进入 FeatureOverview 交付 |
| Avatar | 两个头像示例的资源选择、网站头像眼睛动画 |
| Notification | 仅交付铃铛与未读数字动画；页面演示开关不复制，真实 count / onClick 由产品接入 |

其余 12 个已提供 Copy for AI 的 Current 页面为固定展示：Segmented Choice、PlanCard Current、TagInput、TreeNav、Badge、StatCard Current、Table、Chart、ScoreGauge、CreditBar、Dialog、ConfirmationDialog。它们复制具名生产交付入口，不声称选定了某个展示例。业务单选、多选、标签输入和打开弹窗不等于设计变量选择。

## 格式与边界

读取层生成 `schemaVersion: 1` 的页面快照；这是内部接口，不会整份复制。最终剪贴板是具名接入指令、稳定 latest URL 以及经过清单筛选的可选 JSON。

- 只保留白名单内真实 `props`、`slots`、`theme`；`composition`、`motion` 和 `previewState` 原始字段不输出。真实动画参数必须映射到组件实际 props，例如 Tooltip.animation、Avatar.animated。
- 演示错误、通知数量和 loading/empty 场景均由真实产品数据驱动，不固定写入接入代码。
- 关闭图标后不携带无效的位置选择；切换组合后不携带隐藏控制器的旧值。
- 不读取业务搜索词、表单值、账号身份、通知内容或进度等数据。未批准的头像扩展仍不能进入自动分配池。
- 同页多个示例是独立配置，不能合并成单个组件。需要选用其中哪一个时依照目标任务。
- 预览未加载完成、路径不符、配置未注册或状态缺失时停止复制并显示原因，不静默复制默认值或上一页状态。

## AI 使用规则

收到目标截图或可访问的设计链接后，先匹配已有 Current 组件的用途、结构和交互。有合适组件就复用并设置对应变量；不为视觉近似而复用行为不相符的组件。截图能表达可见布局，隐藏交互仍须依据规范或用户要求。

明确用户选择优先（含复制的配置），否则依次跟随目标设计、产品已确定配置、组件文档默认值。出现冲突应指出差异。这些规则也适用于直接交付完整设计系统的场景；记录产品选用配置并沿用，不能每个页面随机重选。

## 新增变量时的维护要求

React 示例从实际状态生成 `data-aisee-config` JSON；静态示例在 `assets/component-config.js` 注册显式读取函数。门户只在复制按钮被点击时读取当前 iframe。不得用通用遍历所有 input 的方式代替配置声明。

新增 Current 复制入口时必须注册读取器或明确为无变量展示页；新增变量时同步快照、production manifest 的配置白名单、本文覆盖表和验证。检查切换后再次复制、独立示例归属、失效控制器排除、真实 props 映射与不泄漏业务输入。

Tooltip / Toast 的四个方向按钮同时展示，气泡在 hover / focus 后出现；方向不是选择器。动画选择器导出实际 `animation` 参数（subtle / playful / none），预览页初始选择 playful，组件未传 animation 时默认为 subtle。Tooltip 默认 `placement="auto"`；指定方向也是优先方向，空间不足仍会翻转。Copy for AI 保留该规则，不假设用户选中了某个固定方向。
