# 2026-09-15 Dropdown Variant Playground

## 本轮目标

- 明确 Dropdown 详情页上、下两组内容的关系。
- 将平铺的复合组件变体改为可切换、可实际操作的 Variant Playground。
- 更新当前交接，确保下一轮使用准确的 Figma 术语继续工作。

## 本轮完成

- 上方增加 `Interactive core patterns` 分组，继续展示并保留 Single-select、Multi-select、Filter、Input 四种基础交互模式。
- 下方改为单一 `Variant playground`，通过 Composition 控件切换 Compact menu、Search + action、Filter panel、Grouped account 四种组件变体。
- Playground 在标题区显示当前变体参数；Compact 模式额外显示 Open menu 控制，其余模式自动隐藏该无关参数。
- 保留并验证搜索过滤、Add Project、分组 Filter 选择与 Reset、Account 选择、Compact 菜单开合等真实交互。
- 修复参数下拉箭头方向，并修复 Compact 状态文字与打开菜单重叠。
- Overview、README 和 Copy for AI 同步 8px trigger-to-menu、4px option gap 与 Variant Playground 说明。

## 术语澄清

- Playground 中的 Mode、Selection、Search、Icons、Groups 等属于 **组件属性 / 变体属性**，对应 Figma component properties / variants。
- 它们不是 Figma Variables 数据。Figma Variables 在本项目中主要指颜色、间距、数值等 token，例如 semantic color variables。
- 后续文档应使用“组件属性”“组件变体”或 “component properties / variants”，不要把此类切换参数称为 Figma Variables。

## Git / 验收

- 分支：`ai/desktop/design-system-current`，跟踪 `origin/ai/desktop/design-system-current`。
- 当前 HEAD：`ce091cc docs: record component prompt sync`。
- 本轮及前序批次改动仍在本地工作区，尚未 commit、push、创建 PR 或同步 `main`。
- `npm run check` 已通过 68/68 测试、TypeScript、token 检查与完整构建；`git diff --check` 已通过。
- 浏览器已逐一验证四种 Playground 变体及其交互。

## 未完成 / 下一步

- 等待用户继续浏览并确认本轮 Dropdown、Common、Logo 与 README 的整体视觉结果。
- Card 业务变体 Figma `10374:435175` 尚未实现。
- Plugin Entry Options 的三个 Legacy Engage 内嵌页面仍引用不存在的 JSX 路径。
- 用户确认后再按指令整理 commit / push；正式同步 `main` 仍通过开发分支到 `main` 的 PR。
