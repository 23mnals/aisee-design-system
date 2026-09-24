# Brand

Brand 是 Design System 的官网与品牌入口，字体允许 **Karla + Gotu**。

## 门户分类

Brand 只区分两类内容：

1. **Foundations**：AISEE 基础规范，包括 Logo 与资产、颜色、字体、间距、圆角、阴影、dApp 基础视觉和跨组件动效原则。
2. **Explorations**：由 ChatGPT、Codex 或其他 AI 平台生成的方向探索与参考稿。它们仅供灵感参考，不是实际产品设计，也不是开发实施规范；真实产品设计以对应功能的最新 Figma 为准。

来源与使用状态分开记录：`source / surface` 说明内容从哪里产生，`designStatus` 或门户 `status` 说明 Draft、Current、Legacy 等使用状态。来源为 AI 不等于 Draft，Draft 也不会自动升级为 Selected 或 Current。

分类只改变预览导航的信息架构，不移动或删除历史文件；原路径、直达链接和 Legacy/Draft 状态保持不变。新增 AI 参考稿进入 Explorations，并在说明中保留原功能语境；跨模块基础规范归入 Foundations。

## 页面产出约定

当用户提出新的页面需求，并要求依据设计规范或 Figma 设计稿实现时，页面原型、静态 HTML、页面专用视觉资源和对应说明默认归档到本目录的 AI 探索区。每个页面应放在独立子目录中，并同时记录：

- 页面用途、来源的 Markdown / Figma 节点和版本；
- 使用的字体、颜色、组件和交互状态；
- 仍待替换的占位图或待确认的设计差异。

组件库的通用实现仍放在 `src/`、`components/`、`preview/` 或 `ui_kits/`；`brand/` 保存面向页面的设计产出和品牌展示，不复制同一份通用组件源码。

## 外部生成图片接入

网页版 GPT、Figma 或其他工具生成的图片，只要先下载/复制到工作区内，就可以纳入 `brand/`：

1. 将原图放入 `brand/assets/` 或对应页面子目录，使用稳定、可读的文件名；
2. 优先保留 SVG；PNG / WebP 适合插画、纹理和其他位图资源；
3. 同步更新 `brand/assets/README.md`、页面说明和必要的资源清单；
4. 页面实现引用工作区内的相对路径，不使用聊天临时附件路径。

文件放入后，我可以在下一次任务中扫描、校验尺寸和格式，并接入页面。当前不会在后台自动监听文件夹；如果需要自动同步，需要额外配置脚本或文件监控流程。

## 子目录

- [`foundations/`](foundations/)：颜色、字体、间距、圆角、阴影与视觉原则索引
- [`homepage/`](homepage/)：Homepage v1–v3 规范与 About / Homepage 原型索引
- [`pages/`](pages/)：网页端 / AI 生成的功能页面 PNG + HTML 产出，以及 Brand 门户登记表
- [`assets/`](assets/)：Logo、纹理、插画、GIF 与品牌资产索引

原有文件路径为保证历史 HTML 可运行而保留在仓库根目录、`preview/`、`assets/` 和 `fonts/`。本目录提供稳定导航，不复制二进制资源。
