# AISEE Design System 交接上下文

> 本文件用于在新的 Codex 会话中继续维护 AISEE Design System。它记录当前仓库结构、已确认的设计约束、实现方式和未完成事项。所有事实以仓库当前文件和最新用户确认优先。

## 1. 当前任务目标

- 维护并持续更新 AISEE Design System，内容来源包括最新 `v6` 设计文档、Figma 文件、现有设计资产和产品预览。
- 保留原有四个主要板块：README、Brand、Components、UI Kits — Webapp；暂不凭空增加 Foundations、Patterns、Archive 等一级板块。
- 让团队可以通过私有 GitHub 仓库协作维护，并准备一个可公开访问的在线预览地址。
- Components 当前优先整理为可快速查找的组件级信息架构，而不是旧的综合 HTML 文件列表。

## 2. 项目与仓库路径

- 本地仓库：`/Users/ccbakala/ChatGPT Work/aisee workspace/aisee design systerm`
- 主预览文件：`aisee-design-system-preview.html`
- Git 远程：`https://github.com/23mnals/aisee-design-system.git`
- 当前分支：`main`
- 最新设计文档：`docs/aisee-dapp-design.v6.md`
- 原始压缩包：`/Users/ccbakala/Downloads/aisee Design System.zip`
- Figma 源文件：`design-sources/figma/备份-官网+dapp主功能.fig`（当前本地登记版本为 5.7，新增托管自动发布 / Automation）
- 设计系统相关目录（以仓库当前内容为准）：`assets/`、`animated/`、`brand/`、`components/`、`docs/`、`fonts/`、`frames/`、`preview/`、`scripts/`、`src/`、`tests/`、`ui_kits/webapp/`、`uploads/`。

## 3. 当前 Git 状态

- 在创建本交接文件前，执行 `git status --short` 为空，工作区干净。
- `origin` 已指向 `23mnals/aisee-design-system` 的 `main` 分支。
- 本文件创建后是新的未提交文件；继续工作前先执行：

~~~bash
cd "/Users/ccbakala/ChatGPT Work/aisee workspace/aisee design systerm"
git status --short
git add handoff-context.md
git commit -m "docs: add continuation handoff context"
git push origin main
~~~

- 不要把 `stemui` 开发库的代码或预览推回 AISEE Design System；也不要修改 `https://github.com/qi15582378779/stemui`。

## 4. 已完成或已落地的主要方向

- 已把当前 Components 从旧的综合页面组织方式，逐步整理为 Overview + 组件入口 + 分类层级。
- 已有或计划保留的真实组件包括：`Button`、`Input`、`Select / Dropdown`、`Toggle`、`Tabs`、`Sidebar Navigation`（旧版）、`PlanCard`、`Tag`、`IntentTag`、`Badge`、`StatusBadge`，以及仓库中确实存在的其他组件。
- `dApp v6 Components` 已承担 Components Overview 的角色，不应和具体组件页面处在完全相同的层级。
- Components 页面需要和 Overview 中展示的真实示例保持同一套样式和交互，不能出现 Overview 好看、组件详情却是另一套样式的情况。
- 旧的 `Buttons & Badges`、`Nav, Inputs & Toggles`、`Cards & Data` 仅作为历史资产来源；不能继续作为左侧组件入口名称。它们的真实内容应拆到具体组件页面中。
- 三个空白或无法显示内容的历史页面已经被识别为清理候选；删除前仍应确认是否有需要保留的唯一资产。
- 组件侧边栏的随机图标已按用户要求隐藏；后续没有用户确认不要重新添加一批随意图标。

## 5. Components 当前目标信息架构

左侧导航只负责找到组件；Default、Hover、Focus、Disabled、Loading、Primary、Secondary、Size、Spacing 等必须放在组件详情页内部。

~~~text
Components
  Overview
  Button
  Inputs & Controls
    Input
    Select / Dropdown
    Toggle
  Navigation
    Tabs
    Sidebar Navigation (Legacy)
  Content & Status
    PlanCard
    Tag
    IntentTag (Legacy)
    Badge (Legacy)
    StatusBadge (Legacy)
  Data Display              # 仅当仓库存在真实对应组件时显示
  Feedback & Overlays       # 仅当仓库存在真实对应组件时显示
~~~

规则：
- `Button` 是独立的总组件入口，不要再包一层 `Actions`。
- 只有一个真实组件的分类不要硬包分类；分类只在确实有多个组件时显示。
- 分类标题若包含子项，显示可展开/收起的小箭头；不要为每个普通页面额外添加无意义小标题。
- Current 组件默认不再显示醒目的 `CURRENT` 标签；历史组件显示 `LEGACY`，并说明 `Legacy — use the current component instead.`。
- 不创建当前 AISEE 中不存在的组件，不用示例名称凭空补齐结构。
- 不删除 Legacy 资产，除非用户明确批准；可以从导航隐藏，但必须保留文件和历史内容。

## 6. 组件详情页统一结构

真实存在的内容尽量按以下顺序呈现：

1. Component name 与一句话描述
2. Overview / Examples（可操作示例）
3. Appearance / Variants
4. States（只显示真实存在的状态）
5. Usage
6. Do / Don't（没有资料时标记 `Not documented yet`）
7. Specs（Size、Spacing、Radius、Typography、Color；缺失时不要自行编造）
8. Product example / Preview

交互要求：
- Button 示例可切换 Primary、Secondary、Subtle/Ghost、Dark、Danger，并保留 hover/focus、disabled、loading 等真实状态。
- 深色按钮 hover 应转换为当前模块品牌色：Analysis 使用绿色，Post / Engage 使用黄色；带品牌色的按钮 hover 转为深色。
- Input 默认显示 `Default`，同时提供真实的 Hover、Focus、Disabled、Error 等状态，并可以通过鼠标/键盘操作预览。
- Select / Dropdown 需要可交互；至少覆盖单选，并按设计稿补充多选、Filter、Input 型下拉。菜单与触发器之间保留设计稿要求的间距，选中项和 hover 使用浅黑透明填充。
- Dialog、二次确认弹窗、Toggle、Tabs 等存在的组件应可操作；所有弹窗标题统一使用 Karla 20px / 500（demo 与后续规则均按此值），不要使用 600 或 700。
- 交互不能只是一张静态截图，组件示例应让用户能点击、聚焦、切换和查看状态。

## 7. 已确认的视觉与排版要求

- app / dApp / webapp UI 只使用 Karla；官网/Brand 场景可使用 Karla + Gotu。
- 顶部 AISEE logo mark 目标尺寸约 25×26px，`aiseе` wordmark 约 24px 高，Karla 500；系统导航和 UI Kit demo 都要统一这个尺寸。
- 正文约 14px；常规正文颜色 `#111111` 但透明度约 60%，重点正文颜色 `#111111`、100% 不透明、字重约 500；一级标题约 16px / 600，大标题约 18px / 600。
- 侧边栏文字一行显示，不允许换行；单项高度约 30–32px，项间距约 4–8px。
- 页面灰色背景需要偏浅；卡片和灰色展示框之间必须有上下左右间距，组件不能贴边。
- 所有页面主内容区第一块固定为 Page Banner，基准为 Figma `66:122927`：高 76px、圆角 16px、白色 4px 描边环、44×44 白色 icon 容器、24×24 leaf icon、Karla 20/500 标题与 14/400 描述；右侧按功能放按钮、Toggle、统计信息或留空。已有页面优先使用 `@stemui/icons` 或已确认插图；新增页面可在开发期使用明确标记的占位符，发布前必须替换，不能用模糊截图、低分辨率 PNG 或临时绘制 SVG。
- 分析、Growth、Engage、Post、Verify、Connection 等不同页面必须展示与功能相关的页面结构和 banner，不要全部复用 Overview 排版。
- UI Kit 需要覆盖 Growth Loop 的真实页面预览：Analysis、Growth、Engage、Post、Verify、Connection 等；每个页面要有大致对应功能的预览。
- 侧边栏功能 icon 先保持隐藏，除非从 `@stemui/icons` 或确认过的 Lucide 资源中选到与功能相符且不重复的图标。

## 8. Logo、Icon、插图和字体资源

- 业务 icon 库：GitHub `https://github.com/qi15582378779/stemui`。
- npm 包：`https://www.npmjs.com/package/@stemui/icons`。
- 只消费 icon 库的 SVG/包资源，不修改 stemui 仓库，不把 AISEE 预览同步到 stemui。
- 功能 icon 使用 `line_`、`fill_` 等真实功能图标；`illustration` 资源只用于 banner、空状态或需要呼吸感的插图区域，不能拿插图充当侧边栏功能 icon。
- 用户提供的 loading 原视频：`/Users/ccbakala/Documents/ui/aisee/Component/gif/1_1080_N.mp4`，目前只有绿色版本；Engage/Post 若需要黄色版本，应以同一动画逻辑制作颜色变体，不要改变原视频文件。
- 预览中加载动画优先使用 SVG/CSS 动画或清晰视频资源；不要把低清缩略图当成 SVG。
- Logo 动画资产必须保持透明背景；白色只属于眼白路径，预览容器或宿主页面背景由调用方决定，禁止在 SVG 中加入外层白色背景矩形。
- Gotu、Karla、DigitalNumbers 等字体应保存在仓库 `fonts/` 或明确的 `uploads/` 资源目录；核对字体文件是否已经提交。

## 9. 设计文档与版本规则

- 当前 canonical 设计文档是 `docs/aisee-dapp-design.v6.md`；用户已确认最新文档按 v6 处理。
- 文件名和文档内部版本号可能不一致（曾出现文件名 v6、正文仍写 v5.1 的情况）。后续不要静默覆盖：先在差异报告中说明，再由用户决定更新 Markdown 还是更新 Design System。
- Figma 新功能通常新开页面；原有功能新增需求则在原版本页面上方增加。黑色标题框中的更新内容和时间优先级高于文件名。
- 每次同步前扫描标题框、Figma 页面、现有 HTML 和 Markdown，并保留无法确定的差异清单。

## 10. 已知问题与踩坑

- 直接双击从 GitHub 下载的单个 HTML，可能出现空白或“文件已被移动/修改/删除”页面。这通常是因为页面依赖相对路径、脚本、字体、视频或 `file://` 安全限制；不能据此判断内容丢失。
- 本地预览应该通过 HTTP 服务打开，而不是直接双击：

~~~bash
cd "/Users/ccbakala/ChatGPT Work/aisee workspace/aisee design systerm"
python3 -m http.server 8000
~~~

然后访问 `http://localhost:8000/aisee-design-system-preview.html`。发布给团队时，应部署整个仓库静态站点，而不是只发送某一个 HTML 文件。
- GitHub Pages 之前出现过部署失败/空白风险；部署后必须打开线上 URL 验证资源、字体、SVG、视频和交互。
- GitHub 私有仓库本身不等于公开在线预览；要让同事和其他 AI 通过链接访问，预览站点必须公开，仓库仍可保持私有。
- HTML 是可视化交互预览，Markdown 是文字规范和规则来源；HTML 不会自动完整包含 Markdown，AI 能否读取线上 HTML 取决于对方平台是否允许网页访问。向 AI 交付时最好同时提供公开预览 URL 和 `docs/aisee-dapp-design.v6.md` / GitHub 仓库文件。
- 不要使用外部图片替代本地真实 SVG；不要把随机 icon、临时插图或 Overview 截图复制到每个功能页面。

## 11. 尚未完成事项

- 将本交接文件提交并推送到 `23mnals/aisee-design-system`。
- 部署一个非 localhost、可公开访问的在线预览地址（用户希望使用 `chatgpt.site` 尾缀）。当前尚未确认已成功部署；需要验证域名、HTTPS、资源路径和访问权限。
- 完成 Components 级别的最终整理：移除空分类/空页面入口，确认真实组件清单，确保 Overview 和详情页面使用同一份组件示例。
- 完成 Button 深色样式及正确的模块色 hover；补齐 Select / Dropdown 的单选、多选、Filter、Input 示例及交互。
- 修复 UI Kit 每个功能页面的 banner 插图，改用设计稿对应的清晰 SVG/视频资源。
- 核对 5.5/5.6/5.7 Figma 页面与 v6 Markdown 的组件、状态、规则差异，生成并更新差异报告；发现冲突先通知用户。
- 确认两份未提交字体文件是否已进入 `fonts/`，并在变更记录中注明。
- 按用户批准执行重复版本清理；不要删除用户尚未确认的 Legacy 页面。
- Dembrandt 扫描结果应放进一个新的、不会与现有目录重名的独立文件夹，且不要和当前 Design System 内容混在一起；扫描前先确认 MCP 可用和输出路径。

## 12. 下一步直接执行顺序

1. 提交 `handoff-context.md` 并推送到远程仓库。
2. 用 `git status`、`git log -1`、资源检查脚本确认仓库完整性。
3. 在不改 README、Brand、UI Kits 的前提下，完成 Components 最终导航和页面交互修复。
4. 检查 `docs/aisee-dapp-design.v6.md` 与 Figma/预览的漏项，输出一份差异表给用户确认。
5. 修复/验证所有 SVG、字体、动画、相对路径，并通过 `python3 -m http.server 8000` 做本地验收。
6. 配置并验证公开线上预览；确认同事和支持网页读取的 AI 可以访问。
7. 只在验收通过后提交变更并推送 `origin/main`，同时告诉用户提交号、预览 URL、以及 Markdown 源文件位置。

## 13. 交付说明

- 设计系统 Markdown 源文件入口：`docs/aisee-dapp-design.v6.md`。
- 本交接 Markdown：`handoff-context.md`。
- 主 HTML 预览：`aisee-design-system-preview.html`。
- 新会话接手时，先读本文件、`README.md`、`docs/aisee-dapp-design.v6.md`、`docs/TEAM_DECISIONS.md` 和 `docs/design-system-gap-report.md`，再开始修改。

## 14. 2026-08-21 对话总结与续接说明（以本节为准）

> 本节覆盖前文中与当前工作区状态不一致的历史记录；下一次会话先读本节，再回看第 1–13 节。

### 本轮新增：Event Dialog

当前新增 `src/components/EventDialog.tsx`，统一以下事件弹窗：

- `success`：页面分析成功
- `error`：页面分析失败
- `subscribe`：订阅/解锁
- `upgrade`：升级套餐
- `insufficient-balance`：余额/积分不足
- `locked`：开启开关后提示当前页面/流程不能关闭

统一结构：顶部事件类别 icon、标题、描述、操作按钮区。默认不显示右上角关闭 icon；通过 Cancel、Maybe later 等按钮关闭。勾选、额度信息、说明信息等特殊内容按场景放到内容区扩展。

标题使用 Karla 20px/500，描述使用 14px/400 和 `rgba(17,17,17,.6)`，弹窗内边距 24px，按钮间距 8px。React 入口为 `src/components/EventDialog.tsx`，统一导出已加入 `src/index.ts`，样式在 `src/styles/components.css`。图标必须引用本地 `assets/stemui/` SVG，不得使用模糊位图或临时绘制图标。Figma 参考为 node 72:57420（完整链接见前文）。

当前未确认静态 `components/EventDialog/EventDialog.html`、registry 和详情页已补齐；后续如需在 System demo 中展示，必须补齐这些入口。

### 当前统一视觉规则

- 主内容固定宽度 960px（不是只设 max-width），居中，左右内边距 24px。
- 页面/组件标题和下方内容左对齐；页面内容统一居中容器。预览标题栏 padding 12px 24px。
- 区块标题（Overview / Examples、States、Usage、Specs 等）统一 16px / 500；下面描述统一 14px / 400、`rgba(17,17,17,.6)`；标题与描述间距 8px。
- 卡片描边统一 `rgba(17,17,17,.05)`；主文本 `#111111`；次要文字 `rgba(17,17,17,.6)`；Usage 与 Specs 说明同色。
- 搜索框 hover/focus 使用 Aisee lime `#CFFF29`；输入框/下拉框 hover 应沿用同一设计规范。
- Sidebar 展开 224px、收起 58px；收起只显示 icon；刷新后保留当前页面、分组展开状态、收起状态。
- 每个功能页面顶部固定 Page Banner：icon、标题、描述，右侧按功能显示按钮/Toggle/统计或留空。Banner icon 优先 `draw-*`；`platform-*` 只作平台标识；侧边栏和按钮操作优先真实 `line-*`，侧边栏允许动画。
- Dialog/Confirmation Dialog/Toast 统一使用真实 SVG、明确的事件语义，避免自定义模糊 icon。

### 资产与页面归档规则

- `brand/` 只展示 Codex 与 ChatGPT 网页端产出；页面按英文功能名组织。旧 Claude/旧版本页面归入 `legacy/` 或删除范围，默认不作为当前设计系统入口。
- System demo 当前不应把旧产物以 PNG/HTML 双卡片形式展示；需要展示时以当前有效页面/组件为准。
- 不要删除尚未获得用户明确确认的 Legacy 文件；当前工作区已有一批用户确认过的旧产物删除改动，需在提交前逐项核对。
- Icon 约定：banner 使用 `draw-*`，`platform-*` 仅平台标识，侧边栏/按钮优先真实 `line-*`，禁止模糊截图、低分辨率 PNG 或临时绘制 SVG。

### AI 交付约束

- HTML 能否被其他 AI 读取取决于页面和依赖资源是否可访问；HTML 本身不会自动带出 Figma 变量、设计意图或完整规范。
- 为避免其他 AI 改动字体、颜色或间距，交付必须同时提供 canonical Markdown、明确 token/组件契约、真实本地 SVG 路径、可访问的完整预览站点与关键截图/参考节点；不要只发送单个 HTML。
- 用其他 AI 验证时，要求其先读取规则和资产清单，再实现；先对照 tokens/路径做静态检查，再看视觉结果。

### 当前验证与 Git 状态

- 本轮只更新了本交接文档；不修改代码、不提交、不推送。
- 当前工作区存在大量先前累计 staged/unstaged 修改及删除，包括旧产物清理、组件样式、legacy/preview、logo animation 和 EventDialog；后续提交前必须先 `git status --short`，区分已确认删除与未确认改动，避免 reset/checkout 覆盖他人工作。
- 远程协作仍按 `origin/main` 处理；本轮没有进行远程同步。
- EventDialog React API 已加入入口，但静态 demo/registry 尚未确认；后续完成后执行仓库已有 typecheck/test 或等价检查，再决定是否提交。

### 下一次会话建议顺序

1. 先读本节、README.md、docs/aisee-dapp-design.v6.md、docs/TEAM_DECISIONS.md、docs/design-system-gap-report.md。
2. 检查 `git status --short` 与当前分支，保护已有 staged/unstaged 改动。
3. 补齐 EventDialog 静态预览/registry（如需），并统一检查 Dialog/Confirmation Dialog/Toast 的共同规范。
4. 对所有 Components 页面回归：固定 960px 内容宽度、24px padding、标题 16/500、描述 14/400、8px 间距、次要文字色、统一卡片描边。
5. 通过 HTTP 服务验证 SVG、字体、动画、交互和刷新持久化；确认后再提交并推送 `origin/main`。

### Git 交接说明

本 turn 没有执行 commit/push。由于当前 worktree 有大量待处理改动，下一次提交前需要先逐项核对 staging；不要把未确认删除或未确认样式改动混入发布。

## 15. 交接文档与新会话提醒机制（长期约定）

- 每次完成一批可交付修改后，同步更新根目录 `handoff-context.md`；不要只在聊天里记录。
- 当一次工作接近阶段性收尾、距离上次交接更新较久，或系统首次出现“自动压缩上下文”的提示时，主动提醒用户：**“该更新交接文档并新建对话了。”**
- 出现首次自动压缩提示时，应先完成当前阶段的交接摘要（已完成、待确认、未推送、下一步），再提醒用户新建对话，避免上下文丢失。
- 新对话开始时先读取 `handoff-context.md`；如果发现文档已超过当前阶段或与工作区不一致，先刷新交接内容再继续实现。
- 提醒是协作流程提示，不代表自动提交、推送或删除；Git 操作仍需按用户明确要求执行。
