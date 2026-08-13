# aisee Design System

aisee 官网与 Web App 的共享设计系统。本仓库由旧版 Design System **增量升级**而来：旧内容完整保留，最新 dApp 视觉与交互以 [`docs/aisee-dapp-design.v6.md`](docs/aisee-dapp-design.v6.md) 为基线，后续团队决策以 [`docs/TEAM_DECISIONS.md`](docs/TEAM_DECISIONS.md) 为最高优先级。

## 四个入口

| Part | 内容 | 入口 |
|---|---|---|
| **README** | 使用方法、版本、协作与资源状态 | 本文件、[`CONTRIBUTING.md`](CONTRIBUTING.md)、[`CHANGELOG.md`](CHANGELOG.md) |
| **Brand** | 官网设计语言、颜色、Karla + Gotu 字体、Logo、插画与资产 | [`brand/`](brand/) |
| **Components** | 旧系统组件、动画图标、Engage 业务组件与 v6 React 基础组件 | [`components/`](components/) |
| **UI Kits — Webapp** | 仅 Karla 的 dApp foundations、layouts、patterns、screens 与交互 UI Kit | [`ui_kits/webapp/`](ui_kits/webapp/) |

原有 692 个文件与子目录均保留，包括 Brand previews、animated icons、Engage、Analysis、Post Agent、Billing、Pricing、My Account、教程、screenshots 和 uploads。v6 有明确同职责规则的内容已经定点更新；没有重复项的旧资源没有删除。

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
- Figma 对齐 Toggle、Modal footer 和 Engage v5 页面规则
- 73 个设计令牌由 JSON 自动生成 CSS 与 TypeScript

完整迁移表见 [`docs/MIGRATION.md`](docs/MIGRATION.md)，资源状态见 [`docs/RESOURCE_INVENTORY.md`](docs/RESOURCE_INVENTORY.md)。

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

采用 Semantic Versioning。分支以 `feat/`、`fix/`、`docs/` 开头；所有改动通过 PR、截图对比和 CI 后合并。详见 [`CONTRIBUTING.md`](CONTRIBUTING.md)。
