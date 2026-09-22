# AISEE Design System 当前交接

> 工作纪律见 [AGENTS.md](AGENTS.md)，长期决策见 [docs/TEAM_DECISIONS.md](docs/TEAM_DECISIONS.md)，历史见 [handoff/sessions/](handoff/sessions/)。

## 当前 Git 与发布

- 开发分支 `ai/desktop/design-system-current`；本地 HEAD `cd502b5`，比远端开发分支领先 1 个提交。
- Automation Runner、Host Project Compatibility 和同批界面修复已提交为 `cd502b5 feat: publish automation runner and host-compatible deliveries`；因当前会话的外发审批要求明确 GitHub 目的地，尚未 push，main 未操作。
- 上次 CI / Pages [35575034360](https://github.com/23mnals/aisee-design-system/actions/runs/35575034360) 成功；公开入口 https://23mnals.github.io/aisee-design-system/ 尚不包含本轮本地版本。
- 既存 10 个无关通知备用资源/原型继续保留，不重置、不删除；旧公开 release 全部保留。

## 正在做

- Automation Runner 已完成本地实现、验收和提交；等待用户明确确认推送到 `https://github.com/23mnals/aisee-design-system.git` 的 `ai/desktop/design-system-current`。
- 用户已确认 A+D 分区动效并授权同步：悬停卡片按指针方向轻探，只有进入绿色小怪兽时播放一次软胶回弹；已同步 Demo、生产组件和 Copy for AI，取消循环抖动。
- Automation Runner Demo 的标题与控制区已修复为桌面单行布局；Show runner 开关状态不会再触发换行，窄屏时才整组换行。
- Automation Runner Copy for AI 已明确增量合并：宿主已有的兼容眨眼/眼珠跟随可保留，其余出退场、状态、A+D、拖拽和 reduced-motion 以当前交付为准，不创建第二个 Runner 或重复监听。
- Automation Runner 的卡片交互已补齐：标题/箭头展开、横线最小化，点击最小化卡片任意位置恢复 default；Demo view 下拉框仅用于直接预览状态。
- 同一未发布批次还包含 Host Project Compatibility、门户滚动条/描述/按钮布局、Sidebar 收起间距、Tooltip NEW 标签等已确认修改。

## 最近完成 · Automation Runner（本地未发布）

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
- 新 latest 和版本已进入本地提交 `cd502b5`，尚未推送；公开 Copy 仍使用上一发布版，不能宣称外部已获取本轮规则。

## 本轮验收

- 浏览器实测 Automation Runner：标题展开、箭头收起、横线最小化、点击最小卡片空白区域恢复及整卡拖拽均通过；拖动最小卡片不会误触恢复。Show runner 开关关闭再开启后标题与三项控制保持同一行；展开 332×257、最小 74×64、底部间距 24。
- `npm run typecheck` 通过；`npm test` 137 项通过。
- `npm run verify:ai-deliveries`：Registered components 30 / Verified deliveries 30。
- `npm run audit:copy-ai`：30 组件、205 个受控配置案例、0 失败；不等同于外部 AI 产出验收。
- `npm run site`、`git diff --check` 通过。

## 持续有效的交付约定

- Production 不依赖 Demo；生产清单不限制文件数，只包含真实运行需要的源码、局部样式、资产、依赖和类型。
- Copy 使用具体组件名 + 稳定 `latest.json` + 真实选项；稳定地址在执行时解析最新已发布版，已安装源码不会自动更新。
- 兼容性按组件声明，不统一强制 React/Node 版本；安装前识别宿主 UI 库并保留 AISEE 外观、状态、动效、行为和无障碍。
- NEW 更新当天算第 1 天，第 4 天台北零点消失；构建和刷新不延长日期。
- Automation Runner 应挂载在 app shell、位于路由内容外；重新唤起入口和真实任务状态归宿主业务所有。

## 未完成与下一步

1. 用户明确确认 GitHub 远端和分支后，推送本地提交 `cd502b5` 与本次交接提交到 `origin/ai/desktop/design-system-current`，并等待 CI / Pages。
2. 推送后核对 Automation Runner 公开组件页、latest、Copy for AI，以及外部 React 项目接入。
3. 实际业务项目验证宿主 primitive 复用和全局 app-shell 挂载；本仓库尚未验证真实 MUI/Ant/Chakra 等项目。
4. FeatureOverview 第二批平台图标条组件化尚未实施；连接弹窗暂缓，支付和自动化任务执行始终由业务接口负责。

## 最近 session

- [Automation Runner 通用常驻浮层](handoff/sessions/2026-09-21-automation-runner.md)
- [Automation Runner 发布准备](handoff/sessions/2026-09-22-automation-runner-release.md)
- [Host Project Compatibility](handoff/sessions/2026-09-21-host-project-compatibility.md)
- [预览间距与按钮布局](handoff/sessions/2026-09-21-preview-layout.md)
- [精简页面描述](handoff/sessions/2026-09-21-page-descriptions.md)
- [Tooltip NEW 标签修复](handoff/sessions/2026-09-21-tooltip-new-labels.md)
- [隐藏导航滚动条](handoff/sessions/2026-09-21-sidebar-scrollbar.md)
