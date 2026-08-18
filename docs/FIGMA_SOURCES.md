# Figma Sources

Figma feature-page versions and written design specifications are tracked separately:

- **Figma feature-page version** identifies a page opened for a new feature or independent requirement. It is not a global version of the whole Figma file.
- **Design Spec version** describes the current implementation rules, tokens and component behavior.
- **Black title frame** above each design block records that block's actual update subject and date. It is the authoritative freshness marker even when the page or file name was not changed.

## Current source

| Field | Value |
|---|---|
| Latest feature page | **5.7 — latest registered feature version** |
| Registered local source file | `design-sources/figma/备份-官网+dapp主功能.fig`（本地存在、Git 忽略） |
| Scope | Marketing homepage + primary dApp functionality |
| Figma export time | 2026-08-18 16:06:53 +08:00 |
| Archive size | 321,906,245 bytes (about 307.0 MB) |
| SHA-256 | `8d773862b241f884a222d33205380fd1a2441e570316abe9ff3ece4a370f2d60` |
| Stable cloud source | [Figma file](https://www.figma.com/design/LLvI9vd66VLNuAltAWJFJw/%E5%A4%87%E4%BB%BD-%E5%AE%98%E7%BD%91-dapp%E4%B8%BB%E5%8A%9F%E8%83%BD) |
| Repository policy | Do not copy the full `.fig` archive into Git; track its metadata and version here |

The current implementation specification is [`aisee-dapp-design.v6.md`](aisee-dapp-design.v6.md). Later team clarifications in [`TEAM_DECISIONS.md`](TEAM_DECISIONS.md) override conflicting content in both the specification and historical designs. Feature work must be checked against its own Figma page; 5.7 must not be treated as a global replacement for every other page.

The 5.7 source adds the **托管自动发布 / Automation** feature page. It belongs to the vertical **WORKFLOWS** group in the current sidebar, separate from **INTEGRATIONS**. The local archive confirms the new page through its updated export metadata and thumbnail; exact node-level values still require a Figma export or cloud node link because `.fig` is not a stable machine-readable interchange format.

## Fixed local update path

Use [`../design-sources/figma/`](../design-sources/figma/README.md) as the only local intake directory:

- Replace the filename registered in `source.json` whenever a new local backup is saved.
- Do not commit the large `.fig` binary; `.gitignore` keeps it local.
- Before every design comparison, check the file modification time, byte size and SHA-256 instead of trusting an older filename.
- A raw `.fig` archive is suitable for update detection and best-effort preview/resource extraction, but it does not guarantee complete machine-readable access to nodes, variants or Variables.
- For reliable automatic ingestion, update `variables.json` and `exports/` beside the archive, or keep a stable cloud file URL in `source.json`. A stable URL always resolves to that file's latest saved version, so it does not need to be resent after each update.

## Version registry

| Feature page | Status | Notes |
|---|---|---|
| 5.7 | Latest feature page | Latest newly opened feature-version page registered on 2026-08-18; adds 托管自动发布 / Automation; not a global file version |
| Existing feature pages | Living | Add later requirements at the top of the original page; do not open a new page for an existing function |
| Missing earlier feature pages | Planned | Register them as they are supplied; retain their page ownership and history |

## Page maintenance rule

1. For a new feature or independent new requirement, open and register a new feature-version page.
2. For a new requirement on an existing function, keep the original feature page and add the newest design above its earlier content.
3. Read the black title frame above every relevant design block before reading the frames below it. Use its text as the update subject and its date as the design date; do not infer freshness from an unchanged page name or file name.
4. Within one feature page, order overlapping work by black-title date first. If dates match, the visually higher block is newer. A newer block overrides only duplicated responsibility; unmatched earlier content remains available.
5. If a black title frame is absent or unreadable, fall back to page name, archive export time and canvas position, and explicitly mark the result as uncertain.
6. Record the relevant feature page, black-title text/date, file name, export time, byte size and SHA-256 when a source archive is supplied.
7. Describe the pages or modules it contains and preserve unmatched historical pages and assets.

## Reading priority inside Figma

```text
对应功能页面
  → 黑色标题框：更新主题 + 日期
  → 标题框下方对应设计
  → 同日期时比较画布上下位置
  → 页面名 / 文件名 / 导出时间仅作定位与降级参考
```

Example: a title such as `过期plan的交互优化—8.11号` establishes both the change scope and date even if the page continues to be named `v5.7-post页面优化-post弹窗-分析选模型`.
