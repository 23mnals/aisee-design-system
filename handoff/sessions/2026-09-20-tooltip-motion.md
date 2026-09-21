# Tooltip 动效与 hover 展示 · 2026-09-20

## 本轮目标与确认

用户接受上一轮动效建议并要求加入动画，随后明确四方向按钮应同时展示，但气泡只在 hover 后出现。保留键盘 focus 支持；取代上一轮静态常显气泡，不恢复方向选择器。

## 已完成

- 正式 Tooltip 增加 animation subtle / playful / none；默认 160ms 淡入与沿实际方向 4px 位移，120ms 淡出；可选 260ms 轻弹性、最多 ±2° 鼠标倾斜。测量与动画分层，保留 auto 智能定位。
- 保留退出动画时的短暂挂载；快速重新进入会取消卸载计时，Escape 仍关闭。键盘仅淡入，reduced-motion 关闭动画和倾斜。
- 四方向示例改用真实 React Tooltip。动画下拉配置应用于主示例、四向示例、AISEE 头像示例；未新增第三方依赖。
- Copy for AI 从实际状态导出 animation 和 placement auto；四方向仍是演示而非固定方向配置。28 入口变为 16 变量页 + 12 展示页，192 案例。
- 同步 README 当日更新、组件规范、门户说明、Overview、AI 交付文档、配置与审计说明。

## 验证

- npm run check：类型检查、109 测试、组件及包构建通过。
- npm run audit:copy-ai：28 入口、192 受控配置案例、0 失败。
- npm run site 与 git diff --check 通过。
- 浏览器验证初始无气泡、Top / Right 触发、Escape 关闭，头像 pointer 使用 tooltip-spring 且倾斜约 1.33°，移开后消失；键盘为 tooltip-enter 且无倾斜。Playful 选择后 DOM 配置快照对应实际参数。
- reduced-motion 由 CSS / 计时逻辑处理，本轮未切换系统减少动态效果开关；未调用其他 AI 验证产出。

## Git 与保护

分支 ai/desktop/design-system-current，HEAD d6d166b。已有 1 个文档提交未推送。前轮智能定位与本轮动画改动未提交，本轮未执行 commit / push / PR。Notification 备用资源及 prototypes 未动。

## 下一步

用户在 Tooltip / Toast 页面预览并判断动效幅度。后续发布需明确授权；Copy for AI 新变量需继续同步批量案例。
