# AISEE Design System 当前交接

工作纪律见 AGENTS.md，长期决策见 docs/TEAM_DECISIONS.md。

## 当前版本

- 发布分支 ai/desktop/design-system-current；本批从远端 2a9d63a 独立整理 Notification 短版 Copy for AI，最新 SHA 以 git log 为准。
- 仅发布 Notification 所需短提示词、固定哈希公开源码脚本、复制前可用性检查、选定配置、验证与接入文档。其他组件仍用原 Copy for AI。
- 原本地工作区有 Tooltip、第三方整库接入等未提交工作以及未推送的 d6d166b 交接提交，均未混入本批。独立提交后原本地分支可能与远端分叉，后续先检查 git status 和历史，不直接 push 或覆盖本地工作。
- main 未修改。推送将触发 CI / Pages；是否上线以对应 Actions 和匿名下载验证为准。

## 最近完成

- 既有组件变量及 Copy for AI 批量检查已在 2a9d63a 发布。
- Notification 改为约 1,550 字符短提示词，编码 AI 自动获取完整源码、样式、字体和图标，无需安装整库或用户另传附件。
- 目标项目需 React 18+、TSX / CSS / SVG 支持，以及可联网运行 Node 的编码 AI。真实业务回调由产品接入。
- 自动验证包含独立 React 项目、真实源码比对、哈希、重复执行与冲突保护、类型检查和构建。完整说明见 docs/NOTIFICATION_COPY_AI.md。

## 未完成与下一步

- 确认本次 CI / Pages 部署和公开脚本哈希，通过后用户在真实目标项目测试复制结果；未完成第三方 AI 最终视觉与交互验收。
- 试点确认后再决定是否推广其他组件，不自动扩大范围。
- 原本地未提交组件继续按用户反馈处理，正式同步 main 仍需授权 PR。

最近 session：[Notification 短版独立发布](handoff/sessions/2026-09-20-notification-short-publish.md)。
