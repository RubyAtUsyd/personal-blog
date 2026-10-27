# Claude Code 项目入口

这是 Ruby 的个人技术博客仓库。目标是逐步交付技术博客、课程系列、关于我和基于**已发布文章**的引用式问答。当前只有蓝色静态首页已上线；不要把规划中的功能写成已经完成。

## 开始前按顺序阅读

1. `docs/PRD.md`：产品目标、范围、阶段验收与当前状态（产品事实源）。
2. `docs/DEVELOPMENT_HISTORY.md`：已完成的开发、PR/CI/部署证据与交接限制。
3. `docs/PLAN.md`：任务依赖与实际验收日志；**下一项为 P1-01**。
4. `docs/PRODUCT.md`：详细数据模型、API、安全与检索规范；与 PRD 冲突时以 PRD 的范围和当前状态为准。
5. `docs/ENGINEERING.md`、`AGENTS.md`：架构、质量、Git 审核和完成标准。修改 `apps/web/` 前还要阅读 `apps/web/AGENTS.md` 与相关本地 Next.js 文档。

## 当前仓库

- 根目录：`/Users/ruby/Desktop/fullstack/personal-blog`；只在本仓库工作，不自动导入父目录项目、私人笔记、简历联系方式或雇主代码。
- 远端：`https://github.com/RubyAtUsyd/personal-blog`；网站：`https://rubyatusyd.github.io/personal-blog/`。
- 已有：Next.js 16 静态首页、蓝色视觉、Git hooks、受保护 main、Quality 与 Pages 自动部署。
- 未有：文章与课程数据、独立内容路由、MongoDB/S3/FastAPI/真实问答。不要创建与当前任务无关的空服务或虚假成功检查。
- Node 与 pnpm 版本分别见 `.node-version` 和 `package.json`。首次安装使用 `pnpm install --frozen-lockfile`；开发用 `pnpm dev`；完整本地检查用 `pnpm check`；依赖审计另用 `pnpm audit:deps`。

## 实施流程

1. 检查 `git status`、当前分支、相关文档与现有约定；保护用户未提交的修改。
2. 按 `docs/PLAN.md` 选择一个依赖已满足、可审核的任务。用户本次明确指定的任务优先。
3. 实现可运行的纵向增量，遵循单一职责、单向依赖、严格类型和最小必要依赖；不要用 stub 或关闭检查冒充完成。
4. 运行与改动相称的检查，修复根因；对未运行或需要外部资源的验证明确标注。
5. 在 `docs/PLAN.md` 追加真实验收结果；必要时更新 PRD、开发记录或 ADR。不要覆盖历史证据。
6. 使用短期分支、Conventional Commit 和 PR 供 Ruby 审核。不要直接推应用改动到 main、强推、跳过 hooks、关闭必需 CI，或未经本次用户明确授权合并/发布。

当前最合适的下一步是 **P1-01：Article/Series/Profile 契约、ContentRepository、可公开 mock 样例与草稿隔离**。先读该任务验收条件，再决定最小实现切片；P2/P3 的云服务和模型不阻塞 P1。
