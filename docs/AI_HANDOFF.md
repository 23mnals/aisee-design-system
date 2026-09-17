# 把 AISEE HTML 交给其他 AI 的使用说明

## 结论

其他 AI **通常能读取上传 HTML 中直接存在的文字、CSS、HTML 结构和内联 JavaScript**，但这不等于它一定能读取整个设计系统，也不等于它会自动按照 demo 精确实现。

能力取决于接收平台：

- 能解析附件但不执行页面的平台，可以读取源码，却看不到交互后的状态。
- 不支持相对文件或沙箱运行的平台，无法取得 HTML 外部的字体、图片、CSS、JS、React 源码及其他组件页。
- 本地 `file://`、`localhost`、私有仓库链接和登录后的 Figma 页面，对另一平台通常不可访问。
- 只给截图或单个 demo，会让模型把示例内容误当组件规则，或漏掉 hover、focus、disabled、响应式与无障碍状态。

因此，“给一个 HTML”只能作为视觉和源码参考，**不能保证实现一致**。最可靠的交付是公开 HTTPS 预览或完整仓库/ZIP，加上权威规范和明确提示词。

## 单组件任务（推荐）

如果只需要 Button、Input、Tabs、Dialog 等一个 Current 组件，不必上传整套 Demo：

1. 在主门户打开对应的 Current 组件页。
2. 点击右上角双星图标的 `Copy for AI`。
3. 把复制的组件 Prompt、目标页面和真实业务内容一起交给 AI。
4. 要求 AI 对照 Current Demo 检查适用状态与动画。

每个组件 Prompt 都包含该组件的用途、接入方式、公开 API、交互、视觉边界、无障碍和 AISEE 通用规则。它适合交给 AI 编码工具，但不是可安装的组件包。人类开发者仍需要 `@aisee/design-system` 工作区包或对应源码；没有 Design System 时，应同时打开组件页的 Open HTML 作为可运行参考。Demo 中的示例文案、数据、图标和插图不是规定资产，接收方应按真实功能替换。Overview 和 Legacy 页面不提供该按钮，避免把汇总或历史内容误当成 Current 实现。

## 推荐交付包

至少同时提供：

1. `aisee-design-system-preview.html`，最好是可访问的部署 URL。
2. `docs/TEAM_DECISIONS.md`。
3. `docs/aisee-dapp-design.v6.md`。
4. `src/tokens/color-architecture.json`、`src/tokens/tokens.json`、`src/styles/components.css` 与 `src/components/`。
5. 目标页面的内容、信息架构、状态和响应式要求。

主 HTML 内已嵌入 `<script type="application/json" id="aisee-ai-contract">`，让支持源码解析的平台快速找到来源优先级、基础令牌和实现边界。但 JSON 只是索引，不能替代完整文件。

## 给其他 AI 的提示词模板

```text
请依据我提供的 AISEE Design System 实现目标页面。

规则优先级：
1. docs/TEAM_DECISIONS.md
2. docs/aisee-dapp-design.v6.md
3. src/components、src/styles/components.css 和标记为 Current 的组件页
4. 与目标功能相关、带日期黑色标题框的 Figma 设计区块
5. Legacy 页面仅用于没有 Current 对应项时参考

必须：
- 保留目标页面的内容和信息架构；
- 复用现有 Current 组件与 tokens，不重新猜测颜色、字号、圆角和间距；
- 颜色只使用 `--aisee-color-semantic-*`；不得在页面写 HEX，也不得直接使用 `--aisee-color-primitive-*`；
- dApp 只使用 Karla；
- 主内容区第一块必须是 Page Banner（Figma `66:122927` 基准：76px 高、16px 圆角、4px 白色描边环、44×44 图标容器、24×24 leaf icon、Karla 20/500 标题、14/400 描述）；右侧按功能放按钮、Toggle、统计信息或留空；
- Sidebar 遵循当前 Figma 结构：展开宽度 224px；支持收起为 58px，收起态只显示 icon。收起/展开必须使用 `assets/stemui/line_chevron-up.svg`，并提供 `aria-expanded`、`aria-controls`、键盘焦点与同浏览器状态记忆；不得恢复旧版横向 Tab Toggle；
- 已有页面的 Banner 图标优先复用 `@stemui/icons` / 已确认插图；新页面可暂用明确标记的占位符，但发布前必须替换为对应资源；不得使用模糊截图、emoji 或临时绘制 SVG；
- 账户、个人资料和侧边栏身份必须复用导出的 `Avatar` 组件：网站注册用户使用 22 个已确认方形头像，并用稳定用户 seed 固定匹配结果；抓取不到社交媒体头像时，才使用 24 个带灰色描边的圆形兜底头像，并用稳定社交账号 seed 固定匹配结果；不得使用通用占位头像；
- 社交账号来源标识必须复用 `SocialAccountAvatar`：Plan 生成的 Post 使用 `postOrigin="plan"` 虚线描边，用户手动打开弹窗创建的 Post 使用 `postOrigin="manual"` 实线描边，每个标识只显示一层描边；
- Avatar 页面中的 Generated extensions 仅为待确认预览，不进入自动分配资源池；
- 实现 default、hover、focus、disabled、error、loading、empty 等适用状态；
- 不把 Legacy 样式覆盖到 Current 组件；
- 完成后列出复用的组件、使用的 tokens、与规范的任何偏差；
- 对照 Current HTML demo 做最终视觉检查。

如果你无法读取相对资源、链接页面或附件中的某个文件，请明确列出缺失文件，不要自行用默认样式补齐。
```

## 验收问题

让接收方在编码前回答以下问题，可以快速判断它是否真正读到了系统：

- 当前来源优先级是什么？
- Analysis、Post Agent、Engage 的主色分别是什么？
- dApp 是否允许 Gotu 或 Digital Numbers？（答案：Gotu 不用于 dApp；Digital Numbers 仅允许用于 Score Gauge 数字）
- Input / Dropdown 的默认边框、focus 双环和高度是什么？
- 哪些页面是 Current，哪些只能作为 Legacy 参考？
- 它准备复用哪些导出的 React 组件？

回答不完整时，应先补齐文件或开放访问权限，再开始实现。
