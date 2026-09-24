# Dropdown 重复展开 hover 修复 · 2026-09-18

- 用户反馈 Card 内容类型下拉没有 hover。
- 浏览器复现：首次高亮 232×34px，选择后重新打开高亮变成 0×0px。原因是菜单卸载了高亮节点，但组件层面的尺寸缓存仍保留，因此跳过新节点的宽高赋值。
- src/components/Dropdown.tsx 改为比较当前高亮 DOM 的 inline width / height，保留尺寸未变时不重复赋值的行为。
- 定向重建 Card、Toggle、ToggleSelectionGroup、EmptyState 示例，更新最近更新与 NEW 日期。
- 浏览器连续三轮开关与方向键均有 232×34px 高亮；鼠标移动到 Data overview 后高亮正常跟随并截图验证。typecheck、86 项测试通过。
- 分支 ai/desktop/design-system-current，HEAD 25c8f9f。未 commit / push，原有未确认内容保留。Card 等组件仍待视觉验收。
