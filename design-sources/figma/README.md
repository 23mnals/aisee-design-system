# AISEE Figma 本地设计源

固定把最新的本地 Figma 备份复制到：

`design-sources/figma/aisee-current.fig`

每次替换时保持文件名不变。后续进行设计稿对比前，先检查这个目录中文件的更新时间和内容哈希，避免继续使用旧版设计源。

## 重要限制

`.fig` 是 Figma 的本地备份格式，不是稳定、公开的机器可读交换格式。系统可以自动发现文件被替换，也可以读取其中可识别的预览与资源，但不能保证从原始 `.fig` 中完整还原节点、组件变体和 Variables。

为了让更新内容可以被可靠读取，请在同一目录同步放置：

- `variables.json`：Figma Variables / Tokens 导出
- `exports/`：关键组件和页面的 SVG 或 PNG 导出
- `source.json`：云端 Figma 文件和关键节点链接（如果允许使用云端版本）

如果使用同一个云端 Figma 文件持续更新，只需把固定链接写入 `source.json`；之后无需重复发送链接，读取时会获得该链接对应的最新版本。
