# Figma Sources

Figma product versions and written design specifications are tracked separately:

- **Figma version** describes the current visual product source and screen set.
- **Design Spec version** describes the current implementation rules, tokens and component behavior.

## Current source

| Field | Value |
|---|---|
| Figma product version | **5.6 — current** |
| Local source file | `备份-官网+dapp主功能.fig` |
| Scope | Marketing homepage + primary dApp functionality |
| Figma export time | 2026-08-13 12:20 +08:00 |
| Archive size | 288,584,555 bytes (about 275 MB) |
| SHA-256 | `cefdb828349ff1974595a678e0c34ccd21d7b13f93c5cd8caaa715f26d6309ee` |
| Repository policy | Do not copy the full `.fig` archive into Git; track its metadata and version here |

The current implementation specification is [`aisee-dapp-design.v6.md`](aisee-dapp-design.v6.md). Later team clarifications in [`TEAM_DECISIONS.md`](TEAM_DECISIONS.md) override conflicting content in both the specification and historical designs.

## Version registry

| Product version | Status | Notes |
|---|---|---|
| 5.6 | Current | Latest product design source supplied on 2026-08-13 |
| Earlier versions | Planned | Add missing versions here as they are supplied; retain them for comparison without replacing 5.6 |

When a new version is supplied:

1. Record the version, file name, export time, byte size and SHA-256.
2. Describe the pages or modules it contains.
3. Compare duplicate responsibilities with the current version.
4. Replace current rules only when the new source is explicitly designated as newer.
5. Preserve unmatched historical pages and assets.
