# aisee Homepage — Design Specification

> 适用范围：**aisee 官网** https://aisee.live/
> 设计宽度：**1440px**（desktop），向下兼容 768 / 393
> 字体规则：**Gotu（衬线 / 展示字体）+ Karla（无衬线 / UI 字体）**
> 设计基调：**Editorial · 实验感 · Bauhaus 色块 · 现代极简**

---

## 1. Design DNA（一句话定调）

**"严肃的科技公司 + 实验设计工作室"**。
Gotu 提供出版物般的庄重感，Karla 提供精准的功能感，强烈的几何色块（黄/粉/橙/蓝/紫）+ 1.5px 纯黑硬边框打破单调，吉祥物（cyclops mascot）注入一点人格化的温度。

整体阅读节奏遵循：

```
极大字号衬线 Headline (Gotu 60–100px)
  ↓ Eyebrow 小标签 (Karla 12px UPPERCASE)
  ↓ 衬线副标题 (Gotu 17–20px)
  ↓ 黑底圆角按钮 + 几何色块漂浮
  ↓ Hard black border 分隔下一区块
```

---

## 2. Color System

### Brand Core
| Token | Value | 主要用途 |
|---|---|---|
| `--black` | `#111111` | 正文、边框、按钮主色、图标 |
| `--white` | `#FFFFFF` | 主背景、卡片底 |
| `--lime` | `#CFF229` | 品牌主色、CTA hover wipe、关键词高亮背景、Logo |
| `--lime-bright` | `#C9FE12` | Logo 替代色、强调高亮 |
| `--yellow` | `#FFE253` | 装饰圆形、tag、活跃状态 |
| `--yellow-light` | `#FFF2B3` | tag 背景、引用块 |
| `--yellow-pale` | `#FFFADD` | 极淡黄底、通知块 |
| `--orange` | `#EC5212` | 三角装饰、强调点、徽章 |
| `--green` | `#A5D500` | 数据成功、success |
| `--cream` | `#F7F6E9` | warm 区块底、引用块 |
| `--bg-page` | `#F7F8F7` | 偶尔做页面深一档背景 |

### 装饰色（仅出现在 hero 漂浮几何形）
- 粉色块：`#FFD3E2`
- 蓝色圆：`#3C61E5`
- 紫色圆：`#E7E1F8`

### 透明度
- 次要文本：`rgba(17,17,17,0.6)`
- 微弱描边/分隔：`rgba(17,17,17,0.12)`
- Hover 底色：`rgba(17,17,17,0.05–0.06)`

> **配色铁律**：背景以 `#FFF` 为主，相邻 section 切换 `#F7F6E9 / #CFF229 / #FFE253` 制造节奏；**绝不使用渐变背景**。

---

## 3. Typography

> **官网使用 Gotu + Karla 双字体系统**。

### 字体加载
```css
@font-face { font-family:'Karla'; src:url('fonts/Karla-VariableFont_wght.ttf') format('truetype'); font-weight:100 900; font-display:swap; }
@import url('https://fonts.googleapis.com/css2?family=Gotu&display=swap');
```

### 字体职责

| 字体 | 角色 | 出现位置 |
|---|---|---|
| **Gotu**（serif） | Display & 副标题 & 按钮文案 | Hero 大标题、Section 标题、Hero 副文案、Nav link 文字、所有 Button 上的文字、FAQ 标题、Footer tagline、Hero 关键词 ktag |
| **Karla**（sans） | UI / 功能性文本 | Eyebrow（小标签）、正文段落、表单、Nav logo wordmark、说明文字、数字 stat、footer 二级文字 |
| JetBrains Mono | 数字 & code | 仅在 stat 数字、code 片段中出现，可选 |

> 一条铁律：**Hero / Section title / 按钮文字一律 Gotu**，**说明性 / 列表性 / 数据性文本一律 Karla**。

### 尺寸阶梯（基于 1440px）

```
Hero Headline:  Gotu clamp(60px, 6.8vw, 100px)  line-height:1.0  letter-spacing:-0.03em
Section Title:  Gotu clamp(40px, 4.5vw, 64px)   line-height:1.0  letter-spacing:-0.03em
Display Md:     Gotu 32px / 1.25
Display Sm:     Gotu 18–20px / 1.4
Hero Sub:       Gotu 17–20px / 1.7  color rgba(17,17,17,.65)

Body Lg:        Karla 18px / 1.6
Body:           Karla 14–16px / 1.57
Eyebrow:        Karla 12px / weight 600 / letter-spacing 0.12em / UPPERCASE / rgba(17,17,17,.45)
Caption:        Karla 12px / 1.5

CTA / Button:   Gotu 14–16px
Nav link:       Gotu 14px
```

### 排版细节
- Hero 标题里可以用 `<span class="lime-bg">word</span>` 给一个词加 lime 圆角色块强调。
- Eyebrow 标签前缀一根 28×1.5px 灰色短线（`::before` 实现）。
- 段落 `text-wrap: pretty`，限定 `max-width: 500–620px`，避免长行。

---

## 4. Layout & Spacing

- 基础间距：**8px**
- Section 上下 padding：**88px**（小屏 56px）
- 页面左右 padding：**48px**（小屏 16–24px）
- Hero `padding: 72–80px 48px 0`，`min-height:100vh`
- Header 高度：**70px**（fixed）
- 相邻 section 间一律使用 `border-bottom: 1.5px solid #111` 硬边框分隔，**不要用阴影或留白**

### 网格
- Hero 主区：`grid-template-columns: 1fr 400–420px`（左文字右 mascot）
- Section 内容：12 列网格或 `max-width: 1248px` 居中

---

## 5. Border / Radius / Shadow

| 元素 | 规则 |
|---|---|
| Section / Nav / Footer 分隔线 | `1.5px solid #111`（**核心视觉语言**） |
| 按钮 / Pill | `border-radius: 999px`，描边按钮 `1.5px solid #111` |
| 卡片 / 大区块 | `border-radius: 12–24px`，描边可选 `1.5px solid #111` |
| Tag / Chip | `border-radius: 999px`，描边 `1.5px solid #111`，底色用 lime / yellow / cream |
| Logo mark | `border-radius: 320px 320px 0 0`（拱形，cyclops 头型） |
| 阴影 | **默认无阴影**，仅 dropdown 浮层用 `0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1)` |

---

## 6. Components

### 6.1 Navigation
- 固定顶部 70px，`background: rgba(255,255,255,0.9)` + `backdrop-filter: blur(12px)`
- 底部 `1.5px solid #111` 硬边框
- 左侧 logo（mark + wordmark），右侧 nav links（Gotu 14px），末尾 CTA "Start Free"（描边圆角 pill，hover 填 lime）

### 6.2 Buttons

**Primary（黑底）**
- 黑底白字，Gotu 16px，`border-radius:999px`，`padding:14px 32px`
- Hover：lime 从左到右扫过填满（`::after` + `transform: scaleX()`），文字翻黑
- 内部图标在右侧，gap 12px

**Ghost（描边）**
- 透明底 + `1.5px solid #111` + 黑字
- Hover：底色变 `rgba(17,17,17,0.05)`

**Tag / Chip**
- 圆角 pill，描边黑色 1.5px，底色 lime / yellow / cream 之一
- Gotu 11–12px

### 6.3 Cards
- 白底，`1.5px solid #111` 或 `1px solid rgba(17,17,17,.05)`，圆角 12–24px
- 内部 padding 24–32px
- 无阴影；hover 时整张卡片轻微上移 `translateY(-4px)` + 边框颜色加深

### 6.4 Hero
- 左：Eyebrow + 三行 headline + Gotu 副文案 + 两个按钮
- 右：mascot（cyclops SVG，自带浮动 + 眨眼）+ 关键词 ktag 围绕轨道
- 背景层：6–7 个几何色块（黄圆、粉矩形、蓝圆、紫圆、橙三角、lime 小圆点）`pointer-events:none` 漂浮

### 6.5 FAQ / Accordion
- 每条 `border-top: 1.5px solid #111`
- 标题 Gotu 18–24px，左对齐
- 展开图标右侧 `+` / `–`，旋转 45°
- 展开内容 Karla 14–16px，颜色 `rgba(17,17,17,.65)`

### 6.6 Footer
- 背景 `rgba(207,255,41,0.5)` 半透 lime
- 顶部 `1.5px solid #111`
- 上行：超大 Gotu tagline "The future of discoverability."（96–120px）
- 下行：3–4 列 nav，Karla 13–14px

### 6.7 Logo Mark
- Cyclops 头：拱形 28×30px，`border-radius:320px 320px 0 0`
- 黄绿色底 `#CFF229`，上覆 1px 内嵌黑色脸 + 椭圆白色眼睛（12×9px），眼睛位置 `left:50%; top:38%`
- Wordmark "aisee" 用 Karla Medium 16–17px，跟 mark 间距 8px

### 6.8 Iconography
- 全站使用 **Lucide**（线性，1.5px stroke，rounded linecap，24px 网格）
- UI 中通常以 16×16 或 20×20 渲染，颜色 `#111`

---

## 7. 入场动画（Entry Animations）

> 所有入场动画统一使用缓动 `cubic-bezier(0.16, 1, 0.3, 1)`（赋值给 `--ease-out`）。
> 入场动画在页面 load 后**自动播放**，按设定 delay 顺序进入。

### 7.1 顶部 Nav
```css
nav { transform: translateY(-100%); animation: navIn .6s var(--ease-out) .1s forwards; }
@keyframes navIn { to { transform: translateY(0); } }
```
- 从上方滑入，0.1s delay。

### 7.2 Hero 三段式入场（核心动画）

**阶段 A：Eyebrow 小标签淡入上推**（0.35–0.4s 起）
```css
.hero-eyebrow { opacity:0; transform:translateY(16px);
  animation: fadeUp .7s var(--ease-out) .4s forwards; }
@keyframes fadeUp { to { opacity:1; transform:none; } }
```

**阶段 B：Headline 逐行 Word-up reveal**（0.45–0.8s 起）
- 每一行 headline 包一层 `overflow:hidden`，内部文字 `transform:translateY(110%)` → `0`。
- 三行依次 delay 0.45s / 0.6s / 0.75s。
```css
.hl-row { overflow:hidden; display:block; line-height:1.0; }
.hl-in  { transform:translateY(110%);
  animation: slideUp .88s var(--ease-out) forwards; }
.hl-row:nth-child(1) .hl-in { animation-delay: .45s; }
.hl-row:nth-child(2) .hl-in { animation-delay: .60s; }
.hl-row:nth-child(3) .hl-in { animation-delay: .75s; }
@keyframes slideUp { to { transform:translateY(0); } }
```

**阶段 C：副标题 + 按钮淡入上推**（1.0s / 1.15s 起）
- 复用 `fadeUp`，分别 delay 1.0s 和 1.15s。

**阶段 D：Mascot 浮入**（0.65s 起）
```css
.hero-right { opacity:0; animation: mascotIn .9s var(--ease-out) .65s forwards; }
@keyframes mascotIn { from { opacity:0; transform:translateY(40px) scale(.94); } to { opacity:1; transform:none; } }
```

**阶段 E：背景几何色块依次淡入并开始永久漂浮**（1.1–1.8s 起）
```css
.d1 { animation: decoIn .9s var(--ease) 1.1s forwards, driftA 8s ease-in-out 2.1s infinite; }
.d2 { animation: decoIn .9s var(--ease) 1.3s forwards, driftB 9s ease-in-out 2.3s infinite; }
@keyframes decoIn { to { opacity:1; } }
@keyframes driftA { 0%,100%{ transform:translateY(0) rotate(0deg); } 50%{ transform:translateY(-14px) rotate(3deg); } }
@keyframes driftB { 0%,100%{ transform:rotate(-3deg) translateY(0); } 50%{ transform:rotate(3deg) translateY(10px); } }
```

**阶段 F：关键词 ktag 围绕 mascot 依次淡入**（1.2–2.0s 起）
- 5 个 ktag 间隔 0.2s 依次入场。

整体时间轴：
```
 0.0s ─┬─ Nav 滑入
 0.4s ─┼─ Eyebrow
 0.45s ┤  Headline line 1
 0.60s ┤  Headline line 2
 0.65s ┤  Mascot
 0.75s ┤  Headline line 3
 1.00s ┤  Subtitle
 1.10s ┤  Deco 1
 1.15s ┤  Buttons
 1.20s ┤  Tag 1
 ...   ┤
 2.00s ┴─ Tag 5 / 全部 deco 漂浮起来
```

### 7.3 Section 滚动 Reveal
```css
.rv  { opacity:0; transform:translateY(28px); transition: opacity .72s var(--ease-out), transform .72s var(--ease-out); }
.rvl { opacity:0; transform:translateX(-24px); transition: opacity .72s var(--ease-out), transform .72s var(--ease-out); }
.rv.in, .rvl.in { opacity:1; transform:none; }
```
- 用 IntersectionObserver 监听，元素进入视口时加 `.in` 类。
- 大区块标题使用 `.rv`，列表 / 卡片可用 `.rvl` 错位左推。
- 同一区块内的兄弟元素加 `transition-delay: 80–120ms` 错峰。

### 7.4 数字 Count-up
- 统计数字（如 "5+", "50+", "1825"）在元素进入视口时从 0 / 起始值动态计数到目标值，时长 1.2–1.5s，缓动 ease-out。

### 7.5 横向 Marquee（黄色 Ticker）
- 黄色 `#FFE253` 横条满屏滑动关键词（"GEO", "LLM Search", "AI Visibility"…）
- `animation: marquee 30s linear infinite`，无限循环不停顿。
- hover 时降速 50%（可选）。

### 7.6 Mascot 自动行为
- **浮动**：`animation: float 5s ease-in-out infinite`（上下 16px）
- **眨眼**：眼睛 `transform-origin:center; animation: blink 5s ease-in-out 2.5s infinite`，仅 5% 时长内 `scaleY(0.05)`
- 始终循环，进入页面即开始。

---

## 8. 交互动画（Interaction）

### 8.1 Custom Cursor（核心交互特色）
- 替换默认光标，固定一个 18–20px 的描边圆形跟随鼠标
- `mix-blend-mode: difference` 让光标在浅底是黑、深底自动变白
- 经过可点击元素（`a`, `button`, `.hover`）时尺寸放大到 52–56px（加 `.big` 类）

```css
.cursor { position:fixed; width:18px; height:18px; border:1.5px solid #111;
  border-radius:50%; pointer-events:none; z-index:9999;
  transform:translate(-50%,-50%); mix-blend-mode:difference;
  transition: width .2s var(--ease), height .2s var(--ease); }
.cursor.big { width:52px; height:52px; }
```
```js
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a,button,.hover').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('big'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
});
```

### 8.2 Button Hover Wipe（核心交互特色）
- 主按钮 hover 时，**lime 从左到右扫过填满**，文字颜色翻黑。
```css
.btn-primary { position:relative; overflow:hidden; background:#111; color:#fff; }
.btn-primary::after { content:''; position:absolute; inset:0; background:#CFF229;
  transform: scaleX(0); transform-origin:left; transition: transform .35s var(--ease-out); }
.btn-primary span { position:relative; z-index:1; transition: color .35s; }
.btn-primary:hover::after { transform: scaleX(1); }
.btn-primary:hover span { color:#111; }
```

### 8.3 Nav link hover
- 圆角 pill 内 `::after` 从左到右 `scaleX(0→1)` 填一层 `rgba(17,17,17,.06)`，0.3s。

### 8.4 Card hover
- `transform: translateY(-4px)`，边框从 `rgba(17,17,17,.05)` → `#111`，过渡 0.25s。
- 卡内 lucide icon 同步轻微旋转或位移可选。

### 8.5 Sticky Nav 滚动响应
- 滚动超过 24px 后：`backdrop-filter: blur(12px)` + `border-bottom: 1.5px solid #111` 同时出现；
- 滚到顶时这两者透明度回归到 0。

### 8.6 FAQ 展开
- 点击标题，`max-height: 0 → auto`（用 JS 测量到目标高度再 transition），`opacity: 0 → 1`
- 右侧 `+` 图标 `rotate(45deg)` 变成 `×`
- 时长 0.3s ease。

### 8.7 Mascot 跟随 / 眨眼增强（可选）
- 眼睛瞳孔位置可随鼠标 X/Y 做 ±2px 的偏移，造成"看着你"的微互动。
- 鼠标快速移过时触发一次 blink。

### 8.8 Page Transitions（可选，多页路由时）
- 离开页面：白色蒙层从右往左 `transform: translateX(-100%) → 0`
- 新页面进入：白色蒙层继续滑出左边，新内容露出
- 时长 0.5s ease-out

### 8.9 全局通用过渡
- 任何状态切换（hover / focus / active）一律使用 0.2–0.35s + `cubic-bezier(0.16, 1, 0.3, 1)`
- 禁用 `transition: all`；只过渡需要变化的属性，避免性能问题。

---

## 9. 资源 & Assets

| 路径 | 说明 |
|---|---|
| `fonts/Karla-VariableFont_wght.ttf` | 本地字体文件 |
| Gotu | Google Fonts CDN 加载 |
| `assets/logo-mark.png` | Logo mark 位图 |
| `assets/logo-wordmark.png` | 完整 logo（mark + wordmark） |
| `assets/bg-texture.png` | Hero 区可叠加的纸质纹理（multiply 混合） |
| Mascot SVG | 内联在 HTML 中（带 `eye-inner` class 供 blink 动画） |

---

## 10. 文案 & Tone（官网）

- **品牌名一律小写**："aisee"（除 logo / FAQ 顶部强调可写 "AIsee" 外，UI 默认小写）
- **Tagline**：*"The future of discoverability."*
- 标题大胆 / 短句 / 句首大写，可少量幽默
- 副标题客观、不堆词，不超过 2 行
- CTA 永远祈使句、首字母大写："Start Free", "Talk to us", "See demo"
- 禁止使用感叹号、表情符号
- 关键词 ktag 全部首字母大写：`LLM Search`, `AI Visibility`, `Prompt Strategy`, `GEO Diagnostic`, `Citation Score`, `AI Rankings`

---

## 11. Do / Don't

| Do ✅ | Don't ❌ |
|---|---|
| 用 Gotu 写标题与按钮 | 用 Karla 写大标题 |
| 用 1.5px 黑硬边框分隔 section | 用阴影或留白堆砌层级 |
| 用纯色色块和几何形装饰 | 用渐变背景 / 玻璃拟态 |
| 几何形 `pointer-events:none` | 装饰挡住交互区 |
| 入场动画 ≤ 2s 完成 | 动画大量延迟、阻挡阅读 |
| 全局统一 `--ease-out` 缓动 | 多套缓动函数混用 |
| Lime 仅做关键强调 | 整页大面积铺 lime |
| 数字用 Karla / 自动 countup | 数字加货币符号 / 千分位装饰 |

---

> 文档版本：v1.0 · 2026-05-15
