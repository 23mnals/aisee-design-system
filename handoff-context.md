# AISEE Design System 当前交接

> 工作纪律见 [AGENTS.md](AGENTS.md)，长期决策见 [docs/TEAM_DECISIONS.md](docs/TEAM_DECISIONS.md)，历史见 [handoff/sessions/](handoff/sessions/)。

## 当前 Git 与发布

- 开发分支：`ai/desktop/design-system-current`；最新功能提交 `739477f`（fix: preserve host design in AI component integration）已推送 origin，包含 Brand 改名与 Copy for AI 宿主保护修正。
- [本次 CI / Pages](https://github.com/23mnals/aisee-design-system/actions/runs/35949568676) 的 verify 与 pages 均成功。
- 已有 [PR #10](https://github.com/23mnals/aisee-design-system/pull/10) 已关联当前任务；未合并 PR，main 未操作。
- 功能文件已提交且与远端一致；本轮发布交接记录随独立文档提交同步，除此之外没有未提交功能改动。
- 所有旧 release 保留。此前 Brand 改名时的无关构建备份仍位于 `/tmp/aisee-build-only-cds7_4p2`。

## 正在做

- Brand 名称简化与 Copy for AI 宿主保护修正已发布，等待用户在真实业务项目验证。
- Copy for AI 改为先检查目标组件、样式、UI 库与交互；保留既有外观和行为，只补本次缺失能力。动画需求只补缺失动效，不导入完整交付 CSS，不改事件、布局、图标、状态或拖拽。
- 宿主保护优先于 preserve / 默认值 / 预览选项；不兼容不能作为替换理由，只有目标不存在时才新建。短提示词、integrationPolicy、30 组件 preserve、ready.md、README/Overview/交付文档均已同步。
- 侧边栏固定为 `Brand → Foundations / Explorations`。Foundations 承载基础规范，Explorations 承载 AI 灵感参考；门户中英说明、注册默认值、Managed Automation 元数据、README 与长期规则已同步。
- 页面路径、数量（63 pages，Brand 29）、来源、Draft / Legacy 状态保持不变；原有历史页面和资源保留。

## 最近完成与当前有效实现

- 门户保留 README、Brand、Components、UI Kits — Webapp 四个入口；探索稿不是已确认产品设计或实施规范，实际产品设计以对应功能最新 Figma 为准。
- Copy for AI 的 shadcn/ui 接入先读 `components.json`、alias 与既有 primitive，保留宿主样式/UI 库/交互，只在原路径补所需缺失能力；禁止平行组件。不兼容时报告缺口，不能自动重建。
- Automation Runner 已具备 app shell 常驻、default / expanded / minimized、关闭与唤起、拖拽和键盘移动、最近视口边缘锚定；没有真实详情或操作时回落 default，不显示空白详情或展开箭头。
- Runner 已确认 A+D 动效：整卡方向轻探、进入绿色小怪兽单次软胶回弹；整卡 hover 瞪眼并左右寻找两次，保持原始眼睛比例、清晰绘制、眨眼和鼠标跟随；reduced-motion 停止装饰动画并保留操作。
- Runner 原尺寸与 Figma 来源：default 332×64、expanded 约 332×252、minimized 74×64；节点 `72:55666`、`72:56017`、`72:55315`。当前已发布交付版本为 `49db4e9b4383c154`，本次只更新宿主保护说明，运行时代码和样式未变。
- Select / Dropdown 六类核心类型：Single-select、Multi-select、Searchable multi-select、Combobox、Action menu、Grouped select；每张卡一个类型标题并提供无障碍名称。
- NEW 更新当天算第 1 天，第 1–7 天显示，第 8 天台北零点消失；改名、构建和期限调整不批量续期。
- 门户 Share 使用链环图标；目录隐藏滚动条；顶部描述和操作按钮保持精简布局。

## 验收

- 发布后 HTTP 实测：线上 Brand 新分类、短提示词脚本和 manifest 与本地一致；30/30 latest、ready.md 与 installer SHA-256 验证通过。NotificationBell 当前版本 `b9054a32dfa37f1d`，AutomationRunner `49db4e9b4383c154`。
- Copy for AI 修正：140 项测试通过；typecheck、site、git diff --check 通过。
- 30 个交付验证通过（准确文件范围、校验、重装/冲突拒绝、隔离 React 类型检查与构建）；205 个受控 Copy for AI 配置案例 0 失败。
- 对比发布前 `a866165`：30/30 生产源码 payload 和文件清单完全相同，仅接入说明/元数据/版本指针变化。
- 浏览器展开报告中的 NotificationBell 提示词，确认包含保留宿主、只补动画、禁止完整 CSS/平行组件和现有设计优先的规则。真实外部 AI 的生成结果仍需业务项目验收。线上浏览器工具连接两次超时，未声称已完成线上按钮点击。
- Brand 本地浏览器确认 Foundations / Explorations 单行完整显示、展开收起正常；63 pages / Brand 29，Managed Automation Draft 与 ChatGPT · Web 来源不变。

## 持续有效的交付约定

- Production 不依赖 Demo；清单只包含真实运行所需源码、局部样式、资产、依赖和类型。CSS 保留完整依赖闭包及 reduced-motion 等规则。
- Copy 使用组件名、稳定 `latest.json` 与真实选项；执行时解析最新已发布版本，已安装源码不会自动更新。
- 宿主接入保留已有 theme / provider / global styles，保留现有组件级样式和交互，按实际缺口复用 primitive；不为单个组件引入整套 UI framework。
- Runner 挂在 app shell 路由内容外；真实任务状态和重新唤起入口归宿主，关闭浮层不得停止或取消业务任务。

## 未完成与下一步

1. 从在线门户复制提示到真实 shadcn/ui 项目，确认修改既有 primitive 路径且没有平行组件目录。
2. 在外部 React 项目验收 Automation Runner，重点复测空详情和视口四边。
3. 在实际 MUI / Ant / Chakra 等宿主验证 primitive 复用；仓库尚未覆盖真实项目。
4. FeatureOverview 第二批平台图标条组件化尚未实施；连接弹窗继续暂缓，支付和自动化执行由业务接口负责。
5. 用户刷新在线 Demo 并重新 Copy，在业务测试分支验证已有静态外观、交互、状态和回调不变，只增加要求的缺失动画；原业务代码如已被覆盖，需在目标项目另行恢复。

## 最近 session

- [Copy for AI 修正发布与线上验证](handoff/sessions/2026-09-24-copy-ai-release.md)
- [Copy for AI 保留宿主样式与动画增量接入](handoff/sessions/2026-09-24-copy-ai-preserve-host.md)
- [Brand 导航简化与遗留任务核对](handoff/sessions/2026-09-24-brand-navigation-names.md)
- [门户归属与宿主 primitive 接入修正](handoff/sessions/2026-09-23-portal-ia-host-primitive.md)
- [Automation Runner 空详情与边缘锚定修复](handoff/sessions/2026-09-23-automation-runner-edge-anchoring.md)
