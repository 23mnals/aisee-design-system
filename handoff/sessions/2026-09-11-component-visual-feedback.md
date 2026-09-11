# 2026-09-11 — 组件视觉反馈修正

## 目标与完成

用户连续反馈 EmptyState 重复插图/PNG 模糊/需要选择器、教程图标错误、使用场景样式、联动多选对勾与颜色、Tag Input 标签排列。本轮全部增量修改，保留已有状态与动画。

- EmptyState 去除用户指定的 No event alternate，manifest/类型/图库/测试数量改为 14。旧 PNG 不再用于示例，改用原始 SVG。Full composition 与 No action 各有独立下拉，选项用插图名；切换同步对应标题/描述/action。无 action 示例始终不生成按钮。图库选择同步 composer 文案，示例文案在 EmptyState.demo-data.ts，通用组件不内置业务文案。
- TutorialSteps 第二/三步改为 Figma 导出的循环箭头和评论气泡 SVG。整块 38:83251 的 context 错误输出眼睛图层，确切子节点 I38:83251;7692:128539;7692:128584 和 I38:83251;7692:128550;7692:128584 正确解析。首个眼睛动效和单行省略保留。旧 small-eye 历史导出未删除。
- 增加共享 aisee-usage-note：白底、左 3px #EC5212、padding 12px、Karla 14/22。Steps 场景说明、EmptyState 使用说明、ToggleSelectionGroup 场景采用，ScoreGauge 参考同样接入。
- 联动多选 Figma 9704:256746 确认为 #CFFF29 选项底色、#111 方框、白色对勾。根因是 components.css 的基础 Checkbox 在 @import 后覆盖同优先级选择器，错误旋转 SVG 并改色。提升组件作用域选择器优先级，去除该组件对勾旋转过渡；左右 padding 13px。
- Tag Input 标签、输入框 nowrap 横向同排；内容区不足时可横向滚动，添加按钮固定。React CSS 与独立 HTML 同步，窄容器控件保持 40px。

## 修改范围

src/styles/{components,toggle-selection-group}.css；src/components/EmptyStateIllustration.tsx；components/{EmptyState,Steps,ToggleSelectionGroup} Demo 源码与生成包；components/component-doc-layout.css；components/TagInput/TagInput.html；ScoreGauge HTML；assets/empty-state/library/{manifest.json,no-event-alt.svg 删除}；assets/tutorial-steps/{scan.svg,reply.svg,README.md}；tests/composable-status.test.mjs；组件文档与交接。

## 验收

- typecheck、npm test 60/60、build、site 通过。
- 浏览器确认两个选择器各 14 项且独立；No report 显示 Run analysis，No credit 无 action，图库 Plugin 同步 composer。
- 所有图库图片成功加载，示例使用 data:image/svg+xml；教程图标视觉核对正确。
- 场景说明计算样式符合参考；教程标题仍 nowrap/ellipsis。
- 多选稳定状态计算值 #CFFF29/#111/transform none；取消一项、关闭、重开恢复原部分选择，关闭选项 disabled。
- Tag Input 示例添加成功，静态 committed 标签与输入框同排（y 545/544，22/24px 高度），控件 40px。
- 四页 390px iframe 浏览器测试 scrollWidth 均 390。临时 .feedback-layout-audit.html 已删除。

## Git / 状态

分支 ai/desktop/design-system-current，HEAD ee2891a。所有改动仍未提交/推送，无 PR/merge。保留原有 AGENTS.md 与其他未提交改动。

## 未完成 / 下一步

本轮技术实现完成，视觉与八场景仍由用户验收；此前 Card Figma 10374:435175 和 Legacy 插件 JSX 路径问题不属于本轮，继续保留待办。后续按用户反馈增量修改；未经授权不发布。
