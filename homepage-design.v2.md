# aisee Homepage — Design Specification

> 适用范围：**aisee 官网** https://aisee.live/
> 设计宽度：**1440px**（desktop）
> 字体规则：**Gotu 主导（99% 使用）+ Karla 仅用于 nav 链接**
> 数据来源：`官网.fig` Page-1/1440w-light（基于 Figma 源文件提取）
> 设计基调：**Editorial · 衬线主导 · 巨型滚动 Wordmark · Bauhaus 色块 · 1px 黑硬边框**

---

## 1. Design DNA

**"用衬线字体写出的科技公司宣言"**。

整个官网由 **Gotu 衬线字体撑起**，从 88px 的 footer tagline 到 14px 的 nav link 文字、再到段落正文，**几乎所有可见文字都是 Gotu**。Karla 只在 header 顶部 5 个 nav 链接处出现。这是 aisee 区别于绝大多数 SaaS 官网（一律 Inter/Karla 等无衬线）的核心识别。

视觉骨架：

```
极大 Gotu Hero 文案（48–68px）
  ↓
横向无限滚动的 lime "Hi it's aisee" 巨型 SVG marquee（opacity 0.32，跨越多个 section）
  ↓
1px solid #111 黑色硬边框分隔
  ↓
功能卡片 — 用淡彩色块底（lavender / pink-peach / lime variant / yellow variant）
  ↓
半透明白色 backdrop-filter:blur(8px) 覆盖在 marquee 上做 section 切分
  ↓
Footer：lime 半透底色 + 巨型 Gotu tagline + 装饰巨号句号
```

---

## 2. Color System

> 数据来自 `官网.fig/METADATA.md` 真实色频统计。

### 主色 / Brand
| Token | Value | Figma 使用频次 | 用途 |
|---|---|---|---|
| `--black` | `#111111` | 189× | 主文本、按钮、边框、所有 Gotu 文字 |
| `--white` | `#FFFFFF` | 24× | 主背景、卡片底 |
| `--lime` | `#CFF229` | 21× | Footer 半透底（×0.5）、Logo mark 底、巨型 marquee SVG 填色（opacity 0.32） |
| `--lime-bright` | `#C9FE12` | 1× | Logo mark 实际显示色（在 figma 里 logo 用的是这个稍亮的 lime） |
| `--lime-light` | `#C1FF74` | 2× | 功能卡片底（Brand Visualization 卡） |

### 装饰色（Bauhaus 色块）
> 每种颜色都只在 1–2 处装饰使用，**克制、不滥用**。

| Value | Figma 使用 | 用途 |
|---|---|---|
| `#EDE7FF` lavender | 1× fill | Feature card 底色（Brand Search Visualization 卡） |
| `#A7ACF6` periwinkle | 2× fill+stroke | 装饰图形、描边 |
| `#FCEA59` yellow variant | 2× fill | Article 配图 tile 底（Optimization / Agent Executor） |
| `#FFCA28` golden yellow | 2× fill | 装饰星形 SVG（Pricing section） |
| `#FFF59D` pale yellow | 2× fill | tag 底 / hint |
| `#FC72FF` magenta | 1× fill | 小装饰星（8×8 SVG） |
| `#FFB3D0` baby pink | 1× | 装饰 |
| `#FFD0FF` light magenta | 1× | 装饰 |
| `#BDF9FE` ice blue | 1× | 装饰 |
| `#AD7BFF` purple | 1× | 装饰 |
| `#9DC4F5` sky blue | 1× | 装饰 |
| `#FFB394` peach | 1× | 装饰 |
| `#E6FFF9` mint | 1× | 装饰 |

### 中性
| Token | Value | 用途 |
|---|---|---|
| `--bg-page` | `#F7F8F7` | FAQ section bg |
| `--gray-stroke` | `#D9D9D9` | 弱描边 |
| `--gray-text-warm` | `#5A585A` | 次级文本（4×） |
| `--border-faint` | `rgba(17,17,17,0.10–0.12)` | 卡片描边 |
| `--text-secondary` | `rgba(17,17,17,0.32)` | 占位、辅助 |

### Section 背景规则
- **白色 `#FFF`** — 默认背景
- **`#F7F8F7`** — FAQ 区块
- **`rgba(255,255,255,0.7) + backdrop-filter: blur(8px)`** — 当 section 覆盖在 lime marquee 上时
- **`rgba(207,255,41,0.5)`** — 仅 Footer
- **绝对禁止使用渐变背景**（图表渐变填充除外）

---

## 3. Typography（核心铁律）

> **官网字体规则**
> - **Gotu Regular** — **几乎所有文字**：Hero、Section title、Sub heading、段落正文、Card title、Article 描述、FAQ 标题 / 答案、按钮文字、Footer tagline + 链接、Logo wordmark 旁的图标文字
> - **Karla Regular** — **仅 5 处**：header 顶部 nav 链接（About / Pricing / Blog / FAQ + 一个空 home）
> - Karla Bold / SemiBold — 极少用，仅特殊强调（按钮 16px×3 处）

### 字体加载
```css
@font-face { font-family:'Karla'; src:url('fonts/Karla-VariableFont_wght.ttf') format('truetype'); font-weight:100 900; font-display:swap; }
@import url('https://fonts.googleapis.com/css2?family=Gotu&display=swap');
body { font-family:'Gotu', serif; color:#111; }
.nav-link { font-family:'Karla', sans-serif; }
```

### Gotu 尺寸阶梯（基于 figma 实际值）

```
Footer Tagline:        Gotu 86px / lh 158px            (+巨型句号 175.6px)
Hero Title L1:         Gotu 68px / lh 80px / -0.02em   "All-in-One GEO Toolkit built for the AI-first Internet."
Hero Title L2:         Gotu 48px / lh 60px             "Make Your Project Visible to AI."
Section Title:         Gotu 24–22px / lh 32px          "Boost your project's visibility…"
Sub Heading:           Gotu 22px / lh 32px             "Fully automated. Measurable impact…"
Sub Body:              Gotu 18px / lh 24px             正文段落（注意：依然是 Gotu，不是 Karla）
Article description:   Gotu 16px / lh 24px             feature 描述
Footer nav heading:    Gotu 17.6px / lh 17.56px        "Company" / "Resources"
Card Tag / Caption:    Gotu 16px / lh 24px             "Product Demo • Live Analytics"
CTA button:            Gotu 16px / lh 24px             "Start Free" / "Deploy"
Footer link:           Gotu 14px / underline
Hero placeholder:      Gotu 12px / opacity 0.32        "Your Project"
Quote eyebrow:         Gotu 15px                       侧栏小标
```

### Karla 尺寸（仅 nav 用）
```
Nav link:  Karla 16px Regular  /  #111  /  hover 加 underline
```

### 字距 & 行高
- 大字号（≥40px）：**letter-spacing: -0.02em ~ -0.03em**，line-height ≈ 1.0–1.2
- 中字号（18–32px）：letter-spacing: 0，line-height 1.3–1.5
- 小字号（≤16px）：letter-spacing: 0，line-height 1.5–1.7
- 段落 `text-wrap: pretty`，max-width 648px 左右

---

## 4. Layout

### 页面尺寸
- 设计宽度：**1440px**（figma 源宽）
- 总高度：约 **7340px**（整页约 5 屏）
- 主内容左右内边距：**48px**
- Hero 上下留白：top 96px / bottom 124px
- Section 上下 padding：**88–112px**

### 主结构（自上而下）
```
0   ────────────────────────────────────────────
    Header (70px, fixed, white/40% + blur(4px))
70  ────────────────────────────────────────────
    Hero  — 大字标题 + reel.mp4 缩略图 (498×318)
            背景：横向滚动 lime "Hi it's aisee" SVG (opacity 0.32)
            ↓ 下方紧接一个 1344×835 的产品 banner 图
~1600 ──────────────────────────────────────────
    Section 1: Boost your project's visibility
            背景叠加 backdrop-blur 在 marquee 之上
            内含 5 个 feature cards (3+2 网格)
~2700 ──────────────────────────────────────────
    Section 2: "Explore the Core Features of AIsee's GEO Engine"
            标题 + 3 个 Article 横向块
            每个 Article = [客户引言 + 描述] + [图表/产品 mock]
            背景色块：#C1FF74 / #FCEA59 / lime
~5600 ──────────────────────────────────────────
    CTA: Deploy 按钮
~5800 ──────────────────────────────────────────
    Pricing
~6500 ──────────────────────────────────────────
    FAQ (背景 #F7F8F7，accordion)
6930 ─────────────────────────────────────────
    Footer (410px, lime/50 底, 1px 黑边)
        "The future of discoverability." + "."
        Nav columns + social icons
7340 ─────────────────────────────────────────
```

### Spacing Scale
`4 / 8 / 12 / 16 / 24 / 32 / 48 / 56 / 64 / 88 / 112px` — 8px 为基础。

---

## 5. Border / Radius / Shadow

| 元素 | 规则 |
|---|---|
| Section / 卡片硬分隔 | `1px solid #111` ← figma 实际值（不是我之前推的 1.5px） |
| Footer 顶部 | `1px solid #111` |
| 按钮 / Pill | `border-radius: 9999px`；描边按钮 `1px solid #111` |
| 卡片描边 | `1px solid #111`（强强调）/ `1px solid rgba(17,17,17,0.10–0.12)`（弱） |
| 卡片圆角 | `8px / 12px` — figma 实际值 |
| 视频缩略图 | `border-radius: 8px`，1px 描边 `rgba(17,17,17,0.1)` |
| Social icon 圆形按钮 | `border-radius: 36px`，`1.23px solid #111` |
| Logo mark | `border-radius: 320px 320px 0 0`（拱形）/ `444px 444px 0 0`（变体） |
| 阴影 | **整站默认无阴影**（极简风格） |

---

## 6. Components

### 6.1 Header
```
Height: 70px
Background: rgba(255,255,255,0.4) + backdrop-filter: blur(4px)
Padding: 19px 48px
Layout: [Logo 25×26 + wordmark "aisee" (5 vectors)] ── flex-1 ── [nav links × 5] ── [CTA "Start Free"]
```
- Logo mark：`#C9FE12` 实色拱形 + 黑色 face + 白色椭圆眼
- Nav links：**Karla 16px** + hover underline，间距 32px
- CTA "Start Free"：`width:112px height:32px`，圆角 9999，白底 + 1px 黑描边，Gotu 16px

### 6.2 Hero
- 左：Gotu 48px "Make Your Project Visible to AI."（line-height 60px）
- 中央副标题：Gotu 68px / line-height 80px / 加 0.5px 黑描边（描边轮廓做轻微强化效果）
  > "All-in-One GEO Toolkit built for the AI-first Internet."
- 下方：Gotu 22px 一行 hook 文案
- 右：`reel.mp4` 缩略图（403×254，8px 圆角，1px `rgba(17,17,17,0.1)` 描边）+ Gotu 16px 标题 "Product Demo • Live Analytics"
- **背景层**：横向无限滚动的 SVG "Hi it's aisee" — 用 lime `#CFF229` 实色填充 + `opacity: 0.32`，宽度跨越 5700+ px，超出视口循环 → 这是官网最强烈的视觉符号。

### 6.3 巨型产品 Banner（Hero 下方）
- 尺寸：1344×835，圆角 12，`1px solid rgba(17,17,17,0.12)`
- 内容：完整产品截图作为 hero 之下的视觉锚点
- 左右 padding 48px 居中

### 6.4 Section Heading 区
- 左右 2 列分栏：左 Gotu 24px title，右 Gotu 22px sub + Gotu 18px body
- 左右各 648px 宽，间距 48px
- 容器外覆盖 `rgba(255,255,255,0.7) + backdrop-filter: blur(8px)`，把 marquee 柔化到背后

### 6.5 Feature Card（小卡片）
- 尺寸：428×约 437–576
- 圆角 12px，1px solid `#111`
- 顶部 video / 截图 tile（240.75px 高）
- 内嵌底色：
  - **Brand Search Visualization**：`#EDE7FF` lavender
  - **AI Visibility Audit**：浅色 + 几何角色插画
  - **End-to-End GEO Lifecycle**：白底
  - **Auto-Optimization**：浅色
  - **Performance Analytics**：紫色背景 + mascot 形象
- 下方文字：Gotu 22–24px title + Gotu 16–18px description

### 6.6 Article Row（大块产品图文）
- 三块横向排列：AEO Diagnostic Engine / Optimization Recommendation Engine / Agent Executor
- 每块结构：
  - 左侧引言：Gotu 32–48px 多行客户证言（如 "Founded in 2020, Ctrl was the world's first multichain wallet."）
  - 中部小字描述：Gotu 16–18px
  - 右侧：产品截图 / 图表组件（lime tile / yellow tile 背景）
- 背景 tile 色：
  - `#C1FF74`（lime variant，AEO tile）
  - `#FCEA59`（yellow variant，Optimization / Agent Executor tile）

### 6.7 CTA Button: "Deploy"
- 黑底白字 pill，Gotu 16px
- 居中放置在 Article rows 之后

### 6.8 Pricing
- 多卡片 tier，每卡上方放一个 emoji（这是 figma 里看到的，**官网在 Pricing 区块允许使用 emoji 作为装饰**，但 UI 其他地方禁止）
- 卡内有 `#FFCA28` 金黄星形 SVG 装饰
- 按钮：黑底 pill

### 6.9 FAQ
- 整段 section 背景：`#F7F8F7`
- Item 结构：
  - Border-top `1px solid #111`
  - 左侧 Gotu 18–22px 问题标题
  - 右侧 `+` icon SVG
  - 展开内容 Gotu 16–18px，颜色 `#111`
- 例题：
  - "What is GEO (Generalized Engine Optimization)?"
  - "Is GEO the same as SEO?"

### 6.10 Footer
```
Height: 410px
Background: rgba(207,255,41,0.5)  ← 半透 lime
Border: 1px solid #111
Layout:
  ┌──────────────────────────────────────────────────────────┐
  │  The future of discoverability.        (Gotu 86px)    .  │ ← 末尾巨号句号 Gotu 175.6px
  │                                                          │
  │  Company        Resources                        🇽 M in │ ← 3 个 social icon
  │   About          Top Analysis                            │   36×36 圆，1.23px 黑描边
  │                  Blog                                    │
  │                  FAQ                                     │
  │                  Docs                                    │
  └──────────────────────────────────────────────────────────┘
```
- Footer nav 标题：Gotu 17.6px
- Footer 链接：Gotu 14px underline
- Social icons：Twitter / Medium / LinkedIn，圆形 36×36，1.23px solid `#111`，内嵌 SVG 黑色

### 6.11 Logo Mark
- 拱形 25×26（header）/ 25×25 内嵌 face
- Outer：`#C9FE12` 实色 `border-radius: 320px 320px 0 0`
- Inner face：`#D9D9D9` 占位灰 + 上覆 PNG 头像（`./assets/8afbf53c1df6.png` 是吉祥物 face）
- Wordmark "aisee"：由 5 个 Vector SVG 字形组成（不是字体直接渲染，是 SVG path）

### 6.12 Iconography
- 全部使用 SVG path 内联，无外部 icon font
- Stroke：1–2px，黑色
- Footer social icons / FAQ + 图标都是定制 SVG

---

## 7. 入场动画（Entry Animations）

> 缓动统一：`cubic-bezier(0.16, 1, 0.3, 1)`（赋值给 `--ease-out`）。
> 动画在 DOMContentLoaded 后按 delay 序列播放。

### 7.1 Nav 滑入
```css
nav {
  transform: translateY(-100%);
  animation: navIn .6s var(--ease-out) .1s forwards;
}
@keyframes navIn { to { transform: translateY(0); } }
```

### 7.2 Hero 标题逐行 Reveal（核心动画）
两行标题 / 三段文字依次进入：
```css
.hero-line { overflow: hidden; display: block; line-height: 1.0; }
.hero-line-inner {
  display: block;
  transform: translateY(110%);
  animation: slideUp .9s var(--ease-out) forwards;
}
.hero-line:nth-child(1) .hero-line-inner { animation-delay: .45s; }  /* "Make Your Project Visible to AI." */
.hero-line:nth-child(2) .hero-line-inner { animation-delay: .65s; }  /* "All-in-One GEO Toolkit…" */
.hero-line:nth-child(3) .hero-line-inner { animation-delay: .90s; }  /* sub hook */
@keyframes slideUp { to { transform: translateY(0); } }
```

### 7.3 Reel 缩略图 + 副文本淡入
```css
.hero-reel,
.hero-sub-extra {
  opacity: 0;
  transform: translateY(16px);
  animation: fadeUp .7s var(--ease-out) 1.05s forwards;
}
.hero-reel { animation-delay: 1.20s; }
@keyframes fadeUp { to { opacity: 1; transform: none; } }
```

### 7.4 Lime "Hi it's aisee" Marquee 无限横向滚动 ★ 核心视觉
```css
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 60s linear infinite;
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }   /* SVG 内重复 2 份 */
}
```
- 整段 SVG 宽 ~5700px，复制一份并排接续，让 50% 偏移正好首尾接缝
- `opacity: 0.32`，颜色 `#CFF229`
- 在 hero 与第二个 section 都出现一次（不同位置 / 不同 opacity 叠加）
- hover 页面不停顿，**永不暂停**

### 7.5 Section Scroll Reveal
用 IntersectionObserver 在 section 进入视口时给 `.in` 类：
```css
.rv  { opacity: 0; transform: translateY(28px); transition: opacity .72s var(--ease-out), transform .72s var(--ease-out); }
.rvl { opacity: 0; transform: translateX(-24px); transition: opacity .72s var(--ease-out), transform .72s var(--ease-out); }
.rv.in, .rvl.in { opacity: 1; transform: none; }
```
- Section title → body → cards 之间分别 0 / 100 / 200ms `transition-delay` 错位

### 7.6 Article Row 进入
- 左引言文字逐行 reveal（同 hero 模式，3 行 0.15s 间隔）
- 右侧产品 mock 从 `translateY(40px) scale(0.96)` → `0` + opacity 0→1，0.9s

### 7.7 Footer 巨型 tagline 入场
- 进入视口时 `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)`，1.2s `--ease-out`，从右到左揭示
- 巨号句号 "." 单独 `scale(0)` → `scale(1)`，弹性 ease：`cubic-bezier(.34, 1.56, .64, 1)`，0.6s

### 7.8 时间轴
```
 0.0s  ┬ Nav 滑入
 0.45s ┤ Hero title L1
 0.65s ┤ Hero title L2
 0.90s ┤ Hero sub-hook
 1.05s ┤ Hero sub 段落
 1.20s ┤ Hero reel 缩略图
 自动 ┴ Lime marquee 永远横向滚动（独立循环）
```

---

## 8. 交互动画（Interaction）

### 8.1 Custom Cursor（推荐保留）
- 描边圆点 + `mix-blend-mode: difference` 跟随
- 经过 a / button / .hover 元素 → 放大 ×3

### 8.2 Button Hover — Lime Wipe（核心）
```css
.btn-primary { position: relative; overflow: hidden; background: #111; color: #fff; }
.btn-primary::after {
  content: ''; position: absolute; inset: 0;
  background: #CFF229; transform: scaleX(0); transform-origin: left;
  transition: transform .35s var(--ease-out);
}
.btn-primary span { position: relative; z-index: 1; transition: color .35s; }
.btn-primary:hover::after { transform: scaleX(1); }
.btn-primary:hover span { color: #111; }
```
- White ghost button hover：背景从 white 变 lime（不是 wipe）

### 8.3 Nav Link Hover
- Karla 16px 文字 hover 时下方出现 1px underline，左→右 0.25s scale 揭示

### 8.4 Card Hover
- `transform: translateY(-4px)` + border color 加深到 `#111`
- 0.25s ease

### 8.5 Sticky Nav 滚动响应
- 滚动 >24px：`background: rgba(255,255,255,0.9)` + `border-bottom: 1px solid #111` 出现
- 滚动到顶：恢复 `0.4 + blur(4px)` 状态

### 8.6 FAQ Accordion
- 点击 → `+` 旋转 45° 变 `×`
- 内容 `max-height: 0 → measured` + `opacity 0 → 1`，0.3s ease

### 8.7 Article 产品图 hover
- 内部 mock 数据条 / icon 微动（subtle wiggle）

### 8.8 Reel 缩略图 hover
- 鼠标在 reel 上时 cursor 放大为 "▶ PLAY" 文字标签（mix-blend 形式）

### 8.9 通用过渡
- 所有 hover / focus：0.2–0.35s + `--ease-out`
- 禁用 `transition: all`，只过渡需要变化的属性

---

## 9. 资源 & Assets

| 路径 | 说明 |
|---|---|
| `fonts/Karla-VariableFont_wght.ttf` | Karla 本地字体 |
| Gotu | Google Fonts CDN |
| `assets/8afbf53c1df6.png` | Mascot face（Logo mark 内的吉祥物 face） |
| `assets/c44fb8fd7df5.png` (815KB) | Hero reel.mp4 缩略图 / 大产品 banner |
| `assets/fbbed3c10862.png` (817KB) | 大产品 banner 第二层 |
| `Hi-it-s-aisee.svg` | 横向滚动 marquee SVG |
| `Vector.svg`（多份） | 各 section 内的 SVG 装饰、icon、wordmark 字形 |

---

## 10. 文案 & Tone

- 品牌名：UI 写 "aisee"，正文里强调可写 "AIsee"（FAQ 答案里出现 "AIsee analyzes how AI agents..."）
- Tagline："The future of discoverability."（句号是视觉元素，放大成装饰符号）
- Hero："Make Your Project Visible to AI."（句号 + 简短 + 命令式）
- 副 hook："All-in-One GEO Toolkit built for the AI-first Internet."
- Sub："AI engines discover answers — make sure yours is one of them."
- Section title：句号结尾，类似宣言体："Boost your project's visibility across AI engines."
- Article 引言用 customer quote 形式（带数字）："Founded in 2020, Ctrl was the world's first multichain wallet."
- 段落使用全角破折号 `—` 增加节奏感
- 禁止表情符号（**除 Pricing 区块允许 emoji 作 tier 标识**）

---

## 11. Do / Don't

| Do ✅ | Don't ❌ |
|---|---|
| 99% Gotu，正文 / 段落 / 标题 / 按钮一律 Gotu | 用 Karla 写正文或副标题 |
| Karla 只用在 5 个 nav 链接 | 用 Karla 写 hero / footer / FAQ |
| 1px solid #111 黑色硬边框（不是 1.5px） | 阴影、glass 拟态、渐变 |
| Lime marquee 横滚是核心视觉，必出现 | 删掉 marquee 用纯白底 |
| 装饰色块克制，每色 1–2 处出现 | 多色拼贴堆砌 |
| 大字号字距收紧 `-0.02em` | 大字号默认字距 |
| 巨型句号 "." 作装饰符号（Hero / Footer） | 句号当成普通标点 |
| Pricing 允许 emoji | 其他 section 用 emoji |
| Hero marquee + 大产品 banner 必须同时出场 | 删掉 banner 只保留 marquee |

---

## 12. 与 dApp 的关系

| 维度 | Homepage 官网 | dApp |
|---|---|---|
| 字体主导 | **Gotu 99%** + Karla 仅 nav | **Karla 99%** + Gotu 仅页面一级标题 |
| 主色调 | 黑 + 白 + lime（半透）+ 多种装饰色块 | 白 + 浅灰 + lime / yellow 分功能区点缀 |
| 边框 | 1px solid #111 硬边框 | 1px 极淡灰描边 / 无 |
| 阴影 | 几乎不用 | 三档柔和阴影 |
| 装饰 | 巨型 lime marquee + 色块 + 客户引言 | 无装饰 |
| 动画 | 入场动画 + 永久 marquee + cursor | 仅功能反馈 |
| 信息密度 | 低（editorial） | 高（dashboard） |

两端共用：lime + yellow + orange 色板 token、logo mark、Karla 字体（用法不同）、8px spacing、aisee 品牌 tone。

---

> 文档版本：v2.0 · 2026-05-15
> 数据来源：`官网.fig` Figma 源文件（Page-1/1440w-light）+ aisee.live
