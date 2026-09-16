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
- 每个 Current 组件详情页的 `Copy for AI`，用于复制该组件的用途、交互、视觉边界与通用实施规则
- 桌面端与移动端响应式浏览

## 非开发人员如何使用组件

不需要把整套 Design System Demo 交给 AI，也不需要自己从 HTML 中寻找 CSS。单组件任务按以下方式使用：

1. 在门户的 **Components** 中打开需要的 `Current` 组件，先查看页面里的状态、动画和使用说明。
2. 点击页面右上角双星图标的 **Copy for AI**。复制内容已经包含组件用途、关键交互、视觉边界、无障碍与 AISEE 通用规则。
3. 把复制的 Prompt 连同目标页面、真实文案、真实数据和预期行为一起发给 AI。Demo 中的图标、插图、文案和数据都只是参考，AI 应根据实际功能替换。
4. 生成后对照 Current Demo 验收适用的 default、hover、focus、disabled、loading、empty、响应式与无障碍状态。

`Open HTML` 适合需要查看完整渲染实现或源码结构的开发者和 AI。`Overview` 与 `Legacy` 页面不会显示 `Copy for AI`，避免把汇总页或历史样式误当成单个 Current 组件规范。

## 交给其他 AI 平台

单独上传一个 HTML 时，其他 AI 通常可以读取其中直接内嵌的文字、结构、CSS 和脚本，但不一定会执行 JavaScript，也不一定能访问相对链接的字体、图片、组件子页或 React 源码。因此，**能读到 HTML 不代表会自动按 demo 精确实现**。

只使用一个组件时，优先复制该 Current 组件页的 `Copy for AI`，再补充目标页面需求。需要实现完整页面或跨多个组件时，推荐交付公开预览 URL 或完整仓库/ZIP，并同时提供 [`docs/AI_HANDOFF.md`](docs/AI_HANDOFF.md)、[`docs/TEAM_DECISIONS.md`](docs/TEAM_DECISIONS.md) 与 [`docs/aisee-dapp-design.v6.md`](docs/aisee-dapp-design.v6.md)。主门户 HTML 已内嵌 `#aisee-ai-contract` JSON，供支持源码解析的平台读取来源优先级和关键规则。

GitHub Pages 由共享开发分支 `ai/desktop/design-system-current` 自动发布；每次推送先运行完整检查，通过后更新同一个公开入口。`main` 保留为经过 PR 确认的正式稳定代码，团队成员只需要保存 Pages URL。也可以本地生成发布目录：

```bash
npm run site
```

## 字体边界

- **Homepage / Brand：Karla + Gotu**
- **dApp / UI Kits — Webapp：只使用 Karla**，包括标题、正文、数据、代码提示与 Score Gauge

旧历史文件如果仍内嵌其他字体定义，可继续用于追溯；进入现行组件或 UI Kit 时必须按以上边界升级。

## 最近更新

### 2026-09-15 ～ 2026-09-16

- **Avatar**：22 个网站注册方形头像与 24 个社媒缺失圆形兜底头像进入 Components；头像随机取值后保持稳定；眼睛动画直接作用于原头像并限制瞳孔范围；颜色、眼睛尺寸和位置增加差异
- **账号与平台标识**：Sidebar 账号入口同步组件头像库，套餐名更新为 `Growth Loop Plan`，额度说明 icon 改为细描边；Plan-generated Post 的平台 logo 使用单层虚线描边，Manual-create Post 使用单层实线描边，并缩小 logo 与外圈间距
- **Sidebar Navigation**：原 Verify 页面更名为 Compare；Google Search Data 与 Bing Webmaster Data 移入 Verify 子级；账号入口随机展示组件库头像
- **组件发现与 AI 交付**：Avatar 移入 Components；分类内按 A–Z 排序；README、页面更新位置与新增组件显示 `NEW`；22 个 Current 组件详情页提供经过同一规则约束的 `Copy for AI`
- **Credit Bar 与 Empty State**：补齐 Subscription 为 0、Top-up 为 0、两者同时为 0 的额度状态；原 Successful 插图语义修正为 `No report data`，表示暂无报告记录，并引导用户添加产品 URL 发起分析
- **Dropdown**：同步单选、多选、过滤、输入建议、Compact、Search + action、Filter panel 与 Grouped account；Fluid Hover 改为缓存几何信息并缩短动画；行操作加号为 24px、默认隐藏、行 hover / focus 后显示灰底灰边、按钮自身 hover 才变黄
- **Dropdown 参数与布局**：Grouped account 增加真实 `Show icons` 开关；关闭后只显示文字；所有下拉菜单以浮层展开，不改变 Playground、后续内容或文档高度
- **在线 Demo**：GitHub About 保留固定 Pages 地址，Pages 改由 `ai/desktop/design-system-current` 在完整检查通过后自动发布；`main` 继续作为 PR 确认后的稳定代码

## v6 主要更新

- Analysis = lime `#CFFF29`；Post Agent / Engage = yellow `#FFE253`
- Sidebar 采用纵向功能分组：Growth Loop 包含 Analysis / Growth / Engage / Post / Verify；Engage 子项为 Signal Feed / Keywords & Accounts / Replies；Verify 子项为 Compare / Google Search Data / Bing Webmaster Data
- Header 70px；Sidebar 展开 224px、可收起至 58px（收起态仅显示 icon）；主内容 padding 16px
- 页面背景 `#FAFAFA`，卡片 `#FFFFFF`，静态描边统一 5% 黑
- 所有弹窗标题统一 Karla 20px / 500（包括二次确认）
- Automation 属于 WORKFLOWS 分组；Google Search Data 与 Bing Webmaster Data 归入 Verify，不再单列 INTEGRATIONS
- PlanCard 新增 v5.4 Upgrade Plan 当前版本，旧套餐卡继续作为 Legacy 保留
- Figma 对齐 Toggle、Modal footer 和 Engage v5 页面规则
- 44 个元数据颜色与 46 个语义颜色由 JSON 自动生成 CSS；旧变量通过兼容 alias 保留
- Current 组件补齐 Avatar、Badge、Checkbox、Empty State、Steps、Tooltip / Toast、Table、Stat Card、Chart、Score Gauge、Credit Bar、Dropdown、Tag Input 与 Toggle Selection Group；组件目录按分类内 A–Z 排列
- Avatar 统一进入 Components：网站注册账号使用方形头像库，社媒头像缺失时使用圆形灰描边兜底库；Sidebar 等账号入口从组件库随机取值并保持稳定；Plan-generated Post 的平台 logo 只用虚线描边，Manual-create Post 只用实线描边
- Credit Bar 覆盖 Subscription、Top-up、任一来源为 0 及两者都为 0；Empty State 的 `No report data` 表示暂无报告记录，主操作为添加产品 URL 并开始分析
- Dropdown 覆盖单选、多选、过滤、输入建议与分组账号等组合形态；Fluid Hover 使用缓存几何信息平滑跟随，行操作默认隐藏、在 hover / focus 时按需出现；Grouped account 提供 `Show icons` 开关；所有菜单作为浮层打开，不改变外围内容高度
- README、组件页面、Overview、`Copy for AI` 与 `NEW` 标识随 Current 组件更新同步维护，方便用户识别新增内容并把同一套规则交给 AI

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
