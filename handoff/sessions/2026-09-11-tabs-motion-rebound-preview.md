# Tabs 选中框回弹动效预览

## 本轮目标

- 继续昨日未完成任务，根据用户反馈调整 Tabs 独立动效预览。
- 将 segmented Tabs 的圆角形变动画改为选中框到达目标时的位移回弹。
- 用户确认前保持独立预览，不同步到正式 Tabs Demo 或生产组件。

## 本轮完成

- 移除 `.segmented.is-moving` 与运行时圆角变化，选中框圆角全程固定为 7px。
- 初版单一 back easing 经用户反馈仍显僵硬，已升级为 520ms 四段弹簧关键帧：正常起步、`scaleX(1.055) / scaleY(.95)` 横向轻拉伸、越过目标后以 `scaleX(.975) / scaleY(1.025)` 轻压，最后恢复正常比例。
- 位移过程中圆角仍固定为 7px，不重新引入圆角 morph；快速连续切换时会从当前视觉位置重新计算轨迹。
- 保留键盘切换、内容淡入和 `prefers-reduced-motion` 降级。
- 更新预览说明文字与自动化测试，明确该页面仍是未注册的独立研究页。
- 用户确认趣味弹簧方向后，将相同动画同步到正式 `components/Tabs/Tabs.html` Demo 的三组 segmented Tabs；每组使用共享选中框，icon only 保留黄色选中面。
- 正式 Demo 的 underline 与 platform 两组保持原有切换和 hover 规则；React 生产组件未同步。

## 修改文件

- `components/Tabs/TabsMotionPreview.html`
- `components/Tabs/Tabs.html`
- `tests/preview.test.mjs`
- `handoff-context.md`
- `handoff/sessions/2026-09-11-tabs-motion-rebound-preview.md`

## 验证

- 初版浏览器采样目标位移约 216.8px，动画途中约 229.2px，最终回到 216.8px；趣味弹簧版本刷新后最终位移稳定，圆角各采样点仍均为 7px。
- 正式 Demo 浏览器逐组点击验收通过：Writing mode 切到 Rewrite、Content status 切到 Draft、Calendar view 切到 Week view，三组均正确更新选中状态。
- `npm test`：49/49 通过。
- `npm run build`：通过。
- `git diff --check`：通过。

## Git / Commit / PR

- 当前分支：`ai/desktop/design-system-current`。
- 当前 HEAD：`3a97eff docs: record Figma sync and checkpoint audit`。
- 本轮未 commit、未 push、未创建 PR；工作区仍包含整批待确认修改。

## 未完成与下一步

- 正式 Tabs Demo 已同步；React 生产组件仍未同步。
- 用户后续若明确要求，再将已确认动效加入 React 生产组件；独立预览页继续保持未注册。
