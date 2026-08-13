# aisee Design System

aisee 官网与 Web App 的共享设计系统。本仓库由旧版 Design System **增量升级**而来：旧内容完整保留。Figma **5.6 是当前最新的功能版本页面，不是整个 Figma 文件的全局版本**；最新实施规则以 [`docs/aisee-dapp-design.v6.md`](docs/aisee-dapp-design.v6.md) 为基线，后续团队决策以 [`docs/TEAM_DECISIONS.md`](docs/TEAM_DECISIONS.md) 为最高优先级。两条版本线的关系及 Figma 页面维护规则见 [`docs/FIGMA_SOURCES.md`](docs/FIGMA_SOURCES.md)。

## 四个入口

| Part | 内容 | 入口 |
|---|---|---|
| **README** | 使用方法、版本、协作与资源状态 | 本文件、[`CONTRIBUTING.md`](CONTRIBUTING.md)、[`CHANGELOG.md`](CHANGELOG.md) |
| **Brand** | 官网设计语言、颜色、Karla + Gotu 字体、Logo、插画与资产 | [`brand/`](brand/) |
| **Components** | 旧系统组件、动画图标、Engage 业务组件与 v6 React 基础组件 | [`components/`](components/) |
| **UI Kits — Webapp** | 仅 Karla 的 dApp foundations、layouts、patterns、screens 与交互 UI Kit | [`ui_kits/webapp/`](ui_kits/webapp/) |

原有 692 个文件与子目录均保留，包括 Brand previews、animated icons、Engage、Analysis、Post Agent、Billing、Pricing、My Account、教程、screenshots 和 uploads。v6 有明确同职责规则的内容已经定点更新；没有重复项的旧资源没有删除。

## 团队预览页面

直接打开 [`aisee-design-system-preview.html`](aisee-design-system-preview.html) 即可浏览完整系统，无需安装依赖。页面包含 README、Brand、Components、UI Kits — Webapp 四个部分，并提供：

- v6 Foundations 与 Components 当前规范页
- 所有保留的旧版 HTML 预览，并以 `Legacy` 标识
- 目录搜索、内嵌预览、独立打开和页面链接复制
- 桌面端与移动端响应式浏览

GitHub 仓库启用 Pages 后，每次合并到 `main` 都会自动发布同一个入口页，团队成员只需要保存 Pages URL。也可以本地生成发布目录：

```bash
npm run site
```

## 字体边界

- **Homepage / Brand：Karla + Gotu**
- **dApp / UI Kits — Webapp：只使用 Karla**，包括标题、正文、数据、代码提示与 Score Gauge

旧历史文件如果仍内嵌其他字体定义，可继续用于追溯；进入现行组件或 UI Kit 时必须按以上边界升级。

## v6 主要更新

- Analysis = lime `#CFFF29`；Post Agent / Engage = yellow `#FFE253`
- Analysis / Post Agent / Engage 是 Sidebar 中三个平级模块
- Header 70px；Sidebar 224px；主内容 padding 24–32px
- 页面背景 `#FAFAFA`，卡片 `#FFFFFF`，静态描边统一 5% 黑
- 页面与弹窗标题统一 Karla 20px / 600
- PlanCard 新增 v5.4 Upgrade Plan 当前版本，旧套餐卡继续作为 Legacy 保留
- Figma 对齐 Toggle、Modal footer 和 Engage v5 页面规则
- 73 个设计令牌由 JSON 自动生成 CSS 与 TypeScript

完整迁移表见 [`docs/MIGRATION.md`](docs/MIGRATION.md)，资源状态见 [`docs/RESOURCE_INVENTORY.md`](docs/RESOURCE_INVENTORY.md)。

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
npm install
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

只编辑 [`src/tokens/tokens.json`](src/tokens/tokens.json)，再生成 CSS / TypeScript：

```bash
npm run tokens
```

CI 会检测生成文件是否过期。

## GitHub

本地内容已经准备好，但尚未创建 GitHub 远端。建议创建空仓库：

- Owner：你的账号或团队 Organization
- Repository name：`aisee-design-system`
- README / `.gitignore` / License：全部不要勾选（本地已有 README 与 `.gitignore`；授权方案待团队确认）
- Visibility：建议先选 **Private**，因为仓库包含品牌资产、产品原型与历史上传资源

创建后复制仓库 URL，再执行：

```bash
git remote add origin https://github.com/OWNER/aisee-design-system.git
git push -u origin main
```

## 版本与维护

代码包采用 Semantic Versioning。Figma 页面按功能维护：新增功能或独立新需求时新开页面；已有功能追加需求时不新开页面，而是在该功能原版本页面的上方增加最新设计内容。读取 Figma 更新主题与日期时，必须以每个设计区块上方的黑色标题框为准；页面名和文件名即使未改也不能作为时间判断依据。分支以 `feat/`、`fix/`、`docs/` 开头；所有改动通过 PR、截图对比和 CI 后合并。详见 [`CONTRIBUTING.md`](CONTRIBUTING.md)。
