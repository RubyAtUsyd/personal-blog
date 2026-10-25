# ADR 0002: 使用 GitHub Actions 发布项目 Pages 站点

状态：接受（2026-10-26）

## 背景

Ruby 选择保留 `RubyAtUsyd/personal-blog` 仓库，并使用 `https://RubyAtUsyd.github.io/personal-blog/`。Next.js 静态导出部署在子路径，默认本地开发仍使用根路径。仓库已有受保护 `main` 和必需的 `quality-gate`。

## 决策

- Web 构建时设置 `GITHUB_PAGES_BASE_PATH=/personal-blog`，使用 Next.js `basePath`；不为同源子路径设置 `assetPrefix`。
- `Quality` 继续以只读权限检查 PR 和 `main`。独立 Pages workflow 仅在成功的 `main` push 检查结束后启动，并核对提交来源与当前 `main` SHA。
- Pages workflow 从已通过检查的 SHA 重新构建静态产物，使用 `configure-pages`、`upload-pages-artifact`、`deploy-pages`，仅部署作业拥有 `pages: write` 和 `id-token: write`。
- GitHub Pages 的构建源设置为 `workflow`。无需 `gh-pages` 分支、长期发布 token 或自定义域名。

## 后果

站点发布会在质量检查后多一次构建，增加几分钟延迟，但减少了从不可信 PR 工件继承高权限部署的风险。仓库改名或自定义根域名时需调整 basePath 并重建。Pages 只能提供静态站点；后续内容 API 与 AI API 必须单独部署。
