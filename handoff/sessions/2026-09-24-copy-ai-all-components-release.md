# 全组件 Copy for AI 规则同步与发布

## 授权与范围

用户反馈 Toggle 跨项目验证没有明显问题，要求同步其余 Copy for AI 规则，并提交 Toggle 相关修改到远端。发布目标为 `ai/desktop/design-system-current`；不操作 main，不创建或合并 PR。

## 本轮完成

- 全部 30 个登记组件使用同一生成器与菜单：Apply AISEE design 默认更新组件视觉与动效；Add motion only 保留静态外观，两份文本只在 Goal 不同。
- 两模式共用目标组件实现与专属局部样式的精确路径范围；页面、文案、业务逻辑、hook、API、请求与配置等范围外文件先列原因、最小 diff、影响并等待确认。
- 默认不带预览参数；只有 Target variant 明确选中的一个变体进入提示词。
- Toggle 已验证的规则、单行按钮和统一菜单纳入本批提交；修正通用接入与验收说明中自动携带预览配置、直接安装等旧表述。
- 全组件已经使用共同生成器，没有复制出 29 份容易分叉的组件提示词。生产组件源码、payload、tokens 与 UI Kit 未修改。

## 文件

核心为 `assets/ai-delivery.js`、`assets/copy-ai-controls.js`、`aisee-design-system-preview.html`、`components/Toggle/Toggle.html`。相关规则、README/CHANGELOG、测试与审计脚本随同提交；具体文件以该提交 diff 为准。

## 验证

从暂存区导出独立副本，复用本地工具链，验证实际待发布内容：

- `npm run check`：148 项测试、tokens 检查、类型检查与构建通过。
- `npm run audit:copy-ai`：30 个组件、205 个受控配置案例、0 失败；覆盖两模式共享保护、默认无参数及显式变体。
- `npm run verify:ai-deliveries`：30 个独立交付通过文件范围、校验、冲突保护、React 类型与构建检查。
- 静态站点构建与暂存 diff 格式检查通过。
- 独立预览 4174 的 Button 默认/仅动效模式均显示复制成功，页面切换使用共用控制器。完整复制内容由生成器/控制器测试验证；浏览器反馈不等同系统剪贴板全文回读。
- 用户确认的真实项目结果仅针对 Toggle；其余组件真实业务项目接入尚未逐一验证。

## Git 与保护

发布前 HEAD/origin 为 `9d022e3`。先备份全部本地修改，再按内容块暂存；AI Design Brief/资料权威阶段等未提交工作继续保留在工作区，没有混入本次发布。实际新提交号与远端 CI/Pages 状态以 Git 和本次发布结果为准。

## 下一步

刷新线上门户后重新复制其余组件进行真实项目复测，优先 Dropdown/Tooltip 和 Automation Runner；按 Goal 检查视觉、动效、业务不变与精确文件范围。第一阶段资料与真实测试项目收敛任务保持独立。
