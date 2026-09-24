# AISEE Design System 当前交接

> 工作纪律见 [AGENTS.md](AGENTS.md)，长期决策见 [docs/TEAM_DECISIONS.md](docs/TEAM_DECISIONS.md)。

## 当前 Git 与发布

- 统一开发分支 `ai/desktop/design-system-current`，本批为 Toggle 验证后的全组件 Copy for AI 发布；之前 HEAD 为 `9d022e3`，当前提交号看 Git log。
- 用户已授权本批提交与推送；Pages 由开发分支 CI 成功后更新，是否已上线以该提交的 CI/Pages 结果为准。main 未操作，未创建或合并 PR。
- 本地仍有独立的 AI Design Brief/资料权威阶段未提交工作；本批不包含这些资料，不要整库 add 或回滚工作区。

## 最近完成与当前规则

- 用户反馈 Toggle 跨项目验证没有明显问题；全部 30 个组件共用已验证的 Copy for AI 规则与精简菜单。
- Apply AISEE design 默认更新指定组件视觉与动效；Add motion only 保留现有静态外观。两模式只在 Goal 不同。
- 修改前列精确组件文件与专属局部样式路径。保留公开 API、状态所有权、事件与业务流程；页面布局/文案、业务逻辑、hook、API、请求层和项目配置默认禁止改动，必要时先列文件、原因、最小 diff 与影响，等待明确确认。
- 默认无预览参数；仅 Target variant 菜单明确选择的一个目标附加到复制内容，变更预览或组件后清除旧选择。
- 单行主按钮显示当前模式，箭头展开模式与变体菜单；复制成功显示 Copied 与模式提示。完整文本见 [Toggle 示例](docs/TOGGLE_COPY_AI.md)，同一规则用于全部登记组件。
- 生产组件源码、payload、tokens 和 UI Kit 本批未修改。Brand 仍为 Foundations / Explorations，Managed Automation 保持 Draft。

## 验收

独立导出实际暂存内容后，148 项测试、tokens/类型/构建、205 个复制配置案例、30 个独立交付验证、静态站点构建与 diff 检查通过。Button 的两模式在浏览器均显示复制成功。其余组件的外部 AI 实际接入仍需逐项业务项目验证，不能由仓库检查推断通过。

## 未完成与下一步

- 发布完成后刷新门户、重新 Copy，逐项验收 Dropdown/Tooltip、Automation Runner 等真实项目；保留现有业务行为与文件范围。
- Runner 继续检查空详情、视口四边及跨路由；MUI/Ant/Chakra 的宿主 primitive 复用仍需真实项目验证。
- 本地 AI Design Brief/资料权威工作与真实项目改动收敛未包含在本批提交中，继续独立处理，不能拿本批发布当作它们已完成发布。
- FeatureOverview 平台图标条组件化未实施；连接弹窗暂缓；支付/自动化执行由业务接口负责。

## 最近 session

- [全组件 Copy for AI 规则同步与发布](handoff/sessions/2026-09-24-copy-ai-all-components-release.md)
- [单行工具栏与选项菜单](handoff/sessions/2026-09-24-copy-ai-menu-polish.md)
- [两模式与显式变体](handoff/sessions/2026-09-24-copy-ai-modes.md)
