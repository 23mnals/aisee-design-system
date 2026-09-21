# AISEE Design System 当前交接

> 工作纪律见 AGENTS.md；长期决策见 docs/TEAM_DECISIONS.md；历史见 handoff/sessions/。

## 当前发布批次 · 2026-09-21

- 用户明确授权发布新版 Copy for AI 给外部开发使用；目标为 ai/desktop/design-system-current，不操作 main。
- 基于远端 dbaabd12c883ca21c930d51000db95d4b1089bf5，在独立发布工作区整理全组件生产交付机制、必要 Current 源码依赖与文档。原本地工作区的其他未提交文件保留。
- 每个已登记组件使用显式 production manifest，排除 Demo、mock、字体与全局 Design System 环境；必要文件数量不设上限。
- CSS 使用 selector/value AST 依赖闭包，保留状态、变量默认值与条件覆盖、keyframes、media/supports/reduced-motion；缺失依赖阻止构建。
- 复制短指令指定组件名及真实选项，稳定 latest.json 在执行时解析最新已发布生产版本；已安装源码不自动更新。兼容要求由各组件清单声明。
- NotificationBell 仅交付铃铛源码、局部样式、入口与 CSS 类型声明；业务 count/dot/onClick、铃铛和数字动画保留，面板与演示控制不交付。
- Tooltip 已确认的智能定位与 Playful 预览作为当前清单依赖同步发布；原 Demo 仍可切换所有状态。

## 验收与发布状态

- 独立发布目录完成类型检查、124 项测试、组件/包/静态站点构建。
- Registered components: 28；Verified deliveries: 28；全部独立安装、类型检查、构建通过。配置审计 192 个案例、0 失败。
- 发布目录与原工作区生成的生产版本清单完全一致。旧已发布的不可变交付链接保留。
- 本提交推送后由 CI 验证并部署 Pages；最终状态以 GitHub Actions 和公开地址验证结果为准，不把本地检查等同于线上部署成功。
- 公开入口：https://23mnals.github.io/aisee-design-system/

## 未完成与下一步

- 外部开发需要从新版页面重新 Copy for AI，在真实业务项目复测；不要继续转发旧 ready-30.md。
- 尚未运行所有组件全部视觉状态或跨 AI 平台产出对比；类型/构建通过不等同于全部视觉验收。
- 原本地工作区 HEAD d6d166b 与远端存在分叉及未提交修改，禁止直接 pull/reset/覆盖；下次修改先核对 git status 与远端差异。
- 后续普通开发不自动发布；正式同步 main 仍需用户授权 PR，合并另需明确授权。
- 最近 session：[统一生产交付发布](handoff/sessions/2026-09-21-production-delivery-publish.md)。
