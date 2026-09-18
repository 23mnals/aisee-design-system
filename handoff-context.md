# AISEE Design System 当前交接

> 工作纪律见 [AGENTS.md](AGENTS.md)，长期决策见 [docs/TEAM_DECISIONS.md](docs/TEAM_DECISIONS.md)，历史见 [handoff/sessions/](handoff/sessions/)。

## 当前 Git

- 分支：`ai/desktop/design-system-current`。
- 最新功能提交：`2a9d63a feat: publish component variants and Copy for AI configuration audit`，已按用户本轮授权推送到同名远端开发分支；`main` 未修改。
- 本次交接记录随独立文档提交保存在本地；功能提交后的文档 push 连续因 GitHub 443 连接超时失败，尚有 1 个文档提交未推送。网络恢复后重试普通 push；最终 HEAD 请读取 `git log`。
- 当前组件、演示、资源、配置复制规则及批量检查已纳入版本。未引用的 Notification 备用素材、`prototypes/assets/` 和两个 dialog / notification 动效实验页面保留本地，未加入提交；不要删除或误判为发布遗漏。
- 本轮本地检查全部通过；功能提交的远端 CI verify 与 Pages 部署均已成功（run `35333320666`），批量报告 artifact 已上传。

## 已完成 / 最近更新

- **Copy for AI 全组件当前配置**：15 个变量页面在点击时读取当前 iframe 的选择，13 个固定展示页明确没有选定示例。独立示例、真实 props、组合 / 插槽分开记录；隐藏无关参数与业务输入不进入配置。覆盖 28 个复制入口。
- **批量检查**：运行 `npm run audit:copy-ai`，输出 `artifacts/copy-ai-audit/report.html`、JSON 和 `review.csv`。当前 190 个受控配置案例通过，检查实际提示词模板、配置读取、公开 TypeScript props 和复制处理函数；CI 自动执行并上传 `copy-ai-audit` artifact。README 与 [验收说明](docs/COPY_AI_VALIDATION.md) 已同步。
- **验证边界**：190 个案例是配置契约检查，不是自动点击所有浏览器变量或实际调用其他 AI 生成页面。CSV 的 browser / AI_output 默认 NOT RUN；每次重跑会覆盖报告，已填写的验收表应另存。此前 28 个入口浏览器复制反馈成功、侧栏和按钮变量切换已验证；工具虚拟剪贴板不能可靠读回内容，处理函数由集成测试验证。
- 本轮 `npm run check` 通过：类型检查、104 项测试、组件 / 包构建；`npm run site` 静态站点构建通过。报告页面在浏览器可打开。
- **Sidebar**：白底 / 灰底通栏、floating、inset × inside / outside，以及 topbar + hover / click；外置按钮位于内容标题栏，16px 间距、透明 floating 标题、inset 底分隔线、button/usual hover 和轻阴影已实现。
- **PlanCard / FeatureOverview**：新版单套餐订阅确认、旧三档比较保留；连体分区 Card、FeatureList、紧凑 StatCard、四区组合及文字 / 图标模式已实现。
- **其他本批版本内容**：Card 九类组合、Textarea 与 Create Post；Segmented Choice；Brand Mention TagInput；嵌套简化、弹窗滚动；Select hover / 浮层 / 摘要与危险行颜色；Button 图标变量；Toggle 正式 Dropdown；NEW 七天规则；TreeNav 行操作与 Webapp 关联导航更新。

## 仍待确认 / 未完成

- **实际 AI 产出验收**：尚未运行跨 AI 平台生成对比。固定模型 / 版本 / 任务 / 视口，按验收表比较布局、变量、交互和响应式；关键案例至少独立复测两次。合同检查通过不等于视觉还原通过。
- **视觉 / 产品验收**：用户本轮授权保存远端开发版本，不等同于每个组件所有场景已验收，也不等同于正式同步 main。
- PlanCard 订阅确认、FeatureOverview 第一批、Segmented Choice / Card、Button 图标变量、Select / Sidebar、Toggle 正式菜单、NEW 七天规则继续按实际预览验收。
- FeatureOverview 第二批平台图标条组件化尚未实施；购买 / 支付及分析启动由产品接口负责。
- Webapp 的 Growth / Engage 为单级入口，组件页有子菜单，产品层级方向仍待确认，未擅自统一。
- Button 参考稿中的完整任务列表 / 回复卡片是否扩展为复合组件尚未确认。
- 用户尚未指定全产品统一布局配置；单次 Demo 选择不自动成为全产品默认值。
- Connect X / LinkedIn / TikTok 连接账号弹窗暂缓。

## 当前规则

- 全组件遵循“先选变量、再复制”；新增变量同步配置快照与批量案例，契约见 [COMPONENT_CONFIGURATION.md](docs/COMPONENT_CONFIGURATION.md)。
- 截图 / 可访问链接先匹配并复用 Current 组件。选择优先级：明确用户选择 → 目标设计 → 产品既有配置 → 文档默认值。同产品保留统一配置；截图不能证明隐藏交互。
- NEW 日期由 `assets/update-badges.js` 显式维护，按 Asia/Taipei 日历日计算七天，不因构建自动刷新；业务示例自己的 NEW 不参与。
- Dropdown 是浮层；复杂描边仅用于外层 Card，内层保持简单表面。
- 后续普通修改不自动提交 / 推送；本轮远端保存授权已执行，正式进入 main 仍走授权 PR。

## 下一步

1. 按批量报告选择代表案例，实际生成并填写视觉 / 交互验收结果；新增变量同时维护检查案例。
2. 按用户反馈继续组件验收，确认 Sidebar 产品层级及 FeatureOverview 第二批范围。
3. 用户明确授权正式同步时，再创建开发分支到 main 的 PR。

## 最近 session

- [2026-09-18-copy-ai-audit-release.md](handoff/sessions/2026-09-18-copy-ai-audit-release.md)
- [2026-09-18-copy-ai-selected-config.md](handoff/sessions/2026-09-18-copy-ai-selected-config.md)
