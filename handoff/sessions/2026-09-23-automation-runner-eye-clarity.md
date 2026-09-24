# Automation Runner 眼睛放大清晰度修复

## 本轮目标

- 解决 Automation Runner 在卡片悬停、眼睛放大后小怪兽视觉变模糊的问题。
- 保留已确认的 B「慌张扫视」行为和 A+D 分区动效。

## 本轮完成

- 确认模糊来自眼睛 mask 在动画结束后仍以 `transform: scale(...)` 拉伸低尺寸合成纹理。
- 将瞪眼动画改为直接插值眼睛的真实 `top / left / width / height`，保持相同中心点、放大幅度和弹性过冲。
- 用户对单独放大黑色眼珠的版本不满意，最终恢复最开始确认的视觉比例；通过换算父级缩放后的等效宽高、位置和指针位移，以真实尺寸重现原始效果。
- 保留瞳孔左右寻找两次、鼠标跟随、卡片方向轻探及小怪兽软胶回弹。
- reduced-motion 的静态瞪眼同步改为真实尺寸，不再缩放纹理。
- 重建 Demo 与 Automation Runner Copy for AI 生产交付。

## 验收

- 本地浏览器确认普通状态与悬停放大状态清晰，视觉比例恢复最初版本，B 扫视行为仍正常。
- `npm test`：139 项通过。
- `npm run typecheck`：通过。
- `npm run verify:ai-deliveries`：Registered 30 / Verified 30。
- `npm run audit:copy-ai`：30 个组件、205 个受控案例、0 失败。
- `git diff --check`：通过。

## Git

- 分支：`ai/desktop/design-system-current`。
- 本轮未提交、未推送；保留工作区中同批未提交修改。
