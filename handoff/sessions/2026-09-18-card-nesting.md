# 卡片嵌套层级 · 2026-09-18

## 用户澄清

当任何区域已使用复杂描边卡片，内层不再重复复杂描边，优先浅灰填充或浅描边白底；不是只针对 Post 弹窗。用户参考 Figma 77:16889，已读取并继续读取内部 77:16984（Post setup）。

## 实现与验证

- 共享 components.css 针对 section 内的 Card 去除阴影，嵌套 section 自动简化为白底浅描边、8px 圆角、12px 内距；内层标题 14px / 500。
- 仍复用相同 Card，不复制 Post 专用卡片，不影响内容、折叠、选中与输入状态。
- 浏览器实际验证 Step 1 / 2 / 3 保留 5px 白内框、16px 圆角 / 内距；内部 Post setup 为无阴影、8px / 12px、白底。分段选项仍正常显示。
- Card 定向构建通过；规范、README、Copy for AI、AI_HANDOFF 与 TEAM_DECISIONS 同步。此前 Segmented Choice 已完成 88 项测试、键盘 / 窄屏与弹窗集成验证。

## 状态

HEAD 25c8f9f，分支 ai/desktop/design-system-current；未提交 / 推送，其他原有本地改动保留。已确认长期层级规则，本轮视觉实现待用户验收。
