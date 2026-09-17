# AISEE Design System 当前交接

> 当前状态覆盖更新；工作纪律见 [AGENTS.md](AGENTS.md)，长期决策见 [docs/TEAM_DECISIONS.md](docs/TEAM_DECISIONS.md)，历史见 [handoff/sessions/](handoff/sessions/)。

## 当前 Git

- 开发分支：`ai/desktop/design-system-current`，跟踪 `origin/ai/desktop/design-system-current`。
- 本批发布基线包含 `441838f feat: publish dialog tabs and quantity stepper updates` 与 `5787654 feat: add tree nav and checkbox celebration`；交接记录位于当前 HEAD。
- `main` 未直接修改；正式同步仍通过 `ai/desktop/design-system-current → main` PR。
- 工作区刻意保留三组未提交内容：第 7 项 Select / Dropdown、Notification、本轮 Sidebar Navigation 修复。

## 最近完成

- Dialog 已同步用户选定的克制入场动画：260ms 轻微上移与缩放，内容短暂延后进入；关闭使用 180ms，并兼容 reduced motion。
- Tabs 的 `Show icons` 与 `Show counts` 已改用正式 Toggle 结构与动效。
- Quantity Stepper 已进入 `Components → Inputs & Controls`：Figma 对齐外观、StemUI 加减图标、整块数值热区原位输入、黄色文本选区、数字滚动、长按加速、边界抖动和窄容器隐藏单位均已完成。
- Tree Nav 与 Checkbox 动效已在 `5787654` 提交。
- 已完成内容在独立干净快照中通过 74 项测试、TypeScript 检查与组件 Demo 构建。

## 正在做 / 待用户确认

- **Sidebar Navigation**：已在本地恢复 Growth 的 `Opportunities / Recommendations / Tasks` 与 Engage 的 `Signal Feed / Keywords & Accounts / Replies`；Engage 改用 StemUI 正式图标，并把可视尺寸统一为 13px，等待用户在 Demo 验收。
- **Notification**：已把通知面板预览舞台收紧到内容高度，面板底部只保留 24px 留白；该组件其余铃铛、徽章、消息条目、空状态和变量仍保持本地待验收。
- **Select / Dropdown（第 7 项）**：Variant Playground、Icon action menu、StemUI 图标与自适应舞台修改继续保留在本地，未进入本批远端提交。

## 关键决策

- 用户未明确允许自由发挥时，严格按 Figma 样式、现有颜色变量和正式 StemUI 图标实现。
- 组件 Demo 的业务图标必须引用 `@stemui/icons` 明确导出；纯 HTML 使用 `assets/stemui/` 版本化只读快照。
- Notification 动画区分两个触发：新通知包含白色铃铛摆动与徽章滚动；hover / focus 只摆动白色铃铛。
- Dropdown 菜单保持浮层，不改变外围页面高度；第 7 项未确认前不提交。
- 普通开发使用 `ai/desktop/design-system-current`；正式同步 `main` 通过 PR，PR 不自动合并。

## 下一步

1. 用户逐项验收 Sidebar Navigation 的层级与 Engage 图标。
2. 用户验收 Notification 面板底部高度。
3. 继续第 7 项 Select / Dropdown 的交互与版式确认。
4. 各项确认后按范围单独提交，避免把待确认内容混入已发布批次。

## 最近一次 Session

- [2026-09-17-completed-sync-and-pending-bugs.md](handoff/sessions/2026-09-17-completed-sync-and-pending-bugs.md)
