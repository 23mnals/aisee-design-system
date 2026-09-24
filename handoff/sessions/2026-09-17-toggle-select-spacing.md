# Toggle 变量下拉框箭头与留白

- 用户要求：截图中 Color / Surface / Size / State 四个下拉框使用侧边栏同款箭头，增大箭头与右边缘的间距。
- 修改：Toggle 组件页关闭原生 select 箭头，引用侧边栏使用的 `assets/stemui/line_chevron-up.svg`，旋转 90 度向下；16px 图标距右边 12px，文字右 padding 40px，控件高 36px、最小宽 100px；保留原生 select 的选择与键盘操作。
- 同步 README 当前批次与 handoff-context 当前状态；其余组件和未确认内容保持原样。
- 分支 `ai/desktop/design-system-current`；HEAD 仍为 `546faba`；未 commit / push。
- 验证：浏览器检查四个下拉框同款箭头与间距，切换值正常；git diff --check 通过。
- 待完成：Sidebar 两处差异、Toggle 视觉确认、Notification 与 Select / Dropdown 逐项验收继续按上一轮安排。
- 前一轮完整记录：[Sidebar 验收与 Toggle 变量](2026-09-17-sidebar-review-toggle-variants.md)。
