# 2026-09-17 · Button 图标变量

## 目标与范围

用户要求 Button 支持有 / 无图标，并授权制定左右位置规则；给出 Figma 节点 77:17106、38:69084、78:121895。三个节点均已读取设计上下文与截图，大节点继续读取标题 / 行子节点。

## 完成

- 增量扩展 React Button：icon / showIcon / iconPosition；旧 leadingIcon 保持左侧兼容。
- 操作图标默认左侧，前进箭头与 AI 生成星光放右侧。不根据文案推断位置。
- 16px 容器、6px 间距；关闭开关移除图标容器与间距，图标不重复加入可访问名称。
- Button 组件页新增正式 Toggle 控制五种示例：Generate Post、Go execute、View replies、View Post、Bulk schedule。Figma SVG 下载到 assets/button，保留原始路径和多色图标；单色通过 mask 跟随当前文字色。
- 更新 Overview、Copy for AI、NEW 日期、README 当前规则与最近更新、AI_HANDOFF；README 较早一批移至 CHANGELOG。

## 验证

- typecheck 通过；现有全套 83 项测试通过；Button 单独 Vite 构建成功；git diff --check 通过。
- 浏览器开关测试：五个按钮无图标时宽度均减少 22px，没有残留空位，文字名称不变。
- 黑色按钮 hover 的文字 / 图标变为 #111，背景变为 Post 黄色；键盘 Tab 焦点 2px 黑色轮廓；字重 500。
- 未重建其他组件 bundle，其他待确认修改保留。

## Git 与待确认

- 分支 ai/desktop/design-system-current；HEAD / origin 为 25c8f9f，前轮 Notification 已推送和成功部署。
- 本轮未 commit / push；Button 待用户验收。
- 后两个 Figma 节点包含完整任务列表、回复卡片。已询问是否扩展整块组件，尚未答复；本轮按明确 Button 范围提取其中按钮。
- Select、Sidebar、Toggle Dropdown、NEW、Tree Nav / Webapp 等既有待确认内容继续保留。
