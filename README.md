# aisee Design System

aisee 官网与 Web App 的共享设计系统。本仓库由旧版 Design System **增量升级**而来：旧内容完整保留。Figma **5.7 是当前最新的功能版本页面，不是整个 Figma 文件的全局版本**；本次新增托管自动发布（Automation）页面，归入 WORKFLOWS。最新实施规则以 [`docs/aisee-dapp-design.v6.md`](docs/aisee-dapp-design.v6.md) 为基线，后续团队决策以 [`docs/TEAM_DECISIONS.md`](docs/TEAM_DECISIONS.md) 为最高优先级。两条版本线的关系及 Figma 页面维护规则见 [`docs/FIGMA_SOURCES.md`](docs/FIGMA_SOURCES.md)。

## 四个入口

| Part | 内容 | 入口 |
|---|---|---|
| **README** | 使用方法、版本、协作与资源状态 | 本文件、[`CONTRIBUTING.md`](CONTRIBUTING.md)、[`CHANGELOG.md`](CHANGELOG.md) |
| **Brand** | 官网设计语言、颜色、Karla + Gotu 字体、Logo、插画与资产 | [`brand/`](brand/) |
| **Components** | 旧系统组件、动画图标、Engage 业务组件与 v6 React 基础组件 | [`components/`](components/) |
| **UI Kits — Webapp** | 仅 Karla 的 dApp foundations、layouts、patterns、screens 与交互 UI Kit | [`ui_kits/webapp/`](ui_kits/webapp/) |

原有历史页面与资源均保留，包括 Brand previews、animated icons、Engage、Analysis、Post Agent、Billing、Pricing、My Account、教程、screenshots 和 uploads。为缩短仓库根目录，旧版 HTML / 文档已集中到 [`legacy/`](legacy/)；没有重复项的旧资源没有删除。

## 团队预览页面

### 在线预览（推荐）

GitHub Pages 发布后，可直接访问仓库的 Pages URL。在线页面由服务器提供资源，团队成员或 AI 读取时不受本地 `file://` 限制。

### 下载仓库后的正确打开方式

仓库里的 `index.html` 是 Vite 开发入口，不能用文件管理器双击打开；旧页面/资源也不建议直接双击。直接用 `file://` 打开时，浏览器会阻止 `/docs/main.tsx`、模块脚本或相对资源加载，所以可能出现空白页、资源失效或“文件已被移动/删除”提示。这不是仓库内容自动丢失。

```bash
npm install
npm run preview:local
```

然后打开 `http://127.0.0.1:4173/`。该命令使用 Node 内置静态服务器，不会修改 StemUI 或产品开发库。若要开发源码/热更新仍使用 `npm run dev`。

页面包含 README、Brand、Components、UI Kits — Webapp 四个部分，并提供：

- v6 Foundations 与 Components 当前规范页
- 所有保留的旧版 HTML 预览，并以 `Legacy` 标识（页面文件位于 `legacy/pages/`）
- 目录搜索、内嵌预览、独立打开和页面链接复制
- README 全页 English / 中文切换
- 每个 Current 组件详情页的 `Copy for AI`，用于复制明确的生产组件接入指令与最新交付入口
- 桌面端与移动端响应式浏览

## 首次接入：开发者与第三方必读

**当前所有已登记的 Current 组件统一使用生产源码交付。** Copy for AI 复制明确组件名称、稳定最新版本入口及真实选项；编码 AI 自动取得清单内的必要源码、样式、资产与类型。Demo、mock 数据、演示控制、字体及全局 Design System 环境不进入交付。NotificationBell 保留图标与数字动画，真实数量和点击行为由产品传入。详见 [生产交付契约](docs/PRODUCTION_DELIVERY.md)。

完整步骤见 [第三方接入指南](docs/GETTING_STARTED.md)：获取与授权、环境准备、已安装 / 未安装 / 源码 / 非 React 四类接入、完整 Tooltip 用例、字体和资源、SSR、常见错误、版本更新及交付验收。当前仓库标记 private / UNLICENSED，不提供已验证的公共 npm 安装入口。

提供方在本仓库运行 `npm ci`、`npm run pack:local`；接收方把生成的包放入产品 `vendor/`，执行 `npm install ./vendor/aisee-design-system-1.0.0.tgz`（文件名随实际版本调整），再在应用入口导入 `@aisee/design-system/styles.css`。这是整库接入的备选方式，单组件 Copy for AI 不需要这一步。

## 非开发人员如何使用组件

不需要把整套 Design System Demo 交给 AI，也不需要自己从 HTML 中寻找 CSS。单组件任务按以下方式使用：

1. 在门户的 **Components** 中打开需要的 `Current` 组件，先查看页面里的状态、动画和使用说明。
2. 先选好组件变量，再点击页面右上角双星图标的 **Copy for AI**。真实组件配置在点击时复制最新选择；Notification 页的演示控件除外，不作为接入配置，详细用途、交互、安装与验收在链接对应的版本说明中；同页多个示例分别标明配置归属。
3. 把复制内容连同目标页面、真实文案、真实数据和预期行为一起发给 AI。所有组件均无需额外附件或原仓库权限；必要组件资源由生产清单交付，演示文案、业务数据和展示用资源不会迁入产品。
4. 生成后对照 Current Demo 验收适用的 default、hover、focus、disabled、loading、empty、响应式与无障碍状态。

`Open HTML` 适合需要查看完整渲染实现或源码结构的开发者和 AI。`Overview` 与 `Legacy` 页面不会显示 `Copy for AI`，避免把汇总页或历史样式误当成单个 Current 组件规范。

## 交给其他 AI 平台

单独上传一个 HTML 时，其他 AI 通常可以读取其中直接内嵌的文字、结构、CSS 和脚本，但不一定会执行 JavaScript，也不一定能访问相对链接的字体、图片、组件子页或 React 源码。因此，**能读到 HTML 不代表会自动按 demo 精确实现**。

只使用一个组件时，优先复制该 Current 组件页的 `Copy for AI`，再补充目标页面需求。需要实现完整页面或跨多个组件时，推荐交付公开预览 URL 或完整仓库/ZIP，并同时提供 [`docs/AI_HANDOFF.md`](docs/AI_HANDOFF.md)、[`docs/TEAM_DECISIONS.md`](docs/TEAM_DECISIONS.md) 与 [`docs/aisee-dapp-design.v6.md`](docs/aisee-dapp-design.v6.md)。主门户 HTML 已内嵌 `#aisee-ai-contract` JSON，供支持源码解析的平台读取来源优先级和关键规则。

GitHub Pages 由共享开发分支 `ai/desktop/design-system-current` 自动发布；每次推送先运行完整检查，通过后更新同一个公开入口。`main` 保留为经过 PR 确认的正式稳定代码，团队成员只需要保存 Pages URL。也可以本地生成发布目录：

```bash
npm run site
```

## 批量验证 Copy for AI

运行 `npm run audit:copy-ai`，打开 [批量检查报告](artifacts/copy-ai-audit/report.html)。报告覆盖所有已登记的复制入口和受控配置案例（实际数量见每次生成的报告），检查配置导出、真实组件参数类型、复制处理与切页保护；附各案例提示词和待验收清单。新增组件 / 变量时同步扩展案例。每次推送的 CI 也会运行并保存 `copy-ai-audit` 报告。

**自动检查通过不代表 AI 生成页面已经通过验收。** 浏览器交互、截图对照及实际生成结果另行验证；报告明确标为未执行。批量验收方法和可直接交给 AI 的验收指令见 [Copy for AI 验收指南](docs/COPY_AI_VALIDATION.md)。

## AI 选择变量与复用组件

- **先选变量，再复制**适用于所有带变量的 Current 组件，不限于 Sidebar。切换后再次复制会读取新配置；普通搜索词、表单内容和演示数据不属于设计配置。纯展示页不声称选择了某个示例。
- 给 AI 目标截图或可访问的页面 / Figma 链接后，先按用途、结构和交互匹配 Current 组件；有合适组件就直接复用，再选择对应变量。截图可判断可见布局，不能确定 hover、收起方式、加载状态等隐藏行为；链接不可访问时说明缺失，不自行猜测。
- 选择顺序：用户明确指定（包括复制的配置）→ 目标设计 → 产品已确定的统一配置 → 组件文档默认值。存在冲突时指出差异，不能随机挑选。
- **这也是直接把整个设计系统交给 AI 时的规则**，不依赖 Copy for AI 入口。同一产品沿用已有配置；单次预览选择不会自动成为全产品默认值。生成时记录所用组件和变量供后续页面沿用。
- 规则与代码默认值可以减少结果差异，但无法保证未读取规范的外部 AI 自动遵守；交付时应包含 README 和 AI_HANDOFF。详细范围与接入方式见 [组件配置契约](docs/COMPONENT_CONFIGURATION.md)。

## 分区卡片规则

复杂描边卡片只用于外层，任何场景下的内层卡片均简化为浅灰填充或白底浅描边，不重复白色内框和阴影。已有白色 Card 保留；表单、总览和创建流程使用 section 变体：16px 圆角 / 内距、5px 白色内边框、浅色内容底，标题 Karla 16px / 500。内部复用 Input、Textarea、Dropdown、Checkbox、Toggle 和 StatCard，支持 1–4 列自适应布局；卡片不接管业务表单或发布逻辑。详见 [分区卡片交付说明](docs/SECTION_CARDS.md)。

功能权益展示可使用 FeatureOverview，底层复用 Card divided、FeatureList 与 StatCardGroup compact。外框统一为 24px 白色卡片，内部共享分隔线；平台图标条暂为组合示例，不独立导出。详见 [功能总览交付说明](docs/FEATURE_OVERVIEW.md)。

## Button 图标规则

Button 支持显示 / 隐藏图标。一般操作图标在左，前进箭头与 AI 生成标识在右；统一使用 16px 图标容器、6px 文字间距，关闭后不占位。单色图标随按钮 hover / focus 变色，多色原图保留颜色。

## 字体边界

- **Homepage / Brand：Karla + Gotu**
- **dApp / UI Kits — Webapp：只使用 Karla**，包括标题、正文、数据、代码提示与 Score Gauge

旧历史文件如果仍内嵌其他字体定义，可继续用于追溯；进入现行组件或 UI Kit 时必须按以上边界升级。

## 最近更新

### 2026-09-21 · NEW 显示期限

- NEW 暂时改为保留 3 天，更新当天计为第 1 天，第 4 天零点自动隐藏。
- 有新内容时，按对应内容的最新更新日期重新显示；刷新或重新构建不会延长期限。
- 侧栏、README、组件详情和独立预览页统一使用该规则。

### 2026-09-21 · Thinking Indicator 思考状态

- 新增思考 loading：圆形与无限符号连续变形，文字扫光并平滑轮换。
- 支持默认、紧凑和纯文字形式，可传入本地化状态文案。
- 遵循 AISEE 字体与语义色；系统减少动态效果时显示静态图标和文字。
- Copy for AI 保留图标与尺寸选择，仅交付必要生产代码，无需额外字体或动效库。

### 2026-09-21 · 通用 Confirmation Dialog

- 确认弹窗支持普通说明和带操作影响卡片两种组合，保留原有简洁确认样式。
- 标题、说明、图标、按钮文案及确认操作由业务项目传入，可复用正向与警告提示。
- 默认聚焦取消按钮，支持 Escape 关闭和焦点返回；窄屏按钮自动纵向排列。
- Copy for AI 仅交付组件、必要按钮、样式及关闭图标，不包含业务演示、示例插图或字体。

## v6 主要更新

- Analysis = lime `#CFFF29`；Post Agent / Engage = yellow `#FFE253`
- Sidebar 采用纵向功能分组：Growth Loop 包含 Analysis / Growth / Engage / Post / Verify；Engage 子项为 Signal Feed / Keywords & Accounts / Replies；Verify 子项为 Compare / Google Search Data / Bing Webmaster Data
- Header 70px；Sidebar 展开 224px、可收起至 58px（收起态仅显示 icon）；主内容 padding 16px
- 页面背景 `#FAFAFA`，卡片 `#FFFFFF`，静态描边统一 5% 黑
- 所有弹窗标题统一 Karla 20px / 500（包括二次确认）
- Automation 属于 WORKFLOWS 分组；Google Search Data 与 Bing Webmaster Data 归入 Verify，不再单列 INTEGRATIONS
- PlanCard 当前展示单套餐订阅确认；此前 v5.4 三档比较与 Legacy 套餐卡保留供追溯
- Figma 对齐 Toggle、Modal footer 和 Engage v5 页面规则
- 44 个元数据颜色与 46 个语义颜色由 JSON 自动生成 CSS；旧变量通过兼容 alias 保留
- Current 组件补齐 Avatar、Badge、Checkbox、Empty State、Steps、Tooltip / Toast、Notification、Table、Stat Card、Chart、Score Gauge、Credit Bar、Dropdown、Tag Input、Toggle Selection Group 与 Tree Nav；组件目录按分类内 A–Z 排列
- Avatar 统一进入 Components：网站注册账号使用方形头像库，社媒头像缺失时使用圆形灰描边兜底库；Sidebar 等账号入口从组件库随机取值并保持稳定；Plan-generated Post 的平台 logo 只用虚线描边，Manual-create Post 只用实线描边
- Credit Bar 覆盖 Subscription、Top-up、任一来源为 0 及两者都为 0；Empty State 的 `No report data` 表示暂无报告记录，主操作为添加产品 URL 并开始分析
- Dropdown 覆盖单选、多选、过滤、输入建议、分组账号与带图标操作菜单等组合形态；Fluid Hover 使用缓存几何信息平滑跟随，行操作默认隐藏、在 hover / focus 时按需出现；Grouped account 提供 `Show icons` 开关；所有菜单作为浮层打开，不改变外围内容高度
- Tree Nav 作为独立层级导航组件默认直接展示本地相关选项、子级引导线与叶子选中；只有需要自行命名分组时才使用父级展开。Sidebar Navigation 展开态组合 Tree Nav，并单独维护多分组、侧栏收起与浮层职责；SidebarLayout 支持 sidebar / muted / floating / inset / topbar，收起按钮 inside / outside 可独立组合
- Checkbox 新选中时使用短促 bubble 扩散反馈，保留原有选中语义、键盘路径并遵循 reduced motion
- README、组件页面、Overview、`Copy for AI` 与 `NEW` 标识随 Current 组件更新同步维护，方便用户识别新增内容并把同一套规则交给 AI；`NEW` 按台北时区计算，更新当天为第 1 天，第 4 天零点隐藏；有新内容更新后重新显示 3 天

完整迁移表见 [`docs/MIGRATION.md`](docs/MIGRATION.md)，资源状态见 [`docs/RESOURCE_INVENTORY.md`](docs/RESOURCE_INVENTORY.md)。

## 本地 Figma 设计源

最新本地 Figma 备份使用固定入口 [`design-sources/figma/`](design-sources/figma/README.md)。文件名由 `source.json` 的 `figFile` 指定；替换同名文件后，后续设计稿对比会先检查更新时间和内容哈希，并优先读取其中登记的固定云端链接。

原始 `.fig` 可以用于发现版本变化和读取可识别的预览/资源，但它不是稳定的机器可读交换格式。若需要可靠同步组件节点、Variables 和图标，请同时更新 `variables.json`、`exports/`，或在 `source.json` 中保存一个持续更新的同文件 Figma URL。详细规则见 [`docs/FIGMA_SOURCES.md`](docs/FIGMA_SOURCES.md)。

## Icon Library

AISEE 自有 icon 的唯一资源源是 [StemUI GitHub](https://github.com/qi15582378779/stemui)，产品代码通过 npm 的 [`@stemui/icons`](https://www.npmjs.com/package/@stemui/icons?activeTab=readme) 使用：

```bash
npm install @stemui/icons
```

```tsx
import { LineFileSaveIcon } from '@stemui/icons';

<LineFileSaveIcon size={20} color="currentColor" />
```

设计系统不复制整套 SVG，只维护视觉规则、入口和组件使用示例。新增、修改或删除 icon 时，应在 StemUI 中完成 SVG 更新、预览、构建和 npm 发布，再让产品项目升级依赖。完整流程见 [`docs/ICON_LIBRARY.md`](docs/ICON_LIBRARY.md)。

## 本地运行

```bash
# 团队静态预览（推荐）
npm install
npm run preview:local

# 源码开发（Vite + React）
npm run dev
```

完整验收：

```bash
npm run check
```

## 在产品项目中使用

```tsx
import { Button, Toggle } from '@aisee/design-system';
import '@aisee/design-system/styles.css';

export function Example() {
  return (
    <main className="aisee-root" data-aisee-theme="analysis">
      <Button>New analysis</Button>
      <Toggle label="Monitoring" />
    </main>
  );
}
```

主题值：`analysis`、`post-agent`、`engage`。

## 令牌工作流

基础尺寸、字体与兼容 token 编辑 [`src/tokens/tokens.json`](src/tokens/tokens.json)；Figma 两层颜色结构编辑 [`src/tokens/color-architecture.json`](src/tokens/color-architecture.json)。颜色必须保持“元数据 → 语义化 → 组件/页面”引用链，业务代码只使用 `--aisee-color-semantic-*`。修改后生成 CSS / TypeScript 和 HTML 内嵌颜色数据：

```bash
npm run tokens
```

CI 会检测生成文件是否过期。

## GitHub

当前远端为私有仓库 [`23mnals/aisee-design-system`](https://github.com/23mnals/aisee-design-system)。团队成员通过 GitHub Collaborators 获得访问权限；网页预览可通过 GitHub Pages 发布。

## 版本与维护

代码包采用 Semantic Versioning。Figma 页面按功能维护：新增功能或独立新需求时新开页面；已有功能追加需求时不新开页面，而是在该功能原版本页面的上方增加最新设计内容。读取 Figma 更新主题与日期时，必须以每个设计区块上方的黑色标题框为准；页面名和文件名即使未改也不能作为时间判断依据。分支以 `feat/`、`fix/`、`docs/` 开头；所有改动通过 PR、截图对比和 CI 后合并。详见 [`CONTRIBUTING.md`](CONTRIBUTING.md)。
