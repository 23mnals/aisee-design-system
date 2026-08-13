# aisee dApp — Design Specification

> 适用范围：**aisee Web App** https://app-dev.aisee.live/
> 设计宽度：**1440px**（desktop），向下兼容到 1280
> 字体规则：**Karla 单字体系统；Gotu 仅用于页面一级标题**（如 Account Profile）；弹窗标题使用 Karla Bold 20px
> 设计基调：**功能优先 · 信息密度高 · 极简数据驱动 · 与官网同源但更克制**

---

## 1. Design DNA

dApp 是官网的"工作态"版本：

- **删除所有装饰**：没有几何漂浮色块、没有 mascot、没有 mix-blend cursor、没有横向 marquee。
- **保留所有品牌资产**：依然是 lime / yellow / orange / cream 色板。
- **替换字体策略**：Gotu 从主角降级为"仪式感字体"——**仅用于弹窗主标题**，其他全部 Karla。
- **节奏**：以数据卡片、表格、侧边栏导航为主，靠功能区色彩高亮。

### ★ 双主色系统（核心规则）

dApp 按 **功能模块** 划分两套主色调，**侧边栏 tab 切换时整页高亮色随之切换**：

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
> **页面主背景：`#FAFAFA`**（figma 实测值，不是 #F7F8F7）。

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
| `--orange` | `#EC5212` | 通知红点 / 数字徽章、危险 / 异常 |
| `--green` | `#A5D500` | 成功 dot / 完成态、通道已连接、上升数据 |
| `--red-light` | `#FFD0D0` | 错误背景、删除态 |
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
> - **Karla**（Regular / Medium / Bold / SemiBold）— 99% 场景：正文 / UI / 表格 / 表单 / 按钮 / nav / 标签 / **弹窗标题** / **版本号 / 分数 / delta 等数字内容**
> - **Gotu** — **仅页面 / 分区一级标题**（例：Account Profile 页面顶部标题，Gotu 20px）
> - **Digital Numbers** — **仅 Score 仪表盘中心数据**（如 Analysis Overview 中的 "45.0"）
> - **JetBrains Mono** — **仅键盘按键提示（`<kbd>`）与代码块（`<code>`/`<pre>`）**；数据表数字列、版本号、分数都改用 Karla，避免数字与正文割裂

### 字体职责口诀
```
页面一级标题    → Gotu             （"Account Profile" / 页面顶部标题）
弹窗标题        → Karla Bold 700  （"Create Post" / "Edit Time Slots" / "Add Channel"）
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
@import url('https://fonts.googleapis.com/css2?family=Gotu&family=JetBrains+Mono:wght@400;500;700&display=swap');
/* Digital Numbers — self-host 或 CDN */
@import url('https://fonts.cdnfonts.com/css/digital-numbers');

body              { font-family: 'Karla', sans-serif; }
.page-title       { font-family: 'Gotu', serif; font-weight: 400; }
.dialog-title     { font-family: 'Karla', sans-serif; font-weight: 700; }
.gauge-digit      { font-family: 'Digital Numbers', monospace; }
.mono             { font-family: 'JetBrains Mono', monospace; }
```

### 尺寸阶梯（figma 实测）

```
Page Title (Gotu):              Gotu 20px / 400 / lh 24px / #111
                                  → "Account Profile" / 页面顶部一级标题
Dialog Title (Karla Bold):      Karla 20px / 700 / lh 30px / #111
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
│ 211  │   padding: 24px 32px                                    │
│ px   │   background: #F7F8F7                                   │
│      │                                                         │
└──────┴─────────────────────────────────────────────────────────┘
```

| 区域 | 尺寸 |
|---|---|
| Header 高度 | **70px** |
| Sidebar 宽度 | **211px** |
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

### 6.2 Sidebar (211px)
> **⚠️以最新产品截图为准，figma 中 `SidebarAccount` 是旧版**。结构：

- 顶部 **Tab Toggle**（Analysis / Post Agent）：底色 `rgba(17,17,17,0.02)`，圆角 8px
  - **Tab 切换时整页主色随之切换**（lime ↔ yellow）
  - 活跃 tab 底色 = 该模块 primary-pale：Analysis `#F5FFD4`，Post Agent `#FFF2B3`
  - 活跃 tab 描边 `1px solid rgba(17,17,17,0.05)`
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
- **唯一例外**：危险操作（Delete / Disconnect）始终用 red-light 底，与模块色无关

**Secondary** — "Cancel" / 次要操作
- 白底，描边 `1px solid rgba(17,17,17,0.05)`，文字 `#111`
- Hover：底 `rgba(17,17,17,0.04)`，描边加深至 `rgba(17,17,17,0.18)`

**Ghost / Tertiary**
- 透明底，无描边，仅 hover 底 `rgba(17,17,17,0.05)`
- 用于工具栏图标按钮

**Danger**
- 底 `#FFD0D0`，文字 `#111`，hover 加深

### 6.5 Inputs / Toggle / Checkbox
- Input：高度 36，圆角 8，描边 `1px solid rgba(17,17,17,0.05)`，focus 描边 `#111`
- Select / Dropdown trigger：同 Input 样式 + 右侧 caret 图标
- **Checkbox**：18×18，圆角 4，**未选描边 `1.5px solid #111`**（全黑实线，保持可点击感），选中底 `var(--module-primary)` + 黑色 ✓
  - **Hover 反馈**：鼠标移到承载该 checkbox 的整行（如 list row / table row）时，checkbox 底色变 `var(--module-primary)`（lime / yellow 提示即将选中）；离开恢复
- Toggle：W36 H20，圆角 999，关闭灰底，打开 lime 底

### 6.6 Dropdown
- 白底，描边 `1px solid #000`，圆角 8
- `box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1)`
- item 高度 32–36，padding `6px 12px`，hover 底 `rgba(17,17,17,0.05)`

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
  - padding `24px 0px 12px 0px`（顶部 24，底部 12，左右由内部控制）
- **蒙层**：`rgba(17,17,17,0.4)`，可加 `backdrop-filter: blur(2–4px)`
- **标题（Karla Bold 20px / lh 30px / #111）**：靠左对齐，例：“Create Post” / “Add Channel” / “Edit Time Slots” / “Compare versions”
  ```css
  .dialog-title {
    font-family: 'Karla', sans-serif;
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    color: #111;
  }
  ```
- 标题右侧可选辅助标签（Tag pill，如 "Tags ∨"、项目 chip）：Karla Medium 13–14px / `1px solid rgba(17,17,17,0.05)` / radius 999 或 8
- **右上角操作区**：**只放关闭 X 按钮**（30×30，内含 lucide-x 24×24、`#111`，hover 底 `rgba(17,17,17,0.05)`）。
  - 不在右上角放 Export / Upload / Share 等次要操作——这类按钮迁移到**底部操作区**或卡片内 inline，避免与 Close 混淆
- **底部操作区**：右对齐，Cancel（secondary）+ 主按钮（`var(--module-primary)`）。次要工具按钮（Reset / Export 等）放在左侧或与 Cancel 并列
- **内嵌错误 Tooltip**（按钮上方挑出提示）：黑底 `#111` + Karla 14 白字 + 圆角 8 + `box-shadow: 0px 10px 12px rgba(0,0,0,0.12)`，详见 6.17

> **标题字体发生变化**：figma 中各弹窗标题统一 Karla Bold 20px（不是 Gotu）。Gotu 仅出现在**页面顶部一级标题**中（参见 6.15）。

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
- 统一使用 **Lucide**，1.5px stroke，rounded linecap
- UI 尺寸：16×16（标准）/ 20×20（按钮内）/ 24×24（nav）
- 颜色：`#111` 默认；在 lime / yellow 底上保持 `#111`；在黑底用 `#fff`
- Sidebar / Analysis 区域有项目自有图标库（`line_*` 描边、`fill_*` / `flat_*` 填充），保持同一视觉权重

### 6.15 Page Title（**唯一使用 Gotu 的组件**）
> 顶部页面 / 分区一级标题用 Gotu，区别于二级 section / card 标题（用 Karla）。

```css
.page-title {
  font-family: 'Gotu', serif;
  font-weight: 400;
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
| Focus | `outline: 2px solid #111` + offset 2，或描边变 `#111` |
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
- 弹窗主标题（Gotu）使用句首大写 + 句号可省略：`Pick versions to compare`、`Report comparison`、`Connect a new channel`

---

## 10. 资源 & Assets

| 路径 | 说明 |
|---|---|
| `/fonts/Karla-VariableFont_wght.ttf` | 主字体（本地） |
| Gotu | Google Fonts，仅 dialog 标题用 |
| JetBrains Mono | Google Fonts，可选数字列 |
| Logo mark / wordmark | 与官网共用 |
| Lucide | 主 icon 库 |
| 自有图标 | `line_*` / `fill_*` / `flat_*`，用于 Sidebar、Analysis 模块 |

---

## 11. Do / Don't

| Do ✅ | Don't ❌ |
|---|---|
| 全站 Karla，仅页面一级标题 Gotu（如 "Account Profile"） | 在底部 / section / card 标题上用 Gotu |
| 弹窗标题统一 Karla Bold 20px / lh 30px | 弹窗标题用 Gotu |
| Score 仪表盘中心数字用 Digital Numbers | 用 Karla / Gotu 仿照数码管样式 |
| **按模块切换主色**：Analysis = lime，Post Agent = yellow | 同一屏内同时出现 lime 和 yellow 主操作 |
| 主背景统一 `#FAFAFA`，卡片用 `#FFFFFF` | 主背景用 `#F7F8F7` 或取反 |
| 主操作按钮一律 `var(--module-primary)` | 在 Analysis 里出现 yellow 按钮 / Post Agent 里出现 lime 按钮 |
| 阴影柔和（card / dropdown / modal 三档） | 重度投影、玻璃拟态 |
| URL Input 使用 1.5px 黑描边 + lime 3px 外环 focus | 用默认 outline 做 focus |
| Tooltip / Toast 黑底白字 Karla 14 | tooltip 使用白底黑字 |
| 动画 ≤ 300ms，仅做反馈 | 入场大动画、循环漂浮、cursor 特效 |
| Lucide + 自有 icon 同尺寸 | 多套图标体系混用、emoji |
| Modal 关闭只用右上角 × + Esc | 弹窗多个关闭入口 |

---

## 12. 与官网（Homepage）的关系

| 维度 | Homepage 官网 | dApp |
|---|---|---|
| 字体主导 | **Gotu 99%** + Karla 仅 nav 链接（5 处） | **Karla 99%** + Gotu 仅页面一级标题（如 Account Profile） |
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

> 文档版本：v3.1 · 2026-05-15
> 关键更新（v3.1 · Comparison Modal 实战修订）：
> - **Analysis 主色**：`#CFF229` → **`#CFFF29`**（更亮的 lime），hover `#C9FE12` → **`#BFEE19`**
> - **字体规则收紧**：JetBrains Mono **仅用于键盘按键提示与代码块**；版本号 / 分数 / delta / 数据列数字一律用 Karla（避免与正文字体割裂）
> - **Borders 全站统一 5%**：所有静态描边一律 `rgba(17,17,17,0.05)`；hover 加深至 `rgba(17,17,17,0.18)`；选中态用 `#111`；modal 容器保留 0.15 作为最外层例外
> - **Checkbox 描边升级**：未选 `1.5px solid #111` 全黑实线；新增整行 hover → checkbox 底色变 `var(--module-primary)` 的反馈
> - **Modal 右上角规则**：只放 Close X；Export / Upload 等次要操作不再放右上角，迁移到底部或卡片内
> - **可操作 Chip**：新增 Comparison Modal 的 "Set as baseline" 交互模式 — 非 baseline chip hover 显示黑底 tooltip，点击升级为新 baseline
> - 弹窗宽度阶梯补充 1080px 档位（多数业务弹窗用 880–1080 即可，1394 留给 Create Post 类）
>
> 旧版本变更（v3.0）：
> - 字体规则修正：Gotu 仅页面一级标题（"Account Profile"），弹窗标题用 Karla Bold 20px（基于 figma 实测）
> - 主背景色修正为 `#FAFAFA`（不是 #F7F8F7）
> - 新增 URL Input compound 双环描边规范、Tooltip / Toast、Score Gauge、Page Title 组件
> - Header/Sidebar 校准到 figma `Header2` 组件值；Sidebar 视觉以最新产品截图为准（figma `SidebarAccount` 为旧版）
> - 保留：双主色系统（Analysis = lime / Post Agent = yellow）
