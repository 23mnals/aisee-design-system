# Team Decisions

此文件记录团队对基础规范的后续澄清。发生冲突时，顺序为：本文件最新决策 → 当前 dApp spec → 历史文件。

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
- Inputs & Controls 可包含 Input、Select / Dropdown、Toggle；Navigation 可包含 Tabs、Sidebar Navigation (Legacy)；Content & Status 可包含 PlanCard、Tag 与明确标记的 Legacy 状态组件。
- Current 组件默认不显示醒目的 `CURRENT`；历史组件标记 `Legacy — use the current component instead.`。Legacy 可以从当前导航隐藏，但未经用户确认不得删除文件和历史内容。
- 组件详情页按实际资料使用：组件名与描述 → Examples → Variants → States → Usage → Do / Don't → Specs → Product Preview。资料缺失时写 `Not documented yet`，不编造 token 或规范。
- Button、Input、Dropdown、Toggle、Tabs、Dialog 等真实示例必须可点击、聚焦、切换并查看状态，不能只使用静态截图代替交互。

## 2026-08-21 — 组件与页面统一视觉规则

- app / dApp / webapp UI 只使用 Karla；Homepage / Brand 可使用 Karla + Gotu。
- 组件页主内容固定宽度 960px、居中、左右内边距 24px；页面/组件标题与内容左对齐，预览标题栏 padding 为 12px 24px。
- 区块标题使用 Karla 16px / 500；说明文字使用 14px / 400、`rgba(17,17,17,.6)`；标题与说明间距 8px。
- 常规卡片描边使用 `rgba(17,17,17,.05)`；主文本使用 `#111111`；次要文本使用 `rgba(17,17,17,.6)`。
- Sidebar 展开宽度 224px、收起宽度 58px；收起时只显示 icon，并保留当前页面、分组展开和收起状态。导航文字单行显示，不换行。
- 每个功能页面主内容区第一块固定为 Page Banner，以 Figma `66:122927` 为基准：高 76px、圆角 16px、白色 4px 描边环、44×44px 白色 icon 容器、24×24px leaf icon、Karla 20/500 标题与 14/400 描述；右侧按功能放按钮、Toggle、统计或留空。
- Page Banner 和功能页面必须与 Analysis、Growth、Engage、Post、Verify、Connection 等实际功能对应，不把 Overview 结构复制成所有页面。
- 搜索框、Input 与 Dropdown 的 hover/focus 沿用 Aisee lime `#CFFF29`；深色 Button hover 转为当前模块品牌色，带品牌色的 Button hover 转为深色。
- Input 提供真实的 Default、Hover、Focus、Disabled、Error；Select / Dropdown 至少覆盖单选，并按设计稿提供多选、Filter、Input 型下拉。菜单与触发器保持设计稿间距，选中项和 hover 使用浅黑透明填充。
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
- Legacy 页面在页面标题旁使用轻量灰色小写 `legacy`；侧边栏不重复显示 Legacy 标签，标题栏右侧不再显示重复的大写 `LEGACY`。
- Automation 是独立 WORKFLOWS 功能，与 INTEGRATIONS 分开，不归入 Connections / Search Console。
- Web 产物默认元数据为 `source: "ChatGPT"`、`surface: "Web"`、`designStatus: "Draft"`；`designStatus` 只允许 `Draft` 或 `Selected`，未经用户明确确认不得改为 `Selected`。
- 每个 Web 产物必须包含 HTML 与 `meta.json`，PNG 预览可选。

## 2026-08-24 — 预览与发布验收

- 本地 HTML 预览通过 HTTP 服务打开，不以 `file://` 双击结果判断内容是否丢失。
- 发布团队预览时部署完整静态站点，不只发送单个 HTML；AI 交付同时提供 canonical Markdown、明确 token/组件契约、真实本地 SVG 路径和可访问预览。
- 私有 GitHub 仓库不等于公开在线预览；团队预览站点需可访问，同时仓库仍可保持私有。
- 每次 `main` 更新后检查 Actions / GitHub Pages，并实际打开线上 Demo 验证域名、HTTPS、相对路径、字体、SVG、视频与交互。
