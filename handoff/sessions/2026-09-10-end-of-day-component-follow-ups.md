# 2026-09-10 组件文档验收反馈收尾

## 本轮目标

- 根据用户的连续本地验收反馈继续调整 Select / Dropdown、Sidebar Navigation、页面标题导航和页面内 `NEW` 标记。
- 用户最终决定今天暂停，因此本记录只固化准确的停止点，不继续修改组件实现。

## 本轮完成

- 核对当前开发分支、工作区和最近提交，确认仍在 `ai/desktop/design-system-current`，HEAD 为 `3a97eff`。
- 确认 `components/Tabs/TabsMotionPreview.html` 是独立动效研究页，未注册到正式 Portal；组件标题上一项 / 下一项导航由 `aisee-design-system-preview.html` 注入正式组件 iframe。
- 定位 Dropdown 字号缺口：详情页 trigger 已为 14px，但静态 `.option` / `.suggestion` 和生产 `.aisee-dropdown__option` 尚未全部显式统一。
- 定位 Sidebar 箭头来源：静态示例使用 `.toggle-marker`，React 组件使用 `.aisee-sidebar__chevron`；两者均应移除视觉箭头但保留父级展开交互。
- 结束本轮额外启动的 4174 Vite 预览进程；原有 4173 预览未由本轮停止。

## 本轮确认的设计决策

- 所有 Dropdown 菜单选项统一使用 Karla 14px / 20px。
- AISEE Sidebar 父级条目不显示行尾下拉箭头；整行仍可点击展开，收起态点击功能图标仍打开子功能浮层。
- 页面自身标为更新或新增时，不仅侧边栏条目显示 `NEW`，页面内对应新增或更新的内容标题旁也显示同款 `NEW`。
- `TabsMotionPreview.html` 继续保持隔离研究页；正式组件导航应从 Portal 的 hash 地址查看。

## Git / 工作区

- 分支：`ai/desktop/design-system-current`
- HEAD：`3a97eff docs: record Figma sync and checkpoint audit`
- 工作区包含此前组件批次的大量 staged 外修改与新文件，尚未 commit、push 或发布。
- 本轮最后一次组件补丁因上下文不匹配而整体未应用，没有声称完成 Dropdown 字号或 Sidebar 箭头移除。

## 未完成

1. 给通用 `.aisee-dropdown__option`、详情页 `.option` / `.suggestion` 明确设置 14px / 20px，并覆盖必要的空状态或 collapsed flyout 文本。
2. 从 `src/components/SidebarNavigation.tsx`、`src/styles/components.css` 和 `components/SidebarNavigation/SidebarNavigation.html` 移除父级行尾展开箭头，保留 ARIA 与全部交互。
3. 设计并实现内容级 `NEW` 标记，先覆盖 Tabs 本轮新增的 segmented icon + text、text only、icon only、platform logo + text 等标题，再核对本轮其他更新页。
4. 用正确 Portal URL 验证标题上一项 / 下一项箭头、tooltip、滚动跟随与描述避让。
5. 运行测试、构建、`git diff --check` 和浏览器视觉验收。
6. Figma `10374:435175` 的 Card 变体仍待后续单独实现；正式 Tabs 动效同步仍等待用户确认。

## 下一轮建议

- 按“Dropdown 字号 → Sidebar 箭头 → 内容级 NEW → Portal 箭头验证 → 全量检查”的顺序完成，预计 1–1.5 小时；Card 单独预留约 45–60 分钟。
- 相关上一份完整记录：[`2026-09-10-component-docs-navigation-and-tag-input.md`](2026-09-10-component-docs-navigation-and-tag-input.md)。
