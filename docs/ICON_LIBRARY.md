# AISEE Icon Library Workflow

## 入口与职责

| 入口 | 用途 |
|---|---|
| [StemUI GitHub](https://github.com/qi15582378779/stemui) | SVG 源文件、生成代码、预览与版本历史的唯一资源源 |
| [`@stemui/icons`](https://www.npmjs.com/package/@stemui/icons) | 产品项目安装和使用 icon 的正式 npm 包 |
| aisee Design System | 记录 icon 视觉规则、尺寸、语义和使用示例，不复制完整 SVG 库 |

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

## 当前包边界

- `@stemui/icons`：正式 icon npm 包。
- `@stemui/animated-tabs`：已发布的交互组件包，不属于静态 icon 集。
- `@stemui/animated-icons`：StemUI workspace 中的动画 icon 包；尚未发布到 npm 前，不得在产品代码中声明 registry 依赖。
- Lucide：只在 StemUI 缺少对应 icon 时临时补充；频繁复用的补充图标应进入 StemUI，避免形成第二套资源库。
