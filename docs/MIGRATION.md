# Legacy → v1 Migration

旧 ZIP 是设计探索、产品页面、手工 HTML、编译 bundle 和组件源码的混合归档。新仓库把可维护系统收敛为令牌、无业务依赖组件、文档和白名单资产。

| 旧规则 / 实现 | v6 / v1 | 迁移方式 |
|---|---|---|
| Gotu 用于 dApp 标题和 PlanCard 价格 | dApp 100% Karla | 删除 Gotu import，改 `font-family: var(--aisee-font-family-ui)` |
| Sidebar 211px | 224px | 使用 `--aisee-size-sidebar` |
| 全局 lime / yellow 常量 | 模块主题变量 | 容器设置 `data-aisee-theme`，组件使用 `--aisee-module-primary` |
| Engage 是 Post Agent 二级模块 | Engage 是平级第三 tab | 使用 `ModuleToggle` 和 `engage` theme |
| 静态边框存在 6%、12% 等多个值 | 全局静态边框 5% | 使用 `--aisee-color-border`；modal footer 6% 是明确例外 |
| Toggle 规格不统一 | 24×16，thumb 10×10 | 使用 `Toggle` |
| Modal 内边距分散 | 四边固定 24px | 使用 `Dialog`，footer 规则已内置 |
| JetBrains Mono / Digital Numbers 用于局部数据 | dApp 只使用 Karla | 数据、code/kbd 与 Score Gauge 全部改 Karla；Homepage 仍允许 Gotu |
| 旧包大量 standalone / bundled HTML | 不进入发布包 | 只保留必要品牌资产和 v6 文档 |

## CSS 变量兼容映射

| Legacy | v1 |
|---|---|
| `--analysis-primary` | `--aisee-color-analysis-primary` |
| `--postagent-primary` | `--aisee-color-post-agent-primary` |
| `--module-primary` | `--aisee-module-primary` |
| `--bg-page` | `--aisee-color-page` |
| `--border` | `--aisee-color-border` |
| `--sidebar-w` | `--aisee-size-sidebar` |
| `--ease` | `--aisee-motion-ease` |

## 不迁移内容

- 旧版 v3–v5 规范正文：通过 Git 历史保存，不与现行规范并列
- 单页面业务原型、录屏演示、mock data 与打包 HTML
- 编译后的 `_ds_bundle.js` 和 `_ds_manifest.json`
- 名称编码损坏、重复或来源不明的上传文件

业务页面仍可单独参考旧归档，但不得作为新设计系统 API。
