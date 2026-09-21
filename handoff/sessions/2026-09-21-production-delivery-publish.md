# 统一生产交付发布 · 2026-09-21

## 目标与授权

用户要求“发布新版，我要复制给外部开发使用”。本批发布所有已登记组件的统一 Copy for AI 机制到开发分支和现有 GitHub Pages；未授权 main 合并。

## 发布范围

- 显式生产清单、依赖验证、完整 CSS AST 依赖闭包、通用短提示词、稳定 latest 和不可变 release、逐组件 compatibility。
- NotificationBell 精简生产交付，保留真实数据驱动的铃铛/徽章动效，排除通知面板及演示资源。
- 当前清单依赖的 Tooltip 智能定位、弹簧交互及对应 Demo/构建同步，避免交付与页面不一致。
- 安装/使用/验收/长期规则文档、README/Overview/更新标记与 CI 同步。
- 保留旧公开交付历史；不发布本地 prototypes、验收产物、无关未跟踪图片或 node_modules。

## 验证

独立发布目录基于远端 dbaabd1；124 项测试、类型检查、构建、28 份独立 React 生产交付验证、192 个配置案例及静态站点构建通过。当前版本目录与原工作区生成结果一致。CSS 缺失依赖会使构建失败。外部 AI 真实项目最终产出仍需开发验收。

## Git 与部署

原工作区保留，独立目录创建发布提交后非强制快进到 ai/desktop/design-system-current。Git HTTPS 低速超时，必要时使用 GitHub Git Data API 并校验 tree/commit；发布前重新核对远端父提交。推送触发 CI 与 Pages，最终结果记录于原工作区当前交接；main 不变，不创建 PR。
