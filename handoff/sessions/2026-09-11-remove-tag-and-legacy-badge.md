# 删除 Tag 与 Badge Legacy 页面

日期：2026-09-11

## 本轮目标与授权

用户截图明确圈出 Content & Status 下的 Tag 与 Badge — Legacy，并要求删除这两个页面。

## 完成与修改文件

- 删除 `components/Tag/Tag.html`。
- 删除 `legacy/pages/Badge Legacy.html`。
- 从 `aisee-design-system-preview.html` 移除两个注册项，导航与页面数量沿用自动计算。
- Current Badge、Tag Input 及其他组件保持不变。
- 刷新 `handoff-context.md`，保留此前尚未提交事项与未完成产品工作。

## 验证

- `npm test`：49/49 通过。
- `npm run build`：通过。
- `git diff --check`：通过。
- 本地预览 `http://127.0.0.1:4173/` 返回 200，门户已无两个注册入口；被删除的两个页面 URL 均返回 404。
- 沙箱内本地网络不可访问；扩大执行权限后确认已有预览服务正在运行，直接检查该服务成功。

## Git 与原有工作保护

- 分支：`ai/desktop/design-system-current`。
- HEAD：`ee2891a docs: record sidebar main sync PR`。
- 保留进入本轮前已有的 `AGENTS.md`、`handoff-context.md` 与上一轮未跟踪 session 改动。
- 未执行 commit、push、PR 或 merge；此次为本地 Legacy 页面删除，不属于 Web Draft 删除发布例外。

## 未完成与下一步

本轮删除任务已完成。用户授权后按任务范围提交与推送；Card 业务变体、Plugin Entry Options 旧引用等既有事项继续见当前交接。
