# Select 分组账号交互修正 · 2026-09-17

## 用户要求与完成

- Test 分组标题原来没有交互，现增加 aria-expanded / aria-controls，点击、Enter 或 Space 可收起和展开其账号行，箭头同步方向。
- 数字 0 默认右距 12px，不再为隐藏图标预留 42px。行 hover 或 focus-within 时右内边距在 160ms 内变为 42px，数字左移 30px，操作按钮淡入；离开后恢复，支持 reduced motion。
- Connect X / LinkedIn / TikTok 移除附加加号，使用独立整行按钮，不改变当前账号选择。点击仅在已有状态区说明弹窗未包含在 demo；连接账号弹窗遵用户说明暂不实现。
- 保留 Coming Soon、正式图标、Show icons 与现有 fluid hover。分组收起不改变外部预览舞台预留高度。
- 更新组件介绍、README、Copy for AI 和当前交接。本轮不扩展通用 Dropdown API 或修改其他组件生成文件。

## 验证

- 浏览器确认 Test 收起隐藏子账号，Enter 展开恢复。
- 数字默认右距 12px、action opacity 0；hover / focus 后右距 42px、opacity 1，padding transition 160ms。
- 点击 Connect X 后原账号仍选中；三个 Connect 入口均无独立加号。
- 已检查实际截图，选中、hover 及 Coming Soon 保持可见。

## Git 与后续

- ai/desktop/design-system-current，HEAD / 远端 ae7b45e；本轮未提交、未推送。
- 原有 Sidebar、Notification、Select 混合未提交内容继续保留，等待用户分项验收。
