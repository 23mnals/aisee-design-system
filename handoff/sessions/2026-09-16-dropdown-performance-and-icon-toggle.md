# 2026-09-16 Dropdown 性能、图标开关与浮层修复

## 本轮目标

- 修复 Dropdown Fluid Hover 在正式 Demo 中仍有停顿的问题。
- 解释并重做 Variant Playground 顶部参数展示，避免看起来像可操作参数。
- 为 Grouped account 增加真实的 `Show icons` 开关：开启显示头像与平台图标，关闭只显示文字。
- 保证所有下拉菜单展开或收起时不改变外围内容高度与后续内容位置。

## 本轮完成

- React `Dropdown` 在菜单打开或尺寸变化时缓存可用项几何信息；指针移动时直接使用缓存，避免重复 DOM 查询和布局读取。
- Fluid Hover 位移缩短为 110ms，尺寸变化为 80ms，透明度为 60ms，并保留 reduced-motion。
- 正式 Select / Dropdown Demo 与独立预览同步使用缓存几何和更短动效。
- Variant Playground 参数改为 `Current preview · Read only` 的说明列表。
- Grouped account 新增现行 Toggle 样式的 `Show icons` 控件；关闭后隐藏每个选项的 leading avatar / platform icon，文字、辅助信息、状态与行操作保持不变。
- 修复 `.fluid-hover-surface` 覆盖菜单 `position: absolute` 的问题。组合选择器展开前后实测：Playground 高度 `526.59375px`、Summary 顶部 `407.09375px`、Composition 顶部 `477.09375px`、文档 `scrollHeight 1914px`，四项均不变化。
- Copy for AI、组件 README、团队长期决策与自动测试已同步上述规则。

## 修改文件

- `src/components/Dropdown.tsx`
- `src/styles/components.css`
- `components/Select/Select.html`
- `prototypes/dropdown-fluid-hover-preview.html`
- `aisee-design-system-preview.html`
- `components/README.md`
- `docs/TEAM_DECISIONS.md`
- `tests/preview.test.mjs`
- 完整构建同步更新的组件 Demo CSS / JS 产物。

## 验收

- 浏览器实测组合下拉框展开前后高度与位置完全一致。
- 浏览器实测 Grouped account：Toggle 开启时 8 个 leading icon 可见；关闭时 0 个可见，说明同步切换为 `Text-only rows`。
- `npm run check` 通过：token 检查、TypeScript、72/72 测试、全部组件 Demo 与库构建。
- 正式 Demo 与独立预览内联脚本语法检查通过。
- `git diff --check` 通过。

## Git

- 分支：`ai/desktop/design-system-current`
- 实现提交：`9c887ba fix: refine dropdown interactions`
- 实现提交已推送至 `origin/ai/desktop/design-system-current`。
- 已创建 [PR #10](https://github.com/23mnals/aisee-design-system/pull/10)：`ai/desktop/design-system-current → main`。
- 用户确认采用开发预览发布方案：GitHub Pages 改由 `ai/desktop/design-system-current` 的 push 触发，完整检查通过后更新右侧公开 Demo；`main` 继续作为 PR 确认后的正式稳定代码。
- README 的 v6 主要更新已补齐 Avatar、Empty State、Dropdown 图标开关与浮层高度、组件目录 A–Z、NEW 与 Copy for AI 同步规则。
- README 新增按日期维护的“最近更新”，完整列出 9 月 15～16 日的用户可见变更；长期决策明确以后每个批次都必须逐项同步，v6 摘要不能替代更新清单。

## 下一步

- 用户复查 Dropdown hover 手感、Show icons 开关和浮层高度稳定性。
- 推送 README 与 Pages 工作流更新，随后确认 GitHub Actions 检查及公开 Demo 部署结果；PR #10 保持开启，后续仅在用户明确授权时合并。
