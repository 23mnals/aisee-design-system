# Segmented Choice · 2026-09-18

## 目标与依据

用户要求把少量（通常 3–4 项）含选项名、要求和解释的选择区做成通用组件；参考 Figma LLvI9vd66VLNuAltAWJFJw / 77:17029。已读取设计上下文和截图，保留灰色轨道、8px 圆角、黄色填充 / 深色选中描边、12px 名称与 10px 要求。info 图标下载自该节点，来源存 assets/segmented-choice/manifest.json。

## 完成

- 新增导出 SegmentedChoice；选项 id / label / requirement / description / disabled，支持受控与非受控、name、required、disabled、tone lime / yellow。
- 原生 radio 提供单选语义和方向键；说明随选中项变化，info 复用 Tooltip 支持 hover / focus，独立于选项点击区。
- 新增独立组件页，示例覆盖两项 Post format、三项、四项含禁用项、整组禁用。
- Card 的 Post setup 与 Create Post 弹窗改用该组件。
- 注册导航、Overview 索引、Copy for AI、NEW，更新 README / CHANGELOG / AI_HANDOFF。

## 验证

- 88 项测试、typecheck、tokens:check 通过；组件定向构建与静态站点构建成功。
- 浏览器验证点击 Thread 更新解释、方向键返回 Single post、Tab 到 info 显示提示；390px 双列换行无横向溢出。
- Create Post 弹窗内使用真实组件，选择 Thread 同步更新说明。
- 更新 Overview 索引与组件数量断言；NEW 测试日期与上一轮 09-18 实际更新对齐。

## Git / 状态

ai/desktop/design-system-current，HEAD 25c8f9f。未 commit / push / merge，原有本地改动保留。

本轮组件待用户视觉确认，其他待验收范围看 handoff-context.md；收到明确发布请求后精确提取已确认范围。
