# Sidebar 布局变量 · 2026-09-18

## 目标与完成

用户要求保留 AISEE 样式，借鉴 Fluid Functionalism 增加侧栏排版与收起按钮位置变量。

- 扩展现有 SidebarNavigation，新增 SidebarLayout 布局组合。
- variant = sidebar / floating / inset，togglePosition = inside / outside，共六种；默认值兼容通栏白底 + 内部按钮。
- floating 使用 16px 上下左右间距、圆角与浅描边；inset 让主内容区成为白色卡片；外部按钮预留 44px 横向空间。
- 保留受控 / 非受控收起、TreeNav 分组、导航选中、头像及收起子菜单。浮层 ID 加实例前缀。
- 组件页由重复的静态脚本迁移到共享 React 实现，原有导航数据和初始 Summary 保留，正式 Dropdown 控制两个变量。
- 当前页面/Overview/Copy for AI/NEW（9 月 18 日）/README/交付说明同步。
- 未运行用户粘贴参考中的 overwrite 安装，没有覆盖 AISEE 基础组件，没有改 Webapp 产品层级。

## 验证

- 97 项测试通过（新增布局组合及旧 API 兼容检查），typecheck、类型声明、React 库构建与静态站点构建通过。
- 浏览器实测六组合：展开 224px、按钮 32px；所有组合按钮均未遮挡正文。floating 圆角 16px。
- Full Report 选中后收起、从 Engage 浮层选 Replies、切换 inset 再展开，内容标题保持 Replies。
- 390px 下 document.scrollWidth = 390，舞台局部宽 356 / 内容 560；控件换行，预览横向滚动，不撑宽文档。
- 最终浏览器保留 floating + inside、Summary；刷新默认仍是 sidebar + inside。

## 主要文件

- src/components/SidebarNavigation.tsx、src/styles/components.css
- components/SidebarNavigation/SidebarNavigation.demo.tsx / .demo.css / .html / 生成资源
- scripts/build-component-demos.mjs、tsconfig.json、tests/sidebar-layout.test.mjs、tests/preview.test.mjs
- aisee-design-system-preview.html、preview/dapp-v6-components.html、assets/update-badges.js
- docs/SIDEBAR_LAYOUTS.md、docs/AI_HANDOFF.md、README.md、CHANGELOG.md、handoff-context.md

## Git 与未完成

分支 ai/desktop/design-system-current，HEAD 25c8f9f。本轮没有 commit / push / PR，其他混合未提交改动保留。六种布局待用户视觉验收。Webapp Growth / Engage 与组件页层级方向仍未确认；不属于本轮布局修改。

下一步：验收各布局和按钮位置，之后按明确发布指令单独提取范围。
