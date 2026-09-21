# Tooltip 方向变量

日期：2026-09-20

## 目标与完成

用户要求参考四方向示例，在 Tooltip 示例下方增加方向变量；保持 AISEE 样式。

- 新增 Top / Right / Bottom / Left 原生单选控制，默认 top，控制同一个 Tooltip 示例。
- React Tooltip 的 placement 增加 right / left；共享 tooltip.css 同时供正式组件与静态示例使用，静态站点构建包含该资源。
- 保留 hover / focus 和减少动态效果设置，提示保持 8px 间距；不改变 Toast 的定位。
- Copy for AI 读取当前选中 placement；增加四种方向 audit 案例，固定展示页由 13 减至 12，变量页由 15 增至 16。
- README 最近更新、CHANGELOG 归档、Overview、AI_HANDOFF、配置契约、审查说明与 NEW 日期同步。

## 验证

- 浏览器逐个切换四方向，读取实际位置确认提示框位于目标方向；右侧和上方截图检查通过。
- Shift+Tab 聚焦触发按钮，动画结束后 Tooltip opacity 为 1。
- npm run audit:copy-ai：28 入口、193 案例、0 失败。
- npm run check：类型检查、104 测试、组件及包构建通过。
- npm run site：静态站点构建通过。git diff --check 通过。

## Git 与边界

- 分支 ai/desktop/design-system-current；HEAD d6d166b。
- 本轮未 commit / push；此前文档提交尚有 1 笔未推送，当前远端跟踪仍为 2a9d63a。
- 原有未跟踪的通知备用素材和实验原型未修改。
- 不增加自动翻转 / 跟随鼠标等额外行为；本轮仅四方向变量。
- 后续按用户视觉反馈调整；发布仍需新的明确授权。
