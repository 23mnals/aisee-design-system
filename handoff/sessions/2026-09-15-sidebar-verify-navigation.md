# 2026-09-15 Sidebar Verify 导航更新

## 本轮目标

- 按 Figma 节点 `98:182879` 更新 Sidebar Navigation。
- 保留一级 `Verify`，将原 Verify 页面入口更名为 `Compare`。
- 将 `Google Search Data`、`Bing Webmaster Data` 移入 Verify 二级导航。
- 同步组件 Demo、Web App UI Kit、页面路由、README、设计规范、Copy for AI 与测试。

## 本轮完成

- 从 Figma 核对最新结构：`Verify → Compare / Google Search Data / Bing Webmaster Data`。
- 下载并保存 Figma 当前 Compare 线性图标到 `assets/sidebar-v6/compare.svg`。
- `components/SidebarNavigation/SidebarNavigation.html` 已支持带图标的子项，展开态与收起态浮层均按新顺序显示三项。
- 删除独立 INTEGRATIONS 导航组；Google 与 Bing 品牌图标随子项保留。
- `ui_kits/webapp/WebAppSidebar.demo.tsx` 与 `ui_kits/webapp/Components.jsx` 已同步相同数据结构。
- `ui_kits/webapp/index.html` 将叶子页面 Verify 更名为 Compare，并新增 Google Search Data、Bing Webmaster Data 可访问页面；当前叶子目的地为 18 个。
- Sidebar Navigation 的 Copy for AI、根 README、UI Kit README 与 v6 设计规范已写明新结构。
- UI Kit Sidebar 的 Last Updated 更新为 Sep 15, 2026。

## 验收

- Figma `98:182879` 读取结果确认一级 Verify 下依次为 Compare、google Search Data、Bing Webmaster Data。
- `npm run check` 通过：token 检查、TypeScript、71/71 测试与完整构建全部成功。
- 浏览器验证 standalone Sidebar 展开态、收起态 Verify 浮层及三项图标顺序正确。
- 浏览器验证 UI Kit `#Compare` 与 `#Google%20Search%20Data` 页面可正常打开。
- 浏览器控制台无 warning 或 error。
- `git diff --check` 通过。

## Git

- 分支：`ai/desktop/design-system-current`
- HEAD：`ce091cc docs: record component prompt sync`
- 本轮改动尚未 commit、push 或创建 PR；工作区同时包含本会话前序 Avatar、Dropdown、Credit Bar 等未提交修改。

## 下一步

- 等待用户在本地 Demo 中确认新 Sidebar 结构。
- 用户明确要求提交或同步后，再检查完整 diff 与测试并按指令 commit / push。
