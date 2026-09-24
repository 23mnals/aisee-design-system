# 2026-09-24 Copy for AI 两模式与显式变体

## 用户要求

详情页保留一个主复制按钮，增加 Apply AISEE design（默认，更新现有组件视觉与动效）和 Add motion only（保持静态外观、只加动效）。两模式生成文本只在目标描述不同，共用组件修改范围/业务保护。默认移除 Variant playground 参数，只有明确选择变体才写入目标。复制前后显示模式，交付完整两份文本。

## 完成与实现

- 门户主按钮旁增加模式 select，下面显示可选 Variant 与状态。默认 No specific variant；变体需要在该 select 明确选择一项，单纯浏览或操作预览不代表接入意图。切换预览清除旧选择，切换组件恢复默认模式/无变体。
- `assets/ai-delivery.js` 为 30 个组件统一生成两模式提示词，只在 Goal 行不同。业务保护完全共享：目标实现与专属局部样式可写；页面、业务 hook、API、请求、配置默认不可写；范围外先列文件/原因/最小 diff/影响并等待明确确认。
- 设计模式可更新组件视觉，受页面布局及业务保护约束；动效模式保护全部静态外观。显式变体只约束所选目标允许的属性，不允许动效模式换肤或任一模式改变业务状态。
- 新增 `assets/copy-ai-controls.js` 管理模式/变体意图、异步复制与 UI 状态。复制时重读配置；陈旧 frame/变体、期间导航或切换选择都不能写入旧提示词。禁用控件避免复制中改模式。
- 更新使用文档、README 中英门户说明、机器可读契约和长期规则，避免旧“始终保留样式”与新设计模式冲突。复制目标/范围显式优先于既有源码参考的通用保留/安装步骤，未重打生产源码交付。

## 文件

功能：`aisee-design-system-preview.html`、`assets/ai-delivery.js`、新增 `assets/copy-ai-controls.js`。

说明：`docs/TOGGLE_COPY_AI.md`（两份真实默认生成文本）、`docs/PRODUCTION_DELIVERY.md`、`docs/COMPONENT_CONFIGURATION.md`、`components/README.md`、`components/Toggle/Toggle.html`、`preview/dapp-v6-components.html`。

规则与记录：`AGENTS.md`、`docs/TEAM_DECISIONS.md`、`README.md`、`CHANGELOG.md`、`handoff-context.md`、本 session。README 只保留最近三批，旧第三批归档；未续期组件 NEW。

验收：`tests/component-config.test.mjs`、新增 `tests/copy-ai-controls.test.mjs`、`tests/preview.test.mjs`、`scripts/audit-copy-ai.mjs`。

## 验证与边界

- 73 项相关测试通过：全组件两个目标、共享文本逐字一致、默认无参数、显式单一变体、行为状态过滤、模式 UI、变体清除、导航/模式/网络异步错误及陈旧 frame 保护。
- 30 组件/205 配置审计通过；显式变体逐项仍经过交付白名单。
- 静态站点构建与 diff 格式检查通过。
- 本地浏览器验证：默认 Apply AISEE design；两种模式分别点击复制成功且状态含模式；显式选变体后反馈 Selected variant；改变 Color 后清除选择并提示重新选择；切换 Button 后默认模式且无旧变体。桌面截图检查操作区未遮挡内容。工具虚拟剪贴板此前无法读回系统内容，本轮完整文本由真实生成器与控制器测试核对，不冒称系统剪贴板逐字读回。
- 初始文件 hash 对比确认没有修改生产 src、assets/ai-deliveries、UI Kit 或第一阶段 docs/ai-design 资料；既有未提交修改保留。测试业务仓库没有改动。

## Git / 使用 / 下一步

开发分支 `ai/desktop/design-system-current`，HEAD/origin `9d022e3`；本轮及既有资料改动未 commit/push。线上门户仍是旧版。

本地门户 `http://127.0.0.1:4173/aisee-design-system-preview.html#page=components%2FToggle%2FToggle.html` 选择模式后复制；也可直接使用 `docs/TOGGLE_COPY_AI.md` 两个完整代码块。下一步在真实宿主分别复测设计模式和动效模式，核对任务新增 diff 与业务行为。提示词约束测试不是外部 AI 遵循的保证。此前业务项目收敛方案仍未执行。
