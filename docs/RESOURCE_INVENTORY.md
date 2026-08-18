# Resource Inventory

## 已具备

- Karla Variable Font：`fonts/Karla-VariableFont_wght.ttf`
- Gotu Regular：`fonts/Gotu-Regular.ttf`（Homepage / Brand 自托管字体）
- Digital Numbers Regular：`fonts/DigitalNumbers-Regular.ttf`（仅保留为专项数字资产，不进入 dApp / App / Webapp 字体规则）
- Logo mark / wordmark：PNG、SVG、GIF 多种格式
- Homepage 纹理、build 系列插画、tracking eye 与 trail 资源
- Analysis 加载动画原视频：`assets/animated/aisee-loading-analysis-green.mp4`（绿色版本，只读快照）
- StemUI 自有图标库：GitHub [`qi15582378779/stemui`](https://github.com/qi15582378779/stemui) + npm README [`@stemui/icons`](https://www.npmjs.com/package/@stemui/icons?activeTab=readme)
- Lucide 仅作为 StemUI 暂无对应资源时的补充；animated React icon 集仍在 StemUI 仓库维护
- Engage、Analysis、Post Agent、Billing、Pricing、My Account 等历史原型和交互示例
- v3–v6 规范与 Homepage v1–v3 历史文档
- Figma 5.7 本地源文件元数据与版本登记：`docs/FIGMA_SOURCES.md`（`.fig` 本体不进入 Git）

## 资源状态

| 优先级 | 资源 | 原因 |
|---|---|---|
| 可选 | 官方最新版 Figma library / `.fig` 导出 | 用于后续自动核对组件 key、variables 与 screenshots；当前更新可不依赖 |

## 不需要补充

- JetBrains Mono：团队已确认 dApp 只使用 Karla。
- Digital Numbers：字体文件作为专项资产保留；Score Gauge 与 App 全局仍使用 Karla。
- 旧系统 ZIP 内已有的图标、动画、Logo 与 Webapp UI Kit 不需要重复上传。

## Loading 动画

- Analysis 使用绿色原视频 `aisee-loading-analysis-green.mp4`。
- Post / Engage 的加载状态沿用同一眨眼节奏，但主题色切换为黄色；如需最终黄色视频，应由设计侧提供对应源文件，避免对绿色原视频做不可逆修改。

新增资源请保留来源、授权和用途说明；不要直接覆盖不同语义的同名文件。

## Icon 发布状态

- `@stemui/icons` 已发布到 npm，产品端以该包作为正式使用入口。
- `@stemui/animated-tabs` 已发布到 npm，但属于交互组件包，不等同于 icon 包。
- `@stemui/animated-icons` 已存在于本地 StemUI workspace，目前尚未发布到 npm；发布前不可作为产品的 registry 依赖。
- 图标维护及 GitHub / npm 同步步骤见 [`ICON_LIBRARY.md`](ICON_LIBRARY.md)。
