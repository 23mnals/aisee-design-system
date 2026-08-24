# Components 与 Event Dialog 交接

## 本轮目标

- 延续 AISEE Design System 的 Components 整理，统一组件详情页、视觉样式、交互与事件弹窗。
- 把旧的综合 HTML 入口逐步转换为 Overview、具体组件和必要分类组成的导航。

## 本轮完成

- 新增 React `EventDialog`，覆盖 success、error、subscribe、upgrade、insufficient-balance、locked 等事件语义。
- `EventDialog` 采用顶部事件类别 icon、标题、描述和操作按钮区；特殊额度、说明或勾选内容通过内容区扩展。
- 统一了主内容宽度、标题/描述字号、卡片描边、侧边栏展开/收起和 Page Banner 等视觉约束。
- 明确 Components 导航只用于查找组件；variants、states、size、spacing 等内容放在详情页内部。
- 明确 Overview 与详情页必须复用同一套真实组件样式和交互，不用另一套展示实现。

## 修改文件

- `src/components/EventDialog.tsx`
- `src/index.ts`
- `src/styles/components.css`
- 同阶段还涉及 Design System 预览、Brand 说明和预览测试等文件；最终内容以对应 Git commit/diff 为准。

## Git / Commit / PR

- 当时交接基线曾为 `6cd7ad8`，工作区存在尚未提交的预览、Brand、测试和交接文档修改。
- 后续这些设计系统更新已进入 checkpoint `7af750d` 及之后的 current/main 提交；若需精确追溯，应结合 `git log -- <file>` 与对应 diff。

## 本轮确认的设计决策

- Dialog 标题使用 Karla 20px / 500，描述使用 14px / 400 和 `rgba(17,17,17,.6)`。
- Dialog 默认不显示右上角关闭 icon，由 Cancel、Maybe later 等语义按钮关闭。
- Page Banner、组件页结构、icon 选择与 Legacy 资产保护规则属于长期决策，现已整理进 `docs/TEAM_DECISIONS.md`。

## 遇到的问题及处理

- 旧交接同时混入当前状态、长期规则、设计决策与过程记录，导致接手时需要从后追加内容反推最新事实。
- 本记录保留该阶段过程；后续当前状态不再依赖旧段落覆盖关系。

## 未完成

- 当时尚未确认 `EventDialog` 的静态 HTML、registry 与组件详情页是否完整补齐。
- Components 仍有真实组件清单、空入口、Button hover、Dropdown 示例与功能页 Banner 资产等收尾事项。

## 下一轮建议

- 先以当前仓库与 `handoff-context.md` 为准；只有追溯本阶段原因时再使用本记录。
- 补齐组件入口前先确认现有实现，执行 typecheck/test，并通过 HTTP 预览验证 SVG、字体、动画与交互。
