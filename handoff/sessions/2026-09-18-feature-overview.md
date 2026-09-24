# FeatureOverview 第一批 · 2026-09-18

## 目标与授权

用户先要求评估 Figma 51:213896 新版 PlanCard 的拆分，随后明确“好，先做第一批”。本轮实现通用连体容器、功能清单、紧凑信息条和四区组合；未执行第二批平台图标组件化，未替换旧价格套餐卡。

## 完成

- 扩展 Card divided / CardGrid divided：单层白色外框，内部连续分隔线，1–4 列、容器响应式。
- 新增 FeatureList：静态功能说明、强调文字、补充说明、尾部图标，保留 ul / li 语义。
- 扩展 StatCard 与 StatCardGroup compact：数值 / 图标 + 标签，等分列，小宽度改纵向。
- 新增 FeatureOverview：以 sections 插槽组合上述组件，复用 Badge / Tooltip。
- Figma 原始图标资产保存于 assets/feature-overview，来源记录到 manifest。Gemini 按原稿渐变图与 mask 组合，未手绘。
- Current 入口、Overview、Copy for AI、NEW、README、使用说明已同步；Card 和 Stat Card 页面增加独立使用示例。
- 静态站点复制共享 tokens.css，使此前 Select 的浅红 Delete hover 在发布产物中也能读取到 token。

## 主要文件

- src/components/Card.tsx、FeatureList.tsx、FeatureOverview.tsx、StatCard.tsx、src/index.ts
- src/styles/feature-overview.css、src/styles/components.css
- components/FeatureOverview/、components/Card/、components/StatCardCurrent/
- assets/feature-overview/、assets/update-badges.js
- aisee-design-system-preview.html、preview/dapp-v6-components.html
- docs/FEATURE_OVERVIEW.md、docs/SECTION_CARDS.md、docs/AI_HANDOFF.md
- scripts/build-component-demos.mjs、scripts/build-static-site.mjs、tsconfig.json
- tests/feature-overview.test.mjs、tests/preview.test.mjs

## 验证与处理

- 92 项测试通过，typecheck、类型声明与库构建、定向 Demo 构建、静态站点构建通过，git diff --check 通过。
- 1280px 桌面总览为一张白卡四区；列数切换至 4 列有效，内部 Card 不重复包边。
- 390px 改为单列，分隔线方向同步；页面 scrollWidth 为 390px，无横向溢出。
- Tooltip 原 320px 宽导致窄屏溢出，Demo 限制为 200px / 视口减去边距，点击聚焦可显示且不裁切。
- 通用文档布局原先覆盖 divided Card gap / padding 以及 compact 统计组 padding，已通过限定作用域修复并检查实际计算值。
- 静态产物清理仅清理生成 site 目录中的既有悬空链接，未删除源资产。

## Git / 待确认 / 下一步

- 分支 ai/desktop/design-system-current；HEAD 25c8f9f。
- 工作区保留原有大量未确认修改，本轮全部未提交 / 未推送；未操作 main。
- 第一批功能已完成，整体视觉待用户确认。平台图标条仍是 Demo 局部组合，后续再决定独立 API。
- 下轮从 Feature Overview 入口验收；旧 PlanCard、其他未确认组件保持原状。
