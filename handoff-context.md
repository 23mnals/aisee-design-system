# AISEE Design System 当前交接

> 当前状态覆盖更新；工作纪律见 [AGENTS.md](AGENTS.md)，长期决策见 [docs/TEAM_DECISIONS.md](docs/TEAM_DECISIONS.md)，历史见 [handoff/sessions/](handoff/sessions/)。

## 当前 Git

- 开发分支：`ai/desktop/design-system-current`。
- 最新功能提交：`45e4803 feat: refine current component system`，已推送到 `origin/ai/desktop/design-system-current`。
- 本轮组件、Demo、Overview、文档与测试已经同步远端开发分支。
- 本轮未创建 PR、未合并到 `main`。

## 正在做

- 本轮新增 Dialog 分类、Platform Tabs 名称模式与 Overview 快捷入口行为已实现并通过完整构建；等待用户查看实际预览。
- 本地预览入口为 `http://127.0.0.1:4173`；浏览器接管接口本轮无法读取标签页，但构建、结构测试和类型检查均通过。

## 最近完成

- Tabs：在 `Segmented · Icon + text` 标题右侧加入 `Show icons` 开关，在 `Segmented · Text only` 标题右侧加入 `Show counts` 开关；默认显示，关闭后布局和选中指示器会跟随内容宽度重新计算。组件本身仍通过可选 `icon` / `count` 数据控制，Demo 开关只用于演示组合能力。
- Steps：将已确认的加载中文字波浪效果同步到正式通用组件，新增 `titleMotion="wave"`；仅处理中使用，完成与错误状态保持静止，并遵循 `animated=false` 与 reduced-motion。
- Stat Card：按用户明确要求删除重复的 Legacy `components/StatCard/StatCard.html` 及门户入口，保留 `components/StatCardCurrent/`。
- Components Overview：补齐所有 Current 组件的分组索引，并增加测试，保证门户 Current 条目与 Overview 索引保持一致；同步更新 Motion、Toast、Inputs、Content/Status、Data Display 的当前说明。
- Components Overview：Current 标签已成为组件详情页快捷入口；点击后在门户内打开目标页并同步左侧选中项，页面说明可从左侧 Overview 或浏览器返回键返回。
- Dialog：改为结构优先的通用 API，提供 Standard、Centered、Split Shell，以及 Form、Choice、Details、Summary 内容组合和 7 个真实交互场景。
- Tabs：Platform 模式默认 `platformLabelDisplay="auto"`，按全部 Logo + name 的真实宽度自适应；能放下时全部显示，空间不足时仅当前项显示名称，且不再压缩或切断名称。`active` / `all` 保留为显式覆盖。
- 同一批更新还包含已确认的 Button 动效正式同步、Stat Card Current、Credit Bar、Dialog、Toast、Empty State、Badge、Toggle Selection Group 与 Web App UI Kit 侧边栏更新。

## 验收证据

- `npm run build:component-demos` 通过，生成 9 组组件 bundle 与 Web App UI Kit bundle。
- `npm test` 65/65 通过。
- `npm run typecheck` 通过。
- `npm run build` 通过，生产包与全部组件 Demo 已重新生成。
- `git diff --check` 通过。
- 结构测试覆盖 Tabs 两个开关、Steps 波浪标题可访问性、Legacy Stat Card 移除，以及 Overview 与全部 Current 组件条目的同步。

## 关键决策

- 组件页有更新时，Components Overview 必须同步；测试会自动比较门户 Current 页面与 Overview 索引，防止以后再次不一致。
- Tabs 的图标和数字属于每个 Tab 项目的可选内容；Demo 控制开关用于展示有/无内容两种组合，不扩张生产 API。
- Platform Tabs 的名称显示策略属于通用组件 API，默认 `auto`；Dialog 按结构分类，功能名仅作使用场景。
- Overview 的 Current 标签是组件页快捷入口，不是页内锚点；返回方式为左侧 Overview 或浏览器返回键。
- Steps 图标是结构示例，实际业务应按步骤语义传入对应图标；波浪文字是可选的加载状态动效。
- 普通开发继续使用 `ai/desktop/design-system-current`；正式同步 `main` 通过 PR，merge 需要用户明确授权。

## 待确认 / 未完成

- 待用户视觉确认 Tabs 的 icon/count 两个演示开关、Platform 自适应名称模式、Dialog 分类示例与 Overview 快捷跳转。
- 待用户在正式 Steps Demo 中确认波浪文字节奏；技术实现已同步。
- Card 业务变体 Figma `10374:435175` 尚未实现。
- Plugin Entry Options 的三个 Legacy Engage 内嵌页面仍引用不存在的 JSX 路径，尚未修复。

## 发布状态 / 下一步

- 本轮修改已提交并推送到远端开发分支；其他工作区可拉取 `ai/desktop/design-system-current` 查看。
- 如需进入 `main`，按用户明确指令创建 `ai/desktop/design-system-current → main` PR；PR 不自动合并。
- 新对话先读 `AGENTS.md` 与本文件，再检查 branch/status/log，并从当前工作区继续。

## 最近一次 Session

- [2026-09-14-component-motion-tabs-and-overview.md](handoff/sessions/2026-09-14-component-motion-tabs-and-overview.md)
