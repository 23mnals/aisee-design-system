# 2026-09-15 Dropdown 与 Common 文档布局整理

## 本轮目标

- 修正 README、组件详情页和 Brand / Common 页面在近期更新后的视觉与交互不一致。
- 补齐 Dropdown 的 Figma 组合变体，并按用户提供的具体节点复核样式。
- 清理用户明确要求移除的重复或错误 Legacy 页面。

## 本轮完成

- README 的版本卡片、颜色条、下拉箭头间距和中英文内容继续整理；英文视图不再混入中文说明。
- Current 组件详情页的 `Copy for AI`、双星图标、高度和可见度保持一致，相关 Overview 和文档同步。
- Dialog 按 Standard / Centered / Split 外壳与 Form / Choice / Details / Summary 内容结构补齐分类和场景。
- Tabs 补齐图标、数量和平台名称显示策略，并修复全部名称无法容纳时的截断。
- Brand / Common 页面接入共享 640px 文档结构，标题、描述、详情卡及右上角上一项 / 下一项箭头与 Current 组件页对齐。
- 删除用户明确要求移除的 `Visual Style` Legacy 页面及其目录、manifest、README 和测试引用；Brand 当前为 29 项，站点总计 55 页。
- `dApp v6 Foundations` 的说明卡补上完整灰色描边；Logo Animation 交付卡移除空状态占位，底部间距与顶部一致。
- Brand Logo 重排为尺寸和背景两组有描边样本卡，并修正 Analysis lime 色值。
- Dropdown 生产组件新增 richer composition slots，详情页按一行一个组件展示 Compact、Search list + action、Filter panel 和 Grouped account menu。
- Dropdown 所有菜单项改为 4px 垂直间距；Search list 字重降为 500。
- 按 Figma `38:82016` 精确修正 Filter：320px 宽、16px 面板圆角、24px 选项高度、8px 选项圆角、`#FAFAFA` 填充、6% 黑描边、黑色选中态与分隔线。
- Dropdown 详情页明确分为 `Interactive core patterns` 与 `Variant playground`：上方保留 Single、Multi、Filter、Input 四种基础交互，下方通过 Composition 参数切换 Compact、Search、Filter、Account 四种 Figma 组合；Compact 额外提供 Open menu 参数，其余组合保留搜索、操作按钮、筛选和账号选择等真实交互。
- Dropdown Overview、README 与 Copy for AI 同步说明 8px trigger-to-menu 间距、4px 选项间距和 Variant Playground，避免详情与入口文档不一致。

## 修改范围

- 门户与目录：`aisee-design-system-preview.html`、`_ds_manifest.json`、`README.md`、`brand/foundations/README.md`
- Current 组件与 Demo：`components/`、`src/components/Dropdown.tsx`、`src/styles/components.css`
- Brand / Common：`brand/common-doc-layout.css`、`brand/common-doc-layout.js`、`brand/pages/logo-animation/preview.html`、`preview/*.html`
- 测试：`tests/preview.test.mjs`
- 其他同步生成文件：组件 Demo CSS / JS 与 Webapp sidebar 产物

## Git / 验收

- 分支：`ai/desktop/design-system-current`
- 基准提交：`ce091cc docs: record component prompt sync`
- 本轮改动尚未 commit、push 或发 PR。
- 浏览器实测 Filter 的 computed styles：面板 320px、圆角 16px、无阴影；选项 24px、圆角 8px、背景 `rgb(250,250,250)`、描边 `rgba(17,17,17,.06)`；基础下拉菜单 row gap 为 4px。
- 浏览器逐一实测 Variant Playground：Search 查询过滤与 Add Project、Filter 分组选择、Grouped account 选择、Compact 开合参数均可用；非 Compact 变体不显示 Open menu 参数。
- `npm run check` 已通过 68/68 测试、TypeScript 检查、token 检查与完整构建；`git diff --check` 已通过。

## 本轮确认的设计决策

- Dropdown 选项间距最终采用 4px。
- Filter 必须直接服从 Figma `38:82016`，不从视觉推测圆角、颜色或尺寸。
- Dropdown 的基础模式与 Figma 组合分层展示，复合变体统一放入单一可交互 Variant Playground。
- Brand / Common 与 Current 组件页共享 640px 内容结构，箭头保持在标题区右上角。
- 当前错误的 `Visual Style` 页面已明确移除。

## 未完成 / 下一步

- 等待用户继续浏览本轮视觉改动。
- 当前改动仍在本地开发分支，用户未要求 commit 或 push。
- 用户确认后按独立任务整理 commit；正式进入 `main` 仍通过开发分支到 `main` 的 PR。
