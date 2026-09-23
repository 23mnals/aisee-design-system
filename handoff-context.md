# AISEE Design System 当前交接

> 工作纪律见 [AGENTS.md](AGENTS.md)，长期决策见 [docs/TEAM_DECISIONS.md](docs/TEAM_DECISIONS.md)，历史见 [handoff/sessions/](handoff/sessions/)。

## 当前 Git 与发布

- 开发分支 `ai/desktop/design-system-current`；本地最新提交为 `1ab38e8`，Automation Runner 控制区与 Share 图标优化共 2 个提交因 GitHub 443 连接超时尚未推送；远端仍为 `7cd6dc0`，main 未操作。
- `7cd6dc0` 已完成 CI 与 Pages 部署，公开站点已恢复为 63 pages 并包含 Automation Runner。
- 既存 10 个无关通知备用资源/原型继续保留，不重置、不删除；旧公开 release 全部保留。

## 正在做

- NEW 显示期限已恢复为 7 天：更新当天算第 1 天，第 8 天台北零点消失。现有显式日期表保持不变，从最初添加 NEW 或最近一次真实内容更新的日期计算；本轮规则调整不批量续期。已完成针对日期边界的测试，尚未提交、尚未推送。
- Select / Dropdown 核心类型已按能力重新梳理为 Single-select、Multi-select、Searchable multi-select、Combobox、Action menu、Grouped select；每张卡只显示一个类型标题，控件通过该标题获得无障碍名称。本轮修改已完成本地验收，尚未提交、尚未推送。
- Automation Runner Demo 控制区与门户 Share 图标优化已完成本地验收和提交；两次 push 与一次 GitHub 连通性检查均超时，待网络恢复后推送。
- 用户已确认 A+D 分区动效并授权同步：悬停卡片按指针方向轻探，只有进入绿色小怪兽时播放一次软胶回弹；已同步 Demo、生产组件和 Copy for AI，取消循环抖动。
- 用户从三种眼神预览中选择 B「慌张扫视」，并最终要求恢复最开始确认的眼睛比例：进入整张卡片时眼睛瞪大、黑色眼珠保持原始相对比例，随后左右寻找两次并继续跟随鼠标；实现使用等效真实尺寸重绘，避免持续拉伸 mask 纹理导致模糊。已同步生产样式、Demo 与 Copy for AI。
- Automation Runner Demo 的标题与 `NEW` 固定单行；位置选择显示精简为 Left、Center、Right，真实 bottom placement 值不变。
- Automation Runner 的 Overview、Schedule、Replies 已明确标注为 Demo 页面切换，只验证浮层挂在 app shell 后跨路由持续存在，不属于生产组件功能。
- Automation Runner Copy for AI 已明确增量合并：宿主已有的兼容眨眼/眼珠跟随可保留，其余出退场、状态、A+D、拖拽和 reduced-motion 以当前交付为准，不创建第二个 Runner 或重复监听。
- Automation Runner 的卡片交互已补齐：标题/箭头展开、横线最小化，点击最小化卡片任意位置恢复 default；Demo view 下拉框仅用于直接预览状态。
- 门户 Share 已换为链环图标，复制当前页链接的行为不变。

## 最近完成 · Automation Runner

- 新增根布局常驻浮层，支持 default、expanded、minimized、关闭/重新唤起、底部三种位置、整卡任意位置拖拽及键盘方向键移动；拖动不会误触内部按钮。
- 采用 Figma `72:55666`、`72:56017`、`72:55315` 的尺寸和 5 个原始 SVG；默认 332×64、展开约 332×252、最小 74×64。
- 底部弹性出入场、绿色眼睛眨眼和跟随鼠标、卡片方向探头及小怪兽单次软胶回弹均完成；reduced motion 保留状态与操作并停止装饰动画。
- Demo 的 Show runner、视图和位置控制在桌面宽度下保持同一行，720px 以下才切换为窄屏纵向布局。
- 标题、说明、详情和返回操作由宿主传入；关闭只隐藏窗口，组件不启动、轮询、停止或取消自动化任务。
- 门户、Overview、NEW、公共导出、生产 manifest 与 Copy for AI 已登记。生产交付仅含组件、局部样式、入口/类型和 5 个必要 SVG，不含 Demo、mock、字体或全局样式。

## 同批本地完成 · Host Project Compatibility 与界面修复

- 所有已登记生产清单声明 `integrationMode / primitives / preserve`，接收方优先复用宿主兼容 primitive；不为单组件引入整套 UI framework，不覆盖宿主 theme/provider/global styles，不兼容时 standalone。
- CSS 交付继续使用 AST 完整依赖闭包，保留 selector、伪状态、变量默认值、keyframes、media/supports/reduced-motion，缺失依赖阻止构建。
- 门户目录隐藏滚动条；页面顶部描述去冗余来源字段；操作按钮保持单行；Sidebar 收起按钮与分隔线留白修正；Tooltip/Avatar NEW 标签按原日期显示。
- 新 latest 和版本已进入远端提交 `cd502b5`；在本次 Pages 重新部署完成前，公开 Copy 仍使用上一发布版。

## 本轮验收

- Select / Dropdown 本地浏览器确认六类核心类型正常显示；业务功能文案已从核心类型示例移除，组合示例保留。
- 浏览器实测 Automation Runner：标题展开、箭头收起、横线最小化、点击最小卡片空白区域恢复及整卡拖拽均通过；拖动最小卡片不会误触恢复。Show runner 开关关闭再开启后标题与三项控制保持同一行；B「慌张扫视」在整卡 hover 时正常瞪大并完成两次寻找，放大后眼睛与绿色外壳保持清晰；展开 332×257、最小 74×64、底部间距 24。
- `npm run typecheck` 通过；`npm test` 139 项通过。
- `npm run verify:ai-deliveries`：Registered components 30 / Verified deliveries 30。
- `npm run audit:copy-ai`：30 组件、205 个受控配置案例、0 失败；不等同于外部 AI 产出验收。
- `npm run site`、`git diff --check` 通过。

## 持续有效的交付约定

- Production 不依赖 Demo；生产清单不限制文件数，只包含真实运行需要的源码、局部样式、资产、依赖和类型。
- Copy 使用具体组件名 + 稳定 `latest.json` + 真实选项；稳定地址在执行时解析最新已发布版，已安装源码不会自动更新。
- 兼容性按组件声明，不统一强制 React/Node 版本；安装前识别宿主 UI 库并保留 AISEE 外观、状态、动效、行为和无障碍。
- NEW 更新当天算第 1 天，第 1–7 天显示，第 8 天台北零点消失；已有内容沿用最初登记日期，只有真实内容更新才重新计时，期限调整、构建和刷新不续期。
- Automation Runner 应挂载在 app shell、位于路由内容外；重新唤起入口和真实任务状态归宿主业务所有。

## 未完成与下一步

1. 用户确认后提交 Select / Dropdown 类型调整；网络恢复后连同此前 2 个提交推送并核对 Pages。
2. 在外部 React 项目验证 Automation Runner 接入。
3. 实际业务项目验证宿主 primitive 复用和全局 app-shell 挂载；本仓库尚未验证真实 MUI/Ant/Chakra 等项目。
4. FeatureOverview 第二批平台图标条组件化尚未实施；连接弹窗暂缓，支付和自动化任务执行始终由业务接口负责。

## 最近 session

- [NEW 标签恢复七天](handoff/sessions/2026-09-23-new-label-seven-day.md)
- [Automation Runner 眼睛放大清晰度](handoff/sessions/2026-09-23-automation-runner-eye-clarity.md)
- [Select / Dropdown 类型梳理](handoff/sessions/2026-09-22-select-dropdown-type-taxonomy.md)
- [Automation Runner 通用常驻浮层](handoff/sessions/2026-09-21-automation-runner.md)
- [Automation Runner 发布准备](handoff/sessions/2026-09-22-automation-runner-release.md)
- [Automation Runner 控制区与分享入口](handoff/sessions/2026-09-22-automation-runner-demo-polish.md)
- [Host Project Compatibility](handoff/sessions/2026-09-21-host-project-compatibility.md)
- [预览间距与按钮布局](handoff/sessions/2026-09-21-preview-layout.md)
- [精简页面描述](handoff/sessions/2026-09-21-page-descriptions.md)
- [Tooltip NEW 标签修复](handoff/sessions/2026-09-21-tooltip-new-labels.md)
- [隐藏导航滚动条](handoff/sessions/2026-09-21-sidebar-scrollbar.md)
