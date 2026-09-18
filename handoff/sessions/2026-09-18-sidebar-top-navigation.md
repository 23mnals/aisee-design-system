# Sidebar 顶部导航与轻阴影 · 2026-09-18

## 目标与完成

- 根据用户截图新增 Top navigation 布局：全宽顶栏左侧放置收起按钮，收起后侧栏完全隐藏，正文占满宽度。
- Reveal on hover 临时浮出完整导航，正文不移动；按钮点击后恢复常驻展开。离开、外点、选择或 Escape 关闭临时面板。
- Reveal on click 不响应悬停，点击或键盘激活恢复展开。
- 保留原四布局及内外按钮、选中与分组状态；仍使用 AISEE 字体、图标与 token。
- 用户追加反馈要求阴影更轻：从 4px 8px 20px / 12% 改为 2px 4px 12px / 6%。

## 修改范围

共享 SidebarNavigation / SidebarLayout、共享样式、Sidebar Demo 与生成文件、Webapp 关联样式构建、Sidebar 布局文档、Overview、Copy for AI、README、AI_HANDOFF 和当前交接。

## 验证

- 98 项测试通过；类型检查、组件定向构建、包构建及静态站点构建通过。
- 浏览器实测全宽顶栏、收起宽度为 0、hover 浮层不挤正文、触发器到侧栏移动、选择关闭、移出关闭、Escape 关闭。
- click 模式鼠标经过不展开，点击恢复后选中保持。
- 最新阴影 computed style 为 rgba(17,17,17,.06) 2px 4px 12px 0px，已查看实际预览。

## Git 与待确认

- 分支 ai/desktop/design-system-current，HEAD 25c8f9f。
- 本轮未 commit / push；工作区原有多批未提交修改均保留。
- 新增布局及轻阴影视觉待用户验收。Webapp 导航层级差异仍未擅自更改。
