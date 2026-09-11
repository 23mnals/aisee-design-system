# 2026-09-11 完成组件文档昨日遗留项

## 本轮目标

- 继续 2026-09-10 停止点，完成 Dropdown 字号、Sidebar 父级行尾箭头移除、页面内容级 `NEW` 与 Portal 标题导航验收。

## 本轮完成

- `src/styles/components.css`：Dropdown 通用选项明确为 Karla 14px / 20px；Sidebar collapsed flyout 子项同步为 14px / 20px。
- `components/Select/Select.html`：静态 `.option` 与 `.suggestion` 明确为 14px / 20px。
- `src/components/SidebarNavigation.tsx`、`src/styles/components.css`、`components/SidebarNavigation/SidebarNavigation.html`：移除父级行尾视觉 chevron / toggle marker，保留整行展开、ARIA、收起态 icon flyout 与 reduced-motion。
- `components/component-doc-layout.css`：新增可复用内容级 `NEW` 标题样式，颜色与 Campaigns 保持一致。
- Input、Select / Dropdown、Toggle、Tag Input、Tabs、Sidebar Navigation、Badge 的新增或更新内容标题显式显示 `NEW`。
- 规范与长期决策同步记录 Dropdown 14px / 20px、Sidebar 无尾部 chevron、内容级显式 `NEW` 规则。

## 验收

- `npm test`：49/49 通过。
- `npm run build`：tokens、TypeScript、Vite ESM/CJS 与资源复制均通过。
- `git diff --check`：通过。
- 浏览器实际验证：
  - Tabs 正确 Portal 地址显示 32×32 上一项 / 下一项控件，位于 640px 标题区右侧并随内容滚动。
  - Sidebar 展开态父级行无尾部箭头；点击收起后保持 56px icon rail；点击 Analysis icon 可弹出 14px 子功能菜单。
  - Select / Dropdown 展开菜单正常，选项与 trigger 字号层级一致。

## Git / 工作区

- 分支：`ai/desktop/design-system-current`。
- HEAD / 远端：`3a97eff docs: record Figma sync and checkpoint audit`。
- 工作区仍包含本组件批次的大量未提交、未推送修改；本轮未执行 commit、push、merge 或 PR。

## 未完成

1. Tabs 动效研究页仍未注册到正式组件，等待用户确认是否同步。
2. Figma `10374:435175` 的 Card 业务变体尚未单独实现；当前 Card Default / Elevated 是通用占位。
3. `Plugin Entry Options` 的旧 Engage iframe 路径问题仍待后续处理。

## 下一轮建议

- 先让用户从正确 Portal 地址验收本轮结果；之后按用户决定继续 Tabs 正式动效或 Card 业务变体。
