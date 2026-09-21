# Thinking Indicator · 2026-09-21

## 用户目标

根据 AISEE 设计规范加入思考 loading，参考 Fluid Functionalism 的 ThinkingIndicator。用户提供 registry URL、文档及接入说明。要求作为设计系统通用组件沿用统一生产交付规则。

## 参考与实现

读取 https://www.fluidfunctionalism.com/r/thinking-indicator.json 和 docs/thinking-indicator。保留四段 SVG 圆形/无限形态六秒循环、四秒文字切换及扫光；几何与时间参考原始组件。原例依赖 Framer Motion、字体/尺寸上下文；本项目用 React + 原生 SVG SMIL 和 CSS 实现，无新增依赖。

AISEE 预览使用 Karla、次级文字语义色，默认 14px/22px、紧凑 12px/18px，字重 500。生产继承宿主字体。默认词组 Thinking/Planning/Refining；labels 可本地化，aria-label 是稳定读屏状态。装饰性轮换不声明模型内部思维或实际任务步骤。

## 修改范围

- 新增 src/components/ThinkingIndicator.tsx、src/styles/thinking-indicator.css；导出到 src/index.ts 并加入整库样式入口。
- 新增 components/ThinkingIndicator 下 React Demo、HTML、Demo CSS 和生成 bundle，使用现有 Toggle/Dropdown。
- 登记门户导航、组件 guidance、Overview、更新日期；Content & Status 分类。
- delivery/components.json 增加 production manifest；assets/component-config.js 注册实时选择读取；audit-copy-ai 增加四个 size/showIcon 组合。
- 生产交付为 4 文件，无 Demo、fonts、assets 或其它动效依赖，版本 99ee5a4fe9847cba。
- 构建入口、TS 检查范围、新的 SSR/API/交付边界测试、README/CHANGELOG、TEAM_DECISIONS 和 docs/THINKING_INDICATOR.md 同步。
- 修正旧门户测试固定组件数量，改为实际导航和 guidance 数量一致性校验。

## 验收

- npm run check：130 项测试、类型检查、整库构建通过。
- npm run audit:copy-ai：29 个组件、196 配置案例、0 失败。
- node scripts/verify-ai-deliveries.mjs：29 份隔离交付类型检查、构建、精确文件范围及安装安全检查通过。
- npm run site 通过，git diff --check 通过。
- 实际本地浏览器：图标开关、compact 12px、实时配置标记、Karla 字体、6s SVG 动画和实际轮换文字均确认。
- artifacts/thinking-runtime-source 和 thinking-runtime 是测试用临时产物，不交付。通过模拟系统媒体信号验证：减少动态效果后 animate 元素为 0、CSS animation 为 none、显示第一文案、计时器清空；普通父级 rerender 保持计时器 ID；卸载后无计时器和媒体监听。没有修改用户系统偏好。
- 参考 registry 首次普通网络失败，使用授权网络读取后成功；未运行 shadcn --overwrite，未覆盖任何已有基础组件。

## Git / 下一步

仍在 ai/desktop/design-system-current，HEAD d6d166b，origin c34e5fc，ahead 1 / behind 4，已有大量未提交文件。未 commit/push、未操作 main。新组件和上一轮 Confirmation Dialog 都仅本地；用户验收后明确要求发布时再走安全整合流程。公开 latest 不会在本地修改时更新，Copy 公开版本门禁继续保留。
