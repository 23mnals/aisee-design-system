# 2026-09-21 · 交付契约与 CSS 依赖闭包

## 用户目标

修正 latest 为执行时最新版本；组件自己声明兼容环境，不统一强制 React/Node 版本；文档不固定组件数。同时明确 CSS 提取必须完整追踪选择器、伪状态、变量默认值、keyframes、media/supports/reduced-motion，禁止只用 class 字符串截取。

## 完成

- 所有登记清单增加 compatibility 与显式 custom-properties 样式来源；依赖与兼容声明不一致会阻止构建。现有各组件声明 React >=18、Node >=18（安装器），核心没有此默认硬要求，允许未来组件独立声明其他范围。
- latest、归档和 ready 说明均从清单输出 compatibility；稳定 URL 明确执行时解析，已安装源码不自动升级。复制时公开校验不等于锁定安装版本。
- README、生产契约、接入/验收指南、AI_HANDOFF、Portal 帮助文案、Notification Requirements 更新；规范改为所有已登记组件，报告 Registered components / Verified deliveries 动态统计；旧固定总数断言改为登记覆盖一致性。
- 新增 scripts/css-delivery.mjs，使用 postcss-selector-parser / postcss-value-parser AST，清单类族只作为选择器所有权入口锚点，不用于字符串截取。保留正向复合/嵌套选择器和伪状态，避免仅在 :not/:has/属性字符串中出现类名而错误纳入，保留父条件包装。
- selector → declaration → var/provider/@property → animation name/keyframes → 新变量迭代到闭包。支持嵌套 var fallback、条件覆盖、变量间接引用动画；保留 media/supports/layer/container/reduced-motion 与原有顺序。
- 仅使用到的 token 默认值作为 var fallback 注入，条件 provider 限定组件作用域且用 :where 避免抬高优先级，生产 JS 写入的 CSS 属性和内联变量参与校验。样式 URL 依赖在闭包形成后处理，包含 keyframes 里的资产。
- CSS @import 用于发现依赖；可达但未在生产清单登记的选择器、变量或动画明确报错。带条件的 @import 需先转换为明确来源的 media/supports/layer 包装，否则构建报错，不静默忽略。
- 闭包检查发现 TagInput 使用不存在的 --aisee-color-post-agent-primary-hover；修正为实际 --aisee-color-post-agent-hover，并更新旧断言。
- 构建指纹包含 CSS/生产生成器代码，生成逻辑更新自动产生新版本。

## 验收

- npm run check：124 项测试全通过，tokens、类型检查、包构建通过。
- CSS 测试覆盖嵌套选择器/伪元素、嵌套条件内直接声明、变量默认值及别名、条件 token provider、@property、间接 keyframes、循环/未解析变量和未登记 CSS 依赖。
- 各组件 compatibility 在生成 latest、归档、说明中一致；测试另验证不同 React/Node 声明及冲突拒绝。
- 独立生产交付：动态报告 Registered components: 28 / Verified deliveries: 28；严格类型检查、构建、文件边界、校验/重复安装/冲突保护通过。
- npm run audit:copy-ai：192 个受控案例通过（本次报告快照，不是规则数量）。
- 浏览器安装产物：Bell 11 项行为 PASS（增加、同值重绘、减少、清零、99+、dot、focus/hover、宿主字体）；Tabs 选择与 flex row 样式确认；Dialog 打开/关闭及截图查看正常。
- npm run site 与 git diff --check 收尾检查。兼容声明不是全版本矩阵实测；没有切换 OS reduced-motion 偏好。

## Git / 下一步

仍在 ai/desktop/design-system-current，HEAD d6d166b，ahead 1 / behind 2（origin dbaabd1）。保留全部既有未提交工作，未 commit/push/merge。新生产版本仍未发布，线上旧 Notification 交付不代表本轮内容。

后续获发布授权后隔离并发布完整机制及必要源码依赖，验证公开 latest 后再让开发重新复制；其余待验收内容见 handoff-context.md。
