# 2026-09-21 · Automation Runner 通用常驻浮层

## 本轮目标

- 依据 Figma `72:55666`、`72:56017`、`72:55315` 新增可复用 Automation Runner。
- 覆盖默认、详情展开、最小化、关闭/重新唤起、跨路由常驻、拖拽与趣味动效。
- 纳入统一 Copy for AI 生产交付、NEW、组件目录、规范和批量验收。

## 本轮完成

- 新增 `AutomationRunner` React 组件，支持受控/非受控 `open` 与 `view`、底部左/中/右位置、真实详情数据和返回 Automation 回调。
- 默认 332×64、展开约 332×252、最小 74×64；标题或箭头展开，横线最小化，绿色眼睛恢复，X 只隐藏浮层。
- 浮层挂载在应用根布局时跨页面保留；关闭不会停止、取消或修改自动化任务。
- 使用 Figma 原始 drag、eye mask、chevron、minimize、close SVG；未用 CSS 重画图标。
- 增加底部弹性出入场、眨眼、眼珠跟随鼠标、卡片方向探头和小怪兽单次软胶回弹；reduced motion 下停用装饰动画。
- 整张卡片任意位置均支持指针拖拽，并具有移动阈值、误点击拦截和视口限制；拖拽手柄支持方向键移动，多实例使用唯一详情 ID。
- 新增独立 Demo，Show runner 开关用于触发底部出退场，并模拟路由切换以说明 app-shell 常驻职责；关闭后可重新打开开关唤起。
- 注册门户 Current 页面、Components Overview、NEW 三天日期、公开导出和 AI 配置读取。
- 新增生产 manifest、9 个受控 Copy 配置案例和独立测试；交付仅包含生产源码、局部 CSS、入口/类型和 5 个必要 SVG。
- README 最近更新、v6 动效例外和长期设计决策已同步。
- 用户认为当前持续抖动偏搞笑；经独立 prototype 对比后确认 A+D 分区响应：悬停卡片使用方向探头，只有进入绿色小怪兽时播放一次软胶回弹。已同步 Demo、生产组件和 Copy for AI，取消循环抖动。
- Demo 标题与 Show runner / view / placement 控制改为桌面固定两列、控制组不换行；仅在 720px 以下整组换行，修复开关开启后标题行出现大块空白的问题。
- Copy for AI 增加已有实现的增量合并边界：宿主现有眨眼和眼珠跟随在兼容时保留，禁止重复 DOM/keyframes/state/pointermove；其他出退场、三种视图、A+D、拖拽及 reduced-motion 必须采用本次生产交付。
- 补齐卡片本体交互：标题/箭头展开，横线最小化；最小化后点击卡片任意位置恢复 default，同时保留绿色眼睛的键盘恢复入口。顶部 view 下拉框只作为 Demo 状态控制，不再是唯一切换方式。

## 浏览器验收

- 默认态、展开态、最小态均在本地组件页实测。
- 展开实测 332×257，底部间距 24；最小实测 74×64。
- 最小化后眼睛恢复正常，切换 Demo 路由时浮层保持；关闭动画结束后卸载，Show runner 开关可重新显示。
- Show runner 关闭后重新开启，标题和三项控制仍保持同一行；整卡从右下角拖至页面中部后位置正确保留。
- 横线按钮实测可进入 minimized；点击最小卡片空白区域可恢复 default；点击标题可展开、点击箭头可收起。拖动最小卡片后仍保持 minimized，不会误触恢复。
- 拖拽仅在指针移动超过阈值后取得 pointer capture，轻点内部控件不再被整卡拖拽吞掉。

## 自动验收

- `npm run typecheck`：通过。
- `npm test`：137 项通过。
- `npm run verify:ai-deliveries`：Registered 30 / Verified 30。
- `npm run audit:copy-ai`：30 组件、205 案例、0 失败。
- `npm run site`：通过。
- `git diff --check`：通过。

## Git / 发布

- 分支：`ai/desktop/design-system-current`。
- HEAD：`674efe6103ce4281406da16f834ca4e95c509e10`。
- 本轮未 commit、未 push、未操作 main。
- 当前工作区还包含同批未发布的 Host Project Compatibility、预览布局和 Tooltip 等已确认修改，以及既存无关通知备用资源/原型；不得重置或删除。

## 下一步

- 用户确认视觉和交互后，可整理本地已确认批次并推送开发分支。
- 外部项目应将组件挂载在根布局，并从真实自动化状态传入 `open/view/details`；宿主自行保存跨刷新状态及提供重新唤起入口。
