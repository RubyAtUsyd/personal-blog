# 本地验证与 GitHub 接入

## 本地

先切换至 .node-version 指定的 Node，安装 packageManager 指定的 pnpm。

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm check
pnpm audit:deps
pnpm dev
```

`pnpm check` 包含格式、lint、类型、7 个质量门禁单元用例、临时仓库 hooks 验证、秘密扫描、静态构建及浏览器验收。`audit:deps` 需要访问 registry，网络失败不能当作无漏洞。

开发地址默认 http://127.0.0.1:3000。Playwright 使用 4173 端口与静态输出，不连接开发服务器。测试端口被占用时查明进程，不随意终止其他服务。

若在受限执行环境出现 Turbopack `binding to a port / Operation not permitted`，请求批准运行构建；必要时将失败 .next 缓存移至临时目录后重新构建。不要关闭检查或静默更换构建器来掩盖问题。

如果 shell 使用系统 Node 22，将触发 engines 错误；先使用 nvm/fnm 或已经安装的 Node 24.19.0 切换，不降低 engines。Codex 本机验证使用其已安装 Node 24.19.0，未修改全局 Node。

## 提交

- pre-commit 自动修复可修复格式；不可修复 lint 会阻止提交。
- commit-msg 要求 Conventional Commit；例如 `feat(web): add article list`。
- pre-push 运行类型与快速测试。
- hooks 检验脚本只在独立临时仓库创建错误提交；不会往项目历史加入测试错误。
- 秘密扫描针对当前工作树，不是历史清理工具。若发现曾提交秘密，立即撤销凭证并按事故流程处理。

## GitHub（待配置）

1. 用户确认仓库/可见性，添加正确远程；不要猜用户名或自动公开代码。
2. 推送文档 main 和 feat/P0-engineering-foundation，创建 draft PR。
3. 等待 Quality workflow 的 checks、security、quality-gate 运行。
4. 配置 main 保护：仅 PR、required quality-gate、对话解决、禁止 force push/删除。
5. 个人仓库使用 Ruby 人工审核并手动合并；同一账号不能批准自己的 PR。有第二位维护者再启用 required approval。
6. 在独立测试分支制造检查失败，确认 GitHub 阻止合并后修复；此验收当前尚未执行。
7. 确认 workflow 对仅文档修改也运行，任何 failed/cancelled/skipped 必需 job 都不能让 quality-gate 成功。

PR workflow 没有云密钥、写入权限或部署步骤；只读内容权限，不使用 pull_request_target 执行 PR 代码。尚无 CODEOWNERS，因为维护者账号未确认。

## 恢复与审核范围

P0 不涉及数据库迁移或线上状态。保持当前 main 的文档提交；工程变更在独立分支审核。停止本地服务器可结束对应终端进程，生成的 .next/out 可以重新生成。未审核前不合并、不推送、不发布。
