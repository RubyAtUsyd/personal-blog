# GitHub Pages 发布与恢复

站点地址：`https://RubyAtUsyd.github.io/personal-blog/`。这是项目站点，保留 `RubyAtUsyd/personal-blog` 仓库名称。

## 自动发布

合并到受保护 `main` 后，`Quality` workflow 先运行格式、lint、类型、测试、静态构建和安全检查。只有该次 `push` 的完整 workflow 成功，`Deploy GitHub Pages` 才会构建并发布同一个提交。PR、失败的检查和非 `main` 分支不会部署。部署作业读取 GitHub API 核对提交仍是 `main` 最新版本；旧运行不会覆盖新版本。

发布作业使用 `GITHUB_PAGES_BASE_PATH=/personal-blog` 构建 Next.js 静态产物 `apps/web/out`。本地默认没有 basePath，仍可在 `/` 预览。GitHub Pages 的 Source 必须是 **GitHub Actions**，不是 `/docs` 或 `gh-pages` 分支。工作流使用 Pages OIDC token，无额外长期部署密钥。

## 验证

1. 在 GitHub Actions 确认 `Quality` 和随后 `Deploy GitHub Pages` 都成功，记录两个运行对应的 commit SHA。
2. 打开站点地址并硬刷新。检查首页内容、样式与浏览器控制台中的资源请求；资源应位于 `/personal-blog/_next/`。
3. 检查未知路由返回 404。未来上线文章路由时，逐条验证深链刷新和页面内链接。

目前只有蓝色静态首页；Writing、Notes、About 是页内区块，不是完整的文章、系列或独立 About 路由。文章、课程笔记和检索问答仍在后续任务中，Pages 不提供运行中的 API、SSR 或数据库服务。

## 故障与恢复

- `Quality` 失败：修复失败项，按 PR 审核流程合并；旧站点继续提供服务。
- 发布作业失败：确认 Pages Source、仓库 Actions 权限与 `github-pages` 环境设置；从 Actions 日志定位失败步骤。修复后合并新提交触发重试。
- 错误内容已发布：通过 PR 撤回或修复，再让 `main` 通过检查重新发布；需要快速回退时，对相关提交创建 revert PR，不强推 `main`。敏感内容撤回还需检查 GitHub 历史和 CDN 缓存。
- 旧提交的质量检查稍后完成：部署作业会拒绝过期 SHA，不覆盖更新内容。其失败可以在 Actions 中看到，确认最新提交的部署是否成功。
