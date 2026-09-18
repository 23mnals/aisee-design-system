# Sidebar hover 与间距 · 2026-09-18

用户连续截图反馈：hover 加深、floating 透明标题及 16px 间距、Inset 标题仅底线、外置按钮在内容标题左侧、增加灰底侧栏白底内容，以及下拉框靠右。

## 修改与验证

- SidebarNavigation 默认 SVG 移除路径固定 opacity；共享样式在默认状态 0.5，hover / focus-visible 1，颜色绑定 semantic-button-usual。内部与外部按钮都生效，减少动效偏好继续支持。
- 组件页 floating 标题栏 transparent，正文取消重复横向内距，复用外壳 gap / padding 16px。其他布局正文和标题横向内距也调整为 16px。
- 浏览器实测 hover=true，color=rgb(17,17,17)，opacity=1，符合当前 button/usual=#111。floating headerFill=rgba(0,0,0,0)，leftGap=16，rightGap=16。
- Sidebar 与 Webapp 定向重建，typecheck 和 diff check 通过。纯样式小修没有新增测试。
- README 本批记录、Copy for AI、Sidebar 说明与交接同步。

## 后续布局修正

- Inset 标题无独立圆角，仅底部 1px 分隔线，外层卡片仍为 16px 圆角。
- 外置按钮原来在 aside 内绝对定位 right:-40px，额外 margin-right:44px，与用户参考不符。现在 SidebarLayout 提供 header 插槽，SidebarNavigation 用 portal 将同一按钮放到内容标题栏左侧，收起状态和事件仍由原组件维护。
- 新增 muted 变量：灰色通栏侧栏搭配白色内容。四布局与内外按钮独立组合为八种。
- 预览下拉框组 margin-left:auto，右缘与舞台对齐。
- 参考页面工具读取失败，浏览器打开超时；随后 curl 成功取得指定页面，确认 SidebarTrigger 为 ghost icon button，SidebarInset 是内容卡片；位置以用户截图及提供的 Usage 为准。

## 最终验收

- 浏览器检查四种外置布局均只有一个 toggle，按钮位于内容 header 内，距内容左侧 16px（Inset 加 1px 外框）。
- Inset header border 为 0 / 0 / 1 / 0px，radius=0，内容外框 radius=16px。
- muted 侧栏 rgb(250,250,250)，内容 rgb(255,255,255)，侧栏额外 margin-right=0。
- 控制组与舞台右缘均为 960px；灰底标签单行。
- 选择 Full Report 后收起、切换内部、展开、切回外部，标题 / 导航选中与收起状态保留，始终只有一个按钮。
- 97 项测试、typecheck、Sidebar / Webapp 定向构建、库构建、静态站点构建、diff check 通过。

## Git 与待确认

ai/desktop/design-system-current，HEAD 25c8f9f；未 commit / push。保留其他混合未提交工作。八种 Sidebar 布局和本轮细修待用户视觉验收。
