# 2026-09-11 — 使用说明卡片描边

## 完成

- 为共享 `aisee-usage-note` 增加与示例卡片相同的灰色描边 `var(--aisee-color-border, rgba(17,17,17,.06))`。
- 橙色线不再替代卡片灰色描边，改为贴合卡片内部左侧并贯穿上下边缘的独立 3px `#EC5212` 强调线，三个方向偏移均为 0px；卡片保持统一 12px 内边距。
- Steps、EmptyState、ToggleSelectionGroup 和 ScoreGauge 中使用该共享样式的说明卡片同步生效。

## Git / 状态

- 分支仍为 `ai/desktop/design-system-current`，本轮未提交、未推送。
