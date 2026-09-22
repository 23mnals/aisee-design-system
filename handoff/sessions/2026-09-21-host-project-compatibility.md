# 2026-09-21 · Host Project Compatibility

## 目标与完成

按用户八条要求将宿主兼容性纳入全部 Copy for AI 生产交付，不只针对 Notification。所有已登记清单明确 integrationMode / primitives / preserve，并声明每个适配边界的源文件、必要底层能力与 standalone fallback。未增加宿主检测运行时或第三方预制 adapter。

接收方编码 AI 在安装前检查目标项目依赖、现有 primitives、版本/API/ref、主题和 Provider。已有兼容底层能力优先复用，局部 adapter 保持 AISEE 外观、状态、动画、行为、props/ref 与无障碍；不兼容则按边界独立回退。禁止安装整套新框架、全局控制选择器/reset 或覆盖宿主主题。源安装器仍只解包验证后的独立实现。

## 修改

- delivery/components.json：每个组件显式适配边界与保留规范；展示型组件允许无库级边界。
- scripts/host-project-compatibility.mjs：字段校验、元数据、统一英文接入说明。
- scripts/production-delivery.mjs / build-ai-deliveries.mjs：校验接入、新规则纳入版本哈希、latest/archive/ready.md 传递；全部生产交付重新构建。
- tests/host-project-compatibility.test.mjs：规则缺失/错误边界拦截、全部版本传播、CSS 全局隔离；既有生产依赖测试调整 fixture 保持针对缺失 import 的验证。
- README/CHANGELOG、docs/PRODUCTION_DELIVERY.md、GETTING_STARTED.md、AI_HANDOFF.md、TEAM_DECISIONS.md：同步规范；门户 Overview 中英说明、机器规则同步，单组件不再强制 Karla。
- tests/preview.test.mjs：同步字体契约及此前三天 NEW 的已确认日期判断，不恢复旧规则。

原有生产 runtime 未修改；清单仍决定完整 standalone 必需文件，不因选项或宿主库猜测文件数量。Demo 不随交付接入规则改变。保留之前未提交的滚动条、NEW、描述与工具栏/侧栏间距修复及全部原型/备用资源。

## 验收

134 项测试、类型检查通过。Registered components: 29；Verified deliveries: 29，独立 React 安装文件边界、校验/重装/冲突、类型和构建通过。196 个 Copy 配置案例 0 失败。静态站点构建及 diff 空白检查通过。

边界：本轮没有实际验证各第三方 UI 框架的宿主 adapter，没有浏览器 Copy 点击复测，不将交付构建结果等同真实宿主适配。规则由接收方编码 AI 执行，不是安装器自动检测。生产文件列表和短复制形式保留。

## Git 与发布

分支 ai/desktop/design-system-current，HEAD 674efe6103ce4281406da16f834ca4e95c509e10。本轮未 commit/push。新 release/latest 为本地未发布状态，当前公开站点仍上一版；本地 Copy 的公开版本核验可能提示待发布。旧公开 release 保留，无关资源未处理，main 未操作。

## 下一步

用户授权发布后整理相关差异推开发分支，待 CI/Pages 完成后检查公开 latest/说明/校验以及 Copy。外部开发在实际宿主验证复用点、回退原因和视觉/状态/动效/键盘/焦点/浮层，不改变本轮明确的生产/Demo 边界。
