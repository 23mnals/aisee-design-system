# Copy for AI 保留宿主样式与动画增量接入 · 2026-09-24

## 用户要求与原因

用户反馈开发将 Copy for AI 提示词复制到项目后，原样式被替换为新建样式。明确要求先检查已有样式或 UI 库，在原实现上只补缺失内容；动画需求只添加动画，不更改既有外观和交互。

查明此前规则仅保护全局主题，却要求在宿主 primitive 上合并 AISEE 视觉/状态/动画，并把 preserve 视为全量必须。AutomationRunner 还有“除眨眼与跟随外交付行为权威”的规定，确实会引导覆盖宿主。

## 完成

- 短提示词直接加入检查宿主、保留样式/UI 库/交互、只补缺口、动画只加动效、禁止完整 CSS/平行组件、预览参数不覆盖已有实现等规则。
- 统一 integrationPolicy 传递到 latest 与归档元数据；全部 30 组件 preserve 第一项明确宿主优先，其他能力仅适用于新组件或本次缺口。
- 宿主指南明确检查局部 CSS/Tailwind/图标/状态/调用方，复用已有事件和 transform，cleanup/reduced-motion；不兼容不构成替换授权，无法安全添加时保持原实现并报告冲突。
- 下载说明、安装步骤和 standalone 使用例标明只供参考；已有目标不导入完整源码入口或样式，目标缺失才新增。
- 修正 AutomationRunner 旧权威条款及 NotificationBell 全量安装指令；同步门户中英说明、嵌入 AI 契约、Overview、README、交付/接入/铃铛/AI_HANDOFF 文档、TEAM_DECISIONS 与 AGENTS。
- README 最近更新保留三批，旧 Dropdown 更新归档 CHANGELOG；README NEW 日期按此次真实内容更新到 09-24，未批量续期组件标记。
- 重建 30 个交付版本和 stable latest；旧 release 不变。对比 HEAD 的 30 份 payload 与文件清单完全相同，没有修改生产组件、样式或交互。

## 验收

- npm test：140 项通过。
- npm run typecheck、npm run site、git diff --check 通过。
- node scripts/verify-ai-deliveries.mjs：30/30，通过隔离 React 类型检查/构建、文件完整性与拒绝覆盖检查。
- npm run audit:copy-ai：30 组件 / 205 受控案例 / 0 失败；新增规则回归覆盖 latest、归档、完整指南、动画与不兼容边界。
- 浏览器展开报告中 NotificationBell 实际提示词，确认宿主保护规则可见。
- 以上不是外部 AI 实际改造宿主的验证；用户目标业务仓库未提供，本轮未触碰开发项目。新版尚未发布，不能声称线上 Copy 已更新。

## 文件范围与 Git

- 核心：assets/ai-delivery.js、scripts/host-project-compatibility.mjs、scripts/build-ai-deliveries.mjs、delivery/components.json、assets/ai-deliveries 下生成的新版本/指针。
- 回归：tests/host-project-compatibility.test.mjs、tests/component-config.test.mjs、tests/preview.test.mjs、scripts/audit-copy-ai.mjs。
- 文档/门户：aisee-design-system-preview.html、preview/dapp-v6-components.html、assets/update-badges.js、README/CHANGELOG/AGENTS、docs 的相关交付说明、当前交接与本 session。
- 分支 ai/desktop/design-system-current，HEAD a866165；保留上一任务 Brand 改名所有未提交内容。本轮未 commit / push / merge，也未创建或关联 PR。

## 对话中的 PR 问题

用户问旧任务已有 PR 卡片，而当前任务显示“现有 Pull Request / 关联”是否必须点击。当前任务 list_artifacts 返回空。已解释这是当前任务的 PR 附件关联，不是远端连接或推送前置条件；向同分支推送会更新已有 PR 的提交，不能保证应用自动把卡片关联到新任务。后续要求推送时核对对应 PR 并按范围关联。未因此执行 Git 发布操作。

## 后续

用户授权后将本地改动提交/推送，待 Pages 发布成功再验证线上复制；开发在现有样式的真实宿主复测铃铛/按钮/Tooltip/Runner 动画，检查静态外观、点击/键盘/状态和定位拖拽不被改变。已有被覆盖的业务代码需要在目标仓库另行恢复，提示词更新不会自动修复它。
