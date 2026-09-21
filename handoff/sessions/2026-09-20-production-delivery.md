# 2026-09-20 全组件 Production Copy for AI

## 目标与完成

用户要求检查前轮实现，并将规则升级为所有 Current 组件统一的生产交付机制。检查发现旧实现仍是 Notification 专用分支，旧固定说明链接和 Demo 配置机制不满足本轮要求。已增量改造已有构建、页面、复制和验收，未创建平行 Design System。

- 建立 28 个入口的显式 manifest；按生产依赖图验证缺失、冗余与禁止路径。必要资产逐项声明，不按目录打包，不固定文件数量。
- 使用现有生产源码，提取组件 CSS、动画及媒体规则；token 使用最小 fallback 并允许宿主覆盖，字体继承。逐资产类型声明避免多个交付合用的 TypeScript 冲突。
- 统一构建按组件生成不可变 release 和 stable latest.json；版本包含源码、清单、生成器，发布后不需要手改 prompt 链接。
- 全部 Copy 按钮读取当前目录 manifest，核验公开 latest、说明和安装器 hash，复制明确名称的一句话及真实选项。原 Demo 快照保留，最终配置由生产白名单过滤。
- NotificationBell 只有源码、styles.css、index.ts、styles.css.d.ts；不含面板、字体、演示数据/控制器/资产。演示开关 128 种组合不改变输出。
- Notification 原有演示功能保留。修复 QuantityStepper 既有 visually-hidden 辅助样式缺口，补齐 Dropdown 交付中的必要 label 规则。

## 关键文件

- delivery/components.json
- scripts/production-delivery.mjs、build-ai-deliveries.mjs、verify-ai-deliveries.mjs、audit-copy-ai.mjs
- assets/ai-delivery.js、component-config.js、ai-deliveries/
- aisee-design-system-preview.html、components/NotificationBell/NotificationBell.html
- tests/production-delivery.test.mjs、component-config.test.mjs、fixtures/production-runtime.tsx
- src/styles/base.css、package.json / lock、CI artifact 配置
- README、docs/PRODUCTION_DELIVERY.md / NOTIFICATION_COPY_AI.md / COMPONENT_CONFIGURATION.md / GETTING_STARTED.md / COPY_AI_VALIDATION.md / AI_HANDOFF.md / TEAM_DECISIONS.md、Overview、NEW、handoff-context.md

## 验收证据

- npm run check：121 tests，0 failures；tokens、类型检查、包构建通过。
- npm run verify:ai-deliveries：28 份真实解包产物同时在独立 React 目录通过严格类型检查和 Vite 构建；文件范围、checksum、重复安装、冲突保护通过。
- npm run audit:copy-ai：28 入口，192 受控配置，0 failures；审查真实 prompt 白名单。
- 所有实际生成的 latest / ready / installer 经通用 resolver 在测试中验证，另有 latest 切换回归。
- 浏览器独立产物：Bell 初始、递增、同值重绘、再次递增、递减、清零、99+、dot、focus、hover、继承字体共 11 PASS；Tabs 切换、Button 打开 Dialog、Escape 关闭与焦点返回通过。
- 原 Notification Demo：模拟通知、dot、Show icons、Empty 场景切换正常；新 Installation / Usage 可见。
- 静态站点构建通过；最终收尾再次执行站点构建及 diff whitespace 检查。
- 报告：artifacts/production-delivery-audit/report.json、browser-results.json、artifacts/copy-ai-audit/report.html。验收 fixture 位于 artifacts/production-delivery-runtime/index.html，均不在生产 manifest 内。

## 设计与使用边界

- 样式/布局/动画等真实变量仍可复制；业务状态、演示计数、mock、showcase 组合不复制。slots 不是 props。
- 包含必要 SVG/image，排除演示资产与字体；不是一刀切禁止全部 assets。
- latest 是稳定下载入口，不会自动修改已经接入业务项目的源码；旧 release 保留历史含义。
- 用户仍只复制短文本，详细接入步骤由编码 AI 从公开说明读取。接收方需要兼容 React/TSX/CSS、Node 和可联网执行命令的编码 AI。

## Git / 未发布

工作区 ai/desktop/design-system-current，HEAD d6d166b；跟踪 origin dbaabd1，ahead 1 / behind 2。原有大量 Tooltip、第三方接入、资源和构建修改全部保留。未 commit / push / merge；既有公开版本仍是 dbaabd12c883ca21c930d51000db95d4b1089bf5 的旧 Notification 完整交付。本轮不能声称新链接已经在线。

若用户后续授权发布，需先核对差异，隔离本轮交付及其必要的 Current 源码依赖，完整发布全部 manifest / release / latest / 页面，再验证公开版本与复制。不要直接 push 当前分叉工作区或覆盖其他协作修改。

## 未完成与下一步

发布后外部开发重新复制验证；跨 AI 平台视觉产出和所有组件全部状态尚未逐项浏览器验收。reduced-motion 静态媒体规则和源码测试覆盖，但未切换操作系统偏好进行额外浏览器演练。其他既有待验收事项见当前交接。
