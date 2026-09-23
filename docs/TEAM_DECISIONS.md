# Team Decisions

此文件记录团队对基础规范的后续澄清。发生冲突时，顺序为：本文件最新决策 → 当前 dApp spec → 历史文件。

## 2026-09-18 — 所有组件的变量复制与 AI 复用

- 所有带变量的 Current 组件统一遵循“先选变量，再点 Copy for AI，复制点击时的最新配置”；不能只对 Sidebar 实现，也不能把所有可选值清单冒充当前选择。
- 同页独立示例按 scope 分开，组件 props 与组合 / 插槽 / 主题 / 动效要求分开；预览状态不等同于生产环境固定状态，不导出业务输入、搜索词或账号数据。
- AI 收到截图或可访问链接时，先核对现有 Current 组件的用途、结构、交互；可满足时直接复用并映射变量。截图只说明可见状态，隐藏交互与不可访问设计不得臆测。
- 明确用户选择优先；否则依次参考目标设计、产品已确定配置、组件文档默认值。该规则同样适用于整套系统交付，不依赖复制入口。同一产品沿用已确定配置，不随机选择；单次 Demo 选择不自动改全产品默认值。
- 接入契约与当前覆盖见 [COMPONENT_CONFIGURATION.md](COMPONENT_CONFIGURATION.md)。

## 2026-09-18 — 分段选项与 Brand Mention

- Segmented Choice hover 统一使用颜色变量 bg-hover（--aisee-color-semantic-bg-hover），未选项不额外增加灰色描边；选中项保留语义填充和深色描边，hover 叠加同一变量。
- Brand Mention 使用已有 TagInput 接受多个品牌 / 话题，收起不丢标签。
- 可折叠 Card 收起时移除 header 底部内容间距，标题、右侧标签和箭头垂直居中。

## 2026-09-18 — 通用卡片嵌套层级

- 复杂描边（含白色内框、多层边缘或强调阴影）的卡片只用于外层；任何场景下内部都不再重复复杂描边，不限于 Create Post 或弹窗。
- 内层优先浅灰纯色填充，或白色填充 + 浅色单描边，减少重复边框造成的臃肿感。
- section Card 嵌套时自动简化为白底浅描边、8px 圆角、12px 内距、无白色内框和阴影。独立外层 section 保留原有外观，功能与状态不变。
- 用户参考：Figma 77:16889；内部 Post setup 见 77:16984。

## 2026-09-15 — Common 文档与 Dropdown 精确样式

- Brand / Common 的现行文档内容使用与 Current 组件页一致的 640px 居中结构：标题和描述在白色详情卡上方，详情卡内展示 Overview / Examples 等具体内容；上一项 / 下一项箭头位于标题区右上角，不能压在卡片内容或元信息上。
- Dropdown 菜单中相邻选项的垂直间距统一为 4px；组件源码与详情页全部示例必须同步，不能只修其中一处。
- Filter 组合以 Figma `38:82016` 为权威：面板约 320px 宽、1px `#111` 描边、16px 圆角、白底；面板内垂直间距 12px，上 17px、左右 17px、下 25px；分隔线为 8% 黑。
- Filter 未选项高 24px、圆角 8px、背景 `#FAFAFA`、1px `rgba(17,17,17,.06)` 描边、Karla 12px / 500、文字 `#3D3D3A`；选中项为 `#111` 背景和白字。不得改成胶囊形或自行替换颜色。
- Dropdown 详情页按可复用能力展示 Single-select、Multi-select、Searchable multi-select、Combobox、Action menu、Grouped select 六类核心类型，不使用 Reporting period、Publish channels 等业务功能命名。Filter panel、Search + action、Grouped account 等归入下半区组合示例，并保留当前组合的真实交互和参数说明。
- Dropdown Demo 的 Composition 选择器使用项目自定义触发器与菜单，不使用浏览器原生 `select`；箭头复用 Sidebar 的 `line_chevron-up.svg` 线性图标并随展开状态旋转。
- Dropdown 的 Fluid Hover 已从预览同步为 Current 默认行为：菜单内只使用一个共享的 5% 黑色高亮层，跨 4px 间隙连续跟随最近可用选项；打开或尺寸变化时一次缓存选项位置，指针移动期间不再反复查询 DOM 或读取布局，空隙命中按动画帧合并；禁用项不参与，键盘焦点同步，点击间隙选择当前高亮项，并遵循 reduced-motion。React API 可用 `fluidHover={false}` 关闭，用 `gapClick` 控制间隙点击。
- Dropdown Variant Playground 顶部的参数为“当前预览说明”，不得伪装成可点击按钮；Grouped account 中 `Show icons` 是真实 Toggle，打开显示头像和平台图标，关闭后只保留文字、状态和行操作。
- Dropdown 菜单必须作为浮层脱离文档流；展开和收起不得改变 Variant Playground、组件卡片或后续内容的高度与位置。Fluid Hover 容器不得覆盖菜单自身的绝对定位。
- Dropdown 富选项的独立行操作使用 `item.action`。24px 操作按钮不常驻：默认隐藏，行 hover 或 `focus-within` 时以灰底灰描边出现，按钮自身 hover 后才使用 Post 黄色；不得把黄色 hover 状态当默认样式。
- Dropdown 的 Icon action menu 用于频道或条目操作：保留 Figma 的紧凑矩形菜单、16px 左侧线性图标与单行标签；普通操作使用正文色，只有 Delete 使用语义危险色；操作图标必须来自 `@stemui/icons` 的明确导出，HTML Demo 使用 `assets/stemui/` 只读快照，不得手绘或用通用占位图标替代。
- Common 页面中的说明卡使用完整灰色描边和左侧品牌强调线；Logo 示例按用途拆成独立有描边的样本卡，避免无分组的松散排版。
- Components / Content & Status / Avatar 分为两套不可混用的头像库：22 个方形头像用于网站用户注册时按稳定用户 seed 分配；24 个带灰色描边的圆形头像仅在发布 Post 且无法抓取用户社交媒体头像时按稳定社交账号 seed 兜底。资产以 Figma `98:180630` 为权威；Generated extensions 未确认前不进入自动分配资源池。
- Empty State 插图节点 `42:11910` 表示“暂无报告记录”，名称统一为 `No report data`，不能作为成功状态使用；对应示例说明当前没有报告数据，并以 `Add product URL` 引导用户发起分析。

## 2026-09-11 — 用户追加的通用组件与字体规则

- 设计系统所有页面统一 Karla，包括 Brand、Legacy 展示、控件、表格、代码提示与 Score Gauge。覆盖下方早期字体分域及 Digital Numbers 例外；保留历史字体资产不代表继续使用。
- Steps 区分纯静态流程与动态进度；动态每一步包含初始、进行中、完成状态，只有进行中的步骤闪烁。思考明细可选。教程步骤使用独立 TutorialSteps 通用组件，放在同一 Steps 页面。
- EmptyState 的插图、标题、描述和 action 可自由组合；缺失槽位不产生空容器或额外间距。按 Figma 42:11679 使用原始 SVG；用户明确去除重复的 No event alternate 后，保留 14 个独立插图。完整/无 action 示例可独立选择插图并联动场景文案。
- ToggleSelectionGroup 首次开启默认全选可用项，关闭只禁用并保留，重开恢复上次选择；已保存空选仍须恢复空选。
- 来源 Badge 使用灰色纯色填充无描边；状态 Badge 使用低饱和填充加统一灰色描边，二者均支持 icon + label。
- 使用场景说明统一使用白底和与示例卡片相同的完整灰色描边；3px 橙色强调线贴合卡片内部左侧并贯穿上下边缘，偏移均为 0px。
- Tag Input 标签和输入框横向同排；空间不足在内容区域横向滚动，保留添加按钮。
- 联动多选使用 Figma #CFFF29 选项底色、#111 勾选框及原始白色 SVG 对勾，不继承基础 Checkbox 的旋转和模块色。
- Demo 下拉沿用 Sidebar 同形箭头，并保持左右 padding 一致。
- 用户明确授权删除 Tag、Badge 与 Stat Card 的 Legacy 独立页面；其余 Legacy 资产不在删除范围内。
- 上述为用户确认的需求规则，新增视觉实现仍待用户验收，不等于已批准发布 main。

## 2026-08-13 — 字体分域

- **Homepage / 官网**：只使用 Karla + Gotu 两种字体。
- **dApp / UI Kits — Webapp**：只使用 Karla 一种字体；页面标题、弹窗标题、数据、代码提示与 Score Gauge 均不引入第二字体。
- 因此 `aisee-dapp-design.v6.md` 中关于 JetBrains Mono 和 Digital Numbers 的例外说明，被本决策覆盖。
- 历史原型允许保留在仓库中供追溯，但进入现行组件、令牌或 UI Kit 前必须按本决策更新。

## 2026-08-13 — 旧系统更新策略

- 本仓库是旧 Design System 的更新，不是精简重建。
- v6 有同名或同职责规范时，用新版覆盖旧版。
- v6 没有覆盖到的组件、图标、动画、交互、页面和资产继续保留。
- 历史内容不得因“当前发布包未使用”而直接删除；需要废弃时先标记 deprecated，再通过独立 PR 评审。

## 2026-08-13 — Figma 功能页面版本规则

- **5.6 只是当前最新的功能版本页面**，不代表整个 Figma 文件或所有产品功能都统一升级到 5.6。
- 增加新功能或独立的新需求时，新开一个功能版本页面。
- 已有功能追加新需求、状态或交互时，不新开页面；继续在该功能原版本页面维护，并把最新设计增加在页面上方。
- 每个设计区块上方的**黑色标题框**是该区块更新内容与更新时间的权威标记。判断日期和更新主题时，以黑色标题框文字为准；页面名、文件名和版本号只用于定位，即使名称没有修改也不能据此判断新旧。
- 同一功能页面内先按黑色标题框的日期排序；日期更新的标题框优先。若日期相同，则以画布位置更靠上的区块为新。只有标题框缺失或无法辨认时，才降级参考页面名、文件导出时间与画布位置，并明确记录不确定性。
- 因此判断实现依据时应先定位对应功能页面，再读取黑色标题框及其下方设计；不能用 5.6 全局覆盖其他功能页面。
- 原页面中未被最新内容替代的设计继续保留，供上下文与历史追溯。

## 2026-08-18 — Figma 5.7 托管自动发布

- 本地 Figma 源已更新到 **5.7**，新增“托管自动发布 / Automation”功能页。
- Automation 是新的 WORKFLOWS 功能，必须与 INTEGRATIONS 分开，不归入 Connections / Search Console。
- 5.7 仍是功能页版本，不是整个 Figma 文件的全局版本；其他功能继续按各自页面的黑色标题框和设计区块判断。

## 2026-08-13 — Webapp UI Kit 采用 5.5 功能布局

- UI Kits — Webapp 的当前 Shell、信息架构和 Overview 排版以 Figma 5.5 功能页为准。
- 顶部使用官方 aisee 完整 wordmark；禁止代码或 CSS 重画 Logo。
- 旧的顶部 Analysis / Post Agent / Engage 三模块切换不再作为当前 Shell。
- 当前侧栏结构为 Project / Overview，以及 Growth Loop 下的 Analysis、Growth、Engage、Post 分组及其子项。
- 旧 Dashboard、Calendar、Channels、Post Agent、All Posts 仍作为历史内容保留，但不得继续充当 UI Kit 当前预览入口。

## 2026-08-13 — 设计系统与 v6 文档差异处理

- 当前 canonical 设计文档是 `docs/aisee-dapp-design.v6.md`。
- 每次设计系统更新都必须对照 `docs/aisee-dapp-design.v6.md` 做一致性检查。
- 发现实现与 v6 文档不一致时，先记录差异并通知产品/设计负责人，由负责人决定更新文档还是更新系统。
- 在确认前不得擅自改写 v6 文档，也不得把未确认的实现差异标记为正式规范。
- 文件名与文档内部版本号不一致时不得静默覆盖；先在差异报告中说明，再由用户决定更新文档还是更新 Design System。

## 2026-08-21 — Components 信息架构与详情页

- Components 导航只负责查找真实存在的组件；Default、Hover、Focus、Disabled、Loading、Primary、Secondary、Size、Spacing 等 variants/states/specs 放在组件详情页内部。
- `dApp v6 Components` 是 Overview，不与具体组件页处在完全相同的层级；Overview 与详情页必须使用同一套真实组件样式和交互。
- `Button` 是独立组件入口，不再包一层 Actions。只有多个真实组件时才显示分类；不创建 AISEE 中不存在的组件或空分类。
- Inputs & Controls 可包含 Input、Tag Input、Select / Dropdown、Toggle；Navigation 可包含 Tabs、Sidebar Navigation；Content & Status 可包含 PlanCard、Badge 与明确标记的 Legacy 状态组件。
- Current 组件默认不显示醒目的 `CURRENT`；历史组件标记 `Legacy — use the current component instead.`。Legacy 可以从当前导航隐藏，但未经用户确认不得删除文件和历史内容。
- 组件详情页按实际资料使用：组件名与描述 → Examples → Variants → States → Usage → Do / Don't → Specs → Product Preview。资料缺失时写 `Not documented yet`，不编造 token 或规范。
- Button、Input、Dropdown、Toggle、Tabs、Dialog 等真实示例必须可点击、聚焦、切换并查看状态，不能只使用静态截图代替交互。

## 2026-08-21 — 组件与页面统一视觉规则

- app / dApp / webapp UI 只使用 Karla；Homepage / Brand 可使用 Karla + Gotu。
- Current 组件页主内容固定宽度 640px、居中，窄屏使用 `max-width: 100%`；页面/组件标题与内容左对齐，所有 Examples、States、Usage、Specs 等内容区使用 5% 黑色描边的内容框，排列不下时自动换行或横向滚动。Legacy 页面保持原样。
- 区块标题使用 Karla 16px / 500；说明文字使用 14px / 400、`rgba(17,17,17,.6)`；标题与说明间距 8px。
- 常规卡片描边使用 `rgba(17,17,17,.05)`；主文本使用 `#111111`；次要文本使用 `rgba(17,17,17,.6)`。
- Sidebar 展开宽度 224px、收起宽度 58px；收起时只显示 icon，并保留当前页面、分组展开和收起状态。导航文字单行显示，不换行。
- 每个功能页面主内容区第一块固定为 Page Banner，以 Figma `66:122927` 为基准：高 76px、圆角 16px、白色 4px 描边环、44×44px 白色 icon 容器、24×24px leaf icon、Karla 20/500 标题与 14/400 描述；右侧按功能放按钮、Toggle、统计或留空。
- Page Banner 和功能页面必须与 Analysis、Growth、Engage、Post、Verify、Connection 等实际功能对应，不把 Overview 结构复制成所有页面。
- 搜索框、Input 与 Dropdown 的 hover/focus 沿用 Aisee lime `#CFFF29`；深色 Button hover 转为当前模块品牌色，带品牌色的 Button hover 转为深色。
- Input 提供真实的 Default、Hover、Focus、Disabled、Error；Select / Dropdown 覆盖单选、多选、可搜索多选、Combobox、操作菜单和分组选择。Filter panel 等设计稿实例属于组合示例，不作为基础类型命名。菜单与触发器保持设计稿间距，选中项和 hover 使用浅黑透明填充。
- 页面灰色背景保持偏浅；卡片和灰色展示框四周必须留出间距，组件不能贴边。

## 2026-08-21 — Dialog 与事件反馈

- Dialog、Confirmation Dialog、Event Dialog 和 Toast 使用真实 SVG 与明确事件语义，不用模糊位图或临时绘制 icon。
- 所有弹窗标题统一为 Karla 20px / 500，不使用 600 或 700；描述为 14px / 400、`rgba(17,17,17,.6)`。
- Event Dialog 覆盖 success、error、subscribe、upgrade、insufficient-balance、locked 等语义，结构为事件 icon、标题、描述、内容扩展区和操作按钮区。
- Event Dialog 默认不显示右上角关闭 icon，通过 Cancel、Maybe later 等语义按钮关闭；特殊勾选、额度或说明内容放入内容扩展区。

## 2026-08-21 — Logo、Icon、插图与动画资产

- 顶部使用官方 AISEE logo / wordmark，不用代码或 CSS 重画 Logo；logo mark 目标约 25×26px，wordmark 约 24px 高、Karla 500。
- 业务 icon 只消费 `@stemui/icons` 或已经确认的本地 SVG，不修改 `stemui` 仓库，也不把 AISEE 预览同步到该仓库。
- Banner 优先使用 `draw-*` 插图；`platform-*` 只作平台标识；侧边栏和按钮操作优先使用真实 `line-*` / `fill-*` 功能 icon。
- Illustration 只用于 Banner、空状态或需要留白的插图区域，不充当侧边栏功能 icon；未找到准确功能 icon 时保持隐藏，不用随机 icon 补位。
- 禁止用模糊截图、低分辨率 PNG、外部图片或临时绘制 SVG 替代已有真实 SVG。开发期占位符必须明确标记并在发布前替换。
- Logo 动画保持透明背景；白色只属于眼白路径，禁止在 SVG 中添加外层白色背景矩形。
- Loading 动画绿色源视频位于 `/Users/ccbakala/Documents/ui/aisee/Component/gif/1_1080_N.mp4`；Engage / Post 如需黄色版本，应保持同一动画逻辑制作颜色变体，不修改源视频。
- Gotu、Karla 等字体保存在仓库 `fonts/` 或明确的 `uploads/` 资源目录，并纳入版本控制核对。

## 2026-08-24 — Brand 当前分类与 Web 产物

- Brand 当前按 AIsee 功能模块组织：Homepage、Common、Overview、Analyze、Growth、Post、Engage、Verify、Automation。
- 全局共用的插件安装与更新教程归入 Common；只有 Automation 功能自身的页面、流程和说明归入 Automation。
- Legacy 页面在页面标题旁使用轻量灰色小写 `legacy`；侧边栏不重复显示 Legacy 标签，标题栏右侧不再显示重复的大写 `LEGACY`。
- Automation 是独立 WORKFLOWS 功能，与 INTEGRATIONS 分开，不归入 Connections / Search Console。
- Web 产物默认元数据为 `source: "ChatGPT"`、`surface: "Web"`、`designStatus: "Draft"`；`designStatus` 只允许 `Draft` 或 `Selected`，未经用户明确确认不得改为 `Selected`。
- 每个 Web 产物必须包含 HTML 与 `meta.json`，PNG 预览可选。

## 2026-08-24 — 预览与发布验收

- 本地 HTML 预览通过 HTTP 服务打开，不以 `file://` 双击结果判断内容是否丢失。
- 发布团队预览时部署完整静态站点，不只发送单个 HTML；AI 交付同时提供 canonical Markdown、明确 token/组件契约、真实本地 SVG 路径和可访问预览。
- 私有 GitHub 仓库不等于公开在线预览；团队预览站点需可访问，同时仓库仍可保持私有。
- GitHub Pages 由共享开发分支 `ai/desktop/design-system-current` 自动部署，作为团队始终可访问的最新 Demo；每次推送必须先通过完整检查，再发布到固定 Pages URL。`main` 继续作为通过 PR 确认的正式稳定代码，不直接承担开发预览更新。
- 每次开发预览部署后检查 Actions / GitHub Pages，并实际打开线上 Demo 验证域名、HTTPS、相对路径、字体、SVG、视频与交互。

## 2026-09-10 — 组件更新提示、组件导航与新增控件

- Design System 目录中本轮有内容更新的具体功能条目，在标题紧邻位置显示 Figma Campaigns 同款 `NEW` 胶囊；标记只由条目 `updated: true` 显式控制，不根据 Git 提交时间推断。
- `NEW` 采用 Fluid Functionalism 的静态清单行为：点击条目后不消失、当前选中页仍显示、刷新后仍显示，不使用 localStorage 或按用户/组件版本记录已读；仅在后续代码移除 `updated` 标记时消失。
- Web Brand registry 允许使用相同的 `updated: true` 字段；未声明时不显示，避免旧内容和仅重建文件被误标为更新。
- 组件内页 640px 标题区右侧提供上一项 / 下一项箭头，顺序与完整侧边栏目录一致；hover/focus 提示目标条目名称，边界方向禁用。Portal 外层页头不重复放置。
- Tabs 保留原下划线型，并新增 Figma 对应的图文、纯文字（可带数量）、纯图标 segmented 组合，以及平台 Logo + 文字的下划线组合；默认 API 保持向后兼容。
- Sidebar Navigation 是 Current、数据驱动的可复用组件；必须覆盖条目 hover / selected、单项子树展开收起、整个侧边栏展开收起、键盘与 ARIA 状态，不能只提供设计稿的一次性静态切图。
- Sidebar Navigation 的父级功能通过整行点击展开/收起，不显示行尾下拉箭头；收起态点击功能 icon 继续使用 flyout 显示子功能。
- Sidebar Navigation 不使用自绘 cursor：展开态仅在开合按钮 hover 时使用平台原生 `w-resize`，强调向左收起；收起态整条 rail 使用平台原生 `e-resize`，强调向右展开。按钮视觉继续使用已确认的 Figma icon。
- Sidebar Navigation 的单色功能 icon 与文字共用 `currentColor`：默认均为 `#3D3D3A`，hover / selected 均为 `#111111`；Google、Bing 等多色品牌 Logo 保持官方颜色，不参与统一染色。
- Tree Nav 是独立 Current 组件，默认直接展示一组相关叶子选项与层级引导线，不在列表内部重复页面已经提供的分组标题；仅在 Tree Nav 必须自行承担分组命名时才使用父级展开。Sidebar Navigation 展开态必须组合 Tree Nav，并额外负责多个产品分组、宽度收起、账号 Footer 和收起态 flyout。
- Checkbox 只在状态由未选中切换为选中时播放一次短促 bubble 扩散反馈；初始选中、取消选中、禁用态不播放，且必须遵循 `prefers-reduced-motion`。
- Notification 使用 Figma `77:17878` 的 32px 实心铃铛、362px 面板与消息条目：默认按钮为 `colour/bg/hover`，hover / focus 切换 `colour/bg/yellow-mid`，未读标记使用 `colour/feedback/wrong`。新通知到达时白色铃铛摆动且徽章数字滚动；正式组件由外部传入的未读数量增加自动触发，推送 / 轮询由产品接入；Reset demo 恢复通知时显式重播两种动画，包括数量相同的情况；hover / focus 只摆动白色铃铛，外层按钮与黑色圆底始终不动。面板统一支持 All / Unread、全部已读、条目已读、操作、错误详情与 ready / loading / empty / error 状态，并遵循 `prefers-reduced-motion`。
- Current 页面中新增或更新的内容区块标题紧邻显示 Campaigns 同款 `NEW` 胶囊；内容级标记必须显式添加，不能把所有标题按时间自动标记。
- 每次完成一批用户可见更新，必须在根 README 的“最近更新”中按日期使用 3–8 条简洁内容说明更新内容与用户可见结果；README 只保留最近 3 批，更早记录归档到 `CHANGELOG.md`。“v6 主要更新”只保存长期有效的版本级变化，不能替代批次更新清单。影响当前规范时，同步维护组件页、Overview、`Copy for AI`、`NEW` 标识、相关设计资源和交付文档；纯重构、格式化、内部测试等不可见调整不进入 README。
- Dropdown trigger 与所有菜单选项统一使用 Karla 14px / 20px；选项字号不依赖外围页面继承。
- Tag Input 是独立 Inputs & Controls 组件，不扩张基础 Input API；输入时在最前方显示虚线预览，Enter 或 Add 提交为输入框内标签，空输入时 Backspace 删除最后一个标签。
- Toggle 保持 AISEE 唯一标准 24×16px track、10×10px 黑色 thumb 与模块主色，不替换成外部组件尺寸；交互采用弹性位移、hover 横向伸展、press 压缩和 label 状态过渡，并尊重 reduced motion。

## 2026-09-14 — Dialog、Tabs 与 Overview 快捷入口

- Dialog 以结构作为组件分类：Shell 为 Standard、Centered、Split；内容为 Form、Choice、Details、Summary；Create、Edit、Upgrade、Manage 等功能名只用于场景示例与业务文案。
- Split Dialog 只用于同一项短任务内的局部多区段；需要持续导航或长时间编辑时使用页面或 Drawer。破坏性的二选一操作继续使用 Confirmation Dialog。
- 平台 Tabs 提供 `platformLabelDisplay="auto" | "active" | "all"`，默认 `auto`：全部 Logo + name 的真实宽度能放下时全部显示，空间不足时只展开当前项名称，不能把名称压缩或切断。`active` 与 `all` 只用于需要固定策略的特殊页面，显式 `all` 在不足时横向滚动。
- Components Overview 的 Current 标签是完整组件页的快捷入口。嵌入门户时在当前 Design System 内打开目标页并同步侧边栏；通过侧边栏 Overview 或浏览器返回键回到总览。


## 2026-09-17 · NEW 日期规则

- 文档更新标记统一以 Asia/Taipei 日历日期计算：更新当天算第 1 天，第 1–7 天保留，第 8 天零点隐藏（2026-09-23 恢复为 7 天）；已有内容沿用最初添加 NEW 或最近一次真实内容更新的登记日期，修改期限、刷新或重新构建不续期，只有真实内容更新才重新计时。
- 侧栏、README、组件详情与 Open HTML 独立页共用 `assets/update-badges.js`。页面跨午夜、后台恢复、动态组件渲染时同步更新；不依赖访问次数或 localStorage，不因重新构建重置日期。
- 内容更新时维护该文件的日期表；Brand metadata 使用 `updatedAt`（YYYY-MM-DD）。缺失、非法及未来日期不显示 NEW。业务示例自身的 NEW 徽章不属于文档更新标记，不参与过期。
- Toggle Playground 的变量选择直接使用正式 Dropdown 组件，触发框、弹出菜单、键盘操作与动效保持同源，不使用原生 select 菜单。

## 2026-09-20 · Notification 单组件交付边界

- 用户已确认旧公开交付能够接入，但其内容过多。Copy for AI 只交付铃铛和未读数字动画，不复制状态展台、演示操作、模拟数据、通知面板或面板配置。
- 动画沿用 Current NotificationBell；产品传入真实 count / onClick，默认数字徽章。dot 仍是可选产品 API，但演示开关不作为复制配置。
- 交付仅限生产需要的源码、局部样式、入口和类型声明，文件数不设上限；Bell SVG 内联，沿用 token 默认值，继承产品字体。不打包全局 reset、整套 token、Karla 或面板插图。
- 后续已推广为所有组件统一的显式生产清单、白名单配置和 latest 指针。保留设计系统完整 Demo；Production 不可依赖 Demo。依据见 [生产交付契约](PRODUCTION_DELIVERY.md)。

## 2026-09-21 · Production delivery 契约补充

- 已复制的稳定 latest.json 地址在执行时解析最新已发布生产版本；已安装源码不会自动更新。复制时的公开版本检查只是可用性校验，不将短指令固定为版本快照。
- 每个组件显式声明 dependencies / compatibility，安装说明读取这些值，不额外统一强制 React/Node 版本。Node 安装器环境与组件浏览器运行环境区分。
- 文档规范使用“所有已登记组件”，实际组件数与验收数由报告动态输出。
- CSS 按 selector/value AST 和依赖图计算闭包，包括伪类/伪元素、变量默认值及条件覆盖、keyframes、media/supports/reduced-motion，不能只按 class 字符串切片；可达但未登记或未解析的依赖阻止构建。

## 2026-09-21 · 通用 Confirmation Dialog

- 在现有 ConfirmationDialog 上扩展可选 notices 和 children，不创建平行弹窗。无 notices 时保留原简洁确认。
- Notice 只声明 positive / warning 语义、标题、说明和可选宿主图标；自动化、队列数量与回复等业务内容仅为 Demo 示例。
- 业务项目控制 open、onClose 和 onConfirm；组件不自行执行业务操作、关闭确认成功状态或插入 Toast。
- 生产交付遵循统一 manifest：必要源码、Button、局部样式闭包和关闭图标；不含场景数据、业务插图、Toast、字体或展示页。
- 标题沿用系统已确认的 20px / 500；Figma 72:56945 用于影响卡片结构、配色与间距。

## 2026-09-21 · Thinking Indicator

- 参考 Fluid Functionalism ThinkingIndicator 的圆形/无限符号变形、文字扫光和轮换，使用原生 SVG + 局部 CSS 适配 AISEE。无需引入整套 shadcn、Inter 字体、SizeProvider 或动画库。
- AISEE 预览字体为 Karla，默认 14/22、紧凑 12/18，字重 500、语义次级文字色；生产继承宿主字体。
- labels 是可本地化的装饰性等待文案，不是实际进度或模型推理记录；真实任务进度使用 Steps。业务项目决定显示与卸载时机。
- 系统 reduced motion 停止 SVG、扫光和文字轮换，读屏保持单一稳定状态；文字轮换不触发反复播报。
- Copy for AI 交付组件与局部样式完整闭包，选项只包含 showIcon / size，不包含 Demo 控件、字体和展示布局。

## Host Project Compatibility · 2026-09-21

安装前先识别宿主已有 UI 库与自定义 primitives，按组件清单的 `integrationMode / primitives / preserve` 优先复用兼容底层能力；不为单个组件安装整套 UI framework。保留 AISEE 视觉、状态、动画与行为；样式局部作用域，不覆盖宿主 theme/provider/global styles。不兼容时退回交付的 standalone 实现。识别和适配由编码 AI 在目标项目执行，解包安装器不会自动改造框架。完整规则见 [Host Project Compatibility](PRODUCTION_DELIVERY.md#host-project-compatibility)。

## 2026-09-21 · Automation Runner

- Automation Runner 是挂载在应用根布局、独立于路由内容的常驻浮层；页面切换不卸载。关闭只隐藏窗口，不能停止或修改真实自动化任务。
- 组件支持 default、expanded、minimized 三种受控或非受控状态；标题或箭头展开、横线最小化，点击最小化卡片任意位置恢复 default，绿色眼睛作为键盘可访问的恢复控件。标题、说明、详情行和返回操作由宿主业务传入，Demo 路由和模拟状态不进入生产交付。
- 使用 Figma 72:55666、72:56017、72:55315 的几何与原始图标；默认 332×64、展开约 332×252、最小 74×64。
- 底部弹性出退场、眨眼和眼珠跟随鼠标是该浮层的确认交互。悬停卡片时眼睛瞪大并左右慌张扫视两次，同时按指针方向轻探；只有进入绿色小怪兽时播放一次软胶回弹，不循环抖动。减少动态效果时停止扫视和位移，只保留静态放大的眼神反馈，状态和控制保持可用。
- 整张卡片任意位置均可拖拽并限制在视口内；超过移动阈值后不触发展开、最小化、关闭或操作按钮。拖拽手柄另支持键盘方向键；关闭后的重新唤起入口由宿主应用提供。
- Copy for AI 接入已有同类浮层时必须原位增量合并，不能创建第二个 Runner。只有现有眨眼和眼珠跟随行为已正确兼容时才保留；除此之外，卡片出退场、三种视图、A+D、拖拽、视口限制和 reduced-motion 均以当前交付为准，同时禁止重复 DOM、keyframes、状态和全局 pointermove 监听。
