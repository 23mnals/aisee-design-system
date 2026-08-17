# 公开在线预览部署说明

## 当前状态

仓库已经包含 GitHub Actions 静态部署流程：`.github/workflows/ci.yml` 会在 `main` 分支通过检查后运行 `npm run site`，并将生成的 `site/` 发布到 GitHub Pages。

预期地址为：

`https://23mnals.github.io/aisee-design-system/`

本次无法从运行环境验证该地址是否已公开可访问：当前环境 DNS/网络不可用，且 GitHub CLI 登录凭据已失效。因此这里不把未验证的地址标记为“已上线”。

## 你需要在 GitHub 做一次设置

1. 打开仓库 Settings → Pages。
2. 在 Build and deployment 中选择 **Source: GitHub Actions**。
3. 回到 Actions，运行或重新触发 `Deploy static preview` 工作流。
4. 等待 workflow 的 `deploy` job 成功后，再打开上面的 Pages 地址。

## 私有仓库的注意事项

仓库仍可保持私有，但 GitHub Pages 对私有仓库的公开访问能力取决于账号/组织套餐与 Pages 权限。如果 Pages 页面不允许公开访问，有两个安全选项：

- 保持源代码仓库私有，另建一个只发布 `site/` 的公开预览仓库；
- 在确认团队接受公开源代码后，将当前仓库改为 Public。

不要把 StemUI/icon 开发仓库改为公开，也不要把设计系统的提交同步到 StemUI 仓库。

## 后续更新方式

修改本地设计系统后提交并推送到 `main`，Actions 会重新构建并发布。团队成员若只需要查看，可使用 Pages 地址；若需要共同维护，则继续通过私有 GitHub 仓库协作，并按 GitHub 权限邀请成员。
