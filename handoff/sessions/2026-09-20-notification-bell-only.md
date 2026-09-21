# Notification Copy for AI：仅交付动画铃铛

## 用户确认

旧公开安装已经能用，但安装目录过重。只需铃铛和右上角数字动画，Bell states、面板状态/选项等为效果展示，不应出现在复制命令或目标产品里。

## 本轮完成

- build-ai-deliveries 直接复用 Current NotificationBell.tsx，只补 use client 和局部 CSS import；只提取 bell 的 CSS 与两种 keyframes，加入局部 box-sizing、宿主字体继承和减少动态效果。所需颜色和动效 token 带从正式 light tokens 解析的 fallback。
- 交付严格两文件：NotificationBell.tsx / NotificationBell.css；去掉 NotificationPanel、资源目录、字体、共享 tokens/base、index 和安装内文档。用法与说明放在公开 bell.md。
- ai-delivery 的一句话链接不再依赖配置；component-config 只记录空 props 的 bell 范围；128 种原演示组合均得到同一链接。
- 更新页面 Installation / Usage、门户说明、README、GETTING_STARTED、COMPONENT_CONFIGURATION、NOTIFICATION_COPY_AI 与 TEAM_DECISIONS。
- 预览页和面板实现保留；旧的内容哈希安装器和配置文档保留用于历史链接。未改 Current 铃铛源码逻辑，未删除开发接收项目的旧文件。

## 验证

- verify:ai-deliveries：两文件范围、源码逻辑比对、独立类型检查/构建、完整性、重装、拒绝覆盖通过。
- 114 项单元检查、192 项 Copy for AI 受控配置案例、项目 typecheck、site 构建通过。
- CUA 浏览器确认本地 Notification Installation / Usage 显示两文件交付和真实 unreadCount/onOpen 示例，无完整面板接入代码；最小用法 Copy code 点击显示 Copied。
- 外部开发精简版实测未执行；旧完整交付已由用户确认能用。

## Git / 待发布

原工作区 ai/desktop/design-system-current@d6d166b，origin 跟踪 dbaabd1，ahead 1 / behind 2。保留全部既有未提交改动。本轮没有 commit/push/main/PR 操作。新版元数据指向新 bell.md，发布前 Copy for AI 的公开检查会拦截；旧 ready-30.md 仍安装旧版。

下轮若用户要求发布：以 /tmp/aisee-notification-release 的 dbaabd1 为基础只同步本批相关文件，保护原工作区 Tooltip 等修改；先查远端后提交到开发分支，完成 Pages 与公开下载验证后才让开发重新复制。
