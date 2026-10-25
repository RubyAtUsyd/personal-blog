# Ruby 技术博客：Codex 开发交接包

版本：1.1 · 2026-10-25。状态：P0 工程底座已在 `feat/P0-engineering-foundation` 开发；远程 CI 和分支保护以 GitHub 实际状态为准。

这是博客的独立项目工作目录：`/Users/ruby/Desktop/fullstack/personal-blog`。Git 仓库、静态首页、hooks 和质量工作流已经建立；当前首页是可预览的工程底座，文章与检索问答将在后续阶段开发。不要把父目录的其他项目一并纳入仓库。

## 本地启动

使用 `.node-version` 指定的 Node 和 `package.json` 指定的 pnpm：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

打开 `http://127.0.0.1:3000`。提交前 hooks 自动检查暂存文件。运行 `pnpm check` 可执行格式、lint、类型、单元、hooks、安全扫描、静态构建和浏览器测试；首次运行浏览器测试前执行 `pnpm exec playwright install chromium`。依赖安全公告检查另运行 `pnpm audit:deps`，需要网络。

## 阅读顺序

1. `AGENTS.md`：代理执行约束与完成标准。
2. `docs/PRODUCT.md`：产品需求、系统边界和验收标准。
3. `docs/ENGINEERING.md`：代码规则、Git 审核、hooks、CI、安全与部署。
4. `docs/PLAN.md`：按依赖排列的实施任务和状态记录。

## 给 Codex 的启动提示词

> 请读取本仓库 AGENTS.md、docs/PRODUCT.md、docs/ENGINEERING.md 和 docs/PLAN.md，按计划开发 Ruby 的技术博客与文章检索问答产品。先检查仓库现状和未提交修改，不覆盖已有工作。从第一个未完成且依赖已满足的任务开始，每个任务交付可运行的最小增量，执行对应验收与检查，将实际结果写入任务日志。先完成 P0 工程底座和质量门禁，再开发业务功能。不要仅生成空目录或占位配置，也不要一次实现所有阶段。每个任务完成后准备可审核的 diff 或 PR；GitHub 可用且已授权时创建 draft PR，否则保留本地成果并说明差距。不要自行合并或部署生产环境。没有云账户或模型密钥时继续完成可验证的本地实现，不假称真实集成已通过。当前会话默认只执行 P0；之后由我指定继续的阶段。

## 审核与使用

- P0 工程底座审核后，下一轮使用“继续 P1，按既有规则执行”。
- 每个阶段的 PR 应包含用户可见结果、测试证据、限制和恢复方法。
- 个人仓库由 Ruby 审核 diff 并决定合并；有第二位维护者时启用正式 required approval。
- GitHub 用户名、仓库名称、云预算与认证供应商仍待确定，但不阻塞 P0/P1 的本地工作。

所有文档中的命令与配置均是待实现契约；不能因为写在文档里就标记为已配置或已测试。
