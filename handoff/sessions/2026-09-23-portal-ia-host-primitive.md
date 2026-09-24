# 门户归属与宿主 primitive 接入修正

## 本轮目标

- 按已确认边界整理 README、Brand、Components、UI Kits 的信息架构与导航归属，不移动或删除物理文件。
- 保留 AI 探索稿的来源和 Draft / Legacy 状态，不把它们视为已确认产品页面。
- 修正 Copy for AI 在已有 shadcn/ui 项目中仍创建平行 AISEE 组件的问题。
- 保护工作区中的 Automation Runner 边缘锚定与生产交付改动，不重置、不覆盖，并与本任务分开提交。

## 逐项归属

| 当前栏目 | 条目 | 状态 | 内容类型 | 建议位置 | 说明 |
| --- | --- | --- | --- | --- | --- |
| README | README | Current | 使用入口 | README | 保留为三条使用路径与规则索引。 |
| Brand / Common | dApp v6 Foundations | Current | 基础规范 | Brand / Common | AISEE dApp 基础视觉。 |
| Brand / Common | AIsee Logo Animation | Current | 基础规范 | Brand / Common | 跨页面 Logo 动效原则。 |
| Brand / Common | Logo | Legacy | 基础规范 | Brand / Common | 保留旧基础资产状态，不升级。 |
| Brand / Common | Color Palette | Legacy | 基础规范 | Brand / Common | 保留旧颜色资料状态，不升级。 |
| Brand / Common | Spacing, Radii & Shadows | Legacy | 基础规范 | Brand / Common | 保留旧基础资料状态，不升级。 |
| Brand / Common | Display Type — Karla | Legacy | 基础规范 | Brand / Common | 保留旧字体资料状态，不升级。 |
| Brand / Common | UI Type — Karla | Legacy | 基础规范 | Brand / Common | 保留旧字体资料状态，不升级。 |
| Brand / Homepage | About Us — Design Faithful | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 灵感参考，不是实际产品设计。 |
| Brand / Homepage | About Us — Homepage Style | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Homepage | About Us — v3 | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Homepage | About Us — v4 | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Homepage | aisee Homepage Redesign | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Analyze | Comparison Modal | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Growth | Module Comparison v3 | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Post | Post Reply Tutorial (preview) | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Post | Post Reply Tutorial Reddit (preview) | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Engage | Engage | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Engage | Engage Dashboard (Redesigned) | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Engage | Engage Dashboard v6 (Donut Impressions) | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Engage | Engage Empty State (optimized) | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Engage | Engage Replies (History) | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Engage | Engage Replies (Tracking) | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Engage | Engage v3 (React TSX preview) | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Engage | Paste Link Tutorial (preview) | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Verify | Tracking Eye | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Automation | Plugin Entry Options | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Common | Update Tutorial Preview | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | AI 教程探索，不是基础规范。 |
| Brand / Common | Install Tutorial Preview | Legacy | AI 探索稿 | Brand / AI Explorations / Inspiration | 同上。 |
| Brand / Automation | Managed Automation | Draft | AI 探索稿 | Brand / AI Explorations / Inspiration | 保留 ChatGPT / Web 来源与 Draft 状态。 |
| Components / Overview | Overview | Current | 生产组件索引 | Components / Overview | 保留组件入口索引。 |
| Components / root | Button | Current | 生产组件 | Components / root | 可独立复用，位置不变。 |
| Components / Content & Status | Avatar、Badge、Empty State、Feature Overview、PlanCard — Current、Steps、Thinking Indicator | Current | 生产组件 | Components / Content & Status | 位置不变。 |
| Components / Data Display | Card、Chart、Credit Bar、Score Gauge、Stat Card — Current、Table | Current | 生产组件 | Components / Data Display | 位置不变。 |
| Components / Data Display | Post Card | Legacy | 历史组件 | Components / Data Display | 保留 Legacy，不升级。 |
| Components / Feedback & Overlays | Automation Runner、Confirmation Dialog、Dialog、Notification、Tooltip / Toast | Current | 生产组件 | Components / Feedback & Overlays | 位置不变。 |
| Components / Inputs & Controls | Checkbox、Input、Quantity Stepper、Segmented Choice、Select / Dropdown、Tag Input、Toggle、Toggle Selection Group | Current | 生产组件 | Components / Inputs & Controls | 位置不变。 |
| Components / Navigation | Sidebar Navigation、Tabs、Tree Nav | Current | 生产组件 | Components / Navigation | 位置不变。 |
| UI Kits — Webapp | Web App UI Kit | Current | 组件组合示例 | UI Kits — Webapp | Current 仅表示 Demo 正在维护；不声称与实际产品 Figma 一致。 |

所有条目的原文件路径与 hash 深链保持不变。静态 AI 探索稿没有可靠生成工具来源元数据，仍保留 Legacy；只有 Managed Automation 明确记录 `source: ChatGPT`、`surface: Web`、`designStatus: Draft`。

## 本轮完成

- 门户 Brand 导航收敛为 Common 与 AI Explorations / Inspiration；所有 AI 参考稿增加非产品、非实施规范说明。
- 动态 Brand loader 保留 Draft / Selected 状态，并将来源与状态分开显示；默认动态 AI 产物进入 AI Explorations，不再归入 Common。
- README 增加三条使用路径与 Figma 权威边界；UI Kit 文案明确为组件组合 Demo。
- 搜索范围加入 source / surface，旧路径和 hash 深链保持不变。
- Host Project Compatibility 对 shadcn/ui 增加强约束：读取 `components.json`、alias 与现有 `components/ui`，兼容时在原路径增量合并；不得创建平行 `src/components/aisee`、第二套 `components/ui` 或第二个同类组件。
- Copy for AI 的一句话指令同步上述约束；standalone 仅在缺少兼容 primitive 时作为回退。
- 交付生成器的后续 ready guide 使用临时参考目录进行宿主合并，完成后删除临时目录。

## 验收

- `npm run typecheck` 通过。
- `npm test`：139 项通过。
- `npm run audit:copy-ai`：30 个组件、205 个配置案例、0 失败。
- 浏览器验证四个一级栏目、Brand 两个分类、Managed Automation Draft 与 ChatGPT · Web 来源分离显示、按来源搜索以及刷新 hash 深链均通过。
- `git diff --check` 通过。

## Git 与发布状态

- 分支：`ai/desktop/design-system-current`。
- 实现提交：`3c2feeb`（`feat: align portal IA and host primitive integration`）。
- Automation Runner 修复另行提交为 `ee04263`，两个任务未混入同一个实现提交；main 未操作。
- 等待 GitHub Pages 部署完成后，公开 Copy 才会使用本轮更严格的 shadcn 原位复用规则。

## 仍待确认

- 静态 Legacy AI 探索稿缺少明确的生成工具与日期来源；本轮不猜测、不补写。
- UI Kit 尚未逐页核对对应的最新 Figma，不得称为已确认产品页面。
- 更严格的 Copy for AI 规则需要等待 Pages 更新后，外部开发复制到的才是新版一句话指令。
