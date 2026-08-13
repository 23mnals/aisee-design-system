# AISEE Icon Library Workflow

## 入口与职责

| 入口 | 用途 |
|---|---|
| [StemUI GitHub](https://github.com/qi15582378779/stemui) | SVG 源文件、生成代码、预览与版本历史的唯一资源源 |
| [`@stemui/icons`](https://www.npmjs.com/package/@stemui/icons?activeTab=readme) | 产品项目安装和使用 icon 的正式 npm 包；README 页用于查看安装、导出与版本说明 |
| aisee Design System | 记录 icon 视觉规则、尺寸、语义和使用示例；`assets/stemui/` 只保存预览所需的只读快照，不复制完整 SVG 库 |

维护机当前主工作目录为 `~/aisee icon github`。`~/stemui` 是同一 Git 仓库的 worktree，不应当作第二份独立 icon 库。

## 设计师更新流程

1. 将新增或修改后的 SVG 放入 StemUI 的 `packages/icons/svg/` 对应分类目录。
2. 使用稳定、可检索的语义命名；优先使用 `snake_case`，并遵守 `line_`、`fill_`、`flat_` 等家族前缀。
3. SVG 使用统一画板和正确 `viewBox`，移除位图、白底、隐藏图层、无用分组与写死颜色。
4. 在 StemUI 根目录启动联动预览：

```bash
npm run dev:icons:playground
```

5. 确认新增、修改、重命名和删除在 playground 中都正确，再进行完整构建：

```bash
npm run build:icons
```

## GitHub 与 npm 同步

每次正式交付 icon 时，GitHub 源码和 npm 包都必须更新：

```bash
# 自动提升 patch 版本、完整构建并发布 @stemui/icons
npm run publish:icons

# 检查版本与改动后，再按团队流程提交并推送 stemui 仓库
git status
git add packages/icons package.json package-lock.json
git commit -m "feat(icons): update icon library"
git push origin main
```

如果版本已经提升、第一次 npm publish 失败，只重试发布：

```bash
npm run publish:icons:manual
```

发布 npm 是外部写操作，必须由拥有 npm 权限的维护者执行。不要在未经确认时自动发布、覆盖版本或推送远程仓库。

## 产品项目升级

```bash
npm install @stemui/icons@latest
```

```tsx
import { LineFileSaveIcon } from '@stemui/icons';

export function SaveAction() {
  return <LineFileSaveIcon size={20} color="currentColor" aria-hidden="true" />;
}
```

产品升级后应检查锁文件、构建结果与关键页面截图。设计系统仅在视觉规则、语义、命名或使用方式发生变化时同步更新文档，不需要为每个 SVG 保存副本。

## 设计系统预览同步

设计系统的单文件 HTML 不能直接执行 React npm 组件，因此 Web App UI Kit 将所需资源保存为只读 SVG 快照：

```text
assets/stemui/
├── manifest.json
├── nav-*.svg
├── action-*.svg
└── avatar-*.svg
```

StemUI 更新完成后，在设计系统仓库运行：

```bash
npm run sync:stemui
```

脚本只读取 StemUI 并复制指定资源到设计系统，不修改 StemUI、不发布 npm，也不推送 StemUI 仓库。默认读取 `~/stemui`；若维护目录不同，可显式指定：

```bash
STEMUI_ROOT="$HOME/aisee icon github" npm run sync:stemui
```

产品代码仍应直接安装并调用 `@stemui/icons`。快照只服务于设计系统的离线 HTML 预览，避免 `file://`、GitHub Pages 或 iframe 环境出现空白图标。

## 当前包边界

- `@stemui/icons`：正式 icon npm 包。
- `@stemui/animated-tabs`：已发布的交互组件包，不属于静态 icon 集。
- `@stemui/animated-icons`：StemUI workspace 中的动画 icon 包；尚未发布到 npm 前，不得在产品代码中声明 registry 依赖。
- Lucide：只在 StemUI 缺少对应 icon 时临时补充；频繁复用的补充图标应进入 StemUI，避免形成第二套资源库。

## 功能图标与插图区分

- 侧边栏、按钮、输入、下拉框、标签、状态和其他可交互位置，使用 StemUI 的功能图标家族：`line_*`、`fill_*`、`flat_*` 等；优先使用 `line_*`，保持 16px 线性识别。
- `illustration_*` 不用于功能交互或导航。插图只用于 Banner、空状态，以及页面需要增加呼吸感的非交互区域。
- UI Kit 的 `assets/stemui/nav-*.svg` 是上述功能图标的只读快照；其 manifest 会记录对应 StemUI 源文件名，更新时通过 `npm run sync:stemui` 重新生成。
