# 2026-09-11 教程文字单行省略

- 用户要求“全部一行显示，显示不下省略号显示”，未附具体区域。已询问区域，等待期间核对代码，随后明确按当前教程步骤标题和描述处理。
- 修改 src/styles/tutorial-steps.css：copy flex:1/min-width:0，标题/描述 nowrap + overflow:hidden + text-overflow:ellipsis；图标/箭头尺寸不变。
- 更新 docs/COMPOSABLE_COMPONENTS.md 与 Demo bundles。
- npm run build:component-demos、git diff --check 通过；浏览器实测三个标题均高 22px、描述均高 14px，全部 nowrap/ellipsis 且内容宽度超过显示宽度。
- 仅样式调整，未新增测试、未发布；分支 ai/desktop/design-system-current，HEAD ee2891a，原工作区改动保留。
