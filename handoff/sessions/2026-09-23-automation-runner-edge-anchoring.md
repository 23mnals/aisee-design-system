# Automation Runner 空详情与边缘锚定修复

## 本轮目标

- 修复外部接入时没有详情内容却出现空白分隔线的问题。
- 修复卡片拖到屏幕边缘后切换展开、默认和最小化时被视口裁切的问题。
- 将两项行为同步到生产组件、Copy for AI 交付和长期规范。

## 本轮完成

- 新增有效视图判断：只有存在详情行或操作回调时才允许进入 expanded；空内容请求 expanded 会显示为 default。
- 空详情时不渲染详情容器、展开箭头或分隔线，标题区域保持可拖拽且不产生伪交互。
- 拖拽结束时记录最近的水平与垂直锚点；视图尺寸变化时用 left/right/top/bottom/center 锚定，而不是继续固定旧左上角坐标。
- 右侧卡片向左展开、向右收起；左侧反向；顶部、底部和中心采用同一套对称规则。
- 更新组件生产清单的 preserve 契约，并生成最新 Automation Runner 生产交付 `200678363f0b540a`。
- 更新 README、CHANGELOG 和长期设计决策。

## 验收

- 浏览器实测右侧：默认 332px → 最小 74px → 默认 332px，右边缘始终为 1264px。
- 浏览器实测左侧：默认 332px → 最小 74px → 默认 332px，左边缘始终为 8px。
- 浏览器实测顶部：default 切 expanded 时根容器顶边始终为 8px；底部从 expanded 257px 收回 default 64px 时底边始终为 712px。
- `npm run typecheck` 通过。
- `npm test`：139 项通过。
- `npm run verify:ai-deliveries`：Registered 30 / Verified 30。
- `npm run audit:copy-ai`：30 组件、205 个配置案例、0 失败。
- `npm run site` 与 `git diff --check` 通过。

## Git

- 分支：`ai/desktop/design-system-current`。
- 实现提交：`ee04263`（`fix: anchor automation runner state transitions`）。
- 与门户 / shadcn 规则提交分离，随本轮发布推送到开发分支；main 未操作。

## 下一步

- 等待 GitHub Pages 更新公开链接后，在外部 React 项目复测空详情和四边锚定。
