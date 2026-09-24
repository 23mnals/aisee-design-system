# 预览间距与按钮布局 · 2026-09-21

用户指出收起侧栏图标贴近分隔线，以及 Copy for AI / Open HTML 被长描述挤成两行。

侧栏分隔线在 SidebarNavigation.demo.css 中，生产头部按钮为绝对定位，收起后内容隐藏，原 min-height:32px 没为按钮下留白。仅 Demo 的 collapsed + toggle-inside 头部设为 41px，给 32px 按钮留下 8px 与 1px 线；展开及外置按钮不变。

门户 preview-meta 分配可压缩宽度；actions/button 不压缩，文字不换行，SVG 不缩小。实测发现 grid 默认最小内容宽度仍导致横向溢出，随后给 preview 显式 minmax(0,1fr) 列约束。长描述继续省略。

验收：Sidebar Demo 构建通过；浏览器点击收起后 DOM 测量按钮底边至线 8px、头部41px。Tooltip长描述页面在1280px视口页面宽1280px，描述可用694px/内容933px，两个按钮文字单行、右边界1120/1256px，截图确认完整。git diff --check 通过。

当前分支 ai/desktop/design-system-current，基于674efe6。本轮未提交或推送，保留此前所有本地修改及无关未跟踪资源。生产代码及Copy for AI交付未变化。
