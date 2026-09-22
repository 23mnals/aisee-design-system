# AISEE Design System 当前交接

> 工作纪律见 [AGENTS.md](AGENTS.md)，长期决策见 [docs/TEAM_DECISIONS.md](docs/TEAM_DECISIONS.md)，历史见 [handoff/sessions/](handoff/sessions/)。

## 当前 Git 与发布

- 开发分支 `ai/desktop/design-system-current`；Automation Runner 功能提交 `cd502b5`、交接提交 `553daf8` 与部署触发提交 `7cd6dc0` 已推送，main 未操作。
- `7cd6dc0` 已完成 CI 与 Pages 部署，公开站点已恢复为 63 pages 并包含 Automation Runner。
- 既存 10 个无关通知备用资源/原型继续保留，不重置、不删除；旧公开 release 全部保留。

## 正在做

- 正在发布 Automation Runner Demo 控制区与门户 Share 图标的小幅优化。
- 用户已确认 A+D 分区动效并授权同步：悬停卡片按指针方向轻探，只有进入绿色小怪兽时播放一次软胶回弹；已同步 Demo、生产组件和 Copy for AI，取消循环抖动。
- Automation Runner Demo 的标题与 `NEW` 固定单行；位置选择显示精简为 Left、Center、Right，真实 bottom placement 值不变。
- Automation Runner Copy for AI 已明确增量合并：宿主已有的兼容眨眼/眼珠跟随可保留，其余出退场、状态、A+D、拖拽和 reduced-motion 以当前交付为准，不创建第二个 Runner 或重复监听。
- Automation Runner 的卡片交互已补齐：标题/箭头展开、横线最小化，点击最小化卡片任意位置恢复 default；Demo view 下拉框仅用于直接预览状态。
- 门户 Share 已换为连接节点图标，复制当前页链接的行为不变。

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

1. 发布并核对本轮 Automation Runner 控制区与门户 Share 图标优化。
2. 在外部 React 项目验证 Automation Runner 接入。
3. 实际业务项目验证宿主 primitive 复用和全局 app-shell 挂载；本仓库尚未验证真实 MUI/Ant/Chakra 等项目。
4. FeatureOverview 第二批平台图标条组件化尚未实施；连接弹窗暂缓，支付和自动化任务执行始终由业务接口负责。

## 最近 session

- [Automation Runner 通用常驻浮层](handoff/sessions/2026-09-21-automation-runner.md)
- [Automation Runner 发布准备](handoff/sessions/2026-09-22-automation-runner-release.md)
- [Automation Runner 控制区与分享入口](handoff/sessions/2026-09-22-automation-runner-demo-polish.md)
- [Host Project Compatibility](handoff/sessions/2026-09-21-host-project-compatibility.md)
- [预览间距与按钮布局](handoff/sessions/2026-09-21-preview-layout.md)
- [精简页面描述](handoff/sessions/2026-09-21-page-descriptions.md)
- [Tooltip NEW 标签修复](handoff/sessions/2026-09-21-tooltip-new-labels.md)
- [隐藏导航滚动条](handoff/sessions/2026-09-21-sidebar-scrollbar.md)
