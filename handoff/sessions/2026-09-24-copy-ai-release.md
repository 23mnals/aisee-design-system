# Copy for AI 修正发布与线上验证 · 2026-09-24

## 授权与范围

用户明确要求发布推送到远端以便验证。发布到 `ai/desktop/design-system-current`，包括前两轮 Brand 导航改名及 Copy for AI 宿主样式保护。未要求合并 main，故不合并。

## Git / PR

- 发布前 git fetch origin，HEAD 与远端均为 a866165，无新增协作者提交；已有未提交文件均为本对话的两批改动。
- 功能提交：`739477f04388dadd66f270ffb120d27cfb7eed9c`，`fix: preserve host design in AI component integration`，已推送。
- 144 个文件包含 30 组件的新 immutable release 指令与安装器，旧 release 未修改。生产 payload 与文件范围此前已全部比对不变。
- 同分支已有 PR #10（Refine current dropdown interactions）已关联当前任务，未创建第二个 PR、未合并、未改 main。
- 当前交接与三个历史 session 随独立文档提交同步，记录最新功能提交和线上验证状态。

## 验证

- 发布前 npm run check（140 项测试、token 检查、typecheck、build）成功；30/30 交付验证成功；205 个 Copy 配置案例 0 失败。
- GitHub push run https://github.com/23mnals/aisee-design-system/actions/runs/35949568676 的 verify、pages 均 success。
- 浏览器创建线上验收页超时，恢复连接也超时；没有宣称完成线上按钮点击，使用 HTTP 校验线上内容与按钮的交付验证路径。

- 发布后直接核验公开站点：Brand 分类为 Foundations / Explorations；短提示词脚本与本地逐字节一致，manifest 一致；30 个组件的 latest 版本/宿主保护 policy、ready.md 内容、安装器 SHA-256 全部通过。
- NotificationBell 版本 `b9054a32dfa37f1d`；AutomationRunner 版本 `49db4e9b4383c154`。

## 用户验收与剩余事项

- 刷新 https://23mnals.github.io/aisee-design-system/ ，选已有业务组件对应的动画，再重新 Copy for AI。
- 在业务项目测试分支比较接入前后静态外观、UI 库、事件、状态和回调，只允许本次要求的缺失动画及必要 cleanup / reduced-motion 增量。
- 本次部署不会自动修改业务项目已经安装的源码，也不会自动恢复之前被覆盖的业务样式。
