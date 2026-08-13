# aisee dApp — Design Tokens

> **用法**：把这份文档（不是 v5 完整版）丢给 AI 让它做插件 / 移动端 / 任何新形态。
> 这里只有"什么颜色、什么字体、什么气质"——**没有任何桌面端尺寸**，所以 AI 不会被 1440 桌面规格卡住。

---

## 0. 一句话风格 Brief

> aisee 是一个 **AI 搜索可见性工具**，风格是"数据 dashboard"而非"editorial 网站"。
> 功能优先 · 信息密度高 · 极简数据驱动 · 不喧哗。

---

## 1. 色板

### 1.1 双主色系统（按功能模块切换）

| 模块 | 主色 | hex | 用途 |
|---|---|---|---|
| **Analysis** | lime | `#CFFF29` | 报告 / 分析 / Score 主操作 |
| **Post Agent + Engage** | yellow | `#FFE253` | 发帖 / 社媒 / Engage 全部 |

- Hover 加深：lime → `#BFEE19`，yellow → `#FCE055`
- **同一屏内 lime 和 yellow 不并列**：当前模块用哪个主色，整页统一

### 1.2 共享色

| token | 值 | 用途 |
|---|---|---|
| `--black` | `#111111` | 主文本、深底按钮 |
| `--white` | `#FFFFFF` | 卡片、Header、Sidebar |
| `--bg-page` | `#FAFAFA` | 主背景 |
| `--cream` | `#F7F6E9` | Post 编辑器、warm 区域 |
| `--orange` | `#EC5212` | 通知 / 异常 / 删除提示 / Reddit 平台底色（统一用 aisee orange，不用 Reddit 官方 `#FF4500`）|
| `--green` | `#A5D500` | 成功 / 已连接 |
| `--green-dot` | `#92BC01` | sync dot 等小色点（带 `rgba(146,188,1,0.2)` 3px 光环）|
| `--red-light` | `#FFD0D0` | 错误背景 |
| 次要文字 | `rgba(17,17,17,0.6)` | secondary text |
| 通用描边 | `rgba(17,17,17,0.05)` | **铁律：所有静态描边都是这个值** |
| Hover 描边 | `rgba(17,17,17,0.18)` | 仅交互态加深 |
| 选中描边 | `#111111` | 仅选中态（checkbox、active chip）|

### 1.3 Engage 模块专属色

| 用途 | 值 | 备注 |
|---|---|---|
| Engage Banner 底（日常）| `#F3E7F4` | lavender-pink，**Engage banner 专用**，别处不用 |
| Engage Banner 底（首次配置）| `#F0FFBA` | lime |
| Channel banner / Replied pill / Intent Help tag | `#FAE2FE` | 比 `#F3E7F4` 偏紫，**与 Engage banner 严格区分** |
| Keyword pill | `#EFF4E2` 底 / `#8C7400` 字 | 深芥末与 Replies stats 复用 |
| Subreddit active 底 | `#FFFADD` | 浅黄 |
| Replies stats 5 色 | Impressions `#4398FF`（蓝）/ Replies & Likes `#EC5212`（橙）/ Retweets `#A5D500`（绿）/ Bookmarks `#8C7400`（深芥末）| 仅 Replies tab |

---

## 2. 字体

- **Karla** 99% 场景：正文 / UI / 表格 / 表单 / 按钮 / nav / 标签 / **弹窗标题** / 数字
- **Gotu** 仅 1 个场景：**页面顶部一级标题**（如 "Account Profile"）
- **Digital Numbers** 仅 1 个场景：Analysis Score 仪表盘中心数字
- **JetBrains Mono** 仅键盘按键提示 `<kbd>` + 代码块

字重：400（正文）/ 500（按钮、强调）/ 600（卡片标题、section 标题、**弹窗标题**）/ 700 极少

> **关键约束**：弹窗标题 = Karla SemiBold **600**（不是 Bold 700，不是 Gotu）。

---

## 3. 形态

| 元素 | 圆角 |
|---|---|
| Pill / Avatar | 9999px |
| Button / Nav / Tag | 8px |
| Input / Select / Checkbox | 6–8px |
| Card | 12px |
| Large card / Modal | 16–20px |

阴影（只允许这三档）：
```css
--shadow-card:     0 1px 3px rgba(0,0,0,0.06);
--shadow-dropdown: 0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10);
--shadow-modal:    0 8px 8px rgba(0,0,0,0.04), 0 20px 24px rgba(0,0,0,0.10);
```

间距：8px scale — `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`

---

## 4. Tone & 禁忌

**做**：
- 标签短而准（"Dashboard" / "Calendar" / "Channels" / "Engage"）
- 错误直接说明 + 给操作建议（"Your post should have at least one character or one image."）
- 数字原样不缩写（"1825 Credits"、"280" 字符计数）
- 占位符："Start writing your post..." / "Nothing here."

**不做**：
- ❌ Emoji（任何场景）
- ❌ 感叹号
- ❌ 渐变背景（chart 内部 fill 渐变除外）
- ❌ 玻璃拟态、重投影
- ❌ 入场大动画、循环漂浮、cursor 特效
- ❌ 几何漂浮装饰、mascot 横幅（这是官网的语言）
- ❌ 任何动画 > 300ms

---

## 5. 状态反馈

| 状态 | 表现 |
|---|---|
| Hover | 底色叠 `rgba(17,17,17,0.05)` 或主色加深 0.06 |
| Active | `transform: scale(0.98)` + 底色再加深 |
| Focus | 描边变 `#111` |
| Disabled | `opacity: 0.5` |
| Selected | 底 `var(--module-primary-bg)` + 描边 `#111` |
| Loading | 骨架屏 shimmer 1.4s loop |
| Error | 文字 / icon `#EC5212` |

---

## 6. AI 生成时的"自由度"说明

> 这份 token 是**视觉骨架的约束**，不约束你具体怎么布局。
>
> **你可以自由发挥的**：
> - 尺寸（任何宽高 / padding / 字号阶梯都可以重新设计）
> - 布局（弹窗 / drawer / popup / 内嵌 panel 自由选）
> - 组件组合方式
> - 信息密度
>
> **你必须严格遵守的**：
> - 颜色（用 §1 的色，不要发明新色）
> - 字体（Karla 主、Gotu 仅一级标题，其他禁用）
> - 形态语言（圆角、阴影、5% 描边铁律）
> - Tone & 禁忌（§4）
