# Notification 单组件接入

## 使用方式

1. 打开 Notification Current 页面，选择铃铛 dot/count、面板状态和内容开关。
2. 点击 Copy for AI，直接粘贴到目标项目的编码 AI。无需手动安装 AISEE 库、下载归档或上传附件。
3. 编码 AI 按短提示词下载版本固定的公开脚本，核对 SHA-256，用 Node 解包到项目目录；读取随包的 INTEGRATION.md 并接入本地导出和样式。
4. 对照选定配置检查未读数量、已读回调、面板开关、字体图标与铃铛动画。真实通知数据、路由和业务回调由目标产品提供。

## 前提与边界

- 接收方必须能联网下载源码、编辑项目并运行 Node；仅能文字聊天或出图的 AI 无法执行安装。
- 目标为 React 18+ / ReactDOM 项目，支持 TSX、CSS、SVG 和字体资源。SSR 使用客户端边界。无需 Tailwind、shadcn 或额外动效依赖。
- styles.css 只加载一次；沿用目标项目结构并检查全局 token / base 样式与现有样式的关系。不要把多个独立 Demo 的预览状态当成真实业务状态。
- 安装脚本包含 Current NotificationBell / NotificationPanel 源码和必要资源，不会安装 npm 依赖；遇到已有不同文件会停止，避免覆盖改动。
- 源码由公开 Pages 提供，不要求私有仓库权限。复制前检查公开文件及哈希；缺失或版本不一致会提示原因。更新本地组件后需发布对应交付文件才能复制新版本。
- 本轮仅 Notification 试点；没有将所有组件改为源码交付，也没有发布 npm 包。提示词中的链接不是可直接粘贴到 JSX 的代码，实际接入由编码 AI 完成。

## 验证与发布

- npm run verify:ai-deliveries：校验短提示词、固定版本文件、独立 React 项目解包、重复执行与冲突保护、真实源码一致性、类型检查和构建。
- npm run audit:copy-ai：Notification 各配置使用实际短提示词；其他入口继续使用原模板。
- 开发分支推送通过 CI 后自动更新 Pages。发布后需匿名下载文件、核对哈希并测试实际复制。
- 自动检查不等于第三方 AI 最终生成效果验收，仍需在真实目标项目测试。
