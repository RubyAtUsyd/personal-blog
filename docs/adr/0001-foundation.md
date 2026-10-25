# ADR 0001：P0 版本基线与交付边界

日期：2026-10-25。状态：采用。

## 决策

- Node 24.19.0 LTS、pnpm 11.19.0；安装时遵守 engine-strict，提交 lockfile，CI 使用 frozen-lockfile。
- Next.js 16.4.3、React/React DOM 19.3.1、TypeScript 5.9.3、Tailwind 4.3.3。所有直接依赖固定确切版本；registry 元数据和实际安装验证兼容性。
- P0 只创建 web 与质量基础设施，暂不安装 NestJS、MongoDB、FastAPI、shadcn 组件或模型 SDK；后续按实际功能引入。
- Python 服务阶段采用兼容依赖的受支持 Python 3.13 补丁版本，届时核对并固定 Python 与 uv，建立 uv.lock；当前无 Python 服务，不提供假成功检查。
- 当前主页是工程底座的真实静态预览，只有站内锚点，不放不可用文章链接或伪装的 AI 答案。
- 无外部字体请求，使用系统字体；构建不需要云凭证或外网字体下载。
- TS 应用及测试/工具配置分别用 tsconfig 检查；JS 工具由 ESLint 检查，关键质量门禁另有行为测试。
- Husky 唯一管理 hooks，lint-staged 保护部分暂存修改，CI 独立重新检查整个源码树。
- OpenAPI/客户端在接口阶段生成并提交可审查产物；当前不建立空 contracts 包。

## 已知依赖取舍

曾实际安装 ESLint 10.13.0，但 Next 官方配置间接使用的 eslint-plugin-import、eslint-plugin-react、eslint-plugin-jsx-a11y 的 peer 范围尚不接受 ESLint 10。为避免忽略 peer 错误或关闭规则，暂固定兼容的 ESLint 9.39.5。该版本已被 npm 标记不再支持，这是明确的维护风险，不是已解决的问题。

跟进期限：2026-11-08 前或 P1 合并前（二者较早者）复核官方插件兼容性；迁移支持的 ESLint 版本并运行所有规则/hooks 回归。若仍不兼容，单独记录替代配置决策，不能无说明永久停留。当前 registry audit 未报告已知漏洞，但不能据此推断旧版本持续安全。

http-server 的间接 whatwg-encoding 依赖有弃用提示；仅用于本地/CI 静态产物测试，不部署到生产。记录并通过依赖 PR 跟踪，无已知高危审计结果。

## 运行边界

用户提供 `RubyAtUsyd/personal-blog` 远程仓库。P0 分支已推送并通过草稿 PR #1 审核；GitHub 上 `checks`、`security`、`quality-gate` 已成功。main 分支启用必须经 PR、required `quality-gate`、管理员适用和禁止强推/删除。单人模式 required approval 为 0；Ruby 仍需人工审核 diff 才合并。隔离测试 PR #2 证明失败检查导致 `quality-gate` 失败和合并阻止，测试 PR 已关闭。没有生产部署。

AWS、MongoDB、图片服务和检索问答仍为后续阶段，不属于当前可演示能力。

## 参考

- https://nextjs.org/docs/app/getting-started/installation
- https://nodejs.org/en/about/previous-releases
- https://typicode.github.io/husky/get-started.html

官方 Actions 的 v6/v4 提交通过 git ls-remote 核对后固定 SHA；后续由 Dependabot 提 PR 更新，不使用浮动标签执行。
