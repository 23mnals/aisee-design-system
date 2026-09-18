# 把 AISEE HTML 交给其他 AI 的使用说明

## 结论

其他 AI **通常能读取上传 HTML 中直接存在的文字、CSS、HTML 结构和内联 JavaScript**，但这不等于它一定能读取整个设计系统，也不等于它会自动按照 demo 精确实现。

能力取决于接收平台：

- 能解析附件但不执行页面的平台，可以读取源码，却看不到交互后的状态。
- 不支持相对文件或沙箱运行的平台，无法取得 HTML 外部的字体、图片、CSS、JS、React 源码及其他组件页。
- 本地 `file://`、`localhost`、私有仓库链接和登录后的 Figma 页面，对另一平台通常不可访问。
- 只给截图或单个 demo，会让模型把示例内容误当组件规则，或漏掉 hover、focus、disabled、响应式与无障碍状态。

因此，“给一个 HTML”只能作为视觉和源码参考，**不能保证实现一致**。最可靠的交付是公开 HTTPS 预览或完整仓库/ZIP，加上权威规范和明确提示词。

## 变量配置与目标设计匹配

所有组件均遵循 README 的 [AI 选择变量与复用组件](../README.md#ai-选择变量与复用组件) 规则。Copy for AI 在点击时附加当前配置；多个示例分别标明 scope，不能合并为一个组件。配置的来源、适用范围、扩展要求见 [COMPONENT_CONFIGURATION.md](COMPONENT_CONFIGURATION.md)。

直接交付整个设计系统时也须：读取目标截图或可访问链接，优先复用合适的 Current 组件；明确用户选择优先，否则跟随目标设计、产品既有配置、文档默认值。同产品记录并沿用组件配置。静态截图不能证明隐藏交互；链接未读取成功不得声称已经匹配。复制示例不会自动建立产品级默认配置。

## Button 图标接入

- `icon` 传入单个语义图标，`showIcon` 控制是否显示，`iconPosition` 默认 `left`；`leadingIcon` / `trailingIcon` 可组合左右双图标，单个 `icon` 优先于这两个插槽。
- 一般操作（View Post、Bulk schedule）图标在左；前进操作（Go execute、View replies）和 AI 生成（Generate Post）在右。由业务明确传位置，不根据按钮文案自动猜测。
- Button 页面中 Icon variants 位于 States 前，标题右侧为 Show icon 与互斥的 Left / Right 选项；卡片只展示按钮。States 直接用按钮文字标尺寸，下面分别为 With icon 和 Disabled。
- 图标容器 16px、文字间距 6px；关闭开关时移除容器和间距。图标为装饰，按钮可访问名称由文字提供。
- 单色 SVG 使用 `currentColor` 或 mask 跟随 hover / focus 文字颜色，多色图标保留原始色。继续复用 Button 原有双向填充动画、禁用态与焦点规则。
- 本轮参考节点：`77:17106`、`38:69084`、`78:121895`（文件 `LLvI9vd66VLNuAltAWJFJw`）。本轮只提取其中按钮，完整任务列表与回复卡片尚待明确范围。

## 单组件任务（推荐）

如果只需要 Button、Input、Tabs、Dialog 等一个 Current 组件，不必上传整套 Demo：

1. 在主门户打开对应的 Current 组件页。
2. 点击右上角双星图标的 `Copy for AI`。
3. 把复制的组件 Prompt、目标页面和真实业务内容一起交给 AI。
4. 要求 AI 对照 Current Demo 检查适用状态与动画。

每个组件 Prompt 都包含该组件的用途、接入方式、公开 API、交互、视觉边界、无障碍和 AISEE 通用规则。它适合交给 AI 编码工具，但不是可安装的组件包。人类开发者仍需要 `@aisee/design-system` 工作区包或对应源码；没有 Design System 时，应同时打开组件页的 Open HTML 作为可运行参考。Demo 中的示例文案、数据、图标和插图不是规定资产，接收方应按真实功能替换。Overview 和 Legacy 页面不提供该按钮，避免把汇总或历史内容误当成 Current 实现。

## Card 分区组合

Card 新增 `variant="section"`，将标题、输入 / 输入组、选项、长文本、混合表单、指标总览、账号列表、可选设置与预览统一为内容插槽。支持 description / headerAction / footer / collapsible；CardGrid 提供响应式列布局，Textarea 沿用 Input 的状态规范。结构与 Figma 来源见 [SECTION_CARDS.md](SECTION_CARDS.md)。

## 推荐交付包

至少同时提供：

1. `aisee-design-system-preview.html`，最好是可访问的部署 URL。
2. `docs/TEAM_DECISIONS.md`。
3. `docs/aisee-dapp-design.v6.md`。
4. `src/tokens/color-architecture.json`、`src/tokens/tokens.json`、`src/styles/components.css` 与 `src/components/`。
5. 目标页面的内容、信息架构、状态和响应式要求。

主 HTML 内已嵌入 `<script type="application/json" id="aisee-ai-contract">`，让支持源码解析的平台快速找到来源优先级、基础令牌和实现边界。但 JSON 只是索引，不能替代完整文件。

## 给其他 AI 的提示词模板

```text
请依据我提供的 AISEE Design System 实现目标页面。

规则优先级：
1. docs/TEAM_DECISIONS.md
2. docs/aisee-dapp-design.v6.md
3. src/components、src/styles/components.css 和标记为 Current 的组件页
4. 与目标功能相关、带日期黑色标题框的 Figma 设计区块
5. Legacy 页面仅用于没有 Current 对应项时参考

必须：
- 保留目标页面的内容和信息架构；
- 复用现有 Current 组件与 tokens，不重新猜测颜色、字号、圆角和间距；
- 颜色只使用 `--aisee-color-semantic-*`；不得在页面写 HEX，也不得直接使用 `--aisee-color-primitive-*`；
- dApp 只使用 Karla；
- 主内容区第一块必须是 Page Banner（Figma `66:122927` 基准：76px 高、16px 圆角、4px 白色描边环、44×44 图标容器、24×24 leaf icon、Karla 20/500 标题、14/400 描述）；右侧按功能放按钮、Toggle、统计信息或留空；
- Sidebar 遵循当前 Figma 结构：展开宽度 224px；支持收起为 58px，收起态只显示 icon。收起/展开必须使用 `assets/stemui/line_chevron-up.svg`，并提供 `aria-expanded`、`aria-controls`、键盘焦点与同浏览器状态记忆；不得恢复旧版横向 Tab Toggle；
- 已有页面的 Banner 图标优先复用 `@stemui/icons` / 已确认插图；新页面可暂用明确标记的占位符，但发布前必须替换为对应资源；不得使用模糊截图、emoji 或临时绘制 SVG；
- 账户、个人资料和侧边栏身份必须复用导出的 `Avatar` 组件：网站注册用户使用 22 个已确认方形头像，并用稳定用户 seed 固定匹配结果；抓取不到社交媒体头像时，才使用 24 个带灰色描边的圆形兜底头像，并用稳定社交账号 seed 固定匹配结果；不得使用通用占位头像；
- 社交账号来源标识必须复用 `SocialAccountAvatar`：Plan 生成的 Post 使用 `postOrigin="plan"` 虚线描边，用户手动打开弹窗创建的 Post 使用 `postOrigin="manual"` 实线描边，每个标识只显示一层描边；
- Avatar 页面中的 Generated extensions 仅为待确认预览，不进入自动分配资源池；
- 实现 default、hover、focus、disabled、error、loading、empty 等适用状态；
- 不把 Legacy 样式覆盖到 Current 组件；
- 完成后列出复用的组件、使用的 tokens、与规范的任何偏差；
- 对照 Current HTML demo 做最终视觉检查。

如果你无法读取相对资源、链接页面或附件中的某个文件，请明确列出缺失文件，不要自行用默认样式补齐。
```

## 验收问题

让接收方在编码前回答以下问题，可以快速判断它是否真正读到了系统：

- 当前来源优先级是什么？
- Analysis、Post Agent、Engage 的主色分别是什么？
- dApp 是否允许 Gotu 或 Digital Numbers？（答案：Gotu 不用于 dApp；Digital Numbers 仅允许用于 Score Gauge 数字）
- Input / Dropdown 的默认边框、focus 双环和高度是什么？
- 哪些页面是 Current，哪些只能作为 Legacy 参考？
- 它准备复用哪些导出的 React 组件？

回答不完整时，应先补齐文件或开放访问权限，再开始实现。

## Segmented Choice

少量（2–4 项）互斥选项且带简短要求时，使用 SegmentedChoice。每项 id / label / requirement / description / disabled；组件 value / onValueChange 或 defaultValue，支持 name、required、disabled、tone（lime / yellow）。Create Post 使用 yellow。说明跟随选中项，底部 info 支持 hover / focus。不要用 Tabs 承担该表单选择，不要改成多个可独立切换的 Toggle。来源：Figma 77:17029；页面 components/SegmentedChoice/SegmentedChoice.html。

卡片层级：复杂白色内框只用于最外层分区，任何场景的内层均使用浅灰填充或白底浅描边，不叠加复杂边框 / 阴影。共享 Card 样式对 section 内嵌 section 自动简化，详见 SECTION_CARDS 与 TEAM_DECISIONS 2026-09-18。

交互补充：Brand Mention 使用 TagInput；Card 收起时去掉 header 底部空隙并垂直居中。Segmented Choice hover 使用 bg-hover token，不增加未选项描边。Dialog 根据视口约束高度，内容区 overflow:auto 且 min-height:0，标题与底部操作不随内容滚动。

## Feature Overview / 连体分区

Figma 51:213896 的四区功能总览使用导出的 FeatureOverview；底层为 Card variant="divided"、CardGrid divided、FeatureList，以及 StatCardGroup variant="compact"。单个外框 / 共享分隔线，不重复嵌套独立卡片。FeatureList 是说明列表，不使用 checkbox 语义；compact 信息条是静态数值或图标 + 标签，不擅自做成按钮。Badge、Tooltip 复用现有组件。sections 内容通过插槽提供，不内置套餐价格、购买行为或特定业务文案。旧 PlanCard 保留；平台图标条仍为 Demo 组合，未独立组件化。完整 API 和响应式边界见 FEATURE_OVERVIEW.md。

## PlanCard subscription

当前依据 Figma 51:329855，使用 PlanCard variant="subscription" 展示单套餐订阅确认，传入价格、credits、品牌资料、onAction 与 onDismiss。外层白色 16px 圆角，内部使用简单浅底信息行，不重复 section Card。主按钮 dark，次按钮浅灰。作为弹窗时组合现有 Dialog 与 aisee-plan-subscription-dialog 类，保留焦点、Escape、动效和内部滚动；Demo 不执行支付或启动分析。旧三档 API 与 PlanCardPrevious.html 继续保留。详细 props 见 components/PlanCardCurrent/README.md。

## Sidebar 布局变量（2026-09-18，待验收）

SidebarLayout + SidebarNavigation 提供 sidebar / muted / floating / inset / topbar 五种布局与 inside / outside 按钮位置，默认仍为通栏白底 + 内部按钮。topbar 固定全宽顶栏按钮，收起完全隐藏侧栏；hover 临时浮出不挤正文，click 恢复固定展开，Escape / 离开 / 外部点击 / 选择关闭临时预览。布局变化保留导航选中、分组与收起状态。独立卡片使用 16px 外距 / 圆角、AISEE 浅描边；外部按钮在内容区标题栏左侧，无悬浮框与独立占位列。图标 hover / focus 使用 button/usual 全不透明；floating 内容标题栏透明，内容左右间距均为 16px，不叠加正文横向内距。Inset 标题栏直角且仅底部 1px 分隔线；预览变量下拉框靠右。现有 Webapp 默认调用保持兼容，产品层级未改。详见 [SIDEBAR_LAYOUTS.md](SIDEBAR_LAYOUTS.md)。
