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
