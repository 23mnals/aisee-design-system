# 2026-09-16 Quantity Stepper

## 本轮目标

- 将 Quantity Stepper 的静态样式精确对齐 Figma，并用 Spectrum UI Quantity Stepper 作为交互动效参考。
- 扩大原位输入热区：中间整块数值槽（数字、单位与留白）均可点击进入输入，避免只能点中数字字形才有反应。
- 修正输入时重复显示数字、左右按钮未贴合外框，以及窄容器单位字段拥挤的问题。

## 本轮完成

- 40px 默认组件使用 388px 宽度、8px 圆角、3px 分区间距；左右按钮取消容器内缩并贴合外框。
- 加减号改用 `@stemui/icons@0.1.40` 对应的本地只读快照。
- 点击数字后在原位置切换为输入框，不再同时显示静态数字。
- 数字变化使用上下滚动，按钮按压使用轻微缩放，长按 400ms 后重复并在 10 次后加速；达到边界时只抖动数值区域。
- 组件宽度不超过 260px 时自动隐藏单位字段，只显示数字，避免窄卡片拥挤。
- 输入数字的浏览器原生蓝色选区改为 AISEE 语义黄色，数字保持黑色。
- Copy for AI 补齐有 Design System 与无 Design System 两种接入路径、公开 props、依赖、完整静态与动效参数；Usage 增加 React 示例和独立使用说明。
- README 最近更新、Overview、Copy for AI、NEW 标识和回归测试同步更新。
- 同轮追加修正 Select / Dropdown Variant Playground：舞台高度按当前组合的实际菜单高度计算，各组合内容保持相同顶部起点；浏览器实测内容顶部偏移统一为 24px，Compact 展开和收起均保留 220px 高度，不让外围页面跳动。

## Git / 工作区

- 分支：`ai/desktop/design-system-current`。
- 本轮修改尚未 commit / push；工作区还有 Notification、Dialog、Tabs、Select 等同批未提交内容，后续提交前需按确认范围复查。

## 验收

- 浏览器实测：中间数值槽宽 300px，数字本身约 15px；点击单位和留白均会创建原位输入并自动聚焦。

- `node --test tests/preview.test.mjs`
- `npm run typecheck`
- `npm run build:component-demos`
- `git diff --check`

## 下一步

- 等待用户在本地 Demo 验收 Quantity Stepper 的贴边、窄容器和动效。
- 用户明确要求同步远端后，再整理本批提交并推送开发分支。
