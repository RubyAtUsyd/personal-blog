# Ruby 的技术博客

一个持续建设中的个人技术博客，用文章记录问题分析、实现取舍和踩坑复盘，用主题系列整理课程笔记，并逐步加入基于已发布内容的检索问答。

**线上站点：** [rubyatusyd.github.io/personal-blog](https://rubyatusyd.github.io/personal-blog/) · **仓库：** [RubyAtUsyd/personal-blog](https://github.com/RubyAtUsyd/personal-blog)

截至 2026-10-27，已上线蓝色调静态首页与 GitHub Pages CI/CD。Writing、Notes、About 是首页区块；正式文章、课程章节、独立页面、真实数据库、S3 图片和 AI 问答尚未实现。下一项任务是 P1-01：内容契约与可公开 mock 样例。

## 本地开发

工作目录为 `/Users/ruby/Desktop/fullstack/personal-blog`。使用 `.node-version` 指定的 Node 与 `package.json` 指定的 pnpm：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

本地打开 `http://127.0.0.1:3000`。常用检查：

```sh
pnpm exec playwright install chromium  # 首次运行浏览器测试时
pnpm check                            # 格式、lint、类型、测试、安全扫描、构建、浏览器测试
pnpm audit:deps                       # 依赖公告检查，需要网络
GITHUB_PAGES_BASE_PATH=/personal-blog pnpm build
```

## 文档导航

| 文件                                                           | 用途                                       |
| -------------------------------------------------------------- | ------------------------------------------ |
| [CLAUDE.md](CLAUDE.md)                                         | Claude Code 的仓库入口、读取顺序与实施流程 |
| [docs/PRD.md](docs/PRD.md)                                     | 产品目标、阶段范围、当前状态与验收标准     |
| [docs/DEVELOPMENT_HISTORY.md](docs/DEVELOPMENT_HISTORY.md)     | 至今开发时间线、交付证据与下一步           |
| [docs/PLAN.md](docs/PLAN.md)                                   | 分阶段任务、依赖和实际验收日志             |
| [docs/PRODUCT.md](docs/PRODUCT.md)                             | 详细数据模型、API、内容与检索约束          |
| [docs/ENGINEERING.md](docs/ENGINEERING.md)                     | 架构、质量、安全和 Git 审核规则            |
| [docs/runbooks/github-pages.md](docs/runbooks/github-pages.md) | 发布验证、故障定位与恢复                   |

## 审核与部署

在短期分支开发并提交 PR；受保护的 `main` 要求 `quality-gate` 成功。合并后，独立 Pages workflow 在 `main` 的完整 Quality workflow 成功时重新构建并部署静态站点。项目子路径为 `/personal-blog`；GitHub Pages 不能运行后端 API、SSR 或数据库。

代码和文章内容都应通过审核后公开。不要自动导入私人笔记、简历联系方式或雇主代码。尚未接通的功能不能在文档或界面中宣称已上线。
