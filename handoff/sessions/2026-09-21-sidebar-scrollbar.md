# 隐藏门户导航滚动条 · 2026-09-21

用户要求隐藏截图中的左侧目录滚动条。门户 sidebar 增加标准 scrollbar-width: none 和 WebKit 滚动条隐藏规则，保留 overflow-y: auto，继续支持滚轮、触控板与键盘滚动。未改变组件 SidebarNavigation 或 Copy for AI 交付。

README 最近更新同步，较早一批更新归档到 CHANGELOG。当前分支 ai/desktop/design-system-current，基于 674efe6；本轮未提交或推送，保留既有 10 个无关未跟踪资源。

验收：CSS 解析及本地服务返回样式检查通过；git diff --check 通过。
