# 2026-09-24 Toggle Copy for AI 范围生成规则试点

## 目标与范围

用户根据跨项目反馈要求修改 Copy for AI 生成规则，先在 Toggle 试点：只更新目标组件，不调整页面；范围外文件先列原因、最小改动方案并等待确认。当前分支 `ai/desktop/design-system-current`，HEAD/origin `9d022e3`。开始时第一阶段资料与上一轮审查交接未提交；本轮保留，不 commit/push。

## 实现

- `assets/ai-delivery.js`：只对 Toggle 名称和页面匹配的交付追加严格规则。可写范围为已定位的实现和专属局部样式，先列精确路径；整个 components/_components 目录不代表可写。无目标或目标不明确先确认。禁止擅改页面、业务、hook 文件、API、请求、配置、依赖等。
- 保留 checked/defaultChecked、disabled、回调和状态所有权；动效允许组件内部 effects/refs，不允许 pending/optimistic checked 或业务 hook 改造。范围外先列文件、原因、最小 diff、影响，等明确确认；网络/缓存/测试故障不扩大范围。
- 严格范围优先于参考资料的通用安装/依赖/验证步骤；已有组件的参考解包留在宿主外临时目录。原 staged/unstaged/untracked 改动受保护，不整文件回滚。
- 选项继续白名单过滤，只附加参考值；不会覆盖已有设置，也不解除范围。Toggle 源码/交付版本、安装器和其他组件的生成文本不变。

## 文件

功能与验收：`assets/ai-delivery.js`、`tests/component-config.test.mjs`。

使用说明：新增 `docs/TOGGLE_COPY_AI.md`（实际生成的完整文本与复测步骤）；更新 `docs/PRODUCTION_DELIVERY.md`、`components/Toggle/Toggle.html`、`components/README.md`。

更新记录：`README.md` 新增一批三条用户可见更新；原第三批 Brand 导航记录移入 `CHANGELOG.md`，保留最近三批。同步 `handoff-context.md` 与本 session。未续期原 NEW 标识。

## 验证

- 69 项配置/门户测试通过，新增测试覆盖 Toggle 所有样式选择下边界不变、参考不携带 checked/disabled、完整文档等于真实生成文本，以及实际 clipboard handler 路径。
- Copy for AI 全组件审计：30 个组件、205 个控制组合、0 失败。
- 用旧生成器逐字比较其他 29 个组件、每个三种 snapshot，输出一致。
- 静态站点构建、git diff --check 通过；开始时文件 hash 对比确认本轮未修改 src、生产交付目录或第一阶段 ai-design 资料。
- 浏览器打开本地 Toggle 页面，范围说明可见，按钮显示复制成功。工具虚拟剪贴板为空，未把它当成系统剪贴板全文验证；全文由实际处理函数的自动测试核对。
- 真实宿主项目完全未改动；未声称外部 AI 的行为验收已通过。

## 使用入口与待办

本地 `http://127.0.0.1:4173/aisee-design-system-preview.html#page=components%2FToggle%2FToggle.html` → Copy for AI；也可直接复制 `docs/TOGGLE_COPY_AI.md` 完整代码块。本轮未发布，旧线上门户仍生成旧文本；参考 URL 仍使用已发布源码，完整新提示词显式收紧其范围。

下一步由用户在另一个项目验证：只在允许的组件文件新增动效，业务状态不变；需要改调用方时必须在修改前展示最小方案等待确认。复测后再考虑推广其他组件。此前测试项目收敛方案仍未执行。
