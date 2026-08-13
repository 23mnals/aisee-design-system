# Team Decisions

此文件记录团队对基础规范的后续澄清。发生冲突时，顺序为：本文件最新决策 → 当前 dApp spec → 历史文件。

## 2026-08-13 — 字体分域

- **Homepage / 官网**：只使用 Karla + Gotu 两种字体。
- **dApp / UI Kits — Webapp**：只使用 Karla 一种字体；页面标题、弹窗标题、数据、代码提示与 Score Gauge 均不引入第二字体。
- 因此 `aisee-dapp-design.v6.md` 中关于 JetBrains Mono 和 Digital Numbers 的例外说明，被本决策覆盖。
- 历史原型允许保留在仓库中供追溯，但进入现行组件、令牌或 UI Kit 前必须按本决策更新。

## 2026-08-13 — 旧系统更新策略

- 本仓库是旧 Design System 的更新，不是精简重建。
- v6 有同名或同职责规范时，用新版覆盖旧版。
- v6 没有覆盖到的组件、图标、动画、交互、页面和资产继续保留。
- 历史内容不得因“当前发布包未使用”而直接删除；需要废弃时先标记 deprecated，再通过独立 PR 评审。

## 2026-08-13 — Figma 功能页面版本规则

- **5.6 只是当前最新的功能版本页面**，不代表整个 Figma 文件或所有产品功能都统一升级到 5.6。
- 增加新功能或独立的新需求时，新开一个功能版本页面。
- 已有功能追加新需求、状态或交互时，不新开页面；继续在该功能原版本页面维护，并把最新设计增加在页面上方。
- 因此判断实现依据时应先定位对应功能页面，再读取该页最上方的最新内容；不能用 5.6 全局覆盖其他功能页面。
- 原页面中未被最新内容替代的设计继续保留，供上下文与历史追溯。

## 2026-08-13 — Webapp UI Kit 采用 5.5 功能布局

- UI Kits — Webapp 的当前 Shell、信息架构和 Overview 排版以 Figma 5.5 功能页为准。
- 顶部使用官方 aisee 完整 wordmark；禁止代码或 CSS 重画 Logo。
- 旧的顶部 Analysis / Post Agent / Engage 三模块切换不再作为当前 Shell。
- 当前侧栏结构为 Project / Overview，以及 Growth Loop 下的 Analysis、Growth、Engage、Post 分组及其子项。
- 旧 Dashboard、Calendar、Channels、Post Agent、All Posts 仍作为历史内容保留，但不得继续充当 UI Kit 当前预览入口。
