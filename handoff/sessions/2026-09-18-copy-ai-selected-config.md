# 全组件 Copy for AI 当前配置

## 目标与确认

用户要求所有带变量的组件统一“选好变量后复制所选配置”，并写入 README；提供截图或链接时先匹配合适的已有组件并直接复用。此前讨论已确认预览变量不应随机选择，也不自动变成产品全局配置。

## 已完成

- 增加 `assets/component-config.js`：28 个现有 Copy for AI 入口全部注册，15 个变量页读取最新配置，13 个固定展示页明确无变量选择。按 scope 区分独立示例；props 与组合 / 插槽 / 主题 / 动效分开。
- 门户在点击复制时读取同源 iframe，检查加载、路径及配置，阻止上一页 / 缺失状态的静默回退。现有静态组件说明保留，末尾附实时 JSON。
- React 配置声明接入 SidebarNavigation、Button、Toggle、EmptyState、FeatureOverview、Card、ToggleSelectionGroup、Steps；静态读取覆盖 Input、Checkbox、QuantityStepper、Tabs、NotificationBell、Select、Avatar。
- README 增加全系统选择与复用规则，最近更新保留三批；旧批次归入 CHANGELOG。同步 Overview、AI_HANDOFF、TEAM_DECISIONS、机器契约、NEW 日期，并新增 COMPONENT_CONFIGURATION 维护说明。
- 不导出业务输入；关闭图标后排除位置，切组合后排除隐藏控制器。无变量页不擅自取第一张展示卡。截图仅证明可见结构，不猜测隐藏行为。

## 验证

- typecheck、104 项测试、完整 demos / 包 / 静态站点构建通过，git diff --check 通过。
- 28 个组件入口浏览器点击复制均显示成功；实测 Sidebar topbar、Button 左右切换 / 隐藏，DOM 快照随实际状态更新。
- 浏览器工具的虚拟剪贴板读回为空，无法用该接口回读原生页面写入。新增集成测试直接运行门户实际复制处理函数，验证传入剪贴板的文本包含最新变量、切换后刷新、预览不匹配时不写入；没有宣称其他 AI 平台消费结果已验证。
- 6 项新增配置测试覆盖全部入口注册、实时性、多示例、失效字段、真实 API 类型与切页竞态。

## Git 与交付

- 分支 ai/desktop/design-system-current；HEAD 25c8f9f。原有大量混合改动保留，本轮无 commit / push / merge。
- 本轮规则已用户确认，最终复制体验待验收。产品默认布局尚未指定，不擅自设置。
- 后续新增变量需同步配置声明与测试；具体入口清单见 docs/COMPONENT_CONFIGURATION.md。
