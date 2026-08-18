# AISEE Design System：组件对照与漏项报告

扫描日期：2026-08-17  
对照来源：`docs/TEAM_DECISIONS.md`、`docs/aisee-dapp-design.v6.md`、Figma 文件 `tv7gTsQn6OipGVwHG8z0mX`、本地 `.fig` 导出、`src/components/`、Components 门户及 Web App UI Kit。

## 本次结论

本轮已将截图中列出的高优先级缺口闭环为可发布组件和 Current 文档：

1. **Checkbox / Card**：已补 React 实现或 Current 详情页、Overview 与门户入口。
2. **Dropdown**：发布 API 已扩展为单选、多选、菜单过滤和可输入建议，并保持原单选 API 向后兼容。
3. **Tooltip / Toast**：已新增可访问 React API、完整状态样式、Current 页面与门户入口。
4. **Table / Stat Card / Score Gauge / Chart**：已明确复用边界并新增通用发布 API、独立 Current 页面和门户入口；Score Gauge 明确限制为 Analysis。

仍保留为业务模式、未强行基础化的内容包括 Post Editor、AppHeader、Sidebar、PostCard、ChannelBadge 与 CalDay；它们继续由 UI Kit 承载。

## Figma 复核证据

- 本地源文件：`备份-官网+dapp主功能.fig`，导出时间 2026-08-13 12:20 +08:00，约 275MB；元数据与 `docs/FIGMA_SOURCES.md` 一致。
- Figma 顶层共有 7 个页面；组件规范页为 `—— 组件规范-持续更新`（page `716:7641`）。
- 对组件规范页进行只读扫描，共读取约 3,548 个节点、283 个 Component / Component Set。绝大多数是 icon、illustration 与平台资产。
- 可确认的语义资产包括 Header 组件、Button 状态组件集、Card 示例、Empty asset 组件集；Input 与 Toast 主要以画板 Frame 形式存在。
- 组件规范页按命名检索未发现独立 Checkbox、Toggle、Tabs、Tooltip、Dialog/Modal、Gauge 组件；Table 与 Dropdown 命中主要是 icon 名称。这说明 Figma 组件页本身并不是完整的发布组件目录，不能只依赖节点名称判断产品是否需要某个组件。
- v5.0 产品页全量遍历因文件规模触发 Figma 服务端 504，未发生写入。本报告因此以组件规范页、v6 规范的精确节点引用、当前仓库实现和本地 `.fig` 元数据交叉判断；没有把超时页面推断为“无组件”。

## 当前系统库存（本次更新后）

### Components 门户 Current 页面

| 分类 | Current 页面 |
| --- | --- |
| Overview | Overview |
| Actions | Button |
| Inputs & Controls | Input、Checkbox、Select / Dropdown、Toggle |
| Navigation | Tabs |
| Content & Status | PlanCard — Current、Tag |
| Data Display | Card、Stat Card — Current、Table、Chart、Score Gauge |
| Feedback & Overlays | Dialog、Confirmation Dialog、Tooltip / Toast |

Legacy 页面继续保留：Sidebar Navigation、Badge、Stat Card、Post Card、Credit Bar。`IntentTag`、`StatusBadge` 和旧 PlanCard 的源资产仍在仓库中，没有删除。

### 可发布 React + TypeScript 组件

`src/components/` 当前包含并从 `src/index.ts` 导出：

`Button`、`Input`、`Checkbox`、`Toggle`、`Tabs`、`Card`、`PlanCard`、`Tag`、`ModuleToggle`、`Dialog`、`ConfirmationDialog`、`Dropdown`、`Tooltip`、`Toast`、`StatCard`、`Table`、`ScoreGauge`、`LineChart`。

`ModuleToggle` 是兼容旧三模块切换的保留实现；当前 5.5 Growth Loop Shell 已不再把它作为主导航入口，因此不应仅因源码存在就标成 Current 门户页面。

### UI Kit 组合组件

`ui_kits/webapp/Components.jsx` 还包含 `LogoMark`、`AppHeader`、`Sidebar`、`StatCard`、`PostCard`、`ChannelBadge`、`CalDay`、`Dropdown`、`CreatePostModal`。这些组件服务于完整页面预览，尚未全部迁移为发布包 API。

## 逐项差异

| 设计规范 / 设计稿能力 | 当前实现 | 判断 |
| --- | --- | --- |
| Button：Primary / Secondary / Ghost / Danger | 页面和发布组件均覆盖；详情页额外出现 Dark，但 `ButtonVariant` 与 v6 正式规范未定义 Dark | 已覆盖，Dark 待统一 |
| Input / URL Input | 通用 Input 已覆盖 Default、Hover、Focus、Disabled、Error；详情页已修正为 36px、5% 默认描边和错误优先级 | 已覆盖；72px URL Input 仍是业务变体 |
| Checkbox | 本次新增 React 实现、Current 页面、Overview 示例和门户入口 | 已补齐 |
| Select / Dropdown | Current 页面与发布 API 均覆盖单选、多选、Filter、Input-assisted；保留原单选调用方式 | 已补齐 |
| Toggle | 发布组件符合 24×16 / 10px thumb；详情页此前是旧 36×20，本次已对齐 | 已覆盖 |
| Tabs | 发布组件符合 8px padding、24px gap、2px indicator；详情页本次已对齐 | 已覆盖 |
| Card | 发布组件已存在；本次补齐 Current 页面和门户入口 | 已补齐 |
| PlanCard | Current v5.4 页面和 React 实现均存在；旧版继续保留 | 已覆盖 |
| Tag / Chip | Tag 已发布；可操作 Comparing chip 仍只属于业务模式，没有独立 API | 部分覆盖 |
| Dialog / Confirmation Dialog | 页面与发布组件均存在 | 已覆盖 |
| Tooltip | React 组件支持 top/bottom、hover/focus 与 `role=tooltip`；有 Current 页面 | 已补齐 |
| Toast | 已按 Figma `42:12061` 对齐：单行 368×56、双行 400×72、success/error/agent 功能色、40px 图标、4px 生命周期进度条、自动 3.5s、dismiss、status/alert | 已补齐 |
| AppHeader / Sidebar | UI Kit 已实现当前 Shell；发布包没有独立 API，旧 Sidebar 页面是 Legacy | UI Kit 已覆盖，待定是否抽离 |
| StatCard | 新增通用 value/unit/delta React API 与 Current 页面；旧 Stat Card 继续标记 Legacy | 已补齐 |
| PostCard / ChannelBadge / CalDay | UI Kit 有业务实现；门户对应旧资产仍为 Legacy | 业务组合，暂不抽离 |
| Table | 新增泛型 columns/rows/rowKey API，语义 table、空状态与数值对齐 | 已补齐 |
| Chart / Score Gauge | 新增 LineChart 与 Analysis-only ScoreGauge API、Current 页面和模块边界 | 已补齐 |
| Post Editor | CreatePostModal / Post 页面已有组合示例；没有独立发布 API | 业务模式，待定是否抽离 |
| Loading / Empty / Error | Button loading、Empty asset、输入错误等分散存在；没有统一反馈组件族 | 部分覆盖 |

## 已修复的详情页漂移

- Input：40px → 36px；默认黑边 → 5% 黑；Error 移除模块色外环。
- Toggle：36×20 / 14px knob → 24×16 / 10px thumb，并改为原生 checkbox + `role="switch"`。
- Tabs：10px vertical padding / 28px gap → 8px / 24px，补齐 focus-visible 与过渡。
- Checkbox：新增 Default、Row hover、Selected、Disabled 与 Analysis/Post/Engage 主题切换示例。
- Card：新增 neutral Card Current 页面，明确与 StatCard、PostCard、PlanCard 等业务组件的边界。
- Dropdown：详情页修正为 36px trigger、5% 默认描边、黑色内边 + 2px 模块环、8px menu gap、黑色 check；发布 API 同步四种模式。
- Tooltip / Toast、Stat Card、Table、Chart、Score Gauge：新增 Current 页面和可发布实现。

## 下一步优先级

1. 决定 Button 的 Dark 是否是正式第五种 variant；若保留，应同步 v6 规范、React 类型、Overview 与详情页 hover 规则。
2. 评估 AppHeader、Sidebar、Post Editor、PostCard、ChannelBadge、CalDay 是否真的需要跨产品页面复用；在确认前继续留在 UI Kit。
3. 为数据组件补充真实产品数据下的格式化、排序、tooltip 和响应式验收案例。
4. 持续维护 Current 组件状态矩阵和自动覆盖测试，区分“静态示例”“发布 API”“业务模式”。

本次没有删除 Legacy 资产、没有修改 StemUI 仓库，也没有更改未确认的 v6 规则。
