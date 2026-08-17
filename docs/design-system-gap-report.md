# AISEE Design System：设计稿对照扫描报告

扫描日期：2026-08-17  
对照来源：`docs/aisee-dapp-design.v6.md`、`src/components/`、Components 导航页面、Web App UI Kit 页面及现有静态预览。

## 结论摘要

当前系统已覆盖主要的基础交互组件，但设计规范中的“组件清单”比当前可独立复用的实现更完整。当前差异主要不是 token 缺失，而是部分组件仍只有 UI Kit/历史页面示例，没有独立的 Current 组件页面或 TypeScript 实现。

另外，文件名使用 `v6`，文档内部版本仍写作 `v5.1 · 2026-08-11`。这属于版本标识不一致，建议由产品/设计负责人确认后统一，不应由系统自动推断。

## 当前系统实际库存

### Components 导航中已有

| 状态 | 页面 |
| --- | --- |
| Current | Overview、Button、Input、Select / Dropdown、Toggle、Tabs、PlanCard — Current、Tag、Dialog、Confirmation Dialog |
| Legacy | Sidebar Navigation、Badge、Stat Card、Post Card、Credit Bar |

旧的 `Buttons & Badges`、`Nav, Inputs & Toggles`、`Cards & Data` 仍作为历史页面保留，但不再作为组件级入口。`IntentTag`、`StatusBadge` 的历史源目录仍保留。

### 当前 TypeScript 可复用实现

`src/components/` 目前包含：Button、Input、Toggle、Tabs、Card、PlanCard、Tag、ModuleToggle、Dialog、ConfirmationDialog、Dropdown。

这意味着“有页面示例”与“有可直接导入的组件实现”并不完全等价，后续维护时应分别标注。

## 设计规范组件对照

| 设计规范要求 | 当前情况 | 状态 |
| --- | --- | --- |
| Button：Primary / Secondary / Ghost / Danger | 有 Current Button 页面和实现；深色/Dark 作为产品语义变体需继续保持 | 已覆盖 |
| Input / URL Input | Input 页面覆盖文本与 URL 示例；URL Input 尚未独立命名为页面 | 部分覆盖 |
| Select / Dropdown | Current 页面已展示单选、多选、Filter、Input 等交互示例及 hover/selected 语义 | 已覆盖 |
| Toggle | 有 Current 页面和实现 | 已覆盖 |
| Checkbox | 规范明确要求，但没有独立 Current 页面或 `src/components/Checkbox.tsx` | 缺失 |
| Tabs | 有 Current 页面和实现 | 已覆盖 |
| Sidebar Navigation | 只有 Legacy 页面；UI Kit 中有业务侧边栏示例，但没有独立 Current 组件实现 | 部分覆盖/Legacy |
| PlanCard | 有 `PlanCard — Current` 页面和实现，旧版仍保留 | 已覆盖 |
| Tag / Chip | Tag 有 Current 页面；可操作 Chip 的独立页面尚未建立 | 部分覆盖 |
| Badge / StatusBadge / IntentTag | Badge 为 Legacy；IntentTag、StatusBadge 保留历史内容，尚无可验证 Current 页面 | Legacy |
| Stat Card / KPI | 有历史页面或 UI Kit 使用，但没有独立 Current 实现 | 部分覆盖 |
| Table | 设计规范要求，当前未发现独立 Current 页面或实现 | 缺失 |
| Chart / Data Viz / Score Gauge | UI Kit 中有图表/分数示例，但没有独立 Current 组件实现 | 部分覆盖 |
| Dialog / Modal | Dialog 与 Confirmation Dialog 均有 Current 页面和实现 | 已覆盖 |
| Tooltip / Toast | 规范要求，但当前没有独立 Current 页面或实现 | 缺失 |
| AppHeader | 规范有 70px Header、logo、模块切换等规则；目前主要存在于 UI Kit 示例 | 部分覆盖 |
| Post Editor | 规范要求，当前属于业务页面/历史示例，没有独立 Current 组件实现 | 部分覆盖 |
| Loading / Empty / Error 反馈模式 | 在规范和部分页面中有描述，但没有统一的 Current 组件入口 | 部分覆盖 |

## 状态与交互规则差异

规范要求按真实存在的组件记录 Default、Hover、Active、Focus、Disabled、Loading、Selected、Empty、Error。当前情况如下：

- Button、Input、Dropdown、Toggle、Tabs、Dialog 已有较明确的可操作示例。
- Input 已展示 Default、Hover/Focus、Disabled、Error 等状态，但 Loading 没有独立展示。
- Dropdown 已有 trigger、menu gap、hover、selected 规则；键盘语义仍应在实现层补充验证。
- Dialog 与 Confirmation Dialog 已覆盖主要间距和按钮语义；统一的 Loading/Empty/Error 反馈组件尚未形成。
- 规范中的 motion（下拉、弹窗、tabs、侧边栏、toast、路由过渡等）已有原则，但当前没有逐组件的 motion 验收清单。

## 视觉规则差异

- v6 文档规定 dApp 使用 Karla；Gotu 仅用于官网/品牌展示。当前文档与字体资源已记录这一规则。
- 规范中的页面/对话框标题为 Karla 20px / 600，section 标题约 18–20px / 600，正文 14px；静态文档预览中的大标题是展示层级，不应被误认为产品组件 token。
- Header 70px、Sidebar 224px、主内容 24–32px padding 及 8px spacing scale 已在文档中明确；AppHeader/Sidebar 目前还不是独立可复用的 TS 组件。
- 模块色、危险色、hover/focus ring、selected fill 等 token 已在规范中定义；本次扫描没有建议修改 token。
- 图标规范要求优先使用 StemUI，Lucide 作为 fallback；当前 UI Kit 仍存在部分 inline SVG/历史资源，建议后续做一次命名与来源映射审计。

## Web App UI Kit 覆盖情况

规范要求有可识别的页面预览：Overview、Analysis、Growth、Improve Score、Build Brand Influence、Engage、Signal Feed、Keywords & Accounts、Replies、Post、Calendar、Channels、Media、Verify、Connection。

当前 UI Kit 已包含上述 Growth Loop 页面入口，未发现因缺少页面而需要新增空白页面的情况。完整业务页面仍应留在 UI Kits，不应迁移到 Components。

## 建议的下一步（本报告不自动执行）

1. 产品/设计确认文件名 `v6` 与文档内部 `v5.1` 的正式版本号。
2. 如果 Checkbox、Tooltip、Toast、Table、Score Gauge、Post Editor 等确实是当前产品要复用的组件，再分别补齐 Current 组件页面和实现；不要仅为填满导航而创建空页面。
3. 将 URL Input 作为 Input 的真实变体保留，除非团队需要独立 API，暂不必拆成新组件。
4. 为现有 Current 组件补一份状态矩阵（Default/Hover/Focus/Disabled/Loading/Selected/Error），只记录设计稿真实存在的状态。
5. 将 UI Kit 中的 Header、Sidebar、Stat Card、Chart 等业务组合与基础组件边界写清楚，避免重复维护。

本报告没有删除历史资产、没有修改 StemUI/icon 开发仓库，也没有改变现有 design token。
