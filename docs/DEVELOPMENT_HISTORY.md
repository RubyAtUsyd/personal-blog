# 开发记录与交接快照

记录截至 2026-10-27，依据仓库提交、PR、GitHub Actions 运行和 [PLAN.md](PLAN.md) 中的验收日志整理。本文件是**已经发生的事实记录**；未来需求和验收标准以 [PRD.md](PRD.md) 为准。新工作完成后更新快照，并在 [PLAN.md](PLAN.md) 追加对应任务的实际检查结果。

## 当前交付状态

- 仓库：[RubyAtUsyd/personal-blog](https://github.com/RubyAtUsyd/personal-blog)，本地目录：`/Users/ruby/Desktop/fullstack/personal-blog`。
- 线上站点：[RubyAtUsyd.github.io/personal-blog](https://rubyatusyd.github.io/personal-blog/)。当前公开页面为蓝色调静态首页，含 Writing、Notes、About **页内区块**和明确的待发布状态。
- `main` 当前发布版本：`d192c54`（2026-10-27 蓝色首页改造）；对应 [Quality 运行](https://github.com/RubyAtUsyd/personal-blog/actions/runs/40358972156) 与 [Pages 部署运行](https://github.com/RubyAtUsyd/personal-blog/actions/runs/40359200794) 均成功。上线后首页、抽查的 CSS/JS 资源返回 200，并能看到新版标题与区块。
- **尚未实现**：正式文章与课程样例、独立的 `/blog/`、`/notes/`、`/about/` 路由、关键词搜索、MongoDB 内容服务、S3 图片、FastAPI 检索问答和管理端。不要把首页展示文案当作已发布内容。

## 时间线

| 日期       | 交付与决定                                                                                                                                                                             | 证据                                                                                                                                                                                                                                                    |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-24 | 建立独立仓库与首版产品、工程、分阶段计划。明确只做技术博客、课程笔记、关于我和后续文章问答。                                                                                           | 初始提交 `8d85cd1`；`docs/PRODUCT.md`、`docs/ENGINEERING.md`、`docs/PLAN.md`                                                                                                                                                                            |
| 2026-10-25 | 完成 P0 工程底座：Next.js 16 静态首页、pnpm workspace、严格 TS、ESLint/Prettier、Husky/lint-staged/commitlint、单元与 Playwright 测试。                                                | [PR #1](https://github.com/RubyAtUsyd/personal-blog/pull/1)，合并提交 `e602539`；[ADR 0001](adr/0001-foundation.md)                                                                                                                                     |
| 2026-10-25 | 建立只读 Quality workflow 和受保护 `main`。必需 `quality-gate` 聚合 checks/security；故意失败的隔离 PR 证明门禁会阻止合并。单人仓库 required approval 为 0，Ruby 人工看 PR。           | [PR #1](https://github.com/RubyAtUsyd/personal-blog/pull/1)、已关闭的隔离 [PR #2](https://github.com/RubyAtUsyd/personal-blog/pull/2)、[审核运行手册](runbooks/review-and-ci.md)                                                                        |
| 2026-10-26 | Ruby 选择保留 `personal-blog` 仓库名与 GitHub 项目站点 URL。启用 GitHub Pages 的 Actions 发布源；成功的 `main` Quality 运行才触发独立部署，并以 `/personal-blog` 为 Next.js basePath。 | [PR #8](https://github.com/RubyAtUsyd/personal-blog/pull/8)、提交 `3754d9e`、[首次部署运行](https://github.com/RubyAtUsyd/personal-blog/actions/runs/40210690899)、[ADR 0002](adr/0002-github-pages-deployment.md)                                      |
| 2026-10-26 | 核验公开首页及样式/脚本资源为 200、未知路径为 404；将部署证据与恢复步骤写入仓库。                                                                                                      | [PR #9](https://github.com/RubyAtUsyd/personal-blog/pull/9)、[Pages 运行手册](runbooks/github-pages.md)                                                                                                                                                 |
| 2026-10-27 | 参考贤民博客的清晰导航、个人介绍和文章导览结构，使用原创蓝色视觉重做首页；加入 Writing、Notes、About 页内导航与未发布提示。                                                            | [PR #10](https://github.com/RubyAtUsyd/personal-blog/pull/10)、提交 `d192c54`、[主分支质量检查](https://github.com/RubyAtUsyd/personal-blog/actions/runs/40358972156)、[部署运行](https://github.com/RubyAtUsyd/personal-blog/actions/runs/40359200794) |

## 目前的代码与基础设施

| 位置                                                 | 作用                                                     | 状态                                     |
| ---------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------- |
| `apps/web/`                                          | Next.js 静态站点、蓝色首页、`/personal-blog` 构建配置    | 已运行并上线                             |
| `tests/`                                             | 质量门禁行为测试、桌面/手机 Playwright 首页与 404 验收   | 已运行；覆盖当前页面，不代表未来功能已测 |
| `.husky/`、`lint-staged.config.mjs`                  | 提交前格式/lint、提交信息与推送前类型/快速测试           | 已接入                                   |
| `.github/workflows/quality.yml`                      | PR/main 格式、lint、类型、测试、构建、安全检查与聚合门禁 | 已接入，main 受保护                      |
| `.github/workflows/deploy-pages.yml`                 | 成功的 main Quality 后构建并发布静态产物                 | 已接入并完成真实部署                     |
| `apps/content-api/`、`services/ai-api/`、MongoDB、S3 | 后续真实内容、媒体和问答服务                             | 尚未创建/接通                            |

本地常用命令（版本见 `.node-version`、`package.json`）：

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm audit:deps
GITHUB_PAGES_BASE_PATH=/personal-blog pnpm build
```

`pnpm check` 目前覆盖格式、lint、类型、7 项单元测试、hooks 验证、秘密扫描、静态构建和 6 项桌面/手机浏览器测试。依赖审计需要网络，结果随公告变化，不能把旧检查结果视为长期保证。

## 已确定的工程决策

1. Web 固定使用 GitHub Pages 静态导出；项目子路径 `/personal-blog` 在构建时注入。Pages 不运行 API、SSR 或数据库服务。
2. 真实内容计划由 NestJS/Fastify + MongoDB 管理；Web 通过 ContentRepository 切换 mock/真实 provider，不能在真实模式失败时静默回退 mock。
3. 图片计划用 S3；文章检索问答计划用 Python/FastAPI。先有可靠检索与引用，再评估是否需要 Agent 编排。
4. 主分支经 PR 与质量门禁；只有成功的 `main` 检查触发 Pages 发布。发布失败时旧版本继续服务，恢复见 [runbook](runbooks/github-pages.md)。
5. Node 24.19.0、pnpm 11.19.0、Next.js 16.4.3 等版本在锁文件和 [ADR 0001](adr/0001-foundation.md) 中固定。ESLint 9 的兼容风险需要按 ADR 期限复核。

## 下一步与交接限制

**从 P1-01 开始**：建立 Article/Series/Profile 契约、ContentRepository、可公开 mock 内容及草稿隔离，先让第一条真实阅读路径成立；然后继续 P1-02 阅读界面、P1-03 系列/搜索、P1-04 完整静态发布验收。详细依赖与边界案例见 [PLAN.md](PLAN.md)。

未经 Ruby 明确选择，不导入私人笔记或简历中的联系方式；AWS、Atlas、模型和 OIDC 的预算、权限与供应商尚未确定。当前已上线的只有静态前端，不应宣称数据库、图片上传或 AI 问答已投产。
