# Changelog

### 2026-09-18 · PlanCard 订阅确认

- PlanCard 更新为单套餐订阅确认卡，集中展示价格、完整功能权限、credits 与品牌信息
- 提供静态卡片及真实弹窗预览，支持稍后关闭、Escape 与内部滚动
- 订阅操作提供购买流程回调，示例只展示反馈，不执行支付
- 内部使用简单浅底信息行，旧三档套餐示例保留在历史入口

### 2026-09-18 · 连体功能总览

- 新增 Feature Overview：Analysis、Growth plan、Engage、Publish 共用一张白色卡片，以分隔线划分四区
- Card 支持连体分区，1–4 列可切换，小屏自动重排，内部不重复包裹卡片边框
- 新增可复用功能清单，支持重点文字、补充说明和尾部图标
- Stat Card 增加紧凑信息条，可展示配额、频率或图标能力，并在窄屏纵向排列
- 提供组合总览与各部分独立示例，保留原有套餐卡供继续使用
- 紧凑信息条支持纯文字 / 纯图标切换；图标统一 16px，小叹号与标签文字居中对齐


### 2026-09-18 · 下拉组合预览布局

- 组合切换下拉移到 Variant playground 标题右侧，去掉重复的 COMPOSITION 标签
- 组合名称、解释和特性合并在预览下方，上方不再重复展示
- 切换组合时底部说明同步更新，窄屏说明自动换行
- Show icons 仅用于 Icon action menu；Grouped account 保留头像与平台图标
- 说明文字使用可用宽度，与右侧控制保持 12px 间距
- 展开下拉完整覆盖下方预览，修复组合菜单与筛选菜单的内容穿透
- 删除项高亮使用浅红标签色，Brand Mention 输入文字缩小为 12px


### 2026-09-18 · 分段选项与卡片层级

- 新增 Segmented Choice，适合 2–4 项带简短要求的单选
- 选中项同步显示解释，小叹号支持悬停和键盘聚焦查看说明
- 包含黄色 / 柠檬绿、禁用及键盘操作示例，创建 Post 已接入
- 复杂描边卡片的内层自动简化为白底浅描边，避免重复厚边框；页面与弹窗统一
- Brand Mention 使用 Tag Input 添加多个品牌或话题，卡片收起后标题、标签与箭头垂直居中
- 分段选项 hover 统一使用 bg-hover 颜色，未选项不额外增加描边
- 长弹窗内容支持内部滚动，标题与底部操作保持可见，窄屏同样可访问全部内容

### 2026-09-18 · 下拉菜单高亮修复

- 恢复下拉菜单重复打开后的 hover 高亮
- 保留选项之间的滑动高亮和键盘方向键反馈
- Card 及其他复用该下拉组件的示例同步修复

### 2026-09-17 · 通用分区卡片

- **内容组合**：Card 补齐单个输入框、输入框组、选项、长文本及混合表单，统一使用浅底白色内边框
- **遗漏类型**：补充指标总览、账号选择列表、带开关的可选区域、折叠设置和内容预览
- **通用结构**：支持标题说明、右侧操作、底部操作与响应式列布局，折叠后保留输入内容
- **实际场景**：Create Post 弹窗演示账号多选、编辑与预览联动，并展示必填、错误、只读和禁用状态


### 2026-09-17 · Button 图标变量

- **图标开关**：Icon variants 移到 States 前，标题右侧提供 Show icon 与 Left / Right 选择；卡片仅展示按钮，关闭图标后自动去掉间距
- **位置规则**：一般操作图标在左侧；前进箭头和 AI 生成星光在右侧，也支持 Search 这样的左右双图标组合
- **状态示例**：尺寸直接显示为 Small / Default / Large，下面新增 With icon，并单独展示各类按钮的 Disabled 样式
- **设计补齐**：增加 Generate Post、Go execute、View replies、View Post、Bulk schedule 五种 Figma 按钮组合，保留原有 hover、focus 和禁用反馈


### 2026-09-17 · Notification、Toggle 与组件验收

- **Sidebar Navigation**：适度放大 Engage 气泡图标，与相邻导航图标的视觉大小更一致，文字位置保持不变；修复首次打开时选中 Summary、内容标题却显示 Signal Feed 的不同步问题
- **Notification**：Reset demo 恢复未读通知时重播铃铛与数字徽章动画；演示按钮明确标为模拟通知到达，实际使用由未读数量增加自动触发
- **Select / Dropdown**：组合预览标题改为中等字重；Score、Time、Intents 筛选按钮补齐 hover 与键盘焦点；账户分组支持折叠，右侧数字在 hover 时让位给操作图标，Connect 平台使用整行按钮；修复滚动后跨行 hover 高亮跳动与闪烁
- **NEW 有效期**：侧栏、README 与组件页按更新日期保留 7 个日历日，第 8 天自动隐藏；页面持续打开或从后台恢复时也会刷新
- **颜色**：Toggle 支持柠檬绿、黄色填充，统一保留深色描边与圆钮
- **背景与尺寸**：增加浅色 / 深色背景及 16px / 24px 高度组合，24px 黄色版本对齐 Automation 的 Figma 参考
- **交互与交付**：保留 hover、按压、弹性切换及减弱动效支持；组件页通过正式 Dropdown 组件切换颜色、背景、尺寸和状态，触发框与展开菜单统一为组件库样式，Overview 与 Copy for AI 同步说明


### 2026-09-16 · Current 组件与交互更新

- **Tree Nav**：新增独立 Current 组件页，默认直接展示约 6 个相关选项，不重复外围标题，并支持层级引导线、叶子选中与禁用状态
- **Sidebar Navigation**：展开态直接组合 Tree Nav，侧栏自身继续负责功能分组、收起态、账号入口与收起后的子级浮层
- **Checkbox**：从未选中切换到选中时播放一次短促的 bubble 扩散与回弹反馈；取消选中、初始选中和禁用态不触发，并兼容 reduced motion
- **Select / Dropdown**：Variant playground 新增带图标的操作菜单，复制、加入客户、编辑时段、禁用与删除均使用 `@stemui/icons` 正式图标；预览舞台按各组合菜单高度调整，所有组合保持相同顶部间距，同一菜单展开或收起不会改变页面高度
- **Notification**：新增 Figma 实心铃铛、通知面板与消息条目；空状态直接复用 Empty State 清晰 SVG 插图，新通知触发白色铃铛摆动及徽章滚动，hover / focus 只摆动铃铛；点击消息会清除该条未读标记，Reset demo 可恢复初始状态，变量开关使用正式 Toggle 动效
- **Quantity Stepper**：按 Figma 结构更新数量组件，左右按钮贴合外框并使用 StemUI 图标；中间整块数值区均可点击并在原位输入，同时支持 AISEE 黄色文本选区、长按加速、数字滚动、边界抖动和窄容器自动隐藏单位字段
- **发现与交付**：Components Overview、A–Z 导航、`NEW` 标识和 Tree Nav / Checkbox 的 `Copy for AI` 已同步更新


### 2026-09-15 ～ 2026-09-16

- **Avatar**：22 个网站注册方形头像与 24 个社媒缺失圆形兜底头像进入 Components；头像随机取值后保持稳定；眼睛动画直接作用于原头像并限制瞳孔范围；颜色、眼睛尺寸和位置增加差异
- **账号与平台标识**：Sidebar 账号入口同步组件头像库，套餐名更新为 `Growth Loop Plan`，额度说明 icon 改为细描边；Plan-generated Post 的平台 logo 使用单层虚线描边，Manual-create Post 使用单层实线描边，并缩小 logo 与外圈间距
- **Sidebar Navigation**：原 Verify 页面更名为 Compare；Google Search Data 与 Bing Webmaster Data 移入 Verify 子级；账号入口随机展示组件库头像
- **组件发现与 AI 交付**：Avatar 移入 Components；分类内按 A–Z 排序；README、页面更新位置与新增组件显示 `NEW`；22 个 Current 组件详情页提供经过同一规则约束的 `Copy for AI`
- **Credit Bar 与 Empty State**：补齐 Subscription 为 0、Top-up 为 0、两者同时为 0 的额度状态；原 Successful 插图语义修正为 `No report data`，表示暂无报告记录，并引导用户添加产品 URL 发起分析
- **Dropdown**：同步单选、多选、过滤、输入建议、Compact、Search + action、Filter panel 与 Grouped account；Fluid Hover 使用缓存几何信息，长列表移动时不再反复刷新全部选项，并缩短跟随时间；行操作加号为 24px、默认隐藏、行 hover / focus 后显示灰底灰边、按钮自身 hover 才变黄
- **Dropdown 参数与布局**：Grouped account 增加真实 `Show icons` 开关；关闭后只显示文字；所有下拉菜单以浮层展开，不改变 Playground、后续内容或文档高度
- **在线 Demo**：GitHub About 保留固定 Pages 地址，Pages 改由 `ai/desktop/design-system-current` 在完整检查通过后自动发布；`main` 继续作为 PR 确认后的稳定代码


本项目遵循 [Semantic Versioning](https://semver.org/)。

## 1.0.0 - 2026-08-13

### Added

- v6 权威设计规范与完整 Design DNA
- Analysis / Post Agent / Engage 模块主题令牌
- Button、Input、Toggle、Tabs、Card、Tag、ModuleToggle、Dialog React 组件
- Figma v5.4 Upgrade Plan 的 Current PlanCard、计费切换与独立预览
- JSON、CSS、TypeScript 三种令牌出口
- 文档站、规范回归测试、GitHub Actions 与协作模板

### Changed from legacy system

- dApp 字体统一为 Karla，移除 Gotu 依赖
- Sidebar 由 211px 更新为 224px
- 静态描边统一为 5% 黑色
- Modal、Toggle、Engage 组件规则与 v6 文档对齐
- 删除历史实验页面和损坏编码文件，不纳入可发布包
