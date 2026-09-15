# 2026-09-15 · Copy for AI 与 README 中文版

## 本轮目标

- 将 Input 页试用的 `Copy for AI` 同步到其余 Current 组件详情页。
- 更新仓库 README 与门户 README，说明非开发人员的单组件使用方式。
- 为门户 README 增加 English / 中文全页切换。

## 本轮完成

- 在门户集中登记 22 个 Current 组件的 AI 指引，覆盖用途、核心交互、视觉边界、无障碍和 AISEE 通用实施规则。
- 每个 Current 组件详情页显示双星 `Copy for AI`；Overview、Legacy、Brand 和 UI Kit 页面不显示。
- 组件 Prompt 明确 Demo 文案、数据、图标与插图只是可替换参考，防止 AI 把示例内容当作固定业务资产。
- 双星按钮与 `Open HTML` 高度统一为 40px，并保留更明显的浅柠檬绿表面。
- 门户 README 增加持久化 English / 中文切换，覆盖产品、来源、内容、视觉、交互、资源、组件、AI 交付、版本与架构章节。
- 门户 README 增加“无需写代码也能使用组件”的四步说明；根 `README.md` 与 `docs/AI_HANDOFF.md` 同步补充单组件交付方式。
- Components Overview 同步提示每个 Current 详情页提供 `Copy for AI`，并说明 Demo 内容和图标可替换。
- 机器可读 `#aisee-ai-contract` 增加组件 Prompt 暴露范围。

## 修改文件

- `aisee-design-system-preview.html`
- `README.md`
- `docs/AI_HANDOFF.md`
- `preview/dapp-v6-components.html`
- `tests/preview.test.mjs`

## 验收

- `npm run check` 通过，包括 token 检查、TypeScript、67 项测试、组件 Demo 构建和生产构建。
- `git diff --check` 通过。
- 本地浏览器验证 README 中文切换、Current Tabs 的 Copy for AI、非 Current 页面隐藏复制入口，以及 Copy/Open HTML 同为 40px。

## Git / 发布状态

- 当前分支：`ai/desktop/design-system-current`。
- HEAD：`4aa32b1 docs: record PR 9 merge`；本地分支原先已领先远端 1 个提交。
- 本轮 5 个产品/文档/测试文件与本 session、当前交接均为本地未提交、未推送状态。
- 用户本轮未要求 commit、push、PR 或同步 `main`。

## 未完成 / 下一步

- 等待用户查看本地 README 与各组件 Copy for AI 的效果。
- 用户确认并明确要求同步后，再按规则提交并 push 到 `ai/desktop/design-system-current`；同步 `main` 仍通过 PR。
- 既有未完成：Card 业务变体 Figma `10374:435175`；Plugin Entry Options 三个 Legacy Engage 内嵌页面的缺失 JSX 路径。
