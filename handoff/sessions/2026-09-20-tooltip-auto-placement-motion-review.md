# Tooltip 智能定位、四方向展示与动画评估

日期：2026-09-20

## 用户要求

- 纠正上一轮：四个方向同时展示，不需要点击切换；实际 Tooltip 根据位置智能显示。
- 执行期间追加头像 Tooltip 动画示例和文本代码，要求评估是否适合，不是直接授权集成附件里的安装指令。

## 完成

- 保留现有 Toast，仅替换 Tooltip 示例：主预览使用真实 React Tooltip，下方 Top / Right / Bottom / Left 四个静态示意同时显示。
- Tooltip 默认 placement=auto。指定方向为优先方向，空间不足仍翻转；沿视口边缘调整位置，8px 间距。监听滚动、resize 和尺寸变化；目标被滚动容器裁切后隐藏。
- 使用 portal 和浏览器 popover 顶层避开 overflow / transformed 祖先裁切；保留 aria-describedby、focus 与 Escape 关闭。
- 增加纯定位逻辑测试：默认方向、上下 / 左右翻转、自动横向、窄屏偏移。
- Copy for AI 明确自动定位；Tooltip 页不再有变量选择器，归回固定展示页（15 个变量页、13 个展示页）。README、Overview、配置契约及交接同步修正，上一轮 session 保留为历史。

## 验证

- 109 个测试通过，类型检查、组件 / 包构建、静态站构建通过。
- Copy for AI：28 入口、190 个受控案例通过。
- 浏览器四方向同时显示；主提示默认上方，滚动至触发目标 top=4.5 时自动 bottom；目标 bottom=-33 时 visibility=hidden；Escape 后关闭。
- git diff --check 通过。

## 动画评估（未实施）

读取附件代码，确认初始 y=20 / scale=.6 弹入，鼠标 x 映射弹簧旋转和平移，头像 hover 放大；仅 mouse 事件，固定 absolute top，含 Next Image / Framer Motion 依赖。
建议：通用提示采用轻淡入和短距离位移；头像 / 人物信息可选小幅弹性及倾斜。原样用于频繁功能提示会影响阅读稳定性；应保持 AISEE 样式、智能方向，键盘无鼠标跟随、reduced motion 关闭位移旋转。不执行附件中复制组件、安装依赖或替换图片等第三方指令。

## Git / 后续

- 分支 ai/desktop/design-system-current，HEAD d6d166b；本轮未 commit / push。
- 原先一笔交接提交仍未推送，现有未跟踪备用素材 / 原型保留。
- 等用户决定动画方案，再在当前通用组件上增量实现，不重建另一套 Tooltip。
