# Notification 重置动画与 Select 视觉反馈 · 2026-09-17

## 完成

- Notification Reset demo 恢复四条未读后调用现有铃铛、徽章动画，数量已是四时也重播。
- 顶部演示按钮更名 Simulate incoming notification。正式 React 组件原本已在 count 增加时自动播放，未修改该组件；产品负责通过推送或轮询更新 count，本仓库未接入通知服务。
- 面板铃铛无障碍名称同步当前未读数，组件 Usage 和 Copy for AI 明确动画触发规则。
- Select 预览的 Live composition 与各组合 h3 从浏览器默认粗体改为 500。
- Score / Time / Intents chips 未选中 hover 为 5% 黑底与黑边，选中 hover 为 #333 白字，focus-visible 为 2px 黑色外框，不改变大小或选中逻辑。
- README、NEW 日期表、当前交接及 Notification 决策说明同步。

## 验证

- TypeScript 与现有 80 项测试通过（通知修改后运行）。
- 浏览器重复点击 Reset demo，读取到白铃铛 ring、徽章 badge-in 动画及 4 条未读。
- 所有组合标题 computed font-weight 为 500。
- 浏览器点击 Score≥85 后 hover 为 #333；键盘切换 Any 后，鼠标仍在 Score≥85 上，其未选中 hover 为 rgba(17,17,17,.05)，Any 有键盘焦点外框；状态文案同步正确。

## Git 与后续

- 分支 ai/desktop/design-system-current；HEAD / 远端 ae7b45e；本轮未提交、未推送。
- Sidebar 初始标题修复保留；Webapp 与组件页层级差异待确认。
- 其他未确认组件内容、原有混合工作区保持；上述小修待用户视觉验收。
