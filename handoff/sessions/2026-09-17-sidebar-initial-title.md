# Sidebar 初始标题同步修复 · 2026-09-17

## 目标与完成

- 用户要求修复 Sidebar 初始选中 Summary、内容标题显示 Signal Feed 的 bug。
- 移除静态默认标题；每次导航渲染后，从当前选中菜单取标题，首次加载与后续切换共用同一逻辑。
- 更新 README 最近更新和当前交接。未修改其他组件或导航层级。

## 验证

- 本地浏览器首次加载：选中 Summary，标题 Summary。
- 点击 Full Report：选中与标题均为 Full Report。
- 收起侧栏，打开 Engage 浮层并选择 Replies：选中与标题均为 Replies。
- 刷新后恢复 Summary，标题一致。

## Git 与未完成

- 分支 ai/desktop/design-system-current，HEAD / 远端仍为 ae7b45e，本轮未提交或推送。
- 原有混合工作区保留，NEW 日期逻辑与 Toggle 正式 Dropdown 等仍为本地待验收。
- 用户询问 Webapp 与组件页层级差异：已解释 Webapp 的 Growth / Engage 是单级入口，组件页有子菜单；产品层级方向尚未确认，未修改。
- 后续继续逐项验收 Sidebar、Notification、Select / Dropdown。
