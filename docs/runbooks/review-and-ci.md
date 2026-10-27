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

## GitHub 审核与 CI（截至 2026-10-27）

1. 远端为公开仓库 `RubyAtUsyd/personal-blog`。[P0 PR #1](https://github.com/RubyAtUsyd/personal-blog/pull/1) 已合并；最新蓝色首页来自 [PR #10](https://github.com/RubyAtUsyd/personal-blog/pull/10)。交付时间线与运行证据见 [开发记录](../DEVELOPMENT_HISTORY.md)。
2. Quality workflow 的 `checks`、`security`、`quality-gate` 在 PR 与 main 运行。分支保护经 GitHub API 核实：必须经 PR、required `quality-gate`、对话解决、线性历史、管理员适用、禁止强推/删除。
3. 个人仓库 required approval 为 0；同一账号不能批准自己的 PR。Ruby 在 PR 查看 diff 后手动决定是否合并；有第二位维护者再启用 required approval。
4. 隔离 [测试 PR #2](https://github.com/RubyAtUsyd/personal-blog/pull/2) 故意让 `checks` 失败；`quality-gate` 失败且 `mergeable_state=blocked`。该 PR 已关闭，未合并。
5. Workflow 不设置顶层路径过滤，仅文档变更也会运行。`quality-gate` 的失败/取消/跳过组合在本地单元测试覆盖；远端失败路径由 PR #2 验证。

PR workflow 没有云密钥、写入权限或部署步骤；只读内容权限，不使用 pull_request_target 执行 PR 代码。只有成功的 main Quality 才触发独立 Pages 发布，具体见 [Pages 运行手册](github-pages.md)。尚无独立第二位维护者，因此不配置 CODEOWNERS 或 required approval。

## 恢复与审核范围

当前没有数据库迁移，但静态首页已上线。工程变更在独立分支审核；静态站点的回退见 [Pages 运行手册](github-pages.md)。停止本地服务器可结束对应终端进程，生成的 `.next`/`out` 可以重新生成。新 PR 未经审核与授权前不合并或发布。
