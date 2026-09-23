# AISEE Design System 当前交接

> 工作纪律见 [AGENTS.md](AGENTS.md)，长期决策见 [docs/TEAM_DECISIONS.md](docs/TEAM_DECISIONS.md)，历史见 [handoff/sessions/](handoff/sessions/)。

## 当前 Git 与发布

- 开发分支 `ai/desktop/design-system-current`；本轮发布包含 Automation Runner 修复提交 `ee04263` 与门户 / shadcn 接入规则提交 `3c2feeb`，main 未操作。
- Automation Runner 空详情、边缘锚定、Demo、生产交付和测试已随 `ee04263` 进入本轮发布。
- 门户信息架构与 shadcn/ui 原位复用规则已随 `3c2feeb` 进入本轮发布；新版 Copy 明确禁止在兼容宿主中创建平行 AISEE primitive。
- `7cd6dc0` 已完成 CI 与 Pages 部署，公开站点已恢复为 63 pages 并包含 Automation Runner。
- 既存 10 个无关通知备用资源/原型继续保留，不重置、不删除；旧公开 release 全部保留。

## 正在做

- 门户 Brand 导航已收敛为 Common 与 AI Explorations / Inspiration；AI 参考稿保留 Legacy / Draft 和原路径，动态来源与状态分开显示。README、UI Kits 边界和 Figma 权威说明已同步。
- Copy for AI 已明确：shadcn/ui 项目先读 `components.json`、alias 和现有 `components/ui`，在兼容 primitive 的原路径增量合并 AISEE 视觉、状态和动画，不创建平行 `src/components/aisee`、第二套 `components/ui` 或第二个同类组件；standalone 仅作能力不兼容时的回退。
- Automation Runner 外部接入没有真实详情或操作时，expanded 自动回落为 default，不再出现空白详情区、展开箭头或残留横线。
- Automation Runner 拖到视口边缘后切换 default、expanded、minimized 会保持最近边缘或中心锚点；右侧向左展开、向右收起，左侧及上下边缘对称处理。
- Copy for AI 的 preserve 契约已同步上述规则；最新生产交付版本为 `200678363f0b540a`，等待 Pages 完成部署后进入公开站点。

- NEW 显示期限已恢复为 7 天：更新当天算第 1 天，第 8 天台北零点消失。现有显式日期表保持不变，从最初添加 NEW 或最近一次真实内容更新的日期计算；本轮规则调整不批量续期。日期边界测试通过并已推送。
- Select / Dropdown 核心类型已按能力重新梳理为 Single-select、Multi-select、Searchable multi-select、Combobox、Action menu、Grouped select；每张卡只显示一个类型标题，控件通过该标题获得无障碍名称。已完成本地验收并随 `f6603cc` 推送。
- Automation Runner Demo 控制区、门户 Share 图标、眼睛清晰度与生产交付已完成验收并推送。
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

- 门户浏览器实测四个一级栏目、Brand 两个分类、Managed Automation Draft 与 ChatGPT · Web 来源分离显示、来源搜索及刷新 hash 深链均通过。
- Copy for AI 新短指令为单句稳定 latest 地址，明确 shadcn 原位复用与 standalone 回退；`npm run audit:copy-ai` 仍为 30 组件、205 个受控配置案例、0 失败。
- 浏览器实测右侧卡片 332px → 74px → 332px 时右边缘始终为 1264px；左侧同流程左边缘始终为 8px；顶部展开固定 8px 顶边，底部从 257px 收回 64px 时固定 712px 底边。空详情的默认回落和不渲染详情容器已有组件测试覆盖。
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

1. 等待并核对本轮 GitHub Pages 部署结果。
2. 从在线门户复制新版提示到真实 shadcn/ui 项目，确认只修改宿主既有 primitive 路径，不产生平行 AISEE 组件目录。
3. 在外部 React 项目验证 Automation Runner 最新交付，重点复测空详情和视口四边。
4. 实际业务项目验证其他宿主 primitive 复用；本仓库尚未验证真实 MUI/Ant/Chakra 等项目。
5. FeatureOverview 第二批平台图标条组件化尚未实施；连接弹窗暂缓，支付和自动化任务执行始终由业务接口负责。

## 最近 session

- [门户归属与宿主 primitive 接入修正](handoff/sessions/2026-09-23-portal-ia-host-primitive.md)
- [Automation Runner 空详情与边缘锚定修复](handoff/sessions/2026-09-23-automation-runner-edge-anchoring.md)
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
