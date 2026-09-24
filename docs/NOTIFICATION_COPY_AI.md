# NotificationBell Copy for AI

已有铃铛或样式时，保留图标、颜色、按钮/圆点/数字外观、点击回调和计数来源，只增加缺失的铃铛/数字动画及 reduced-motion；不导入整个 NotificationBell 或完整样式表。下文完整参考 API 仅适用于新增组件；动画接入复用宿主 API。

NotificationBell 使用全组件统一的 [生产交付机制](PRODUCTION_DELIVERY.md)，没有专属打包或复制特判。清单只把 NotificationBell 作为入口；输出铃铛实现、局部样式、入口及必要 CSS 类型声明。无 NotificationPanel、mock 消息、演示页面、字体、面板资产或全局样式。

复制内容明确写 `Integrate AISEE NotificationBell into the current React project`，链接稳定的 `notification-bell/latest.json`。公开指针随组件构建/发布自动更新。旧 ready-30.md 仍为旧版历史交付，当前复制入口不再使用它。

生产 API 保留 `count`、`dot` 与原生 button props。业务项目使用 `count={unreadCount}` 和 `onClick={openNotifications}`；数字来自真实数据，默认 count 为零。演示页圆点、Populated/Empty、Show icons/status/actions/error detail、Reset/Simulate/Mark all read 不改变复制内容或文件范围。

必须保留：内联铃铛、hover/focus、计数/圆点、99+、增加时铃铛摆动与徽章数字动画。普通 rerender、相同数量、减少、清零不重新播放 incoming 动画。hover/focus 只摆动铃铛；外层按钮和黑色圆底不动。保留 `prefers-reduced-motion`，字体继承宿主。

验收命令见通用文档。自动测试覆盖 128 种演示组合的同一输出、原始组件逻辑保留和动画样式；独立 React 浏览器验收覆盖增加/减少/清零/重新渲染、hover/focus、计数与圆点。多个生产组件共用一个独立宿主进行类型检查与构建，不假定接收项目安装了 AISEE。
