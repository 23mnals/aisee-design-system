# Copy for AI：统一生产交付契约

当前所有已登记的 Current 组件入口统一使用此机制。NotificationBell 是验证案例，不是核心逻辑中的特判。无需接收方安装整个 AISEE 库。

## 使用路径

组件详情页保留一个 Copy for AI 主按钮及选项菜单：默认 **Apply AISEE design** 更新目标组件视觉与动效；**Add motion only** 保留现有静态外观、只添加缺失动效。两种生成文本只有 Goal 段落不同，共用组件文件范围和业务行为保护规则。

默认 **No specific variant**，不输出预览默认参数。用户在 Target variant 菜单明确选择一项后，才把该项经过白名单筛选的配置作为目标附加；预览名称（例如 Variant playground）不写入。变更预览清除旧选择，复制前后显示当前模式。完整两份实际生成文本见 [Toggle 示例](TOGGLE_COPY_AI.md)。

接收方需要兼容的 React 项目及组件清单声明的运行环境。具体 React、Node 和第三方依赖要求由每个组件的 `dependencies / compatibility` 配置声明，Copy for AI 不额外强制统一技术栈版本。Node 声明用于执行源码安装器，不是浏览器组件的运行依赖；宿主构建工具自身的版本要求由宿主负责。还需 TSX/CSS 及该组件必要资源的导入支持，以及可联网读取交付、执行项目命令的编码 AI。无需手动下载附件或安装整个 AISEE 库；缺少基础依赖时，先列出拟改文件、原因与最小方案，等待用户确认，不能自动修改依赖或配置。

## Host Project Compatibility

所有已登记的组件共用以下接入边界：

1. **先读后列范围**：检查实际目标、UI 库、样式和调用处；修改前列精确文件路径。默认只写目标组件实现及其专属局部样式，components/_components 目录不是整体授权。目标不明确或不存在时先确认目标/新组件路径。
2. **按选定目标调整视觉**：设计模式允许组件内视觉与动效更新，但不重排页面；动效模式保留全部静态外观。复用既有 primitive 和 UI 库，不创建平行组件，不导入整份交付 CSS。
3. **两种模式都保留行为**：公开 API、状态所有权、checked/defaultChecked、disabled、回调、焦点/键盘及业务流程不变；不可增加乐观状态、提前切换或绕过确认来制造动画成功。组件内部动画 effects/refs 需要 cleanup/reduced-motion，不构成修改独立 hook 文件的授权。
4. **范围外先确认**：页面/调用处、文案、业务逻辑、hook 文件、API、请求/超时/异常、路由、全局样式/主题、工程配置和依赖文件默认不可写。确实需要时，先逐文件列原因、最小 diff 和影响，等待用户明确确认后只改获批部分；排障、缓存/网络/测试失败及“继续修好”不扩大范围。
5. **保护工作与验收**：保留已有 staged/unstaged/untracked 修改，不整文件回滚。参考解包放在宿主项目外临时目录。选定 Goal 与组件范围优先于交付通用安装/默认/保留步骤；最终逐文件核对任务新增 diff 并如实记录限制。

每个组件声明 `integrationMode: "host-first"`、`primitives` 与 `preserve`；生成的 latest、交付元数据和接入说明统一包含 `integrationPolicy`。其中 `preserve` 描述独立参考组件及本次缺失能力，是否更新组件外观由所选 Goal 决定，既有业务交互始终保留。当前复制指令显式说明模式与范围，其优先级高于源码参考中的通用宿主保留条款。

这是一套接入契约，不是自动样式合并器。本仓库验证规则传递、交付完整性和覆盖保护；真实外部 AI 是否正确遵循仍需在实际项目验收。

## 显式清单

`delivery/components.json` 是文件范围的唯一来源，每条包含：

- `name / slug / page`：具体交付名称、公开目录、对应入口。
- `entries`：可供用户导入的生产入口。
- `productionFiles`：逐项列出的 TSX/TS/hooks/utils 和样式来源。共享样式声明组件拥有的 class families 作为语法树入口锚点。构建解析 selector 与 value AST，计算样式依赖闭包，绝不使用 class-name 字符串截取或复制整个共享样式文件。
- `dependencies`：真实外部运行依赖；优先复用宿主已有的兼容版本。
- `compatibility`：每个组件自己声明兼容范围，如 `{ "react": ">=18", "node": ">=18" }`。这是配置示例，不是全组件统一版本规定；与对应 dependencies 一致，构建同步到 latest、归档和接入说明。
- `styleDependencies`：逐项声明仅用于解析必要 CSS custom properties 的来源，不把整套 token 文件交付出去。
- `assets`：代码或选定 CSS 实际引用的生产资产，逐项列出。未使用或未声明引用都会使构建失败。
- `demoFiles`：明确不参与交付的预览/演示文件；另外拒绝 demo/mock/playground/showcase/story/examples/fonts 路径和字体扩展名。
- `integrationMode / primitives`：宿主优先策略与逐项可适配底层边界，含生产来源、必需能力和独立回退。
- `preserve`：新组件与本次缺失能力的参考规范，服从已有宿主样式和交互保护。
- `integrationPolicy`：生成器统一注入的增量接入、动画范围、既有实现优先级及冲突处理规则。
- `configuration`：可复制的真实 props / slots / theme 白名单，纯演示状态不在其中。

不限制文件数量。必要的类型声明、入口和局部样式属于生产文件；Dialog、Tooltip 等可带多个实现或动效文件。构建验证所有生产源码引用都在清单内，所有源码都由入口可达。Production 不能依赖 Demo；Demo 继续使用生产组件或既有展示实现，不随交付清单改变。

CSS 闭包从生产选择器进入，保留复合/嵌套 selector、pseudo state 与 pseudo element，递归追踪 `var()` 默认值和别名、条件覆盖、`@property` 以及变量间接引用的 keyframes；动画内的新变量继续参与闭包。按原来源顺序保留 media、supports、layer、container 与 reduced-motion 包装。根默认值作为宿主可覆盖的 fallback 注入，仅将用到的条件变量限定在组件作用域；生产 JS 明确写入的动态 CSS 属性属于运行时依赖。缺失变量、循环默认值或未声明的可达 CSS import 依赖使构建失败，不能静默遗漏。组合中另一组件的专属覆盖由组合清单负责，不外溢到单组件。

构建交付保留 standalone 源代码逻辑；接收方可按清单适配宿主 primitives。构建仅处理相对导入、客户端边界、局部样式导入和 token 默认值。所有样式有组件作用域，不输出全局 reset、整套 token 或字体目录；优先继承宿主字体并保留 token 覆盖入口。必要 SVG/image 仍交付，否则组件真实功能会缺失。资源类型声明逐文件作用域，多个交付并用不会互相冲突。

## 配置与 Demo 边界

布局、方向、动画模式等真实参数可以复制，但仅作为本次缺失能力或新组件的参考，不能覆盖现有配置；动画需求忽略布局、尺寸、图标、主题等非动画参数。模拟业务数据、当前演示计数、reset/simulate、错误场景和 showcase composition 不复制。多个 scope 是独立例子，不要求目标项目创建多份示例页面。slot 布尔值描述内容组合，不能直接当作 props。

NotificationBell 默认交付动画铃铛本身，数值/圆点是生产 API；展示页的圆点、面板选项和模拟数量不是选定业务配置。调用 `count={unreadCount}` 和 `onClick={openNotifications}` 接入真实数据和现有通知入口。不会交付 NotificationPanel、消息数组、面板插图或全部已读演示按钮。详情见 [铃铛验收](NOTIFICATION_COPY_AI.md)。

## 版本与发布

每个组件都有稳定地址 `<slug>/latest.json`，指向 `releases/<version>/ready.md` 和 `install.cjs`。版本由生产文件、清单和交付生成器决定；新版本构建自动改写 latest，复制按钮不拼接或硬编码 ready-xx 链接。

一次构建先校验全部组件，再写出交付与指针。站点发布将所有文件作为同一 Pages artifact 发布。按钮实时读取目录清单，检查公开 latest 与当前预览版本一致，并验证说明和安装器 SHA-256；未发布、版本混用或文件损坏时明确报错，不退回寻找私有仓库的旧提示词。请求中的公开 URL 永远不会换成本地 localhost。

旧 release 和旧 ready-30.md 保持历史含义，不静默覆盖其内容。已复制的稳定 `latest.json` 地址始终解析到执行时最新的已发布生产版本；已经安装到业务项目中的源码不会自动更新。升级时安装器拒绝覆盖不同文件，由开发检查差异。不能因为发布了新版本就自动删除接收方旧组件或业务文件。

## 维护与验收

1. 新组件登记完整生产清单与配置白名单，Demo 继续独立维护。禁止通过扫描整个目录来自动扩大交付。
2. `npm run build:ai-deliveries`：生成所有交付，检查缺失/越界/未使用依赖。
3. `npm run verify:ai-deliveries`：将所有已登记交付安装到与本仓库隔离的 React 目录，检查准确文件范围、校验、重复安装/冲突保护、跨组件类型检查与构建；生成独立浏览器验收页。
4. `npm run audit:copy-ai`：检查全部入口、真实配置白名单与实际提示词；报告中的受控案例不是全部业务组合，也不等同于 AI 视觉结果。
5. `npm test`、`npm run typecheck`、`npm run site`：回归边界、latest 切换、Demo 和站点。
6. 打开 `artifacts/production-delivery-runtime/index.html` 检查真实 bell/count 动画与 Button/Tabs/Dialog。发布后再检验公开地址和浏览器 Copy for AI。

本地通过不代表新版本已经发布，也不保证所有外部编码 AI 在任意宿主项目零适配；网络、执行权限和目标技术栈仍须满足以上前置条件。

构建/验收报告动态输出 `Registered components` 与 `Verified deliveries`；文档规范不固定组件数量。运行于当前验收环境通过，不等于所有声明版本组合均已实测。
