# 精简页面描述 · 2026-09-21

用户询问每条简介中的 Components 与部分 Figma-aligned 文案用途，并提出去掉分类前缀。Components 是门户附加的分类信息，不是运行字段；Figma-aligned 是来源说明，不是依赖要求。

门户描述直接使用 subtitle，分类数据和侧栏结构仍保留。Notification / Tooltip 门户及内页简介去掉 Figma-aligned 等措辞，来源文档/节点/行为说明保留。README 最近三批与 CHANGELOG 同步。

本轮未提交或推送，基于开发分支 674efe6，保留此前本地调整与无关资源。验收 git diff --check 通过，核对描述赋值及简介文案，未修改生产组件或交付内容。
