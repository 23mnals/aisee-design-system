# 通用 Confirmation Dialog · 2026-09-21

## 目标与设计依据

用户要求将 Figma LLvI9vd66VLNuAltAWJFJw / 72:56945 的自动化关闭确认做成通用组件。读取 Figma 设计上下文及截图，沿用原组件和设计系统的标题 20px / 500 规则；扩展影响卡片结构、语义配色及间距。

## 完成

- ConfirmationDialog 增加可选 notices（id/title/description/icon/tone）、children、自定义文案、confirmVariant 和 confirmDisabled。
- 无 notices 时保留简洁确认；open、操作、关闭时机和错误反馈归宿主控制。原生 modal、取消初始焦点、Escape 和焦点返回保留。
- CSS 支持 512px 弹窗、影响卡片、长内容滚动和窄屏按钮堆叠。
- 组件页面从静态复制实现改为直接 import 生产组件，展示两种实例；完成反馈留在页面 Toast。
- 两张 Figma 原始 SVG 仅用于 Demo，不进入 production manifest。
- 统一 Copy for AI 清单增加交付行为说明及 Demo 排除项，7 个必要文件包含组件、Button、局部样式、关闭 SVG 和类型/入口，无示例数据/字体/业务插图。
- README 最近更新、CHANGELOG、TEAM_DECISIONS、Overview、门户说明、NEW 日期、组件使用文档及交接同步。

## 主要文件

- src/components/ConfirmationDialog.tsx、src/styles/components.css
- components/ConfirmationDialog/ConfirmationDialog.html、ConfirmationDialog.demo.tsx、ConfirmationDialog.demo.css 及生成的浏览器 bundle
- assets/confirmation-dialog/ 下的两个 Demo SVG
- delivery/components.json、assets/ai-deliveries/confirmation-dialog/ 的本地生成版本 f0524f6175a927ef
- scripts/build-component-demos.mjs、tsconfig.json
- tests/confirmation-dialog.test.mjs、tests/preview.test.mjs
- docs/CONFIRMATION_DIALOG.md 及上述站点/交接文档

## 验收

- npm run check 通过（当时 125 项测试），新增两条生产 API 渲染测试后 npm test 共 127 项通过。
- npm run site 通过；npm run audit:copy-ai：28 组件、192 案例、0 失败。
- node scripts/verify-ai-deliveries.mjs：全部 28 份独立源码交付、精确文件范围、哈希、重复安装、冲突拒绝、独立 React 类型检查与构建通过。
- 真实本地浏览器：两种预览；确认后页面 Toast；取消、关闭、Escape；初始聚焦取消、关闭后返回触发按钮；375px 窄屏无横向溢出、按钮堆叠。
- 当前交付仍本地，未宣称外部站点已更新或所有组件所有视觉状态均验证。

## Git 与未完成

原工作区 ai/desktop/design-system-current，HEAD d6d166b，跟踪 c34e5fc，ahead 1 / behind 4，已有大量其他未提交改动。本轮未 commit/push，未操作 main 或独立发布工作区。后续发布需先保护原工作区并按既有安全发布流程整合。

下一步：用户本地验收；收到明确发布请求后发布新版，然后核验公开 latest、安装器及浏览器 Copy。上次全组件生产交付仍公开可用，外部开发验收结果继续保留为待反馈事项。
