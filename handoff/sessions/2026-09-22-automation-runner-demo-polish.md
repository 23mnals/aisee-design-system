# 2026-09-22 · Automation Runner 控制区与分享入口

## 本轮目标

- 避免 Automation Runner 的 `Interactive preview` 与 `NEW` 在桌面宽度下换行。
- 精简底部位置选择文案，并替换门户顶部不协调的分享图标。

## 已完成

- 标题使用不可换行的行内弹性布局，`NEW` 保持独立且不收缩。
- 位置选项从 Bottom right / center / left 精简为 Right / Center / Left；内部 placement 值仍为 bottom-right / bottom-center / bottom-left。
- 两个下拉框宽度收紧，显示开关、状态和位置控制在桌面预览中保持同一行。
- Share 改为三节点连接图标，继续执行复制当前页面链接。
- README 最近更新按 2026-09-22 记录本批可见变化，较早的预览布局批次归档到 CHANGELOG。

## 验收

- TypeScript 类型检查通过。
- Automation Runner 与门户专项测试通过。
- 组件 Demo 构建与生产交付生成通过。
- 浏览器实测标题、NEW、Show runner、Default、Right 均保持单行，Share 新图标正常显示。

## Git / 发布

- 当前分支：`ai/desktop/design-system-current`。
- 功能提交：`c6ed991 fix: compact automation runner preview controls`。
- 两次 Git push 与一次 GitHub HTTPS 连通性检查均在 443 端口超时；本地提交完整保留，远端仍为 `7cd6dc0`，待网络恢复后继续推送。
