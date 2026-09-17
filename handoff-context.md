# AISEE Design System 当前交接

> 当前状态覆盖更新；工作纪律见 [AGENTS.md](AGENTS.md)，长期决策见 [docs/TEAM_DECISIONS.md](docs/TEAM_DECISIONS.md)，历史见 [handoff/sessions/](handoff/sessions/)。

## 当前 Git

- 开发分支：`ai/desktop/design-system-current`，跟踪 `origin/ai/desktop/design-system-current`。
- 最新功能提交：`549782a feat: add toggle variants and refine engage icon`；本次文档提交记录其发布边界。用户已授权推送开发分支。
- 已发布关键实现：`441838f`（Dialog / Tabs / Quantity Stepper）、`5787654`（Tree Nav / Checkbox）。
- 工作区保留 Sidebar Navigation 层级、Notification、Select / Dropdown 等未提交内容；Toggle 变量、下拉框间距及 Engage 15px 图标已独立提交。
- `main` 未直接修改；正式同步仍通过开发分支到 main 的 PR。

## 最近完成

- 已发布的 Dialog 克制入场动画、Tabs 正式 Toggle、Quantity Stepper 数值输入 / 滚动 / 长按 / 边界反馈、Tree Nav 与 Checkbox 动效保持原样。
- Toggle 已提交柠檬绿 / 黄色、浅色 / 深色背景及 16 / 24px 高度变量；24px 依据 Figma Automation 节点，保留深色描边和圆钮。
- Toggle 组件页提供变量切换和 8 组对照；四个变量下拉框已换为侧边栏同款 StemUI 箭头，箭头右侧留白 12px、文字右侧预留 40px。README、Overview、Copy for AI 已同步并纳入提交。
- 发布快照通过完整 npm run check（74 项测试、类型、token 与构建）及浏览器预览；不含其他待确认内容。Toggle 与 Engage 图标已获用户发布授权。

## 正在做 / 待用户确认

- **Sidebar Navigation**：Growth / Engage 子级、StemUI Engage 图标、独立展开、收起浮层及子项选择已经过浏览器检查。暂未验收通过：初始 Summary 选中项与 Signal Feed 内容标题不一致；Webapp UI Kit 的 Growth / Engage 仍是单级入口，与组件页不同。两处差异仍只记录；后续按用户截图反馈将组件页 Engage 图标由 13px 放大至 15px，18px 图标容器与文字位置不变，Webapp 未修改。
- **Toggle（已提交）**：新增 `color=lime|yellow`、`surface=light|dark`、`size=16|24`；默认保持原 16px 和模块色。已按用户授权纳入本次发布。
- **Notification**：面板底部 24px 留白及其余铃铛、徽章、消息条目、空状态和变量仍待逐项验收；本轮未修改。
- **Select / Dropdown（第 7 项）**：Variant Playground、Icon action menu、StemUI 图标与自适应舞台保留本地；本轮未修改。

## 关键决策

- 按 Figma 样式、现有颜色变量和正式 StemUI 图标实现，不自行扩展未要求的产品方向。
- React 业务图标引用 `@stemui/icons`；纯 HTML 使用 `assets/stemui/` 版本化快照。
- Notification 新通知触发铃铛摆动与徽章滚动；hover / focus 仅摆动白色铃铛。
- Dropdown 保持浮层，不改变外围高度；未确认前不提交。
- 普通开发使用统一开发分支；正式同步 main 通过 PR，PR 不自动合并。

## 下一步

1. 确认 Sidebar 的初始状态和 Webapp 层级差异，按范围处理。
2. 复查远端 Demo 的 Toggle 组合与 Engage 图标。
3. 继续 Notification，然后 Select / Dropdown。
4. 只有获得相应发布授权后，才按独立范围提交，避免混入其他待确认内容。

## 最近一次 Session

- [2026-09-17-toggle-engage-publish.md](handoff/sessions/2026-09-17-toggle-engage-publish.md)
