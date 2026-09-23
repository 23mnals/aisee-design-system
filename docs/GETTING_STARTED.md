# 第三方接入 AISEE Design System

适用于团队开发、第三方和编码 AI。所有已登记的 Current 组件统一使用 [生产交付契约](PRODUCTION_DELIVERY.md)。Copy for AI 只取得目标组件必要的源码、样式、运行依赖与生产资产，继承宿主字体；不复制 Demo、模拟数据、展示布局或整个 Design System 环境。


安装前先识别宿主已有 UI 库与自定义 primitives，按组件清单的 `integrationMode / primitives / preserve` 优先复用兼容底层能力；不为单个组件安装整套 UI framework。shadcn/ui 项目必须先读取 `components.json`、alias 和现有 `components/ui`，兼容时直接在宿主既有组件路径上合并 AISEE 视觉、状态、动画与行为，不创建平行的 `src/components/aisee` 或第二套 `components/ui`。交付源码只作为临时参考，合并完成后删除；仅在宿主 primitive 无法满足必要行为时退回 standalone。样式局部作用域，不覆盖宿主 theme/provider/global styles。识别和适配由编码 AI 在目标项目执行，解包安装器不会自动改造框架。完整规则见 [Host Project Compatibility](PRODUCTION_DELIVERY.md#host-project-compatibility)。

## 0. 单组件最短路径

1. 提供方构建并发布组件交付；本地预览不能代替公开地址。
2. 打开目标组件，选择真实布局/样式/交互变量，点击 **Copy for AI**。按钮核对公开版本与文件校验；未发布则显示原因。
3. 将短指令粘贴给能编辑现有 React 项目、联网并执行 Node 的编码 AI，说明要放在哪里。指令包含具体组件名、稳定 latest 地址及白名单允许的实际选项，不含源码归档或演示状态。
4. AI 读取 latest 指向的说明，下载并验证安装器，将生产组件连接到真实业务数据和回调；无需用户下载/上传附件或安装整库。

接收环境：兼容的 React 项目及组件清单 `dependencies / compatibility` 声明的 React、Node 和第三方依赖范围；Copy for AI 不额外强制统一版本。Node 用于源码安装步骤。需要 TSX/CSS 处理，带生产资源的组件还需 SVG/image 导入支持。复用现有兼容依赖，不要求 Tailwind/shadcn/额外动画库。非 React 项目不能直接调用 React 组件；无联网/命令执行能力的聊天 AI 不能完成自动安装。

脚本使用 Node 内置模块，仅解包 manifest 中的文件，不安装 npm 依赖，不覆盖已有不同文件。不同组件所需文件数量不同，入口与局部类型声明也是生产依赖。字体、全局 reset 和整套 tokens 不交付；宿主可覆盖局部 token 默认值。

latest 会在发布新版本后更新；旧版本链接保持历史含义。已安装源码不自动升级，也不能自动删除用户旧文件。`npm run build:ai-deliveries` 构建；`npm run verify:ai-deliveries` 验证全部清单、独立类型与构建；`npm run audit:copy-ai` 验证复制内容。新版本必须发布后才能对外使用。

## 1. 先确认你拿到了什么

| 当前条件 | 接入方式 |
| --- | --- |
| React 项目已安装兼容的 AISEE 包 | 检查版本与导出，导入组件及样式 |
| React 项目未安装，但拿到了团队提供的 `.tgz` | 按下面的本地安装包流程接入（推荐） |
| 有完整仓库 / ZIP，没有安装包 | 在设计系统仓库构建并打包，或迁入源码及其完整依赖 |
| 收到任一 Current 组件新版 Copy for AI | AI 按公开地址自动下载组件接入；无需整库、附件或内部仓库 |
| 只有截图 / 旧版提示词 / 在线预览 | 获取缺失的源码交付文件；不能凭包名写一个不存在的 import |
| Vue / Svelte / 原生 HTML 等非 React 项目 | 使用 tokens / 字体 / 资源和行为规范，在目标框架实现；现有 React 组件不能直接当作该框架组件调用 |

仓库位置：<https://github.com/23mnals/aisee-design-system>。仓库访问权限取决于提供方设置。`localhost` 和本地文件路径对其他人 / 云端 AI 不可访问；请交付实际文件、完整 ZIP 或接收方可访问的地址。

**当前分发状态**：`package.json` 为 `private: true`、`license: UNLICENSED`，仓库没有 LICENSE 文件；这里没有已验证的公共 npm 安装入口。不要直接执行 `npm install @aisee/design-system`，也不要把可浏览 Demo 等同于已获准第三方使用。对外使用范围与资产授权需由系统提供方明确；本指南不改变许可，也不发布包。

## 2. 前置准备

- 已有 React 应用，`react` 与 `react-dom` 版本匹配，均满足 `>=18`。已有项目不要盲目升级 React。
- 包声明 Node.js 20+；构建本仓库时，当前 Vite 要求 Node 20.19+ 或 22.12+（不含 Node 21），本轮在 Node 22.20 验证。使用项目约定的包管理器和仓库 lockfile。新手先使用已有 React/Vite 项目，不要把预览 HTML 当成项目入口。
- 项目构建工具支持导入 CSS；使用源码模式时还需 TSX、必要 SVG/PNG 资源处理及对应类型声明（生产交付附带局部资源声明，不下载字体）。
- 此库使用普通 CSS，不要求 Tailwind、shadcn、Next.js、Framer Motion 或 GSAP。只因参考案例使用这些工具，不代表要安装它们。
- 确认目标组件的真实导出和 props；页面名称不一定是导出名称，例如 Select 页面用 `Dropdown`，Tooltip / Toast 页面分别用 `Tooltip` / `Toast`，侧栏布局用 `SidebarLayout`。
- 准备目标页面、真实文案 / 数据 / 回调和配置；组件不代替后端接口、身份鉴权、支付、上传或发布服务。

## 3. 整库接入：安装团队交付的组件包

### 提供方：在设计系统仓库执行

```bash
npm ci
npm run pack:local
```

可再运行 `npm run verify:package`，在独立临时 React 项目中检查本地包安装、公开类型、构建及资源。这个离线检查复用仓库现有 React 依赖，不代表所有框架或 AI 最终产出已验证。

这会构建当前工作区并生成 `artifacts/packages/aisee-design-system-1.0.0.tgz`（以实际 package 版本输出为准）。打包不会 push、publish 或修改产品项目。提供包时同时给出来源 commit、是否含未提交修改、交付日期、SHA-256 和对应 Demo。当前本地包可能包含尚未推送的更新，不能拿远端旧 Demo 作为同版本证据。

### 使用方：在自己的 React 产品项目执行

把收到的包放入项目 `vendor/` 目录，再运行：

```bash
npm install ./vendor/aisee-design-system-1.0.0.tgz
npm ls @aisee/design-system react react-dom
```

将收到的 tgz 和 lockfile 一起保留在团队 / CI 可获取的位置；只引用发送者电脑上的绝对路径，换机器就会失效。

`vendor/` 和包名是本示例约定，按实际路径替换。使用其他包管理器时按项目约定添加同一个文件依赖，不混用 lockfile。若已有 workspace 依赖，沿用该管理方式，不再重复装第二份。

在应用入口（例如 `src/main.tsx`）导入一次样式：

```tsx
import '@aisee/design-system/styles.css';
```

页面中使用真实组件：

```tsx
import { Tooltip } from '@aisee/design-system';

export function Example() {
  return (
    <Tooltip content="成员信息" placement="auto" animation="playful">
      <button type="button">查看成员</button>
    </Tooltip>
  );
}
```

组件的 `content`、`children`、业务值和回调仍须按公开类型填写；Copy for AI 的配置快照只包含设计选择，不是完整可运行页面。未传 `animation` 时 Tooltip 为 subtle，当前 Demo 初始选择为 playful，复制后会显式携带 playful。

此处整库备选构建包包含 CSS、Karla 字体及库内部用到的资源（单组件生产交付不带字体），不需要再从 Demo 地址热链。自定义业务图标 / 头像 / 图片由调用方提供：使用已获准资源，若另行引用 `@stemui/icons` 再按其实际文档安装，不能凭猜测的导出名称使用。不要把 `../../assets/...` 的 Demo 路径原样贴进产品。

**TypeScript 的 CSS 类型**：Vite 项目保留 `vite/client` 类型声明；其他项目使用框架提供的 CSS 模块声明。若报 TS2882 且构建工具已支持 CSS，可在被 tsconfig 包含的 `assets.d.ts` 添加 `declare module '*.css';`，这只补类型，不能代替真实的 CSS 加载能力。

**Next.js / SSR 项目**：交互组件放在 `'use client'` 边界内，样式在框架允许的全局入口引入。浏览器相关行为在客户端运行。仓库当前验证基线是 React + Vite，不声称所有 SSR 框架都已验证；接入时检查客户端边界、hydration 与资源路径。

## 4. 不安装包：按生产清单迁入组件

优先使用 Copy for AI 对应的 latest 说明。手动接入也使用相同安装器和生产清单，不复制整个组件目录、src、tokens、styles 或 fonts。

1. 读取组件 latest 指针，打开其中 delivery 对应的版本说明。
2. 下载说明中的 install.cjs，校验 SHA-256，运行并指定产品组件目录。不同文件冲突时先核对，不强行覆盖。
3. 从安装目录 index 导入组件；入口自动加载局部样式。保留随附的必要代码、资源和类型声明，继承宿主字体。
4. 根据真实 API 接入业务数据与回调。需要更新时读取新的 latest 版本并检查差异；已经安装的源码不会自动改变。

例如 Tooltip 的交付包含真实弹簧 hook、定位/弹簧算法和局部样式；这些是生产依赖。演示头像、方向展示网格和动画模式选择器不交付。

## 5. 普通 HTML 或非 React 项目

现有组件包导出 React 组件，不提供可直接注册的 Vue 组件或 Web Component。可以使用 tokens、字体与获准的资源，再按 Current 规范实现目标框架版本；这属于适配，需要重新验证交互。Open HTML 中的脚本 / CSS / 图片可能依赖多个文件，并非保证自包含的单文件；完整目录应通过 HTTP 服务预览，不要双击 file://。

如果 AI 环境不能安装依赖或读取源码，应先明确阻塞和缺失文件。不要以无样式占位组件、凭记忆仿制或引用未安装包的方式声称接入完成。

## 6. 常见问题与验收

| 现象 | 检查与处理 |
| --- | --- |
| Cannot find module / 包安装 404 | 是否拿到并安装实际 tgz，是否在正确产品目录；当前不能假设 npm 公共包存在 |
| No exported member / 找不到某个组件 | 检查安装版本的类型和导出；Demo 名不一定是 API 名；不要使用未发布版本的 props |
| 有结构但无样式 | 应用入口导入 styles.css；排查 Tailwind preflight、全局 button 样式等覆盖 |
| 字体 / 图标 / 图片丢失 | 检查网络 404、CSP 对字体和内嵌 data URL 的允许范围；源码模式核对相对路径；不要降低全站安全设置来掩盖资源问题 |
| Invalid hook call / React 冲突 | 检查重复 React、react-dom 版本以及 workspace / link 解析；优先本地 tgz 安装 |
| SSR 报错或 hydration 不一致 | 检查客户端边界和浏览器 API；按所用框架逐项验证 |
| 与 Demo 动画 / 布局不一致 | 比较版本、当前 props、同一视口、系统减少动态效果设置及 CSS 覆盖 |
| AI 只有链接仍无法复用 | 检查公开 latest、delivery 与安装器的实际 HTTP 错误，以及编码 AI 的联网/执行权限；不要索要原私有仓库路径 |

最低验收：依赖解析成功、类型检查及产品 build 通过；宿主字体与必要图标无加载错误；对照同版本 Demo 检查尺寸和配色、hover / focus / Escape / disabled、滚动和窄屏、减少动态效果。复制契约检查不等同于第三方项目或 AI 产出的视觉验收。

## 7. 版本与更新

组件包只需接入一次，不是每次复制都安装。更换组件配置通常只改 props。只有需要新组件 / 新行为时更新安装包并重测；锁定依赖和 lockfile，避免团队混用不同本地包。同样名为 1.0.0 的本地包可能内容不同，正式对外分发前应提升版本并建立可追踪的交付记录。本次不会自动发布 npm、改许可或同步 main。

提供方交付清单：安装包或完整源码、版本与来源、公开 props / 配置、对应 Demo、接入说明、资源和使用授权范围。使用方回传：框架 / React 版本、安装来源、复用组件与变量、运行和视觉验收结果。

## 一句话链接

NotificationBell 仅交付铃铛生产实现，count / onClick 接入真实数据与既有入口，页面演示控制不复制。所有组件遵循相同清单机制；文件数量依实际生产依赖而定。旧版完整交付已被产品使用时不要自动删除；新版可装入独立目录并更新 import。
