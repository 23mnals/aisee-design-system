# aisee Homepage — Design Specification

> **适用范围**：aisee 官网 https://aisee.live/
> **设计宽度**：1440px（desktop），响应式断点 `max-md: 768px`
> **字体规则**：**Gotu 默认全局**；Karla **仅** 用于 Pricing 卡片内部分元素
> **数据来源**：`aisee-website` 源码（Next.js 15 + Tailwind v4 + Framer Motion + GSAP + Matter.js + Swiper）
> **设计基调**：Editorial · 衬线主导 · 滚动驱动动画 · Bauhaus 色块 · 1px 黑硬边框

---

## 1. Design DNA

**"用衬线字体写出的科技公司宣言 + 滚动驱动的动画剧场"**。

aisee 官网把网页当电影：每个 section 由 IntersectionObserver 触发自己的入场动画；Hero 用 GSAP pin-scroll 把图片从 384px "拉开"到全宽、文案同步上移消失；背景永远有一个慢速横滚的 lime "Hi it's aisee" 巨型 SVG（opacity 0.32）；Footer 不是静态 tagline，而是 typewriter 敲字 + 删除循环，光标是一颗 175px 的句号。

技术栈：

| 用途 | 库 | 备注 |
|---|---|---|
| 框架 | Next.js 15 (App Router) | `'use client'` 渲染所有动画 |
| 样式 | **Tailwind CSS v4** + tw-animate-css | 全部 utility，无独立 CSS 文件 |
| 入场动画 | IntersectionObserver（自研 `AnimationContext`）| threshold 0.2，可 once 或 repeat |
| 滚动 pin / scrub | **GSAP + ScrollTrigger** | Hero (slider_1) 用 pin + scrub timeline |
| 微动画 / 拖拽 | Framer Motion 12 + Motion | useSpring / useMotionValue 做 countup |
| 物理动画 | **Matter.js** | "Recommend" 关键词从天而降、可拖动 |
| 鼠标轨迹 | GSAP（自研 ImageTrail）| Footer 鼠标移动留 SVG 图案 |
| 轮播 | Swiper 11（vertical creative effect）| Slider 2 |
| 图标 | lucide-react + 自定义 SVG / GIF | 部分图标用 GIF 动起来 |

---

## 2. Color System（基于真实代码）

### 2.1 Brand Core
| Token | Hex | 使用位置 |
|---|---|---|
| `#111111` | black | 文本 / border / icon（100% 默认） |
| `#FFFFFF` | white | body bg |
| **`#CFFF29`** | lime（**官网与 dApp 共用主色**） | Logo mark、Pricing active tab、btn-30 hover wipe、btn 标签、Footer 半透底 `rgba(207,255,41,0.50)` |
| `#5DD562` | green | Pricing 标题装饰椭圆框 |
| `#FCEA59` | yellow | Slider 4 第 3 卡 bg、FallingText 标签 |
| `#D3F6A9` | lime-light | Slider 4 第 1 卡 bg、FallingText 标签 |
| `#FFD0E2` | pink | Slider 4 第 2 卡 bg、FallingText 标签 |
| `#FFD0FF` | light magenta | Slider 3 icon 容器 |
| `#BDF9FE` | ice blue | Slider 3 icon 容器 |
| `#C1FF74` | lime-light variant | Slider 3 icon 容器 |
| `#EDE7FF` | lavender | Slider 2 "Analyze" 卡 bg |
| `#E6FFF9` | mint | Slider 2 "Visibility Boost" 卡、Slider 4 标题圆 |
| `#FFF0F6` | pink-pale | Slider 2 "Score" 卡 bg |
| `#FF88B5` | hot pink | FallingText 标签 |
| `#F5FFD4` | lime-pale | Slider 2 引言高亮底（"Where do we stand..."） |
| `#4353FF` | blue | FallingText 标签 |
| `#F7F8F7` | bg-gray | FAQ section 半透底 |
| `#ECEFEC` | bg-gray | Pricing card 描边、tab bg |
| `#5A585A` | warm-gray | Footer 链接文字色 |
| `#D1D6E0` | gray-medium | Developer 卡片 dashed |

### 2.2 透明度 / Backdrop
- Header：`bg-white/40 backdrop-blur-[2px]`
- Slider 2 section：`bg-white/70 backdrop-blur-[4px]`
- FAQ section：`bg-[rgba(247,248,247,0.70)] backdrop-blur-[2px]`
- Marquee SVG：`opacity-[0.32]`
- Footer：`bg-[rgba(207,255,41,0.50)]`

### 2.3 配色铁律
1. 大面积底色只有 4 种：纯白 / `white/40-70` + blur / `#F7F8F7/70` + blur / `lime/50`（仅 Footer）
2. 装饰色块 12+ 种，**每种只用于 1 个具体元素**（一卡一色）
3. lime / yellow 实色只出现在按钮、tab active、小装饰圆——**不大面积铺**
4. 渐变仅出现于 Pricing `.pro-only`：`linear-gradient(91deg, rgba(207,255,41,0.12), rgba(255,237,41,0.12))`

---

## 3. Typography

### 3.1 加载方式（基于 `layout.tsx`）

```tsx
const Gotu = localFont({
  src: "./fonts/Gotu-Regular.ttf",
  weight: "400",
  variable: "--font-gotu"
});
const Karla = localFont({
  src: "./fonts/Karla-VariableFont_wght.ttf",
  variable: "--font-karla",
  weight: "200 800"
});

<body className={`${Gotu.className} ${Karla.variable} antialiased`}>
```

**关键：`Gotu.className` 直接挂到 `<body>` 上——全站默认就是 Gotu**。Karla 仅暴露为 CSS 变量 `--font-karla`，需要用 `.font-karla` 显式 opt-in。

### 3.2 字体职责（核心铁律）

```
默认全局            → Gotu Regular
Pricing 卡片细节内容 → Karla（`font-karla` 显式标记的元素）
text-stroke 工具    → 给文字加 webkit-text-stroke 描边
```

`.font-karla` 在源码中的使用：
- Pricing 卡片整体 `<article>` 加 `font-karla`
- `<CountUp>` 数字加 `font-karla font-bold` / `font-semibold`
- Pricing tab 切换按钮 `font-karla`
- Slider 4/5 卡片内部分文字
- Pricing feature ul / li 内文（`classNames.feature = "text-sm font-normal ..."`）

**结论**：可以把 Karla 理解为 dApp 的"残留"——**只在 Pricing 这种密集数据卡片中用 Karla 保证可读性**，其余 99% 是 Gotu。

### 3.3 尺寸阶梯（基于源码实测）

```
Footer Tagline:        text-[86px]   leading-[183.721%]    Gotu (TextType typewriter)
Footer 巨型 ".":       text-[86px] 末尾 cursorCharacter="."  Gotu
FAQ 标题 "FAQ":         text-[100px]  leading-[97.565%]      Gotu
Pricing big title:     text-[124px]  leading-[122.038%]     Gotu
Slider 4 标题:         text-[84.3px] leading-[108.327%]     Gotu
Slider 2 nav (大词):    text-[88px]   leading-[109.091%]     Gotu / uppercase / opacity-25 默认 / hover 100
                                                              xl 以下 70px
Hero L2:               text-[68px]   leading-[117.647%]     Gotu + text-stroke-1
Hero L1:               text-[48px]   leading-[125%]          Gotu
Slider 4 卡片标题:      text-[36px]   leading-[133.333%]      Gotu / tracking-[-1.25px]
Slider 3 卡片标题:      text-[24px]   leading-[133.333%]      Gotu
FAQ 问题:              text-[24px]   leading-[32px]          Gotu
Slider 2 H2:           text-[24px]   leading-[133.333%]      Gotu + text-stroke-5
Hero sub:              text-[22px]   leading-[145.455%]      Gotu
Slider 2 sub:          text-[22px]   leading-[145.455%]      Gotu + text-stroke-5
FAQ 答案 / Slider 3 描述:text-[18px]  leading-[150%]          Gotu
Pricing card name:     text-[18px]   leading-[27px]          Karla
Footer "Company":      text-[17px]   leading-[99.773%]       Gotu
Slider 1 caption / Header nav / btn: text-[16px] leading-[150%] Gotu
Pricing description:   text-[16px]   leading-[24px]          Karla
Slider 2 切换内容:      text-[16.734px] leading-[134.454%]    Gotu
Pricing price 大数字:   text-[26px]   leading-[39px]          Karla SemiBold + CountUp
Pricing 数字 credit:    text-[20px]   font-bold               Karla
Pricing tab text:      text-[16px]   leading-[150%]          Karla
Pricing feature:       text-sm font-normal                    Karla
Footer link:           text-[14px]   leading-[100%]          Gotu / `#5A585A`
"Soon" tag:            text-[12px]   font-gotu               Gotu / bg `rgba(17,17,17,0.05)`
```

### 3.4 文字描边工具类（globals.css）
```css
.text-stroke   { -webkit-text-stroke-width: 0.2px; -webkit-text-stroke-color: #111111; }
.text-stroke-5 { -webkit-text-stroke-width: 0.5px; -webkit-text-stroke-color: #111111; }
.text-stroke-1 { -webkit-text-stroke-width: 1px;   -webkit-text-stroke-color: #111111; }
```
- 大字号常加 `text-stroke-1` 让 Gotu 看起来更厚实
- 引言行加 `text-stroke` (0.2px) 让 16px 文字有一点重量感

---

## 4. Layout

```
0  ─────────────────────────────────────────────────────────
   Header (fixed, 44px min, bg-white/40 + blur(2px), px-12 py-[13px])
   左：Logo 25×25 GIF + "aisee" SVG 80×24
   中：Blog / FAQ nav (gap-8, mx-[56px])
   右：btn-59 "START FREE" pill (border #111, rounded-full)
─────────────────────────────────────────────────────────
   <BgTxt /> — fixed 全屏背景，4 张 lime "Hi it's aisee" SVG
              横向 scroll-left 20s linear infinite
              opacity-[0.32]
─────────────────────────────────────────────────────────
   <Tips />  — 滚动提示，pageYOffset 检测，1.5s 无滚动时显示
─────────────────────────────────────────────────────────
   Slider 1 (Hero) — min-h-screen, pt-[100px] pb-[27px] px-12
     右上：product demo 384px 图 (GSAP 滚动撑到全宽 → 文字消失)
     左下：absolute top-[calc(100vh-310px)] 三行 Gotu 大标题
─────────────────────────────────────────────────────────
   Slider 2 — pt-[96px] pb-[124px] px-12, bg-white/70 + blur(4px)
     12 列 grid: 左 4 列 (Swiper 垂直 + 描述), 右 8 列 (6 行 88px 大词 nav)
─────────────────────────────────────────────────────────
   Slider 3 — px-12 py-[72px]
     4 列 grid，每张卡顶部 40×40 GIF 圆 / 方框，下面 Gotu 24px 标题 + 描述
     入场延迟：transitionDelay: (i+1) * 500ms
─────────────────────────────────────────────────────────
   Slider 4 — px-12 pb-[72px]
     居中巨型 Gotu 84.3px 标题 (含一个 72×72 圆框装饰)
     3 列彩色卡片 rounded-[24px] pt-8 px-6
       - 卡 1 (#D2F6A7)：Stack drag 卡牌堆叠
       - 卡 2 (#FFD0E2)：AnimatedList 滚动列表
       - 卡 3 (#FCEA59)：CardStack 5s 循环洗牌
     hover：`-translate-y-4` 整张卡上浮
─────────────────────────────────────────────────────────
   Slider 5 (Pricing) — px-12 pt-[32px] pb-[48px]
     Gotu 124px 标题 + Monthly/Yearly tab + 3 个 PricingCard
     hover：btn-30 圆形 lime 扩散动画
─────────────────────────────────────────────────────────
   Slider 6 (FAQ) — px-12 pt-[32px] pb-[48px]
                    bg-[rgba(247,248,247,0.70)] + blur(2px)
     Gotu 100px "FAQ" 标题
     accordion items：border-2 #111, rounded-2xl, 圆形 +/- 按钮
                      open 时按钮 hover bg-[#111] 黑底白色
─────────────────────────────────────────────────────────
   Footer — px-12 pb-10, border-t #111, bg-[rgba(207,255,41,0.5)]
     背后跑 ImageTrail GSAP 鼠标轨迹（5 个 SVG 装饰）
     TextType 86px 循环敲打 "The future of discoverability"
     cursorCharacter="."（也就是巨号句号是 typewriter cursor 本体！）
     左下：Company / Resources 两组链接（gap-[105px]）
     右下：3 个 social 圆 35×35（border 1.2px #111，hover scale-110）
─────────────────────────────────────────────────────────
```

### Spacing Scale
基于 Tailwind 默认 + 自定义 px 值：`4 / 8 / 12 / 16 / 24 / 32 / 48 / 72 / 96 / 124px`

### Header
- 高度：`py-[13px]` + `min-h-[44px]`（实际约 50px，**比之前推测的 70px 矮**）
- 内边距：`px-12 max-md:px-4`
- 背景：`bg-white/40 backdrop-blur-[2px]`
- 没有 border-bottom

---

## 5. Border / Radius / Shadow

| 元素 | 规则 |
|---|---|
| Footer 顶部分隔 | `border-t-[1px] border-[#111111]` |
| FAQ item | `border-2 border-[#111111] rounded-2xl` |
| Slider 3 icon 容器 | `border-[1.5px] border-[#111111]` (40×40，rounded-[12px] / rounded-[50%]) |
| Slider 4 卡片装饰圆框 | `border border-[#111111] rounded-full` |
| Slider 2 内容卡 | `border border-[#111111] border-solid rounded-[12px]` |
| Pricing 卡片 | `border border-[#ECEFEC] rounded-[24px]`（极淡灰，**不是黑色硬边**）|
| Pricing tab | `border border-[#ECEFEC] rounded-[10px]` |
| Pricing 标题装饰圆框 | `border-[2.75px] border-[#111111] rounded-[100%]` |
| Hero 大标题描边 | `.text-stroke-1`（webkit-text-stroke 1px #111） |
| Header CTA "Start Free" | `border-solid border-[#111111] border px-4 py-2.5 rounded-[9999px]` |
| Social icon 圆 | `border-[1.2px] border-[#111111] rounded-full` 35×35 |
| **阴影** | **整站不使用 box-shadow**（极简） |

---

## 6. Components

### 6.1 Header（`Header.tsx`）
```tsx
<header className="bg-white/40 backdrop-blur-[2px] flex items-center justify-between
                   px-12 py-[13px] min-h-[44px] fixed top-0 z-999 max-md:px-4">
  <Link><Image /* logo.gif 28×28 */> <Image /* aisee.svg 80×24 */></Link>
  <nav>
    {/* gap-8, mx-[56px], text-[16px] */}
    <Link className="group relative">
      Blog
      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#111]
                       group-hover:w-full transition-all duration-300" />
    </Link>
    <a className="btn-59">
      <span className="border-[#111] border px-4 py-2.5 rounded-full uppercase">
        Start Free
      </span>
    </a>
  </nav>
</header>
```
- **Logo 是 `.gif`** —— 不是静态图，自带循环动画
- Nav link hover：底部 1px 横线从 0 宽度 → 100% 宽度（`group-hover:w-full`）
- "Start Free" 按钮 hover：触发 `btn-59` **tada 动画**（详见 8.1）

### 6.2 BgTxt 横向 Marquee（核心视觉，`bg-txt.tsx`）
- **位置**：`fixed top-0 left-0 w-full h-full`，**始终铺满整个屏幕**
- 4 份 SVG 横向并列：每份 `h-[90%] w-auto object-contain`
- 动画：`animate-scroll-left`，CSS keyframe `translateX(0 → -100%)`，**20s linear infinite**
- 颜色：lime `#CFFF29`（SVG 文件本身的填色），整体 `opacity-[0.32]`
- `aria-hidden="true"` —— 不参与可访问性
- pointer-events 默认（**注意 source 里没禁用，可能会影响鼠标事件**）

### 6.3 Slider 1 — Hero with GSAP Pin Scroll
**核心机制**：进入页面时图片 384px 宽，文字 100% 可见；滚动 1500px 内：
- 图片 width: `384px → 100% wrapper width`，由 `ScrollTrigger { start:"top top", end:"+=1500", scrub:true, pin:true }` 驱动
- 文字 `opacity: 1 → 0` 同时 `y: 0 → -100px`
- wrapper 设 `minHeight: expandedHeight + 100px` 保证撑开

```tsx
const tl = gsap.timeline({
  scrollTrigger: { trigger: wrapper, start:"top top", end:"+=1500",
                   scrub:true, pin:true, invalidateOnRefresh:true }
});
tl.fromTo(img, { width: 384 }, { width: wrapperWidth, ease:"none" }, 0)
  .to(text, { opacity: 0, y: -100, ease:"none" }, 0);
```

**Mobile（≤768px）**：完全禁用 pin & scrub，图片 width:100%，文字一直显示。

**文案**：
- L1：text-[48px] "Make Your Project Visible to AI."
- L2：text-[68px] leading-[117.647%] text-stroke-1 "All-in-One GEO Toolkit built for the AI-first internet."
- L3：text-[22px] "AI engines discover answers — make sure yours is one of them."

### 6.4 Slider 2 — Swiper Vertical + Hover Switch
**布局**：12 列 grid，左 4 列右 8 列。

**左侧** = Swiper (vertical creative effect)
- `direction="vertical"`, `speed: 1000`, `effect: "creative"`
- creativeEffect prev: `translate: [0, "calc(-10% - 20px)", -1000]`, `scale: 0.8`
- creativeEffect next: `translate: [0, "calc(100% + 20px)", 0]`
- 高度：`clamp(200px, 20vw, 400px)`
- 内容卡：`bg-white rounded-[12px] border border-[#111111]`

**右侧** = 6 行 Gotu 88px 大词 nav
- 每个 button：`text-[88px] uppercase opacity-25 hover:opacity-100`
- **onMouseEnter** 触发 `handleIndexChange(i)`（50ms 防抖）
- active item 强制 `!opacity-100`
- 切换时 Swiper.slideTo(i) + 左侧描述 fade in/out 0.5s

**关键动画 — "Recommend" 卡 (`FallingText`)**：
- 使用 **Matter.js 物理引擎**
- 关键词字符串 "Add Schema.org, AI-Ready Text, ..." 按 `,` 分割成单独 `<span>`，每个 span 不同色块（lime / 黑 / 蓝 / 黄 / 粉 / 浅粉），都是 `border-radius: 100px` pill
- desktop 触发：`trigger="manual"`，鼠标 hover 该卡时调用 ref-trigger 函数；mobile：`trigger="auto"`
- gravity 0.8，让标签像积木一样从顶部坠落、堆叠、可拖拽

**Execute 卡（`ScrollingElements`）**：
- 5 个图标在垂直方向无限循环上下滚动
- gap 50, xOffset 150, duration 20s

### 6.5 Slider 3 — 4 列 Feature Grid
- ul.grid grid-cols-4 gap-8 list-none
- 每张卡：40×40 icon 容器（带 1.5px 黑边） + Gotu 24px 标题 + Gotu 16px 多段描述
- icon 内是动态 GIF（slider_3/001.gif ~ 004.gif）
- 不同卡的 icon bg 颜色：`#FFD0FF` / `#BDF9FE` / `#D9D9D9` / `#C1FF74`
- 不同卡的 icon 形状：rounded-[12px] / rounded-[50%] 交替
- **入场**：每张卡 `transitionDelay: (i+1) * 500ms`，从下方 20px + opacity 0 进入

### 6.6 Slider 4 — Explore Core Features
**标题**：
```tsx
<h2>Explore the
  <span /* 72×72 圆框，bg #E6FFF9，1px border #111 */>
    <Image src="/images/slider_4/1.gif" />
  </span>
  Core Features of
</h2>
<h2>AIsee's GEO Engine</h2>
```
- 左行从左 -50 滑入；右行 delay-100 从右 +50 滑入

**3 张卡片**（rounded-[24px]，hover `-translate-y-4`）：
| # | bg | 动画组件 |
|---|---|---|
| 0 | `#D2F6A7` | `<Stack>` — Framer Motion 可拖拽卡牌堆叠（drag 后送回最底，5 张图片） |
| 1 | `#FFD0E2` | `<AnimatedList delay={2000}>` — 列表项 2s 间隔从上方进入 |
| 2 | `#FCEA59` | `<CardStack offset={20} scaleFactor={0.1}>` — 5s setInterval 把最后一张移到最前 |

入场：每张卡 `transitionDelay: i * 100ms`，`scale 0.9 → 1` + `translateY(50) → 0`

### 6.7 Slider 5 — Pricing
**标题**：Gotu 124px "Offer tiered pricing based on [小 GIF 椭圆框] functionality"
- 装饰圆：`border-[2.75px] #111 rounded-[100%] bg-#5DD562 w-[98px] h-[76px]`

**Tab**（Monthly / Yearly）：
- 容器 `border border-[#ECEFEC] rounded-[10px] bg-[#ECEFEC] p-[6px]`
- active tab：`bg-[#CFFF29]`，inactive：`bg-[#ECEFEC]`
- Yearly tab 内嵌 `15% off` 标签（白底圆角 32px）

**3 张 PricingCard**：
- 标准卡 `border-[#ECEFEC] rounded-[24px] p-[30px] bg-white`
- 带 `tag` 的 Developer 卡 `bg-[#ECEFEC]`（图灰底高亮）
- icon 50×50 PNG + 价格 CountUp + plan name + `bg-[#cfff29]` tag pill + 描述 + Credits（**Karla** font-bold）
- `<hr>` 用 `border-dashed`
- 主按钮 `btn-30 h-[52px] rounded-[10px]`，详见 8.2
- feature list：`<ul>` 列表，每项左边带 ✓ icon（`bg-[#CFFF29] p-[6px] rounded-md`）或灰色 ✗ icon
- "Soon" 标签：12px Gotu，`bg-[rgba(17,17,17,0.05)] rounded-[4px]`
- Pro Only 区块：渐变背景 `linear-gradient(91deg, lime/12, yellow/12)` + 右下角 64×64 装饰 SVG

**CountUp 数字动画**：
- 用 Framer Motion `useMotionValue` + `useSpring`（damping 25, stiffness 120）
- isInView 检测，进入视口播放一次
- duration 1.5s，from 0 → to 99/270/594
- credit countup 用 separator `","`

### 6.8 Slider 6 — FAQ Accordion
- 容器 section：`bg-[rgba(247,248,247,0.70)] backdrop-blur-[2px]`
- 标题 "FAQ" Gotu 100px
- 6 个 item，`<dl><dt><dd>` 语义化
- item 容器：`border-2 border-[#111111] rounded-2xl bg-[#f7f8f7]`
- 按钮：`px-10 py-[18px]`，左侧 Gotu 24px 问题 / 右侧 40×40 圆形 ±按钮
- 圆形按钮 hover：
  ```
  内部 absolute bg-[#111] rounded-[40px] scale-0
  group-hover:scale-100 transition-transform duration-300 ease-out
  → 黑色填充从中心扩散
  内部 icon 同时 group-hover:text-white
  ```
- 展开/收起：`max-h-0 → max-h-[500px]` + `opacity 0 → 1`，300ms ease-in-out
- icon 切换：`isExpanded ? <MinusIcon /> : <AddIcon />`
- 每条入场 `transitionDelay: i * 100ms`

### 6.9 Footer
- bg `rgba(207,255,41,0.50)`，border-t 1px #111
- 后面跑 `<ImageTrail />` — 鼠标移动时 5 个装饰 SVG 沿轨迹被吸出来（GSAP 实现），mouse-distance 计算
- 主 tagline：
  ```tsx
  <TextType
    text={["The future of discoverability","The future of discoverability"]}
    typingSpeed={100}
    deletingSpeed={70}
    pauseDuration={1500}
    cursorCharacter="."
    loop={true}
    startOnVisible={true}
  />
  ```
  text-[86px] leading-[183.721%]
- **巨型句号 = typewriter cursor**！cursorBlinkDuration 默认 0.5s
- nav columns：`Company`（About）+ `Resources`（Blog / FAQ / Github / Docs）
- 链接 14px Gotu `#5A585A`，hover：底部 1px 横线展开 + text-primary
- social 圆 35×35：`border-[1.2px] #111 rounded-full`，hover `scale-110`
- 内嵌 X / Medium / LinkedIn 三个 SVG

### 6.10 Tips（滚动提示器）
- 检测 `pageYOffset`，滚动开始时立即隐藏，停止后 1.5s 重新显示
- 同时检测是否滚到底（pageYOffset + windowHeight ≥ documentHeight - 10）

---

## 7. 入场动画系统（核心：`AnimationContext`）

### 7.1 通用机制
```tsx
const { registerAnimation, isVisible, setRef } = useAnimation();
const sectionRef = useRef<HTMLElement>(null);
useEffect(() => {
  registerAnimation("slider3", false);    // false = play once
  setRef("slider3", sectionRef);
}, []);
const visible = isVisible("slider3");
```
- 内部用 IntersectionObserver
  - `threshold: 0.2`
  - `rootMargin: "0px 0px 0px 0px"`
- once 模式：进入视口后 unobserve；repeat 模式：离开视口重置状态

### 7.2 入场动画模式（统一）
所有 slider 都用 Tailwind transition utility，配合 `visible` 切换 class：

```tsx
className={`transition-all duration-300 ${
  visible
    ? "opacity-100 translate-x-0"
    : "opacity-0 translate-x-[-50px]"
}`}
```

常用方向 / 距离：
| 方向 | distance | 用法 |
|---|---|---|
| 从左滑入 | `translate-x-[-50px]` → 0 | 标题、Slider 2/4 左半 |
| 从右滑入 | `translate-x-[50px]` → 0 | 标题右半、Slider 2 右半 |
| 从下进入 | `translate-y-[20-100px]` → 0 | Slider 3/6 卡片、Slider 5 卡片 |
| 从上进入 | `translate-y-[-20px]` → 0 | Pricing tab |
| scale 进入 | `scale-90 → scale-100` | Slider 4/5 卡片 |
| opacity only | `opacity-0 → opacity-100` | 文字描述 |
| 组合 | `opacity + translate + scale` | 大卡片 |

时长 / 缓动：
- 默认 `duration-300`（300ms）
- `ease-in-out` 默认
- 一些列表用 `duration-700` (Slider 4 bounce-twice)
- **关键**：错峰 `transitionDelay` —— `i * 100ms` 或 `(i+1) * 500ms`，制造瀑布感

### 7.3 Hero GSAP Pin（Slider 1）
见 6.3，**不走 AnimationContext**，独立 GSAP timeline + ScrollTrigger。

### 7.4 永久循环动画

**Marquee 滚动**（`bg-txt.tsx`）：
```css
@keyframes scroll-left {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
.animate-scroll-left { animation: scroll-left 20s linear infinite; }
```

**Logo GIF**：`/images/logo.gif`，自带循环（mascot 眨眼+浮动）

**Footer Typewriter**：TextType 组件 typingSpeed 100ms / deletingSpeed 70ms / pauseDuration 1500ms / loop true

**CardStack**：5s setInterval 循环洗牌

**AnimatedList**：每 2s 新增一项从顶部进入

**Float / bounce-twice**：tailwind animation.css 里定义，目前注释掉了未启用

### 7.5 GIF 动效（"会动的 icon"）
源码中大量使用 `.gif` 而不是 SVG/Lottie 来实现 icon 动画：
- `logo.gif`（header）
- `slider_3/001.gif ~ 004.gif`（4 个特性 icon）
- `slider_4/1.gif`（标题装饰）
- `slider_5/1.gif`（Pricing 标题装饰）

---

## 8. 交互动画

### 8.1 btn-59 — Header CTA "Start Free"（tada）
```css
.btn-59:hover span { animation: tada 0.8s; }
@keyframes tada {
  0%        { transform: scaleX(1); }
  10%,20%   { transform: scale3d(.9,.9,.9) rotate(-3deg); }
  30%,50%,70%,90% { transform: scale3d(1.1,1.1,1.1) rotate(3deg); }
  40%,60%,80% { transform: scale3d(1.1,1.1,1.1) rotate(-3deg); }
  to        { transform: scaleX(1); }
}
```
按钮文字"嗖嗖嗖"摇摆 0.8s。

### 8.2 btn-30 — Pricing CTA（圆形 lime 扩散）
```css
.btn-30 { overflow: hidden; position: relative; }
.btn-30::before {
  content: ''; width: 120%; aspect-ratio: 1;
  border-radius: 50%; left: 50%; transform: translateX(-50%);
  position: absolute; top: -200%; height: 0;
  transition: height 0.3s;
}
.btn-30:hover::before { height: 400%; }
.btn-30:hover .text {
  animation: move-up-alternate 0.3s ease forwards;
}
@keyframes move-up-alternate {
  0%   { transform: translateY(0); }
  50%  { transform: translateY(80%); }
  51%  { transform: translateY(-80%); }   /* 瞬移到上方 */
  to   { transform: translateY(0); }
}
```
- hover 时一个圆形 lime 色块从下方"涌"进按钮（300ms）
- 同时文字向下 80% 后瞬移到 -80% 再回到 0（造出"翻牌"错觉）
- 默认变体 + active 变体（带 `tag` 的 Developer 卡）颜色对换：
  - inactive：bg `#ECEFEC` text `#111`，hover ::before `#111`，hover text white
  - active：bg `#111` text white，hover ::before `#CFFF29`，hover text `#111`

### 8.3 Nav link hover（Header）
```tsx
<Link className="group relative">
  Blog
  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#111]
                   group-hover:w-full transition-all duration-300" />
</Link>
```

### 8.4 FAQ 圆形按钮 hover
```
<div class="group">
  <button>
    <icon-container class="relative overflow-hidden">
      <div class="absolute inset-0 bg-[#111] scale-0
                  group-hover:scale-100 transition-transform duration-300
                  ease-out origin-center" />
      <icon class="relative z-10 group-hover:text-white" />
    </icon-container>
  </button>
</div>
```
- 黑色填充从圆心 scale-0 → scale-100 扩散
- icon 同时 `text-#111 → text-white` 反色

### 8.5 Card hover
- **Slider 4 卡片**：`hover:-translate-y-4`，过渡 300ms
- **Pricing 卡片**：无 hover 位移
- **Social icon**：`hover:scale-110`

### 8.6 ImageTrail（Footer 鼠标轨迹）
- 自研 GSAP 实现（`ImageTrail.tsx` 1263 行）
- 5 个 SVG 装饰图片在鼠标移动时被"拖出"，按距离阈值生成下一个
- variant 1 模式：标准跟随，imageSize 64×64

### 8.7 FallingText（Slider 2 "Recommend"）
- Matter.js 物理引擎
- 6 个色块标签从顶部坠落
- gravity 0.8
- mouseConstraintStiffness 0.2（可用鼠标拖拽弹起）
- desktop 仅在 active index === 2 时触发；mobile auto 播

### 8.8 全局过渡惯用法
```
transition-all duration-300       — 默认（大部分入场）
transition-all duration-700       — 一些慢入场
transition-transform duration-300 ease-out — 圆形扩散
animate-bounce-twice              — 小圆点弹两下（目前在注释里）
animate-float                     — 上下 6px 3s 循环（可用）
animate-fade-in-out               — 0.5s 文字切换淡入
```

### 8.9 滚动行为
```css
html { scroll-behavior: smooth; }
```
- Slider 1 用 ScrollTrigger pin 模拟"窗口暂停"

---

## 9. 资源

| 路径 | 用途 |
|---|---|
| `/src/app/fonts/Gotu-Regular.ttf` | 主字体 |
| `/src/app/fonts/Karla-VariableFont_wght.ttf` | Pricing 字体 |
| `/public/images/logo.gif` | Header logo |
| `/public/images/aisee.svg` | wordmark |
| `/public/images/bg-txt.svg` | "Hi it's aisee" marquee SVG |
| `/public/images/bg1.png` | Hero reel 缩略图 |
| `/public/images/slider_2/*.png` + `001.mp4` | Slider 2 卡片图 |
| `/public/images/slider_3/001-004.gif` | Slider 3 动态 icon |
| `/public/images/slider_4/*.gif/png` | Slider 4 卡片插画 + 标题装饰 |
| `/public/images/slider_5/icon*.svg / 1001-1002.png / 1.gif / 004.svg` | Pricing 资源 |
| `/public/images/footer/001-005.svg` | Footer ImageTrail 装饰 |
| `/public/images/footer/x.svg / medium.svg / linkedin.svg` | social icons |

---

## 10. 文案 & Tone（基于真实文案）

- **品牌名**：UI 写 `aisee`，文档/SEO 用 `AIsee`
- **Tagline**："The future of discoverability"（typewriter 循环）
- **Hero**：
  - H1: "Make Your Project Visible to AI."
  - H2: "All-in-One GEO Toolkit built for the AI-first internet."
  - Sub: "AI engines discover answers — make sure yours is one of them."
- **Section 标题**多用引言式 + 句号 + 装饰图：
  - "Boost your project's visibility across AI engines."
  - "Explore the [icon] Core Features of AIsee's GEO Engine"
  - "Offer tiered pricing based on [icon] functionality"
- **6 步法 nav 大词**：Analyze → Score → Recommend → Execute → Verify → Visibility Boost
- **引言行**：`"Where do we stand right now in AI discoverability?"`（lime pale 底高亮）
- **CTA**：永远是 "Start Free" / "Get Started"（btn-30 内）
- **没有感叹号**
- **emoji 不出现**（除了 Pricing 用 GIF emoji 当装饰图）

---

## 11. Do / Don't

| Do ✅ | Don't ❌ |
|---|---|
| 全站默认 Gotu（直接 `${Gotu.className}` 挂 body） | 给整站换 Inter / Karla |
| Karla 仅在 Pricing 卡片细节用 | Karla 写大标题 |
| `text-stroke-1` 给大字加描边重量感 | 大字号默认无描边显得空 |
| `BgTxt` lime marquee 永远存在 | 删 marquee 用纯色背景 |
| 每个 section 用 AnimationContext + IntersectionObserver | 在 SSR 阶段 render 动画 |
| Hero 用 GSAP pin + scrub | Hero 用普通 fade in |
| Pricing 价格用 CountUp 数字动画 | 价格直接显示 |
| Slider 2 大词 hover 切换 | 大词点击切换 |
| FAQ 圆形按钮黑色 scale-0→100 扩散 | 用 box-shadow / 改色 |
| Footer tagline 是 TextType typewriter | 静态文字 |
| 装饰用 GIF（logo / icons） | 用 Lottie / video |
| 永远 1px 黑色硬边框（FAQ 是 2px） | 阴影、glass 拟态、渐变 |
| Header 半透明 + blur 2px | 实色 Header |

---

## 12. 与 dApp 的关系

| 维度 | Homepage 官网 | dApp |
|---|---|---|
| 字体 | **Gotu 99%** + Karla 仅 Pricing | **Karla 99%** + Gotu 仅页面一级标题 |
| Lime hex | `#CFFF29`（两端统一） | `#CFFF29`（两端统一） |
| Backdrop | 大量 blur(2-4px) + 半透 | 不用 blur |
| 边框 | 1-2px solid `#111` 硬边 | 1px 极淡灰描边 |
| 装饰 | lime marquee + Matter.js / GSAP / ImageTrail | 无 |
| 动画引擎 | GSAP + Framer Motion + Matter + Swiper | 仅 CSS transition |
| 视觉密度 | 低（editorial） | 高（dashboard） |

两端共用：lime / yellow 色板（hex 不同但视觉一致）、logo mark、Gotu / Karla 字体源文件、8px 间距、aisee 品牌 tone。

---

> 文档版本：v3.0 · 2026-05-18
> 数据来源：`aisee-website` 仓库源码（Next.js 15 项目）+ Figma `aisee.fig`
> 关键发现：
> - Gotu 是 body 默认字体（不是只用在大标题）
> - **Lime hex 全局统一为 `#CFFF29`**（官网与 dApp 共用主色）
> - 入场动画全部基于 IntersectionObserver + Tailwind transition
> - Hero 用 GSAP pin + scrub timeline
> - Footer "." 是 TextType cursorCharacter（不是单独装饰元素）
> - 大量动态 GIF 当 icon 用
