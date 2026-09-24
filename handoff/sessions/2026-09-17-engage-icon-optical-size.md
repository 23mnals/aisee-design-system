# Engage 气泡图标视觉尺寸

- 用户反馈 Sidebar Navigation 组件预览中的 Engage 气泡视觉上小于相邻图标，要求再次调整。
- 只修改 `components/SidebarNavigation/SidebarNavigation.html` 的 Engage 专属尺寸：13×13px → 15×15px。保留正式 StemUI SVG、18px 图标容器、居中方式、文字位置和交互。
- SVG 自带留白，适度增大显示尺寸以补偿圆形轮廓的视觉偏小；没有改写图标资产。
- README 最近批次与 handoff-context 已同步。
- 分支 `ai/desktop/design-system-current`，HEAD `546faba`；未 commit / push，其他未确认实现不动。
- 浏览器核对尺寸和视觉对齐；git diff --check 通过。
- Sidebar 初始 Summary / Signal Feed 不一致及 Webapp 层级差异仍待处理，Notification / Select 仍待验收。
