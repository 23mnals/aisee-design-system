# 通用分区 Card · 2026-09-17

## 目标与设计来源

按用户四个 Figma 链接补齐用于信息填写、数据总览和 Create Post 的通用卡片。已读取 38:84429、38:84482、38:65908、77:16891，并深入 77:16893、77:16984、77:17205。沿用既有组件和资源，未修改 Figma。

## 完成

- 扩展既有 Card，保留默认 / 阴影外观；新增 section 白色 5px 内框、浅灰底、16px 圆角 / 内距、16px / 500 标题。
- 增加 description、headerAction、footer、受控 / 非受控折叠及响应式 CardGrid。折叠后内容保持挂载，字段值不丢失。
- Input 模块导出 Textarea，支持标签、说明、错误、原生属性和 ref。
- Card 页面提供九类组合：单输入、输入组、选项、长文本、混合表单、指标、账号多选、折叠设置、内容预览。
- Create Post Dialog 验证账号选择、正文填写、嵌套设置与实时预览的组合；不包含 AI 生成、真实账号连接或发布服务。
- 保留原 Default / Elevated 示例；增加禁用、只读、错误与说明状态。
- 同步 README / CHANGELOG、Overview、Copy for AI、Card / Input NEW 日期、Input 用法、AI_HANDOFF 与 SECTION_CARDS 规范。

## 主要文件

src/components/Card.tsx、Input.tsx、src/styles/components.css；components/Card/Card.demo.tsx、Card.demo.css、Card.html 与生成文件；scripts/build-component-demos.mjs、tsconfig.json、tests/card.test.mjs；相关文档和预览入口。

## 验证与处理

- tokens:check、typecheck、86 项测试全部通过，Card 定向 Vite 构建、静态站点构建成功。
- 浏览器逐一切换九类组合、下拉选择、折叠再展开保留输入；账号全选跳过禁用项，正文同步预览。
- 1280px 与 390px 检查无横向溢出，窄屏弹窗自动单列。
- 修复共享文档布局覆盖 Card 圆角 / 内距、容器查询优先级导致窄屏三列、Dialog 输入样式覆盖 Textarea 最小高度的问题。

## Git / 确认边界

分支 ai/desktop/design-system-current；HEAD 与 origin 跟踪均为 25c8f9f。未执行 commit / push / PR / merge，保留所有此前混合工作区修改。

本轮 Card 待用户视觉验收。Button、Select、Sidebar 层级、Toggle 正式菜单、NEW 日期及 Tree Nav / Webapp 仍按当前交接逐项确认。Notification 已发布，本轮没有重新发布。

## 下一步

用户从 Card 的 Variant playground 和 Open dialog 入口验收，按反馈增量修改；收到明确发布指令后精确提取已确认范围。
