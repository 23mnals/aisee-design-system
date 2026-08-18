# aisee dApp — Design Specification

> 适用范围：**aisee Web App** https://app-dev.aisee.live/
> 设计宽度：**1440px**（desktop），向下兼容到 1280
> 字体规则：**aisee dApp 全部统一使用 Karla**；Gotu 仅保留在官网（Homepage），不进入 dApp；弹窗标题使用 Karla SemiBold 20px / weight 600
> 设计基调：**功能优先 · 信息密度高 · 极简数据驱动 · 与官网同源但更克制**
> 版本：**v6** · 2026-08-11 · dApp 字体统一 Karla；Toggle 组件规范与 Figma 组件源同步；Modal 间距与文字规范补全

---

## 0. 文档范围与权威边界

> 本文档是 aisee dApp **视觉与交互规范**的唯一来源。
>
> **本文档说了算的事**：颜色 / 字体 / 间距 / 组件视觉 / 状态样式 / 微交互 / 模块页面布局 / 子 tab 划分
>
> **本文档不说了算的事**：业务规则 / 数据接口 / 权限 / 错误处理 / 文案 —— 以产品文档为准
>
> **两份文档冲突时**：样式 / 视觉 / 布局冲突找设计、功能 / 数据冲突找 PM，**不自行决定哪份对**。

---

## 1. Design DNA

dApp 是官网的"工作态"版本：

- **删除所有装饰**：没有几何漂浮色块、没有 mascot、没有 mix-blend cursor、没有横向 marquee。
- **保留所有品牌资产**：依然是 lime / yellow / orange / cream 色板。
- **替换字体策略**：官网保留 Gotu；**dApp 全部使用 Karla**，包括页面一级标题、弹窗标题、导航、表格与表单。
- **节奏**：以数据卡片、表格、侧边栏导航为主，靠功能区色彩高亮。

### 1.1 产品能力闭环

Product overview 必须完整呈现六个相互连接的能力，不能只列 Analysis / Post Agent / Engage：

1. **Analysis / GEO**：诊断 AI visibility、citation、ranking 与 prompt coverage。
2. **Growth**：把诊断缺口转化为提升计划、关键步骤和可执行任务。
3. **Engage**：发现相关对话并完成回复、跟踪和效果管理。
4. **Post Agent**：生成、排期并发布内容。
5. **Verify**：执行后重新扫描，记录分数轨迹并验证实际提升。
6. **Connection**：统一管理 channel、social account 与 extension 连接，供 Growth / Engage / Post 复用。

主流程关系：**Analysis diagnoses → Growth prioritizes → Engage / Post execute → Verify measures**；Connection 是跨流程的底层连接能力。六项是产品能力结构，不等同于顶部模块主色切换结构。

### ★ 双主色系统（核心规则）

dApp 按 **功能模块** 划分两套主色调，**侧边栏 tab 切换时整页高亮色随之切换**：

| 功能模块 | 主色 | hex | 范围 |
|---|---|---|---|
| **Analysis** | lime | `#CFFF29` | Analysis / Score / Report / Diagnostic |
| **Post Agent** | yellow | `#FFE253` | Calendar / Channels / Models / Media |
| **Engage**（v5 起独立） | yellow | `#FFE253`（**沿用 Post Agent 的 yellow 主色系**） | Dashboard / Signal Feed / Keywords & Accounts / Replies |

> **Engage 位置说明**（v5 修订）：Engage **不再是 Post Agent 的二级模块**——它在 Sidebar 顶部 Tab Toggle 中与 Analysis / Post Agent **平级**，是独立的第三个 tab。**色彩仍完全沿用 yellow `#FFE253` 系统**（所有 step badge、active tab、selected feed card、Generate Reply 主按钮均用 yellow），不引入新的模块主色；但 Engage 自有的 **身份色 lavender-pink `#FAE2FE`**（日常 Banner）和 **lime `#F0FFBA`**（首次配置 Banner）仅用于 Banner 容器，不参与主色切换逻辑。Engage 内置 4 个子页 Tab：**Dashboard / Signal Feed / Keywords & Accounts / Replies**——详见 §13。

| 功能模块 | 主色 | 用途 | 触发位置 |
|---|---|---|---|
| **Analysis**（分析报告 / 竞品对比 / Score / Report） | **`#CFFF29` lime** | "+ New Analysis" 主按钮、Score 区底色、active sidebar 项、"Latest" 徽章、Channels/Past Reports 顶部 tag、progress fill、上升数据 | 侧栏 tab 选中 "Analysis" 时 |
| **Post Agent**（社媒帖子 / Calendar / Channels / Post Editor） | **`#FFE253` yellow** | "+ New" 主按钮、active sidebar 项底色、Post 卡片活跃高亮、Calendar 当天背景、active 平台 tab | 侧栏 tab 选中 "Post Agent" 时 |

> **共享**：黑色文本、白色卡片、cream 编辑器底、orange 通知红点、green 成功 dot、red-light 错误底 —— 在两个模块下完全一致。
> **不共享**：active 状态色、主 CTA 按钮色、关键徽章色。

切换逻辑：
```js
// 侧栏顶部 Tab Toggle 切换
const moduleTheme = activeTab === 'Analysis'
  ? { primary: '#CFFF29', primaryHover: '#BFEE19' }
  : { primary: '#FFE253', primaryHover: '#FCE055' };
document.documentElement.style.setProperty('--module-primary', moduleTheme.primary);
```
所有主操作按钮、active 高亮使用 CSS 变量 `var(--module-primary)`，切换 tab 时整个 dApp 主色调瞬间切换。

---

## 2. Color System

> dApp 使用与官网相同的色板，但**按功能模块切换主色**。
> **页面主背景：`#FAFAFA`**。

### 2.0 两层颜色变量架构（强制）

Figma 与代码必须保持同一条依赖链：

```text
元数据 / Primitive（原始值） → 语义化 / Semantic（功能角色） → Component / Page（最终消费）
```

- **元数据 / Primitive**：只记录未经用途修饰的原始颜色及 Light / Dark 值，例如 `gray/gray-900`、`yellow/yellow-400`。这一层不描述按钮、文字、背景或状态，不允许在业务页面直接引用。
- **语义化 / Semantic**：按功能角色命名，例如 `colour/text/primary`、`colour/bg/base`、`colour/button/analysis`。每个语义变量通过 alias 引用元数据；页面换模式时由 alias 解析到对应的 Light / Dark 值。
- **组件与页面**：只允许使用 `--aisee-color-semantic-*`。禁止直接写 HEX，也禁止直接使用 `--aisee-color-primitive-*`。
- **兼容层**：现有 `--aisee-color-black` 等旧 CSS 名称会继续导出，但由生成器转接到语义变量；新代码不得继续扩展旧命名。
- **完整清单**：`src/tokens/color-architecture.json` 是从 Figma 的“元数据 / 语义化”集合校准的机器可读快照，HTML system 内嵌同一份数据并提供层级、模式、类别和搜索筛选。

> 尚未应用到组件的语义变量保留在内部 token 快照中，暂不嵌入公开 System；组件开始使用并完成校对后再发布。

### 2.1 模块主色（随 sidebar tab 切换）

```css
:root {
  /* Analysis 模块 */
  --analysis-primary:       #CFFF29;   /* lime — 主按钮、active、Latest */
  --analysis-primary-hover: #BFEE19;
  --analysis-primary-bg:    rgba(207,255,41,0.18);   /* 弱化背景 */
  --analysis-primary-pale:  #F5FFD4;                  /* 极淡 lime hint */

  /* Post Agent 模块 */
  --postagent-primary:       #FFE253;  /* yellow — 主按钮、active、New */
  --postagent-primary-hover: #FCE055;
  --postagent-primary-bg:    #FFF2B3;
  --postagent-primary-pale:  #FFFADD;

  /* 由 JS 在 tab 切换时设置 */
  --module-primary:       var(--analysis-primary);
  --module-primary-hover: var(--analysis-primary-hover);
  --module-primary-bg:    var(--analysis-primary-bg);
}
```

| 状态 | Analysis 用 | Post Agent 用 |
|---|---|---|
| Active sidebar item 底色 | `#CFFF29` lime | `#FFE253` yellow |
| 主 CTA 按钮（New / Compare / Confirm） | lime 底 + 黑字 | yellow 底 + 黑字 |
| "Latest" / 关键徽章 | lime | yellow |
| Progress fill / Score 区底 | lime | yellow |
| Hover 加深 | `#BFEE19` | `#FCE055` |

### 2.2 共享色板（两个模块都用）

| Token | Value | 用途 |
|---|---|---|
| `--black` | `#111111` | 主文本、图标、深底按钮 |
| `--white` | `#FFFFFF` | 卡片底、header、sidebar |
| `--bg-page` | `#FAFAFA` | 主视图背景（figma 实测值） |
| `--bg-card` | `#FFFFFF` | 卡片、Header、Sidebar背景 |
| `--bg-card-warm` | `#FBFBF3` / `#F9F9F1` | 软 cream 色卡片背景变体 |
| `--cream` | `#F7F6E9` | Post 编辑器底、warm 区域、信息提示块 |
| `--orange` / `--danger` | `#EC5212` | 通知红点 / 数字徽章 / Danger 按钮 / 异常 |
| `--green` | `#A5D500` | 成功 dot / 完成态、通道已连接、上升数据 |
| `--red-light` | `#FFD0D0` | 浅色错误提示面、Tag、非按钮错误容器；不用于 Danger 按钮 |
| `--gray-200` | `#E1E1E1` | 分隔线、描边 |
| `--gray-300` | `#D9D9D9` | inactive 描边、占位（已极少使用） |
| 次要文字 | `rgba(17,17,17,0.6)` | secondary text |
| 通用描边 | `rgba(17,17,17,0.05)` | **所有静态描边统一 5%**：卡片、输入框、按钮 secondary、chip、tab toggle、分隔线 |
| Hover 加深描边 | `rgba(17,17,17,0.18)` | 仅在 hover/focus 等交互态使用 |
| 选中态描边 | `#111111` | 仅在元素被选中时使用（checkbox、selected list row、active chip） |

### 2.3 配色铁律
1. 80% 表面是 **`#FAFAFA`**（页面主底）或 `#FFFFFF`（卡片 / Header / Sidebar）
2. **模块主色（lime / yellow）只出现在**：主按钮、active sidebar、关键徽章、score 区、progress
3. orange 只做通知 / 异常 / 数字徽章
4. green 只做成功 dot 与"已连接"指示
5. **不使用渐变背景**（chart 内部 fill 渐变除外）
6. **同一屏内 lime 和 yellow 不并列出现**（切换模块时整页只用一种主色，避免色彩混乱）
7. 共享元素（如通知图标、头像）在两个模块下颜色完全一致

---

## 3. Typography

> **dApp 字体规则**
> - **Karla**（Regular / Medium / Bold / SemiBold）— dApp 100% 场景：正文 / UI / 表格 / 表单 / 按钮 / nav / 标签 / **页面一级标题** / **弹窗标题** / **版本号 / 分数 / delta 等数字内容**
> - **Gotu** — 仅用于官网（Homepage），dApp 不加载、不使用
> - **Digital Numbers** — **仅 Score 仪表盘中心数据**（如 Analysis Overview 中的 "45.0"）
> - **JetBrains Mono** — **仅键盘按键提示（`<kbd>`）与代码块（`<code>`/`<pre>`）**；数据表数字列、版本号、分数都改用 Karla，避免数字与正文割裂

### 字体职责口诀
```
页面一级标题    → Karla SemiBold 600（"Account Profile" / 页面顶部标题）
弹窗标题        → Karla SemiBold 600（"Create Post" / "Edit Time Slots" / "Add Channel"）
其他所有文本     → Karla            （body / button / nav / table / form / tag）
Score 仪表盘数字   → Digital Numbers （仅中心数字）
```

### 字体加载
```css
@font-face {
  font-family: 'Karla';
  src: url('/fonts/Karla-VariableFont_wght.ttf') format('truetype');
  font-weight: 100 900;
  font-display: swap;
}
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
/* Digital Numbers — self-host 或 CDN */
@import url('https://fonts.cdnfonts.com/css/digital-numbers');

body              { font-family: 'Karla', sans-serif; }
.page-title       { font-family: 'Karla', sans-serif; font-weight: 600; }
.dialog-title     { font-family: 'Karla', sans-serif; font-weight: 600; }
.gauge-digit      { font-family: 'Digital Numbers', monospace; }
.mono             { font-family: 'JetBrains Mono', monospace; }
```

### 尺寸阶梯（figma 实测）

```
Page Title (Karla SemiBold):    Karla 20px / 600 / lh 24px / #111
                                  → "Account Profile" / 页面顶部一级标题
Dialog Title (Karla SemiBold):  Karla 20px / 600 / lh 30px / #111
                                  → "Create Post" / "Edit Time Slots" / "Add Channel"

Section Title:                  Karla 18–20px / 600 / lh 1.4
Card Title:                     Karla 16px / 500–600 / lh 1.5
Body / Table cell:              Karla 14px / 400 / lh 1.57    ← 默认
Secondary / Label:              Karla 13px / 400 / lh 1.5 / rgba(17,17,17,.6)
Caption / Helper:               Karla 12px / 400 / lh 1.5
Micro / Tag:                    Karla 10–11px / 500 / lh 1.4

Stat Number (Dashboard):        Karla 32–48px / 600 / lh 1.0
Stat unit / delta:              Karla 12px / 500

Score Gauge 数字（仅 Analysis）: Digital Numbers 64–80px / #111
Score Gauge unit:               Karla 14–16px / 500

Nav item / Sidebar:             Karla 14px / 400（active 500）
Button (大):                    Karla 20px / 500（如 URL Input 内 Analysis 按钮）
Button (中):                    Karla 14px / 500
Button (小):                    Karla 12px / 500
```

figma 实测字频 — Karla 字号使用分布：14px×229、12px×195、16px×111、13px×47、10px×33、18px×8。**14px 是绝对主力**。

### 字重使用
- 400 → 默认正文、表格内容
- 500 → 按钮、活跃 nav、强调标签、数字
- 600 → 卡片标题、section 标题
- 700 → 极少数大数字 / 表头（可选）

---

## 4. Layout

### 框架
```
┌────────────────────────────────────────────────────────────────┐
│ AppHeader  70px                                                │ ← fixed
├──────┬─────────────────────────────────────────────────────────┤
│      │                                                         │
│ Side │   Main Content Area                                     │
│ 224  │   padding: 24px 32px                                    │
│ px   │   background: #FAFAFA                                   │
│      │                                                         │
└──────┴─────────────────────────────────────────────────────────┘
```

| 区域 | 尺寸 |
|---|---|
| Header 高度 | **70px** |
| Sidebar 宽度 | **224px**（v5 由 211 调整） |
| 主内容内边距 | 24–32px |
| 卡片间距（gap） | 8 / 12 / 16 / 24 / 32 / 48px（8px scale） |
| Modal 默认宽 | 480 / 640 / 880 / 1080px（按内容深度） |

### Spacing Scale
`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px` — 一律以 8px 为基础。

---

## 5. Borders, Radii, Shadows

> 与官网最大的视觉差异：**dApp 不使用 1.5px 黑色硬边框**，改用极淡的灰色描边和柔和阴影。

| 元素 | 规则 |
|---|---|
| 全站默认描边 | **`1px solid rgba(17,17,17,0.05)`**（卡片 / 输入框 / 按钮 secondary / chip / tab toggle / 分隔线，一律 5%） |
| Hover 描边加深 | `rgba(17,17,17,0.18)`（hover 反馈才使用） |
| Selected / active 描边 | `1px solid #111111`（仅选中态：checkbox 选中、list row 选中、chip 选中） |
| Checkbox 默认描边 | **`1.5px solid #111`**（始终全黑实线，比一般描边更重以保持可点击感） |
| 分隔线（card 内部 / list） | `1px dashed rgba(17,17,17,0.05)` 或 `1px solid rgba(17,17,17,0.05)` |
| Dropdown 描边 | `1px solid #000` + shadow（独立规则，强调浮层） |
| Modal 容器描边 | `1px solid rgba(17,17,17,0.15)`（仅最外层 modal 容器允许 15% 加重） |
| 数据列分隔（table） | `1px solid #F0F0F0` 可保留作为视觉断点 |

### Radius
```
Pill / Avatar / Connect badge:  9999px (full)
Button / Nav item / Tag:        8px
Input / Select / Checkbox:      6–8px
Card:                           12px
Large card / Modal:             16–20px
Logo mark:                      320px 320px 0 0
```

### Shadow
```css
--shadow-card:     0 1px 3px rgba(0,0,0,0.06);                                    /* 默认卡片 */
--shadow-dropdown: 0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10);
--shadow-modal:    0 8px 8px rgba(0,0,0,0.04), 0 20px 24px rgba(0,0,0,0.10);
```

---

## 6. Components

### 6.1 AppHeader （以 figma `Header2` 组件为准）
- 高度 70px，白底 `#FFFFFF`，padding `14px 24px`
- 左：Logo mark（拱形 25×26，拱顶圆角 `320px 320px 0 0`，实色 `#CFFF29` lime）+ "aisee" wordmark
  - Wordmark 由 5 个 SVG 字形拼接而成（不是字体 render）、纯黑色 `#111`、总宽 80.78px
- 中：nav items（Karla 14px），活跃项底色 `var(--module-primary)`，圆角 8px，padding `6px 14px`
- 右侧操作区，依次：
  - 通知图标（32×32，底色 `#FFFADD`，右上角 orange 数字徽章）
  - **主 CTA 按钮**（随模块切换）：底色 `var(--module-primary)`，圆角 10px，高度 32，icon + 文字，Karla 14px / 500
    - Analysis 模块：`+ New Analysis`（lime 底）
    - Post Agent 模块：`+ New`（yellow 底）
  - 头像：32×32 圆，灰底 `#E1E1E1`

### 6.2 Sidebar (224px)
> **⚠️以最新产品截图为准，figma 中 `SidebarAccount` 是旧版**。结构：

- 顶部 **Tab Toggle**（Analysis / Post Agent / Engage，v5 起 3 项平级）
  - 横向排布，gap 4，外层容器底 `rgba(17,17,17,0.02)`，圆角 8
  - **⚠️ 全站描边铁律**：所有静态描边一律 `rgba(17,17,17,0.05)`（5% 透明黑）——Tab Toggle 的 active tab、卡片、输入框、chip、Banner 等全部用同一值，不要派生其他灰阶
  - **active 项**：**显示 icon + 文字**，白底 `#FFFFFF`，描边 `1px solid rgba(17,17,17,0.05)`，文字 `#111` / Karla 14 / 500，icon `#111` 100% 不透明，padding `6px 12px`
  - **inactive 两项**：**只显示 icon**（隐藏文字），透明底，无描边，icon `rgba(17,17,17,0.5)`（50% 黑），hover 时 icon 变 `#111`（100%）；padding `6px 10px`
  - 切 tab 时主色随之切换：Analysis → lime，Post Agent → yellow，Engage → yellow（沿用 Post Agent 色系）
- **主 CTA**（仅 Analysis 模块出现在 sidebar 顶部）：`+ New Analysis` 大按钮，全宽，底 lime `#CFFF29`，Karla 14 / 500
  - Post Agent 模块下，该按钮移到 Header 右侧（"+ New" yellow）
- **Nav Items / 项目列表**（Analysis 下）：
  - 项目名 + 右侧 chevron，可展开查看该项目的历史 Report
  - 项目名左侧是平台 favicon（16×16 圆形）
  - 活跃项目底色 = `var(--module-primary)`，Analysis 下为 lime
  - hover 底色 `rgba(17,17,17,0.05)`
  - Karla 14px / 400（active 500）
- 底部 Profile Card：
  - 圆角 8 ，底 `#FAFAFA`，1px 极淡描边
  - 头像 + 邮箱 + 计划名（Karla 11–12px）
  - 内部分隔 `1px dashed #E5E6EC`
  - Credits 行 + progress bar（高度 6px，圆角 4px，底 `rgba(17,17,17,0.05)`，填充 `var(--module-primary)` — sidebar 位于 profile 区，不随模块切换，默认 lime）

**Engage 顶部 Tab Toggle**（跨 Analysis / Post Agent / Engage 三 tab 平级切换）：
- 容器：宽 208，高 34，底 `rgba(17,17,17,0.02)`，圆角 8，padding 3
- **inactive 项**：宽 59，高 20，**只显 icon**（icon `rgba(17,17,17,0.5)` 50% 黑、hover 变 `#111` 100%）
- **active 项**：宽 82，高 28，icon + 文字，底 `#FFFFFF`，
  **双层阴影 / 描边：`inset 0 0 0 1px rgba(17,17,17,0.05), 0 1px 2px 0 rgba(0,0,0,0.12)`**（v5 补充，原文仅写 inset border 未写外部 drop shadow）。文字 Karla 500 / 14 / `#111`
- 切 tab 时主色同步切换：Analysis → lime，Post Agent → yellow，Engage → yellow（沿用 Post Agent）



### 6.3 Stat Card（Dashboard 顶部）
- 白底，圆角 12，padding 20–24，无描边或极淡描边
- 上：label（Karla 13 / 500 / rgba(17,17,17,.6)）
- 中：大数字（Karla 32–48 / 600 / `#111`）+ unit（Karla 14 / 500）
- 下：delta（"+12.4% vs last week"，绿色 `#A5D500` 上升，orange `#EC5212` 下降）

### 6.4 Buttons

**Primary（模块色）** — 主操作，如 "Compare"、"Confirm"、"+ New Analysis"、"+ New"
- 底 `var(--module-primary)`，文字 `#111`，Karla 14 / 500，圆角 8，padding `8px 16px`
  - Analysis 模块自动 = `#CFFF29` lime
  - Post Agent 模块自动 = `#FFE253` yellow
- Hover：底变 `var(--module-primary-hover)`
- Disabled：opacity 0.5
- **唯一例外**：危险操作（Delete / Disconnect / Discard Changes）使用 Danger 按钮，与模块色无关

**Secondary** — "Cancel" / 次要操作
- 白底，描边 `1px solid rgba(17,17,17,0.05)`，文字 `#111`
- Hover：底 `rgba(17,17,17,0.04)`，描边加深至 `rgba(17,17,17,0.18)`
- **Modal 内例外**：弹窗底部灰色次按钮不使用本节的全局 5% 描边，必须遵守 §6.9 的 Modal Footer Button 规范：`#111111 / 6%` 描边 + `#111111 / 2%` 灰底

**Ghost / Tertiary**
- 透明底，无描边，仅 hover 底 `rgba(17,17,17,0.05)`
- 用于工具栏图标按钮

**Danger**
- 以 Figma [`button大小`](https://www.figma.com/design/tv7gTsQn6OipGVwHG8z0mX/aisee?node-id=9905-214773) 为准：底 `#EC5212`，文字 `#FFFFFF`
- 在共享按钮组中与 Primary / Secondary / Ghost 统一为 Karla Medium 14px / 500 / line-height 18px；padding `8px 16px`；高度 36；圆角 8；无描边
- 用于 Delete / Disconnect / Discard Changes 等不可逆或高风险操作。`#FFD0D0` 仅保留给错误提示面、危险 Tag 等浅色容器

### 6.5 Inputs / Toggle / Checkbox
- Input：高度 36，圆角 8，默认描边 `1px solid rgba(17,17,17,0.05)`
- **Input hover / focus（compound 双描边）**：内层描边切换为 `1px solid #111`，外层增加 `2px solid var(--module-primary)` 的模块色环；圆角保持 8px，不使用浏览器默认 outline。实现可使用 `box-shadow: 0 0 0 2px var(--module-primary)`，效果必须等价于 Figma [`Input hover`](https://www.figma.com/design/tv7gTsQn6OipGVwHG8z0mX/aisee?node-id=9420-448029)
  - Analysis：外环 `#CFFF29`
  - Post Agent / Engage：外环 `#FFE253`
- Error 优先级高于 hover / focus：保留 orange 错误描边并移除模块色外环；Disabled 不响应 hover
- Select / Dropdown trigger：同 Input 样式 + 右侧 caret 图标
- **Checkbox**：18×18，圆角 4，**未选描边 `1.5px solid #111`**（全黑实线，保持可点击感），选中底 `var(--module-primary)` + 黑色 ✓
  - **Hover 反馈**：鼠标移到承载该 checkbox 的整行（如 list row / table row）时，checkbox 底色变 `var(--module-primary)`（lime / yellow 提示即将选中）；离开恢复
- **Toggle（唯一标准组件）**：使用 Figma [`toggle`](https://www.figma.com/design/tv7gTsQn6OipGVwHG8z0mX/aisee?node-id=9708-259524)；Component Set Key `f66aa1aef1a16c844d6e08326831f72c3af7d400`
  - 尺寸 **24×16**；圆角约 12.7（视觉上为 full radius）；四边 padding 3px
  - thumb：**10×10**，`#111`；track：`1px solid #111`
  - Variant：`Property 1 = off | on`，默认 `off`
  - off：`rgba(17,17,17,0.04)`；on：`var(--module-primary)`（Analysis = lime，Post Agent / Engage = yellow）
  - 必须按节点 ID / Component Key 复用并保留实例变量绑定；禁止仅凭名称搜索同名 Toggle、禁止手工重画

### 6.6 Dropdown
- Trigger 高度 36，白底，默认描边 `1px solid rgba(17,17,17,0.05)`，圆角 8，padding `8px 12px`，右侧 16×16 caret；hover / focus / 展开态沿用 Input 的黑色内边 + 2px 模块色外环
- 展开层白底，描边 `1px solid #000`，圆角 8，padding 8，与 trigger 保持 **8px** 可见间距；不得覆盖 trigger
- `box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1)`
- item 高度 32–36，padding `6px 12px`，圆角 6；**hover / focus / selected 均使用 `rgba(17,17,17,0.05)`**；selected 另显示 check 并可使用 500 字重，不使用 lime / yellow 模块色
- 展开时 caret 旋转 180°；菜单 `opacity 0 → 1` + `translateY(-4px) → 0`，150ms
- 语义使用 button trigger + `role="listbox"` / `role="option"`，支持 Enter、Space、↑、↓、Home、End 与 Escape

### 6.7 Tabs（页面级）
- 横向 tabs：每个 tab padding `8px 0`，下方 active indicator 为 `2px solid #111`
- 文字：Karla 14 / 500，inactive 颜色 `rgba(17,17,17,0.6)`，active `#111`

### 6.8 Cards（信息卡）
- 白底，圆角 12，无阴影或仅 `--shadow-card`
- padding 16–24，title 上、内容下
- 标题 Karla 16 / 600，body Karla 14 / 400

### 6.9 Modal / Dialog
> **对照 figma `popup-create-post` / `popup-Edit-Time-Slots` / `popup-add-channel` 实测，结合 Comparison Modal 实战修订**。

- **容器**：
  - 宽度：按内容深度 `480 / 640 / 880 / 1080 / 1394px`（多数业务弹窗 880–1080 即可；Create Post 这类表单+预览并列才需要 1394px 超宽）
  - **圆角 16**
  - 描边 **`1px solid rgba(17,17,17,0.15)`**
  - 阴影：`box-shadow: 0px 8px 8px rgba(0,0,0,0.04), 0px 20px 24px rgba(0,0,0,0.1)`
  - 背景 `#FFFFFF`
  - **内边距（默认硬规则）**：`24px`（上 / 右 / 下 / 左全部为 24px）。除非对应 Figma 节点有明确覆盖，不得拆成不同方向值，也不得改由内部容器补齐左右间距
- **蒙层**：`rgba(17,17,17,0.4)`，可加 `backdrop-filter: blur(2–4px)`
- **标题（Karla SemiBold 20px / 600 / lh 30px / #111）**：靠左对齐，例：“Create Post” / “Add Channel” / “Edit Time Slots” / “Compare versions”
  ```css
  .dialog-title {
    font-family: 'Karla', sans-serif;
    font-weight: 600;
    font-size: 20px;
    line-height: 30px;
    color: #111;
  }
  ```
- **描述文字**：Karla 12px / 400 / line-height 18px / `rgba(17,17,17,0.6)`；用于标题下方的说明、约束或辅助文案
- **标题区结构与间距**：
  - 标题与描述必须放在同一个 header group 中，垂直排列
  - 标题与描述之间的间距固定为 `0px`，不额外添加 margin 或 gap；通过各自的 line-height 建立垂直节奏
  - 标题区与整个内容区域之间的间距仅允许使用 `12px` 或 `16px`：紧凑型弹窗、高密度表单或内容连续时使用 `12px`；标准弹窗、多区块内容或首个内容卡片需要视觉分隔时使用 `16px`
  - 同一弹窗确定一种间距后必须全程保持一致，不得混用 `12px` 与 `16px`
  - 没有描述文字时，标题仍保持 30px 行高，标题区与内容区继续遵守 `12px / 16px` 规则
  ```css
  .dialog {
    padding: 24px;
  }
  .dialog-header {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .dialog-description {
    font-family: 'Karla', sans-serif;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: rgba(17, 17, 17, 0.6);
  }
  .dialog-content {
    margin-top: var(--dialog-header-content-gap, 16px);
  }
  .dialog--compact {
    --dialog-header-content-gap: 12px;
  }
  ```
- 标题右侧可选辅助标签（Tag pill，如 "Tags ∨"、项目 chip）：Karla Medium 13–14px / `1px solid rgba(17,17,17,0.05)` / radius 999 或 8
- **右上角操作区**：**只放关闭 X 按钮**（30×30，内含 lucide-x 24×24、`#111`，hover 底 `rgba(17,17,17,0.05)`）。
  - 不在右上角放 Export / Upload / Share 等次要操作——这类按钮迁移到**底部操作区**或卡片内 inline，避免与 Close 混淆
- **底部操作区 / Modal Footer Button（默认硬规则）**：以 Figma [`按钮`](https://www.figma.com/design/tv7gTsQn6OipGVwHG8z0mX/aisee?node-id=9872-287453) 为唯一参考；之后所有弹窗内部底部按钮均按此规则实现
  - 操作区顶部必须有 **1px 顶边分割线**：`#111111`、opacity `6%`，即 `rgba(17,17,17,0.06)`；只显示上边，不显示左右和底边
  - 分割线横跨弹窗内容宽度；按钮区域顶部 padding `14px`、左右 padding `24px`，按钮右对齐，按钮间距 `12px`
  - **灰色次按钮**（Cancel / Reset / Back 等）：高度 `40px`，padding `8px 12px`，圆角 `8px`；底色 `rgba(17,17,17,0.02)`；必须增加 **1px 描边**，描边为 `rgba(17,17,17,0.06)`；文字 Karla 14px / 500 / line-height 24px / `#111`
  - **主按钮**：高度 `40px`，padding `8px 16px`，圆角 `8px`；文字 Karla 14px / 500 / line-height 24px。背景和文字颜色继续按具体弹窗主操作语义使用（Figma 示例为 `#111` 底 + 白字；模块主色 CTA 仍可使用 `var(--module-primary)`）
  - 次要工具按钮（Reset / Export 等）放在左侧或与 Cancel 并列；右侧维持 Cancel + 主按钮的操作层级
  - **优先级**：本规则覆盖 §6.4 Secondary 和全局 5% 静态描边规则，仅作用于弹窗底部操作区，不改变页面内普通按钮
  ```css
  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    margin-inline: -24px; /* 让分割线横跨弹窗内容宽度 */
    padding: 14px 24px 0;
    border-top: 1px solid rgba(17, 17, 17, 0.06);
  }
  .dialog-footer .button--secondary {
    min-height: 40px;
    padding: 8px 12px;
    border: 1px solid rgba(17, 17, 17, 0.06);
    border-radius: 8px;
    background: rgba(17, 17, 17, 0.02);
    color: #111;
    font: 500 14px/24px 'Karla', sans-serif;
  }
  .dialog-footer .button--primary {
    min-height: 40px;
    padding: 8px 16px;
    border-radius: 8px;
    font: 500 14px/24px 'Karla', sans-serif;
  }
  ```
- **内嵌错误 Tooltip**（按钮上方挑出提示）：黑底 `#111` + Karla 14 白字 + 圆角 8 + `box-shadow: 0px 10px 12px rgba(0,0,0,0.12)`，详见 6.17

> **标题字体规则**：Figma 中页面一级标题与弹窗标题全部使用 Karla；弹窗标题统一 Karla SemiBold 20px / weight 600（不是 Gotu、也不是 Bold 700），参见 6.15。

#### 6.9.1 二次确认弹窗 / Confirmation Dialog
> 适用于关闭未保存内容、删除、断开连接等需要用户再次确认的高风险操作。唯一参考为 Figma [`关掉弹窗时提示用户`](https://www.figma.com/design/tv7gTsQn6OipGVwHG8z0mX/aisee?node-id=9905-214758)。它是独立模式，不得用带输入框的标准表单弹窗代替。

- 容器：宽 512px，白底，`1px solid rgba(17,17,17,0.15)`，圆角 16；阴影 `0 20px 12px rgba(0,0,0,0.10), 0 8px 4px rgba(0,0,0,0.04)`
- 标题区：上、左右 padding 24px；标题 Karla SemiBold 20px / 600 / line-height 30px
- 关闭按钮：右上 30×30、圆角 8，使用官方 `dialog-close.svg`；图形 13.5×13.5，stroke 1.5 / `#111`
- 正文：与标题垂直间距 24px，左右 padding 24px；Karla Regular 16px / line-height 24px / `#111`
- 操作区：与正文保持 24px 模块间距，按钮区上下 20px、左右 24px；两个按钮等宽，gap 12px
- Keep Editing：高度 44px，底 `rgba(17,17,17,0.02)`，无描边，Karla Medium 16px / 24px
- Discard Changes：高度 44px，底 `#EC5212`、白字，Karla Medium 16px / 24px；继承 Danger 语义
- 行为：点击 Keep Editing、右上关闭或 Esc 均回到编辑；只有点击 Discard Changes 才执行不可逆操作。标题需用 `aria-labelledby`，正文需用 `aria-describedby`

### 6.10 Tag / Badge / Chip
- 圆角 999，padding `2px 8px`，Karla 11–12 / 500
- 状态色：
  - **"Latest" → 底 `var(--module-primary)`**（Analysis 下 lime，Post Agent 下 yellow），文字 `#111`
  - "Baseline" → 底 `#111`，文字 `#fff`
  - "Target" → 底 module-primary-bg 弱化，文字 `#111`
  - 通用次要 → 底 `rgba(17,17,17,0.05)`，文字 rgba(17,17,17,.6)
  - 顶部页面级 tag（"Channels 46 unlinked"、"Past Reports"）→ 底 `var(--module-primary-pale)`
- 状态 dot：8×8 圆，绿/橙/灰，用于通道连接 / Post 状态

#### 可操作 Chip（Comparing chips / action chip）
用于 Comparison Modal 顶部 "Comparing" 区域，或任何需要 "取消选择 + 改变角色" 的位置：

- **结构**：`版本名 + 角色 pill（Baseline / Target / Latest）+ × 删除按钮`
- **描边**：基础 `1px solid rgba(17,17,17,0.05)`；Baseline 强调用 `1px solid #111`
- **交互**：
  - **非 Baseline chip 可点击 → "Set as baseline"**：hover 显示黑底 tooltip "Set as baseline"（Karla 13 / 500 / 白字，translateY(4→0) + opacity 0→1，120ms），点击该 chip 把它升级为新的 baseline
  - hover 描边加深至 `#111`
  - × 删除按钮独立，stopPropagation，与 chip click 不冲突
- **多 chip 排版**：横向 flex + gap 8px，前方加 `Comparing` 标签（Karla 11 / 600 / uppercase / muted）

### 6.11 Chart / Data Viz
- **折线图**：stroke 2px `var(--module-primary)` + 下方 module-primary → 透明 fill 渐变（仅图表内允许渐变）
- **柱状 / 进度条**：高度 6–8px，圆角 4，底 `rgba(17,17,17,0.05)`，填充 `var(--module-primary)`；多平台 / 多版本对比使用同色 opacity 区分（v1.0 0.3 → v4.0 1.0）
- **Score 仪表盘**（Analysis 独有）：大型环形 / 弧形 gauge，底色 `#CFFF29` lime 实块，中心大数字（如 "45.0"，Karla 加粗 64–80px），背景叠加放射线装饰。Post Agent 模块下不使用 Score 组件。
- 坐标轴：浅灰 `#E1E1E1`，标签 Karla 11 / rgba(17,17,17,.5)
- 数据点 hover：`var(--module-primary)` 圆点 + 黑色 tooltip（Karla 12 / 白字，圆角 6）

### 6.12 Table
- 行高 44–48px，每行底部 `1px solid #F0F0F0`
- 表头：Karla 12 / 500 / rgba(17,17,17,.6) / UPPERCASE letter-spacing 0.06em
- 数据：Karla 14
- hover 行底：`rgba(17,17,17,0.02)`
- 数字列可使用 JetBrains Mono 12–13 等宽

### 6.13 Post Editor（创建 / 编辑帖子）
- 容器底色 `#F7F6E9`（cream），圆角 12
- 文本域 Karla 14 / 1.6
- 字符计数器右下 Karla 12，rgba(17,17,17,.6)，>0 时绿色，<0 时 orange
- 平台 chips 横排，每个 chip 圆角 999 + 平台 icon + 名称

### 6.14 Iconography
- AISEE 自有 icon 统一来自 **StemUI**：源文件与 React 组件维护在 [`qi15582378779/stemui`](https://github.com/qi15582378779/stemui)，产品端通过 npm README 页面安装与查看版本说明：[`@stemui/icons`](https://www.npmjs.com/package/@stemui/icons?activeTab=readme)
- 设计系统不复制整套 SVG；StemUI 是唯一资源源。Lucide 仅在 StemUI 暂无对应图标时作为补充，补充图标仍遵守 1.5px stroke、rounded linecap，并应评估后续纳入 StemUI
- UI 尺寸：16×16（标准）/ 20×20（按钮内）/ 24×24（nav）
- 颜色：`#111` 默认；在 lime / yellow 底上保持 `#111`；在黑底用 `#fff`
- 自有图标采用 `line_*` 描边、`fill_*` / `flat_*` 填充命名家族，保持同一视觉权重；产品代码使用生成后的 typed React icon component

### 6.15 Page Title（Karla）
> 顶部页面 / 分区一级标题统一使用 Karla SemiBold，与 dApp 单字体系统保持一致。

```css
.page-title {
  font-family: 'Karla', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #111;
}
```
- 出现位置：Account Profile 页面顶部标题、Billing / Plan 等设置页一级 header
- **不**出现位置：Modal 标题、Section 标题、Card 标题（这些都用 Karla）

### 6.16 URL Input（Analysis 输入框 / Search 输入）
> 来自 figma `dapp-component` —— Analysis 创建流程中输入网址的核心控件。

- **\:default 态**
  - 宽 466，高 72
  - 白底，**`1.5px solid #111`** 描边
  - **圆角 16**
  - padding `12px 16px`
  - 内嵌右侧主按钮（详见下）
- **占位符**：`Karla 20px / 400 / rgba(17,17,17,0.32)`，文案 "Enter the website url"
- **内嵌按钮**：48×103，圆角 8，底色 `var(--module-primary)`（Analysis 下是 lime），文字 "Analysis" Karla 20 / 500 / #111
- **\:focus / active 态（compound 双环）**
  - 外层包一层 wrapper，`3px solid var(--module-primary)`（lime 外环）+ `border-radius: 16`
  - 内层保留 `1.5px solid #111` 黑色内边
  - 两层错位形成 lime 高亮指示，无需 outline
- **辅助 chip**："Input More" 圆角 16，`rgba(17,17,17,0.02)` 默认 / `rgba(17,17,17,0.05)` active

### 6.17 Tooltip / Toast（黑底白字）
- 黑底 `#111`，圆角 8，padding `8px 12px`
- 文本：**Karla 14px / 400 / `#FFFFFF` / line-height 20px**
- 阴影：`box-shadow: 0px 10px 12px rgba(0,0,0,0.12)`
- 出现位置：表单字段下方错误提示（"Please include at least some text or an attachment for Reddit"）、按钮 hover 提示、复制成功反馈
- 入场：从触发点上方 4px 弹出，`opacity 0→1 + translateY(4px→0)`，120ms ease-out

### 6.18 Score Gauge（**仅 Analysis**）
> 来自 figma + 截图——Analysis Overview 的核心数据视觉。

- **容器**：圆角 16 卡片，宽度 50%，高度约 350px
- **背景**：lime `#CFFF29` 实色铺底 + 顶层叠加放射状线条 / 太阳光线装饰
- **中心数字**：
  ```css
  .gauge-digit {
    font-family: 'Digital Numbers', monospace;
    font-size: 64–80px;
    color: #111;
  }
  ```
  示例显示 "45.0" 这种带小数点的数码管数字
- **环形 / 弧形 progress**：黑色 stroke 在 lime 底上做指针 / 弧形指示
- **标签**：左上角 "Score" Karla Bold 24px / #111
- **Post Agent 模块下不显示此组件**——直接换成 Dashboard StatCard 矩阵

---

## 7. States & Feedback

| 状态 | 表现 |
|---|---|
| Hover | 底色叠 `rgba(17,17,17,0.05)` 或 lime 加深 0.06 |
| Active / Pressed | 元素 `transform: scale(0.98)` + 底色再加深 0.02 |
| Focus | 普通控件使用 `outline: 2px solid #111` + offset 2；Input 使用 `1px #111` 内描边 + `2px var(--module-primary)` 外环 |
| Disabled | `opacity: 0.5`，`cursor: not-allowed` |
| Loading | 骨架屏：`linear-gradient(90deg, #F0F0F0, #FAFAFA, #F0F0F0)` shimmer，1.4s loop |
| Selected (list / row) | 底 `var(--module-primary-bg)` + 左侧 2px `var(--module-primary)` 实线（可选）+ 1px 描边 `#111` |
| Empty | 居中插画占位 + Karla 14 / "Nothing here." rgba(17,17,17,.6) |
| Error | 文本 / icon orange `#EC5212`，输入框描边变 orange，错误提示底 `#FFD0D0` |

---

## 8. Motion / Interaction（dApp 范围）

> dApp 的动画原则：**功能服务于反馈**，不喧宾夺主，全部短促（≤300ms）。
> **官网的入场动画、cursor 跟随、word-by-word reveal、几何漂浮、marquee 全部不出现在 dApp**。

### 全局缓动
```css
--ease: cubic-bezier(0.2, 0.8, 0.2, 1);
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
```

### 通用过渡
- 所有 hover / active / focus：`transition: background .15s, color .15s, border-color .15s, transform .15s var(--ease)`
- 切勿使用 `transition: all`

### Modal 入场 / 退场
- 蒙层 fade 0.2s
- 容器：`opacity 0 → 1` + `transform: translateY(8px) scale(0.98) → 0` 0.25s `--ease-out`
- 关闭：反向 0.18s

### Dropdown / Menu
- `opacity 0 → 1` + `transform: translateY(-4px) → 0` 0.15s
- 关闭立即 hide 或 0.12s fade

### Tab 切换
- Indicator 横条（`2px solid #111`）用 `transform: translateX` 滑动到新 tab 下方，0.25s `--ease`
- 旧内容 `opacity 1 → 0`（80ms），新内容 `opacity 0 → 1`（120ms）

### Sidebar Item Hover / Active
- 底色过渡 0.15s
- Active 切换瞬时（无动画），仅 hover 有过渡

### 数字 / 进度 变化
- 进度条宽度变化：`width` transition 0.4s `--ease-out`
- Dashboard 数字：进入视口时一次 count-up（800–1200ms ease-out），刷新数据后不再播放

### Chart 入场
- 折线：path `stroke-dasharray` + `stroke-dashoffset` 从满偏移 → 0，0.8–1.2s ease-out
- 柱状 / progress：从 0 宽度增长到目标值
- 仅页面首次加载或数据切换时触发；hover 时无动画

### Toast / Notification
- 从右上角滑入：`translateX(20px) → 0` + fade，0.25s
- 自动 3.5s 后消失，反向滑出

### Page / Route 切换
- 主内容容器 `opacity 0 → 1`（150ms），无位移
- 不做整页过渡蒙层

### 禁止行为
- ❌ mix-blend-mode cursor
- ❌ 文字逐字 reveal
- ❌ 任何无限循环的漂浮 / 旋转 / scale 动画（loading spinner 除外）
- ❌ Hero-style 多元素错峰大入场
- ❌ 大幅度的 `scale` 变化（>0.1）

---

## 9. 内容 & Tone（dApp）

- 标签短而准：`Dashboard`, `Calendar`, `Channels`, `Post Agent`, `Models`, `Media`
- 数字原样：`1825 Credits`、`280`（字符计数）
- 占位符：`Start writing your post...`、`Nothing here.`
- 错误：直接说明 + 给操作建议，例 `Your post should have at least one character or one image.`
- 禁止表情符号；禁止感叹号
- 弹窗主标题（Karla SemiBold）使用句首大写 + 句号可省略：`Pick versions to compare`、`Report comparison`、`Connect a new channel`

---

## 10. 资源 & Assets

| 路径 | 说明 |
|---|---|
| `/fonts/Karla-VariableFont_wght.ttf` | 主字体（本地） |
| Gotu | 仅官网（Homepage）使用；dApp 不加载 |
| JetBrains Mono | Google Fonts，可选数字列 |
| Logo mark / wordmark | 与官网共用 |
| StemUI GitHub | 图标 SVG、生成代码与预览的唯一资源源：`qi15582378779/stemui` |
| `@stemui/icons` | 产品代码的 npm 使用入口 |
| Lucide | StemUI 暂无对应图标时的补充，不作为 AISEE 自有图标的第二资源源 |
| 自有图标 | `line_*` / `fill_*` / `flat_*`，用于 Sidebar、Analysis、Growth、Engage、Post 等模块 |

---

## 11. Do / Don't

| Do ✅ | Don't ❌ |
|---|---|
| dApp 全站统一 Karla，包括页面一级标题与弹窗标题 | 在 dApp 任意位置加载或使用 Gotu |
| 弹窗标题统一 Karla 600 / 20px / lh 30px | 弹窗标题用 Gotu / Bold 700 |
| Score 仪表盘中心数字用 Digital Numbers | 用 Karla / Gotu 仿照数码管样式 |
| **按模块切换主色**：Analysis = lime，Post Agent = yellow | 同一屏内同时出现 lime 和 yellow 主操作 |
| 主背景统一 `#FAFAFA`，卡片用 `#FFFFFF` | 主背景用任何 off-white 派生值 |
| 主操作按钮一律 `var(--module-primary)` | 在 Analysis 里出现 yellow 按钮 / Post Agent 里出现 lime 按钮 |
| 阴影柔和（card / dropdown / modal 三档） | 重度投影、玻璃拟态 |
| URL Input 使用 1.5px 黑描边 + lime 3px 外环 focus | 用默认 outline 做 focus |
| Tooltip / Toast 黑底白字 Karla 14 | tooltip 使用白底黑字 |
| 动画 ≤ 300ms，仅做反馈 | 入场大动画、循环漂浮、cursor 特效 |
| Lucide + 自有 icon 同尺寸 | 多套图标体系混用、emoji |
| Modal 关闭只用右上角 × + Esc | 弹窗多个关闭入口 |

---

---

## 13. Engage 模块详解（v5 落地版 · 新前端复刻基准）

> 范围：Post Agent zone 下的 Engage 二级模块。本节为**前端 + AI 复刻设计的工作蓝本**——所有数值、颜色、间距均与 `Engage (Aisee Repo).html` + `engage-aisee/*.jsx` 实现一致，与 figma "aisee - v5.3 post-agent-engage" frame 对照实测。
> 主色系：**Post Agent yellow `#FFE253`**（按钮、active、selected feed card outline、step badge）。
> 模块身份色：**lavender-pink `#F3E7F4`**（日常 Banner、仅 Engage 专用，不要与 Channel banner 的 `#FAE2FE` 混用）/ **lime `#F0FFBA`**（initial setup Banner，仅首跑出现一次）。

### 13.1 模块结构与导航

Engage **是 Sidebar 顶部 Tab Toggle 上与 Analysis / Post Agent 平级的独立 tab**（v5 调整，v4 曾错误地描述为 Post Agent 的二级模块）。选中 Engage 后 Sidebar 下方**纵向列出 4 个子页 Tab**：

| # | Tab 名 | 路由 | 默认落地 | 顶部 Banner 变体 |
|---|---|---|---|---|
| 1 | **Dashboard** | `/engage` | 首次进入有数据的工作区时 | lavender |
| 2 | **Signal Feed** | `/engage/signal` | 信号流（核心交互页） | lavender |
| 3 | **Keywords & Accounts** | `/engage/keywords` | 关键词 / 账号 / 子版块配置 | lavender |
| 4 | **Replies** | `/engage/replies` | 已发与待审回复（含 Sent / Awaiting review 子 tab） | lavender |

**Engage 子项渲染规则**（Sidebar Tab Toggle 选中 Engage 后才出现）：
- 项高 **30**（v5 从 36 收紧），padding `4px 8px`，圆角 8，icon 18×18 + 文字 Karla 14 / 400
- Active 项：底 `#FFE253`（yellow，不变浅、无描边，无阴影），icon + 文字保持 `#111`；非 active 文字 `#111` / 400（依赖文本本身颜色）
- 项右侧挂数字徽章（Replies 项上作历史提示）：圆角 12，高 16，min-w 29，padding `0 6px`，**底 `rgba(144,120,0,0.1)`**（深芙黄调透明，与 keyword pill `#8C7400` 同色系），**文字已从设计中拿掉**——徽章仅作为纯色点提示（v5 调整）

**首次进入 vs 已配置**：
- 未配置过 keywords/accounts/subs → 走 `<InitialConfig>` 路径（lime Banner + Keywords / Accounts / Subreddits 三卡 + 底部 "Start tracking posts" CTA）
- 已配置 → 落地到 Dashboard，4 个 Tab 全部可点

### 13.2 Engage Banner（横贯四个 Tab 顶部）

> 实现：`engage-banner.jsx → EngageBanner({ variant, title, subtitle, stats })`。在每个 Tab 内都渲染一次，宽度 = 内容区宽 - 48（左右各 24 内边距）。

> **设计系统预览页应用规则（2026-08-13）**：组件与规范预览页的顶部说明区也使用 AISEE Banner 语言，不使用通用后台模板式的大标题栏。标题为 Karla 20 / 600，副标题 12 / 400，左侧使用 44–48px 白色 icon 容器，外层圆角 16px，并保留白色 4–5px 呼吸环。Analysis 使用 `#F5FFD4`，Post Agent 使用 `#FFFADD`，Engage 使用其身份色 `#F3E7F4`；组件卡标题统一 Karla 14 / 600，避免 Ant Design 式偏大、偏粗的展示层级。

> **UI Kit 功能预览覆盖规则（2026-08-13）**：Web App UI Kit 不能只展示 Overview。当前侧边栏中的每个可到达功能都必须有可识别的近似页面预览，至少覆盖 Overview、Analysis、Growth、Improve Score、Build Brand Influence、Engage、Signal Feed、Keywords & Accounts、Replies、Post、Calendar、Channels、Media、Verify 与 Connection。预览无需逐像素复刻，但必须同步对应 Figma 设计区块的页面目的、主要信息结构、模块身份色和关键组件状态；不得使用空白页或通用占位卡代替。新增 Figma 功能时同步更新导航、页面注册表与自动覆盖测试。

> **PlanCard 当前版本规则（2026-08-13）**：现行套餐卡以 Figma `v5.4-upgrade plan-页面优化 / upgrade`（node `8253:116053`）为准。页面包含 Plans / Credits 标签、Monthly / Yearly（15% off）计费切换，以及 Starter、Developer、Pro 三张 24px 圆角白色卡片。权益必须按 Analysis、Engage、Post Agent、Support 分组，并保留 Current Plan、Upgrade Plan、黑色 Primary CTA 与 Full Engage 徽章等状态。当前实现位于 `src/components/PlanCard.tsx` 与 `components/PlanCardCurrent/`；旧 `components/PlanCard/` 继续作为 Legacy 保留，不覆盖、不删除。

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ▢   Engage                              New  Keywords  X acc  sub  Sent │
│     Monitor and reply to relevant…       2     5        3      2    5   │
└─────────────────────────────────────────────────────────────────────────┘
```

| Token | 值 | 备注 |
|---|---|---|
| 容器圆角 | **`14px`** | 比标准卡片大 2 |
| 容器高度 | **`76px`** | 固定，内容不超出 |
| 内边距 | `15px 22px` |  |
| Margin | `mx-6 mt-5` 即 `24px / 20px` | 与 PageTabs 紧邻 |
| **lavender-pink 变体底** | **`#F3E7F4`**（Engage 专用身份色） | Dashboard / Signal Feed / Keywords / Replies 默认；**不要误用 Channel banner 的 `#FAE2FE`** |
| **lime 变体底** | **`#F0FFBA`**（tailwind: `bg-green-f0ffba`） | 仅 `<InitialConfig>` 使用 |
| icon 容器 | 46×46，白底，圆角 10，`shadow: 0 1px 2px rgba(17,17,17,0.06)` | 内置 chat-bubble 28×28 黑色描边 |
| 标题 | Karla **Bold 20** / lh 24 / `#111` | 文案固定 "Engage" / "Engage — Initial Setup" |
| 副标题 | Karla 12.5 / lh 18 / `rgba(17,17,17,0.6)` | 例："Monitor and reply to relevant conversations across X and Reddit." |
| 右侧 stats 间距 | gap 26px | 多于 4 项时不允许换行（截断） |
| stat label | 10px / 500 / uppercase / letter-spacing 0.04em / `rgba(17,17,17,0.55)` | 例 NEW / KEYWORDS / X ACCOUNTS / SUBREDDIT / SENT |
| stat 数值 | Karla **Bold 19** / lh 22 / `#111` / tabular-nums | 不带千位逗号（除非 ≥4 位）|

**`stats` 数组**通常 3–5 项。Dashboard / Signal Feed / Keywords / Replies **共用同一组**：`[New, Keywords, X accounts, subreddit, Sent]`——切 Tab 时数值不变（数据来自全局 store），切 Tab 时 Banner **不重新挂载**。

### 13.3 Page Tabs（Banner 下的页面级 tabs）

> 实现：`signal-feed.jsx → PageTabs`. **Banner 下方的真实页面内导航**——Sidebar 是路由级，PageTabs 是 Tab 内分屏（如 Replies 内的 Sent / Awaiting review，Signal Feed 内的 All / X / Reddit）。

- 容器：横向 flex，gap 28（`gap-7`），padding `16px 32px 0`（`mt-4 px-8`），底部 `1px solid rgba(17,17,17,0.05)` 作为 baseline
- 每个 tab：`padding 12px 2px 14px`，inline-flex + gap 8
- 文字：Karla 14
  - **active**：`#111` / 600，下方 `2px` 黑色 indicator 实线（贴底，`rounded-t`，无动画位移——直接 swap）
  - **inactive**：`rgba(17,17,17,0.6)` / 500，hover → `#111`
- 数字徽章（可选，紧贴标题右侧）：
  - 圆角 999，高 18，min-w 18，padding `0 6px`
  - **active 状态**：底 `#111`，文字 `#FFE253`（黑底亮黄字，注意是反白）
  - **inactive 状态**：底 `rgba(17,17,17,0.06)`，文字 `rgba(17,17,17,0.6)`

### 13.4 Dashboard 页（Tab 1）

> 实现来源：figma "Dashboard-engage" frame（screenshot 1）。Engage 模块的数据综合页，给运营 / PM 看的"成绩单"。

**布局**：Banner → 主标题区 → 5 列 KPI strip → 2 列大图表 → 3 列下方组件。全页 padding `pt-2 px-8 pb-12`，纵向 gap 24。

#### 13.4.1 主标题区
- 单行：`"Engagement Performance"` Karla **Bold 18 / 600** + ⓘ info icon（12×12, `rgba(17,17,17,0.4)`，hover 显示 tooltip）
- 右上角：平台过滤胶囊组 `X | Reddit`
  - 每个 chip 高 24，padding `2px 10px`，圆角 999，gap 6
  - **X chip**：黑底圆 + X 字形 logo + "X" 文字；激活时 `bg-yellow-ffe253` 底（图示），非激活 `bg-primary/[0.04]`
  - **Reddit chip**：`bg-red-ec5212` 底 + 白 r/ logo + "Reddit" 文字；激活同上
  - 多选模型（两个都可亮）

#### 13.4.2 KPI Strip（5 列横向）
**容器**：白底 `#FFFFFF`，圆角 14，padding `20px 24px`，内部 5 列等宽，**列间用 `1px solid rgba(17,17,17,0.05)` 竖分隔线**。

| 顺序 | label | 数值字号 | 单位字号 | 备注 |
|---|---|---|---|---|
| 1 | Replies | 28px / 700 | — | 普通整数 |
| 2 | Response rate | 28px / 700 | "%" 14 / 500 | 数值与 % 同色 #111 |
| 3 | Total impressions | 28px / 700 | "K" 12 / 500 | K 紧贴右下、轻微抬基线 |
| 4 | Traffic index | 28px / 700 + ⓘ | — | 数值后跟 info icon |
| 5 | Total likes | 28px / 700 | — | — |

- label 在数值下方：Karla 12 / 400 / `rgba(17,17,17,0.6)`
- 每列内：`flex flex-col gap-1`，**居左**对齐
- 数值用 tabular-nums，千位用半角逗号

#### 13.4.3 双图表（2 列等宽，gap 24）

**两张图共用的容器规格**：
- 圆角 16，padding `20px 24px`
- **底色 `#FBFBF3` cream**（不是白！这是 Dashboard 的标志性背景，与 KPI 白卡形成节奏）
- 描边：无 / `1px solid rgba(17,17,17,0.05)`
- 顶部一行：左边小 label + 大数字（label `Replies sent` / `Your Impressions`，数字 Karla **Bold 32** / `#111`）
- 右上角：平台筛选胶囊（X / Reddit，同 13.4.1）+ **`Monthly ▾`** 周期选择 dropdown（高 28，padding `4px 12px`，圆角 8，描边 `rgba(17,17,17,0.05)`）

**图 1 — `Replies sent` 柱状图**：
- 12 根柱（按日期），颜色 `#FFE253` 实色 yellow
- 柱宽 22，圆角顶部 4（底部直角），柱间 gap 计算到使整张图等距
- Y 轴标签 0 / 20 / 40 / 60 / 80 / 100 / 120 / 140（Karla 11 / `rgba(17,17,17,0.5)`，左对齐）
- Y 轴 grid line：`1px dashed rgba(17,17,17,0.05)`
- X 轴标签：日期 `3/12` `3/13` ... Karla 11 / `rgba(17,17,17,0.5)`
- hover 柱 → 整柱变深 yellow `#FCEB63`，弹出**白底 tooltip**：宽 132，padding `8px 10px`，圆角 8，描边 `rgba(17,17,17,0.05)`，shadow `0 8px 16px rgba(0,0,0,0.06)`
  - tooltip 内容：第一行日期（"Mar 17" Karla 11 / 600 / `rgba(17,17,17,0.6)`）；下两行 `X 100` / `Reddit 29`（带平台 icon，数字 tabular-nums Karla 12 / 600）
  - tooltip 上方延出一条 **dashed 1px** 黑色虚线到顶部，下方延伸到该柱柱顶

**图 2 — `Your Impressions` area chart**：
- **动位说明**（回答 "X / Reddit 指哪里"）：指这张 area chart 里的填充曲线本身。**figma 实测是单层渐变**（不是双 layer），该页上只有 X 一条曲线，需要在右上角胶囊切换才出现 Reddit；v5 中间版描述的 "双层 stroke + fill" 不准。
- **实测渐变公式**（X 曲线底下 fill）：`linear-gradient(181.918deg, rgb(255,216,95) -27.81%, rgba(255,216,95,0) 75.69%)` ——即 **`#FFD85F` gold**，**不是 `#FFE253`**
- 曲线 stroke：`#111` 2px（黑色）
- Reddit 曲线（切换后出现）：同样单层渐变，stroke `#8C7400` 2px + fill `linear-gradient(…deg, #8C7400 -27%, transparent 75%)`（与 donut 深芙末色同 token 复用）
- Y 轴标签 0 / 100K / 200K / 300K / 400K，Karla 11 / `rgba(17,17,17,0.5)`
- Y 轴 grid：`1px dashed rgba(17,17,17,0.12)`
- hover 显示圆点 + 白底 tooltip：圆点颜色对应平台（X 黑、Reddit 深芙），圆点 8px；tooltip 同图 1（"Mar 20" + 两行数据）

#### 13.4.4 下方三组件（3 列 grid，左→右）

**A. Engage traffic by platform（donut）**：
- 容器同图表（cream `#FBFBF3` + 圆角 16）
- 标题 `Engage traffic by platform` Karla 13 / 500
- 大数字 `51` Karla **Bold 32** + 下方 chart
- Donut：外径 ~160，环宽 28，二色分段：**主色 yellow `#FFE253`**（占大）+ **次色 `#8C7400` 深芙末**（v5 修订：原写 `#FCC4A0`、figma 实测是与 keyword pill / Reddit area chart 复用的 `#8C7400`）
- 下方两行 legend：每行 = icon + 平台名 + 横向 progress bar + 数值
  - bar 高 6，圆角 4，底 `rgba(17,17,17,0.08)`，填充 yellow / orange 实色
  - 数值右对齐 Karla 14 / 600

**B. Top engage sources（list）**：
- 容器同 A
- 标题 `Top engage sources` Karla 13 / 500 + 大数字 `22` + 下方 "Likes" 小标 11 / 400 / muted
- 右上角 平台 dropdown `X ▾`（高 28）
- 列表：3 行 entry，每行：
  - 左：avatar 圆 28×28（lavender / pink / mint 用户头像底色）
  - 中：handle Karla 13 / 600 + "1h ago" 灰小字
  - 内容：3 行 body 摘录，Karla 12 / 1.5 / `rgba(17,17,17,0.65)`，超出 ellipsis
  - 右下：分隔 progress（细 4px yellow bar）+ "10 likes" 数字
  - 右上：外链 icon 12×12 + 平台 chip（X 黑底圆 / Reddit 橙底圆，16×16）
  - 行间分隔：`1px dashed rgba(17,17,17,0.05)`

**C. Calendar + Sent（2 列 ½ ½ 内嵌）**：
- 容器 cream 同上，外层圆角 16；内部分两部分
- **左半：Calendar**
  - 顶部：← Oct 2025 → （Karla 13 / 600 居中，箭头 lucide `chevron-left/right`）
  - 7×5 网格，cell 32×32，Karla 13 / 400
  - **当天数字**有 `1.5px solid #111` 黑色描边圆（不填充）
  - **有事件的日子**底色 `#FFFADD`（yellow-fffadd 弱化），圆角 8
  - **被选中的日子**底色 `#FFE253` 实色 yellow + 黑色描边
  - 周末数字字色不变（不区分）
- **右半：Sent 时间块列表**
  - 标题 `Sent` Karla 13 / 500 + 列表 3 个上下排
  - 每个 item：圆角 12 卡片，padding `12px 14px`，白底 `#FFFFFF`，描边 `rgba(17,17,17,0.05)`
  - 内容：上一行 "27 Oct 2025" Karla 11 / 500 / muted；中行时间 "02:00" Karla **Bold 22** / `#111`；右侧平台 icon 圆（X 黑 / Reddit 橙）
  - 下行 "Introduction for AISee" 副标题 Karla 12 / 500

### 13.5 Signal Feed 页（Tab 2 · 核心交互页）

> 实现：`signal-feed.jsx`. 完整三件套：**Filter Bar → Feed cards 列表 → Reply Panel 浮在右侧**。

#### 13.5.1 顶部聚合行（Banner 下、PageTabs 下、FilterBar 上）

**单行布局**，padding `0 32px`，高度 32：
- **平台 mini-tabs**（左侧）：`All 3.3k` / `X 2.1k` / `Reddit 1.2k`
  - 每个 chip 高 24，padding `4px 10px`，圆角 8
  - 数字徽章紧贴标签右侧，Karla 11 / 500 / `rgba(17,17,17,0.55)`
  - **active 标签**：文字 `#111` / 600，**下方 2px 黑色 indicator**
  - inactive：`rgba(17,17,17,0.6)`
- **聚合行**（右侧）：`SORT BY Score ▾` + 升降序按钮（24×24，旁边那个，灰描边）

#### 13.5.2 Filter Bar（次行）

> 实现：`filter-bar.jsx`. 一行 chips，使用 container query 在窄宽时降级（参见现有 css 注释）。

- 容器高 52，padding `12px 24px`，底部 `1px solid rgba(17,17,17,0.05)`
- **左 1：Platform Picker**（与上面 mini-tabs **重复**，由用户偏好二选一展示；当前 v5 同时存在，做冗余 fallback）
  - 高 28，padding `4px 8px`，圆角 8，灰描边
  - 内容 "All Platform" + 数字徽章 + chevron
- **左 2：Sync 状态**（紧跟 picker）
  - 圆点 6×6 `#92BC01` 实色 + 外发光 `box-shadow: 0 0 0 3px rgba(146,188,1,0.2)`
  - 文字 Karla 12 / `#111`：`Last sync` muted + `2m ago` 加粗 + 分隔点 + `Next in` muted + `23h 58m` 加粗
  - **响应式降级**：<900px 隐藏 "Next in 23h 58m" 段；<760px 隐藏 "Last sync" 前缀；<640px 隐藏整段
- **右侧：filter chips 横排**（gap 8）
  - 6 个 chip 一致样式：高 24，padding `0 8px`，圆角 8，**默认 transparent 底**，描边 `rgba(17,17,17,0.05)`
  - 文字 Karla 12 / 500
  - 已选时：底 `#FFFADD`，描边 `rgba(17,17,17,0.15)`，右侧追加 X 删除按钮（hover 才显示）
  - 多选 chip：未选时右侧 chevron，已选时变为 "× count"（圆形数字徽章，反白：黑底 + 黄字 `#FFE253`）；单选 chip：永远 chevron
  - 顺序：`Scores` / `Keywords` / `Status` / `Intents` / `Accounts` / `Subreddits`
- 最右 Sort 区与 Clear all 按钮（仅在有选时显示）

**Sync now 按钮**（FilterBar 下方对齐右侧的独立行）：
- 高 28，padding `4px 12px`，圆角 8，白底，描边 `rgba(17,17,17,0.05)`
- 内容：`↻` icon + "Sync now" Karla 12 / 500，文字 `#111`

聚合统计行（FilterBar 下方左对齐）："`3320 feeds total · 12 new since your last visit · Last sync 1m ago · Next in 23h 58m`"，Karla 12 / `rgba(17,17,17,0.6)`，加粗数字部分用 `#111` / 600。

#### 13.5.3 Feed Cards（主列表）

> 实现：`feed-card.jsx`. **每张卡片高度由内容决定**，列表 gap 18。

| 区域 | 规格 |
|---|---|
| 容器 | 白底，圆角 12，padding `16px 18px`，描边 `1px solid rgba(17,17,17,0.05)` |
| **selected 态** | 描边变 `1px solid #111` + **外圈 `outline: 4px solid #FFE253`**（即"黑边 + 4px 黄环"双层指示） |
| hover 态 | 描边加深至 `rgba(17,17,17,0.18)`（仅未选中时） |

**头部一行**（mb 10）：
- 平台 icon 圆角 6 方块 22×22：X = 黑底 + 白色 X 字形；Reddit = `#EC5212` 橙底 + 白色 r/
- intent tag pill（22 高，padding `0 8px`，圆角 999，Karla 11 / 500）：
  - `Help-seeking` → `#FAE2FE` 紫（注：主体是 intent tag 调色，与 Engage banner `#F3E7F4` 是不同 token）
  - `Hot take` / `Opinion` → `#DCEEFF` 蓝
  - `Discussion` / `Data` → `#F7F6E9` 米
  - `Comparison` → `#FFFADD` 浅黄
- subreddit chip（仅 reddit）：白底 + 灰描边 + `rgba(17,17,17,0.6)` 文字
- action tag（如 "Manual reply"）：`#FFE253` 黄底 + 黑字 / 600
- **右侧**：`{time} ago` + Source 链接（含外链 icon）+ **score 大数字** Karla **Bold 16** / `#111`

**新增状态徽章**（v5）：
- **`Replied` 标签**（已发回复）：紫 lavender `#FAE2FE` 底（与 Channel banner 用同系，不是 Engage banner `#F3E7F4`），文字 `#111` / 500，前缀对话圈 icon，例："`💬 Replied at Jun 4, 10:30 AM`"
- **`Expired` 标签**（>7 天）：`#FFFADD` 黄底 + 黑色 ✕ 圆环 icon，"Expired"
  - **悬停 hover** 在整张卡片任意位置 → 弹出**黑底白字 tooltip**：宽自适应，padding `10px 14px`，圆角 8，shadow `0 10px 12px rgba(0,0,0,0.12)`，箭头指向 Expired 标签
  - tooltip 文案固定："This post is over 7 days old — the reply window has closed."
  - Expired 卡片**整体 opacity 0.92**，Generate Reply 按钮 disabled（opacity 0.5）

**用户行**（mb 8）：
- 头像 22×22 圆，背景 `rgba(17,17,17,0.08)`，文字 Karla 11 / 600 取首字母
- handle Karla 13 / 600 + （可选 `· {followers}` muted）

**正文**：Karla 14 / 1.5 / `#111`, `text-wrap: pretty`，展开/收起靠 "See more / See less" 触发按钮（Karla 12 / 500 / `rgba(17,17,17,0.6)`，hover #111）

**底部一行**：
- 左：标签 chips（同上 22 高 pill），二号标签如 "Pain-point hit" 用 `#FDEBE4` 浅橙底
- 中：stretch
- 右：数据指标横排 gap 12（Karla 12 / muted）：
  - X 卡：`❤ 234` likes / `💬 45` replies
  - Reddit 卡：`↑ 86k` upvotes / `💬 45` comments
- **CTA 按钮 `Generate Reply →`**：
  - 高 32，padding `0 14px`，圆角 8，Karla 13 / 600
  - **selected 卡上**：`#FFE253` 黄底 + `#111` 文字（primary 状态）
  - **未 selected 卡上**：白底 + 黑描边 1px + `#111` 文字（secondary 状态）
  - **已 Replied 卡上**：替换为 "View Reply" ghost 按钮（透明底，仅文字）
  - **Expired 卡上**：disabled，opacity 0.5

#### 13.5.4 Reply Panel（右侧粘性面板，宽 400）

> 实现：`reply-panel.jsx` v5 重写——简化为**单一 "Configure your reply" 工作区** + 底部 Continue。

**容器**：
- 宽 400 固定，`position: sticky; top: 24px`
- 白底，圆角 12，padding `20px`，描边 `1px solid rgba(17,17,17,0.05)`
- `max-height: calc(100vh - 118px)`，纵向 overflow auto

**头部**：
- 单行：`Generate reply` Karla **Bold 16** + 右上角 X 关闭按钮（28×28，hover 底 `rgba(17,17,17,0.05)`）
- 副行：handle + 时间，Karla 12 / muted

**Post Preview 卡**：
- 底 `#FAFAFA`，圆角 10，padding `12px 14px`，描边 `rgba(17,17,17,0.05)`
- 头：`@handle` 12 / 600 + followers muted
- 体：Karla 13 / 1.5 / `#111`，可折叠 "See more ▾"

**Configure your reply section**：
- 标题行：圆形数字徽章 `① Configure your reply` Karla 13 / 600 + 右侧 muted "Auto-regenerates on change"

**Step Header（每个子项的统一头）**：
- 18×18 圆形 badge + 标题 + Required/Optional pill + 右侧 hint
- 编号 badge 三种状态：
  - **未填**（数字态）：`#111` 黑底 + 白字（粗体）
  - **已完成**：`#FFE253` 黄底 + 黑色 ✓
  - **可选**：白底 + 黑色 dashed `border 1.5px dashed rgba(17,17,17,0.3)` + 灰字号 +
- 标题 Karla 12 / 600 / uppercase / letter-spacing 0.04em
- **Required pill**：黄底 `#FFE253` + 黑字，padding `2px 6px`，圆角 4，Karla 10 / 600 / uppercase
- **Optional pill**：`rgba(17,17,17,0.06)` 底 + 灰字 + `rgba(17,17,17,0.08)` 描边，同尺寸
- 右侧 hint Karla 11 / muted（如 "Pick the angle" / "How long the reply should be"）

**子项 1 — Reply Strategy `[Required]`**：
- 标题 hint "Pick the angle"
- 3 张方按钮（grid 3 列，gap 8）：
  - `Expert answer / Structured steps`
  - `Data-backed / Cite numbers`
  - `Empathetic / Acknowledge pain first`
- 按钮规格：padding `10px`，圆角 10，左对齐
  - 未选：白底 + `rgba(17,17,17,0.05)` 描边
  - **选中**：**`#FFE253` 黄底 + 黑色 1px 描边**
  - 标题 Karla 13 / 600；副标 11 / muted（选中时 `rgba(17,17,17,0.7)`）

**子项 2 — Length `[Required]`**：
- 标题 hint "How long the reply should be"
- 3 张同上方按钮：`Short / ~80 chars` · `Medium / ~280 chars` · `Long / 500+ chars`
- 按钮左上角有**条形 micro chart**（3 根递增小竖条，宽 3 / 圆角，高度 5/8/11），Short 高亮第 1 根，Medium 前 2 根，Long 全部 3 根；高亮色 `#111`，未高亮 `rgba(17,17,17,0.15)`
- 选中态下，未高亮条变为 `rgba(17,17,17,0.3)`（更醒目）
- 帮助行（按钮下，全宽）：ⓘ + "3–5 sentences · all-purpose default · fits both X and Reddit replies." Karla 11 / muted

**子项 3 — Mention Intensity `[Optional]`**（可折叠）：
- 标题点击可折叠，右侧 hint 切换 "Add a mention" / "Hide"，最右 chevron 旋转
- 展开后的内容卡：
  - 底 `#FAFAFA`，dashed 描边 `rgba(17,17,17,0.18)`，圆角 10，padding 14
  - **`What to mention`** label + 输入区
    - **关键变更（v5）**：从纯 text input 改为 **Tag pills + 输入 hybrid**——容器圆角 8，内部已选 mention 以 pill 形式（`#FFE253` 底 + ✕ 删除），右侧 `+ Add` 按钮
    - 占位 "Enter or click to add"
    - 帮助行：Karla 11 / muted "Enter or click to add · ⌫ on empty to remove last"
  - **`How Strongly`** + 当前强度文字（右对齐）
    - 4 档 slider，水平 track 高 2，圆点 18×18，圆点 `#FFE253` 黄底 + 黑色 2px 描边
    - 4 个档位 label：`Don't mention` / `Subtle` / `Natural` / `Direct`
  - 底部 ⓘ + "Woven into the reply where it genuinely fits the answer."

**空 draft 占位（未点 Generate）**：
- 底 `#FBFBF3` cream，dashed 描边，圆角 10，padding `20px 16px`
- 居中：38×38 白色圆 + 灰 ✏ icon
- 文案 Karla 13 / muted：`Pick a strategy, optionally guide the angle, set intensity — then generate.`

**底部固定操作区**：
- 上方 `1px solid rgba(17,17,17,0.05)` 分隔
- **`Continue`** 按钮：全宽，高 44，圆角 10，**disabled 态 = `rgba(17,17,17,0.06)` 灰底 + `rgba(17,17,17,0.5)` 文字**（v5 截图里所示状态——必填未填齐）；activated 态 = `#FFE253` 黄底 + `#111` 文字

### 13.6 Keywords & Accounts 页（Tab 3）

> 实现：`keywords-accounts.jsx`. 三段式 stepper：Keywords → X accounts → Reddit subs。

**顶部 X Auto-reply 切换条**：
- 白底，圆角 14，padding `16px 20px`
- 左侧：X icon + "X Auto-reply" + 状态 pill（On = `#CFFF29` lime 底 / Off = 灰）
- 副行 Karla 12 / muted：动态文案
- 右侧 Switch 使用 §6.5 标准 Toggle（24×16）

**Stepper（一行）**：3 圆 + → 箭头连接，active 步骤圆 `#111` + 白字 + 文字 600

**KwaCard（每个步骤的卡片，3 张垂直叠）**：
- 白底，圆角 14，描边 `rgba(17,17,17,0.05)`，overflow hidden
- **CardHead**（顶部 padding `20px 20px 14px`，底部 dashed 分隔）：
  - 左：步骤 pill（圆形数字 16 黑底白字 + "Pick first" / "X config" / "Reddit config" 标签 Karla 10 / 600 / uppercase / `rgba(17,17,17,0.04)` 底）+ 主标题 Karla 16 / 700
  - 子文案 Karla 12 / muted，关键数字加粗 `#111`
  - 右：Add 按钮（secondary 样式，高 32）

**关键字行 KeywordRow**：
- padding `14px 20px`，行间分隔 `1px solid rgba(17,17,17,0.05)`
- 左侧：关键字 Karla 14 / 600 + 类型 chip（**Core / Brand / Competitor**，10 高 px / uppercase / letter-spacing 0.04em）
  - Core: `#DCEEFF` 底 / `#1F3D70` 字
  - Brand: `#E6F2DB` 底 / `#3B5A1F` 字
  - Competitor: `#FFD0D0` 底 / `#EC5212` 字
- 下一行：**进度条**（宽 220，高 4，圆角，底 `rgba(17,17,17,0.06)`，填充色随 type 切换：Core 黄 `#FFE253` / Brand 浅绿 `#CEEBC8` / Competitor 浅红 `#FFD0D0`）+ "`{N}` this week" + posts 数量 pill（黄底 `#FFFADD`）
- 右侧：Switch
- **新增 v5**：每个 keyword 的右侧增加 **"`{N}` Total"** 累计数（Karla 11 / muted），位于 Switch 上方；前端实现应**同时展示**周值 + 累计 Total

**+ Add keyword 内联输入**：
- 圆角 10，padding `10px 14px`，dashed 描边，底 `#FAFAFA`
- focus 时变实线 + 白底
- 提示文 "Add a keyword, press Enter to confirm"
- 右侧 keyboard hint `Enter ⏎` chip

**Priority Accounts**（卡 2）：
- 行 layout：avatar 38×38（圆，`rgba(17,17,17,0.08)` 底 + 首字母 600）+ handle 14 / 600 + X 平台 chip + role 副行 + 右侧 Switch + 删除 icon
- Add account 弹窗：`Dialog` 弹窗，含 handle 输入 + Verify 按钮 + 验证成功后展示 followers / posts per week + Keyword 多选 chips + "Start tracking" 切换

**Subreddits**（卡 3）：
- 2 列 grid，每格 padding `12px 14px`，圆角 10
- 左：r/ 橙底 30×30 方圆角 + 副标 11 muted
- 右：Switch
- active 底 `#FFFADD`，未 active 底 `#FAFAFA`
- + Add subreddit 弹窗：name 输入 + Find 按钮 + 验证成功后展示 members / posts per day + monitoring 切换

### 13.7 Replies 页（Tab 4 · v5 重命名自 Sent）

> 实现来源：figma "Engage-Sent" + "Engage-Sent-X" + "Awaiting review" frame（screenshot 3）。**比旧 Sent tab 大幅扩充**——把已发与待审拆为两个子 tab。

#### 13.7.1 顶部子 tabs
- 紧贴 Banner 下方，左对齐
- 子 tabs：`All` / `Sent 12` / `Awaiting review` — 同 PageTabs 样式（13.3）
- 子 tab 下方再放一组**平台筛选 chips**：`X 3` / `Reddit 2`（与 Sent 数字对应，22 高 chip + 黑底数字徽章）

#### 13.7.2 KPI strip（与 Dashboard 不同）
- 4 列：`3 X replies sent` / `100% Author replied` / `18.9K Total impressions` / `118 Total likes`
- 容器白底卡（不同于 Dashboard cream），4 列等宽，左对齐，行内 dividers
- 数字 Karla **Bold 26**，label Karla 11 / 500 / uppercase / `rgba(17,17,17,0.6)`

#### 13.7.3 HISTORY section
- 标题行：`HISTORY` Karla 11 / 500 / uppercase / muted + 右侧 "`3 replies`" 计数 Karla 11 / muted
- 列表 gap 14

#### 13.7.4 Sent 子 tab 的 ReplyCard
- 白底，圆角 12，padding `16px 18px`，描边 `rgba(17,17,17,0.05)`
- **头部**：
  - 行 1：用户 avatar（圆 22 + initial）+ handle Karla 13 / 600 + `→` arrow + 目标用户 avatar + `@target` handle + X 平台 chip
  - 行 1 右：**`💬 Replied`** lavender pill（`#FAE2FE`，同 Signal Feed Replied 标签）+ "`at 16h ago`" 灰
- **From 引用块**：
  - 上方一行：`From` Karla 11 / 600 / uppercase / muted + 原帖 1 行 snippet（Karla 13 / `#111`，超出 ellipsis）
- **YOUR REPLY 块**：
  - `YOUR REPLY` 标签 Karla 11 / 600 / uppercase / muted + 主体 Karla 14 / 1.5 / `#111`（**斜体** italic）
  - "See more ▾" 展开
- **底部 stats grid（5 列等宽）**——v5 的关键扩充：
  - 每列：上 icon + label（Karla 11 / 500 / uppercase / muted），下数字（Karla **Bold 18** / tabular-nums / **彩色！见下**）
  - 各列固定色：
    - `Impressions`：折线 icon + 数值 **`#4398FF` 蓝**
    - `Replies`：comment icon + 数值 **`#EC5212` 橙**
    - `Retweets`：refresh icon + 数值 **`#A5D500` 绿**
    - `Likes`：heart icon + 数值 **`#EC5212` 橙**
    - `Bookmarks`：bookmark icon + 数值 **`#8C7400` 深黄**（注意：直接用 `#FFE253` 在白底上不可读，深化为 `#8C7400`）
  - 顶部用 dashed 1px 分隔
- **底部一行**：左 `X Traffic Index 630`（Karla 12 / muted + 数字 600 #111）+ `Expert answer` 黄 tag + 右 `View Post ↗` 按钮（secondary）

#### 13.7.5 Awaiting review 子 tab 的 ReviewRow（更紧凑）
- 列表项更扁：每行只显示**一条待审记录**（不是对话 thread，是一条独立条目——v5 明确）
- 容器同 ReplyCard 但 padding 更小 `12px 16px`
- 单行：sender avatar + handle "ccbakala" + `→` + recipient avatar + `@viaOxgina` + 平台 chip
- **From** 单行截断
- **YOUR REPLY** 单行（不展开，单段）
- 右下角：**状态条**——
  - `🔗 Link to reply not submitted · Data pending update` 信息 pill：底 `#FFFADD`，前缀 ⓘ icon，Karla 11 / 500 / `#111`
  - `Expert answer` 黄 tag 并排
- 不显示 stats grid

### 13.8 Engage 专属 token 一览（v5 修订）

> v4 列出的若干 token 与代码不一致，v5 全部以 `engage-aisee/*.jsx` 实际值为准。

| 用途 | v5 实际值 | v4 错误值 |
|---|---|---|
| 日常 Engage Banner 底 | **`#F3E7F4`** lavender-pink（v5 最终确认） | v4 估算 `#F3E7F4`、v5 中间版曾误改为 `#FAE2FE`，后者是 Channel banner 亓位，已恢复 |
| Channel Banner 底（参考对比） | `#FAE2FE` 深 lavender（不在 Engage 作用域，仅 Post Agent / Channel 列表语境使用） | — |
| Setup Banner 底 | **`#F0FFBA`** lime | 未列出 |
| Subreddit active 底 | **`#FFFADD`** yellow-fffadd | ✓ |
| Reddit 平台标识底 | **`#EC5212`** aisee orange（**注意：不用 Reddit 官方 `#FF4500`，统一品牌**） | ~~`#FF4500`~~ |
| Sync dot 实色 | **`#92BC01`** | ~~`#A5D500`~~ |
| Sync dot 光环 | **`rgba(146,188,1,0.2)`**，3px 实心 box-shadow | ~~`rgba(165,213,0,…)`~~ |
| Keyword 默认 pill | **`#EFF4E2`** 底 / **`#8C7400`** 字 | ~~`#E6F0CD/#597300`~~ |
| Intent tag · Help | `#FAE2FE`（同 Channel banner，主体调色重叠不冲突） |  |
| Intent tag · Opinion / Hot take | `#DCEEFF` |  |
| Intent tag · Discussion / Data | `#F7F6E9` cream |  |
| Intent tag · Comparison | `#FFFADD` |  |
| Pain-point / Competitor 提示 | `#FDEBE4` 浅橙 |  |
| Selected feed card outline | 内层黑 `1px solid #111` + 外层 `outline 4px solid #FFE253` |  |
| Replied 状态 pill | `#FAE2FE` lavender 底（同 Channel banner）+ `#111` 文字，与 Engage banner `#F3E7F4` 区开 |  |
| Stats 数字 5 色（Replies tab） | Impressions `#4398FF` · Replies `#EC5212` · Retweets `#A5D500` · Likes `#EC5212` · Bookmarks `#8C7400` |  |

> 通用按钮 / 输入框 / Switch / Dropdown / Modal 外壳、States & Feedback、Motion、字号阶梯：本节**不重写**，沿用 §6 / §7 / §8 / §3。

---

## 14. 与官网（Homepage）的关系

| 维度 | Homepage 官网 | dApp |
|---|---|---|
| 字体主导 | **Gotu 99%** + Karla 仅 nav 链接（5 处） | **Karla 100%**（含页面一级标题与弹窗标题） |
| 主色调 | 黑 + 白 + lime（半透 marquee）+ 多色装饰块 | 白 + 浅灰 + **双主色（Analysis = lime / Post Agent = yellow）** |
| 边框 | 1px solid #111 黑色硬边框 | 1px 极淡灰描边 / 无描边 |
| 阴影 | 几乎不用 | 三档柔和阴影（card / dropdown / modal） |
| 装饰 | 巨型 lime "Hi it's aisee" 滚动 marquee + 客户引言 + 几何色块 | 无装饰 |
| 动画 | 入场动画 + 永久 marquee + custom cursor | 仅功能反馈 |
| 信息密度 | 低（editorial） | 高（dashboard） |
| Emoji | 仅 Pricing 区允许 | 一律禁止 |
| 模块化 | 单一品牌叙事 | 按 Analysis / Post Agent 切换主色 |

两端共用：lime + yellow + orange + cream 色板 token、logo mark（`#C9FE12` 实色）、Karla 字体（用法不同）、8px spacing 体系、aisee 品牌 tone of voice。

---

> 文档版本：**v6** · 2026-08-11 · Figma 反向校对；dApp 字体统一 Karla；Toggle 与 Modal 规范修正
>
> **v5.x 关键变更**（护航着顶，旧版本变更在本项目仓库的 git 历史 / archive 中可查）：
> - **Engage 独立 tab**（Sidebar Tab Toggle 与 Analysis / Post Agent 平级，不是二级子项）；主色仍 yellow `#FFE253`
> - **Sidebar 宽度 211 → 224**；Engage 子项高 30；Active tab 三重描边 `inset 1px rgba(17,17,17,0.05) + 0 1px 2px rgba(0,0,0,0.12)`
> - **Engage Banner = `#F3E7F4`**（为避免与 Channel banner `#FAE2FE` 混淆专门标记）；setup 变体 `#F0FFBA`
> - **Engage 子页 4 件套**：Dashboard / Signal Feed / Keywords & Accounts / Replies（Sent + Awaiting review 两个子 tab）
> - **Reply Panel 重写**：Required/Optional pill、Length 改为字数标注（~80/~280/500+）、Mention 改 tag pill 模式
> - **Dashboard Your Impressions area chart**：单层渐变 `#FFD85F` gold（不是双层）
> - **Donut 次色**：`#8C7400` 深芙末（与 keyword pill / Reddit area 同 token）
> - **弹窗标题 weight 700 → 600**；Sync dot `#92BC01` + `rgba(146,188,1,0.2)` 光环；Reddit 平台色统一 aisee orange `#EC5212`（不用官方 `#FF4500`）。
> - **Modal 统一规范**：四边 padding 固定为 24px；标题 20/600/30，描述 12/400/18；标题与描述间距为 0，标题区与内容区按场景使用 12px 或 16px。
> - **Modal Footer Button 统一规范**：操作区增加 `#111 / 6%` 的 1px 顶部分割线；灰色次按钮使用 `#111 / 2%` 底色和 `#111 / 6%` 的 1px 描边，参考 Figma 节点 `9872:287453`。

> **关于旧版本变更是否保留**：不建议。md 是现说明书、不是 changelog。**只保留当前版本与上一版的 diff 足够（上面 v5.x 列表）**；更早的变更什么时候发生、为什么发生必须靠 git log + commit message，不宜塞进设计规范。当前 v6 只重写 v5→v6 的差异，本节不要肥大。
