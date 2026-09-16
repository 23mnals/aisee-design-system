# AISEE Design System 当前交接

> 当前状态覆盖更新；工作纪律见 [AGENTS.md](AGENTS.md)，长期决策见 [docs/TEAM_DECISIONS.md](docs/TEAM_DECISIONS.md)，历史见 [handoff/sessions/](handoff/sessions/)。

## 当前 Git

- 开发分支：`ai/desktop/design-system-current`，跟踪 `origin/ai/desktop/design-system-current`。
- 最新关键实现提交：`9c887ba fix: refine dropdown interactions`，已推送至 `origin/ai/desktop/design-system-current`。
- Dropdown 性能、Show icons 开关和浮层高度修复已同步到远端开发分支。
- `main` 未直接修改，未创建或合并 PR。
- `main` 最近一次正式同步为已合并的 [PR #9](https://github.com/23mnals/aisee-design-system/pull/9)。

## 当前状态

- Dropdown Fluid Hover 已同步到 React 组件、正式 Select / Dropdown Demo 与独立预览；菜单打开或尺寸变化时缓存选项几何信息，指针移动只读取缓存。
- Dropdown 行操作加号为 24px，默认隐藏；行 hover / focus-within 时显示灰底灰边，按钮自身 hover 才变黄。
- Fluid Hover 高亮移动为 110ms，尺寸变化 80ms；跨间隙计算使用 `requestAnimationFrame`，同一项内移动不再查询 DOM 或读取布局。
- Variant Playground 参数为只读说明；Grouped account 提供真实 `Show icons` Toggle，关闭后仅隐藏 leading avatar / platform icon。
- Dropdown 菜单保持绝对定位浮层；展开或收起不改变 Playground、后续内容或文档高度。
- Credit Bar 已包含 Subscription 与 Top-up 同时为 0 的状态。
- Empty State 的 `No report data` 已使用正确业务语义：无报告记录，添加产品 URL 后发起分析。
- Avatar、Sidebar Navigation、组件目录 A–Z、README、Copy for AI、NEW 标识与相关 Demo 已同步。

## 验收证据

- `npm run check` 已通过 token 检查、TypeScript、72/72 测试和完整构建。
- `git diff --check` 已通过。
- 浏览器实测组合选择器展开前后 Playground 高度、Summary 位置、Composition 位置和文档总高度完全一致。
- 浏览器实测 Grouped account 的 Show icons 开关：开启 8 个 icon 可见，关闭 0 个可见并保留文本内容。
- 浏览器检查正式 Grouped account Dropdown：默认加号为 24×24px、`opacity: 0`、灰底灰边；行 hover / 键盘聚焦时出现，按钮 hover 变黄。
- 浏览器检查 Credit Bar 双 0 状态、Empty State 暂无报告数据文案及 Avatar 相关页面，控制台无 warning 或 error。

## 关键决策

- Fluid Hover 是正式 Dropdown 组件能力，不再只是独立原型。
- Dropdown 菜单必须脱离文档流作为浮层，展开和收起不得改变外围内容高度或位置。
- Variant Playground 顶部参数只用于描述当前预览；Grouped account 的 `Show icons` 是真实的显示密度开关。
- 行内次级操作默认隐藏；行 hover / focus-within 后以中性样式出现，操作本身 hover 才使用黄色强调。
- Empty State 插图 `no-report-data` 只表示暂无报告数据，主操作为添加产品 URL 并开始分析。
- Avatar 两套资源不可混用：方形用于网站注册用户；圆形灰描边用于无法获取社媒头像时的兜底。
- Plan-generated Post 的社媒 logo 只使用虚线描边，Manual-create Post 只使用实线描边。
- 组件更新必须同步 Overview、README、Copy for AI 与 NEW 标识；分类内按 A–Z 排序。
- 普通开发使用 `ai/desktop/design-system-current`；正式同步 `main` 通过 PR，merge 需要用户明确授权。

## 远端 Demo

- GitHub About / Website 已设置为 [AISEE Design System HTML Demo](https://23mnals.github.io/aisee-design-system/)。
- GitHub Pages 从 `main` 部署；开发分支的本轮新改动需在后续 PR 合并后才会进入正式 Pages。

## 未完成 / 下一步

- 创建 `ai/desktop/design-system-current → main` PR；项目规则要求用户明确授权后才合并。合并后 GitHub Pages 才会部署最新版，右侧链接地址保持不变。
- Figma `38:208828` 的复杂 Filter 尚未完整进入 Dropdown；当前仅有简化版 Status / Difficulty。
- Card 业务变体 Figma `10374:435175` 尚未实现。
- Plugin Entry Options 的三个 Legacy Engage 内嵌页面仍引用不存在的 JSX 路径。

## 最近一次 Session

- [2026-09-16-dropdown-performance-and-icon-toggle.md](handoff/sessions/2026-09-16-dropdown-performance-and-icon-toggle.md)
