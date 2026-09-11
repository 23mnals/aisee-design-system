# 2026-09-11 本地预览恢复

- 用户报告本地预览打不开；检查时 TCP 4173 无监听进程。
- 通过独立后台进程重新启动现有 scripts/serve-preview.mjs，仅绑定 127.0.0.1:4173。
- 启动 PID 94710，日志 /tmp/aisee-preview-4173.log；PID 非长期配置，下次使用前核实监听。
- 门户 /、Steps.html、steps-demo.js 均返回 HTTP 200，端口监听正常。
- 未修改业务代码、未重建、未执行 Git 发布；分支 ai/desktop/design-system-current，HEAD ee2891a，原有未提交改动保留。
