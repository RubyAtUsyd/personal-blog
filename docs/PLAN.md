# 分阶段执行计划与证据记录

初始状态：所有任务 TODO。本文档存在不代表配置已生效。每个任务用 TODO / IN_PROGRESS / BLOCKED / DONE；DONE 必须有验收证据。任务内独立部分可继续推进，但不得绕过依赖、权限或生产发布要求。

## 执行约定

- 每次先读相关需求与工程规则，检查 git status。
- 每个任务是可审查的增量；小任务可合并为同目标 PR，大任务按可运行纵向功能拆分。
- 当前会话授权范围以用户指定阶段为准。跨阶段不自动开新任务或并行代理。
- 关键决定写 docs/adr/NNNN-title.md：背景、选择、替代方案、取舍、后果。
- 任务完成记录实际命令、通过/失败、未验证项、PR/commit 或本地 diff；禁止编造测试结果。

## P0：工程底座与门禁

### P0-01 仓库与版本基线 — DONE（本地）

依赖：无。
行动：确认目标目录与现有 Git；独立初始化或使用用户指定仓库；设定 pnpm workspace、Node LTS、Python/uv 版本约定；选择兼容稳定版本并记录 ADR；创建最小可运行 web 页面。
验收：新 checkout 可按 README 安装与启动；lockfile 完整；没有纳入父目录项目；明确版本和命令。

### P0-02 格式、lint、类型与 hooks — DONE（本地）

依赖：P0-01。
行动：ESLint flat config、Prettier、TS strict、Husky、lint-staged、commitlint、统一脚本；只配置当前实际存在的应用。
验收：工程文档第 6 节的合法/非法提交、部分暂存与含空格路径测试全部通过；临时仓库验证不破坏工作区；规则失败能阻止提交。

### P0-03 PR 与 CI 门禁 — DONE（本地与 GitHub）

依赖：P0-02。
行动：PR 模板、质量 workflow、quality-gate；明确单人审核模式；远程具备条件时配置并验证 main 保护。
验收：有效 PR 检查通过；故意失败的隔离测试 PR 无法通过门禁；文档 PR 不挂起；无 secrets 泄漏；远程不可用时只标记本地配置完成，远程验证保持 BLOCKED。

阶段交付：工程底座可运行、检查真实生效、审核模式清楚。交给 Ruby 审核后进入 P1。

## P1：mock 博客产品

### P1-01 数据契约与样例 — TODO

依赖：P0 本地门禁完成。
行动：Article/Series/Profile schema、ContentRepository、Mock provider、样例与合法图片、幂等 fixtures loader。
验收：至少 8 篇完整可读样例；schema 错误、重复 slug、无效系列引用被检测；草稿在公开输出中不可见。

### P1-02 阅读界面 — TODO

依赖：P1-01。
行动：设计 tokens、导航、博客列表/正文、Markdown 安全渲染、代码块、目录、About、主题。
验收：中文/英文/长代码显示正常；键盘可操作；移动端检查；不执行文章中的脚本；空/错/加载状态可复现。

### P1-03 课程与关键词搜索 — TODO

依赖：P1-02。
行动：系列目录与前后篇、构建搜索索引、中英文匹配与过滤 URL。
验收：第一/末章和草稿跳过正确；搜索技术词可找到对应文章；重复中文标题锚点一致；无结果体验清楚。

### P1-04 静态构建与首次发布准备 — TODO

依赖：P1-03。
行动：静态路由枚举、sitemap/RSS/metadata、图片适配、404、Pages workflow、Playwright 静态产物测试。
验收：本地构建可深链刷新；站点 URL/basePath 不硬编码未知用户名；无服务端依赖；请求不存在文章显示合理 404；获得部署授权后验证线上路径。
注意：尚无部署授权或 GitHub 配置时交付 artifact 与清单，不标记线上验收完成。

## P2：真实内容与媒体

### P2-01 NestJS + MongoDB + 真实 provider — TODO

依赖：P1 产品可用。
行动：内容服务、Mongoose schema/索引、OpenAPI/client、内容导入、API provider、容器开发环境。
验收：导入 fixtures 后 mock/API 契约一致；真实 Mongo 集成测试验证分页、唯一索引、错误返回；构建可以读取 API 且失败不退回 mock。

### P2-02 管理员与发布流程 — TODO

依赖：P2-01；真实 OIDC 供应商在正式集成前确定。
行动：管理员认证与权限、简单管理端、草稿编辑、版本冲突、发布/撤回、可信构建触发、持久化任务状态。
验收：未登录/非管理员无法修改；草稿不能被公开读取；重复发布幂等；失败可重试；并发编辑不覆盖；发布后站点版本与内容一致。

### P2-03 S3 媒体工作流 — TODO

依赖：P2-02；AWS 测试资源获授权。
行动：upload intent、受限直传、完成校验、图片变体、MediaAsset、CloudFront 分发、孤立资源清理。
验收：非法格式/超限/伪造 MIME/其他对象 key 被拒；草稿图不可公开读取；真实测试环境上传并显示成功；图片 key 与 metadata 一致。
离线替身可提前完成；真实 S3/OAC 验收必须单独记录。

### P2-04 服务部署与运行基线 — TODO

依赖：P2-01；部署 P2-02/03 前完成对应运行要求。
行动：预算与 region/网络 ADR、容器、IaC、OIDC 部署、健康检查、日志、错误监控、备份恢复说明。
验收：测试环境可运行；Mongo 网络与最小权限确认；版本可回退；一次备份恢复演练；资源及费用清单经用户确认后才上生产。

## P3：文章检索与问答

### P3-01 FastAPI 底座与 Python 门禁 — TODO

依赖：P1 完成，可与尚未取得云权限的 P2 离线部分交错推进。
行动：uv/lockfile、Pydantic 配置、router/use case/adapters、Ruff/mypy/pytest、Python lint-staged 路由、AI OpenAPI/client。
验收：启动/健康/错误契约可测试；Python 格式与 lint 错误阻止提交；取消/超时路径测试；无模型 key 可运行离线测试。

### P3-02 索引管线与真实检索 — TODO

依赖：P3-01、P2-01；真实集成需 Atlas Search 与 embedding 配置。
行动：内部内容读取、分块与 anchor、版本/hash、幂等任务、向量索引、更新/撤回、状态对账。
验收：同版本重复任务不增生；旧版本不污染新索引；更新正确替换；撤回及时过滤；失败可重跑；真实 Atlas 检索有独立证据。

### P3-03 可靠回答与来源 — TODO

依赖：P3-02。
行动：检索过滤、模型 adapter、结构化回答、来源校验、无依据返回、限流/预算/超时；用确定性替身测试故障。
验收：不能引用未提供或已撤回 chunk；不能执行正文中的指令；服务失败不生成假答案；请求参数过滤确实影响检索。

### P3-04 问答界面 — TODO

依赖：P3-01 后可先做明确标注的 mock UI；最终验收依赖 P3-03。
行动：/ask、问题输入、内容过滤、引用卡片、取消、重试、空证据与故障状态。
验收：引用进入正确文章锚点；过滤可操作；连续请求不显示旧回答覆盖新回答；浏览器不包含任何模型/数据库密钥。

### P3-05 评估与上线决定 — TODO

依赖：P3-03、P3-04。
行动：至少 40 题与证据标注、保留测试集、检索基线对比、支持度人工抽样、成本/延迟统计、失败分析。
验收：达到 PRODUCT 第 7 节门槛；记录真实模型与索引版本；确定预算和延迟 SLO；通过后 Ruby 决定上线。
门槛未达时保留关键词搜索，修复检索/引用问题；不得仅调低阈值或隐藏失败样例。

## P4：发布与交接

### P4-01 最终验收与演练 — TODO

依赖：P1–P3 对应上线功能完成。
行动：干净环境安装、E2E/可访问性/安全边界、公开数据检查、生产配置、恢复演练、运维手册与项目说明。
验收：每个功能有证据；自动检查无未解释失败；发布和回退清楚；已知限制与后续事项列出；未接通功能不能标记为已上线。

## 任务日志模板

每次完成任务追加一条，不覆盖历史：

```text
日期 / 任务 ID / 状态：
交付与用户可见变化：
主要文件 / commit / PR：
实际检查命令与结果：
验收证据（截图、报告、日志链接；勿含秘密）：
未验证与阻塞：
决策 / 风险 / 恢复方式：
下一项任务：
```

## 当前决策与阻塞

- 2026-10-25：P0 工程底座已合并；文章/课程/关于我正文和检索服务属于后续阶段。
- GitHub 远端由用户指定为 `https://github.com/RubyAtUsyd/personal-blog.git`。P0 PR #1 已由 Ruby 合并。Ruby 选择保留仓库名并使用项目 Pages 地址 `https://RubyAtUsyd.github.io/personal-blog/`。
- AWS/Atlas/模型账户和费用授权未确定：不阻塞本地与替身测试，阻塞真实集成及生产发布。
- OIDC/模型/embedding 供应商待相应阶段验证与记录，不能由示例密钥或开发身份冒充生产完成。

## P0 验收日志

2026-10-25 / P0-01 / DONE（本地）：独立初始化 `personal-blog` 仓库，`main` 仅含最初开发文档；从 `feat/P0-engineering-foundation` 开发静态首页。Node 24.19.0、pnpm 11.19.0、Next.js 16.4.3、React 19.3.1 固定在配置/锁文件，具体取舍见 `docs/adr/0001-foundation.md`。干净临时仓库中的 `pnpm install --frozen-lockfile --offline`、`pnpm typecheck`、`pnpm build` 均通过；临时仓库已清理。构建生成 `/` 与 `/_not-found` 静态页面。未上线。

2026-10-25 / P0-02 / DONE（本地）：Husky + lint-staged + commitlint + ESLint/Prettier + 严格 TS 类型检查已接入。`pnpm check` 通过：7 项单元测试、hooks 独立仓库场景（首次提交、自动格式化、错误 lint、错误提交信息、有效提交、部分暂存、含空格路径、删除文件）、秘密扫描、构建、6 项桌面/手机端浏览器测试（包括 320px、404、键盘、自动可访问性）。`pnpm audit:deps` 返回无已知漏洞。自动可访问性测试仅覆盖当前首页，不代表整个未来网站已完全符合 WCAG。ESLint 9 的兼容取舍和复核期限见 ADR。

2026-10-25 / P0-03 / DONE：PR 模板、只读质量 workflow、`quality-gate` 聚合和 Dependabot 配置在开发分支。本地 `quality-gate` 7 项状态判断测试通过。GitHub 草稿 PR #1 的 `checks`、`security`、`quality-gate` 均完成且成功。main 分支保护通过 API 核实：必须经 PR、需要 `quality-gate`、0 位独立审批（单人模式）、评论已解决、管理员也受保护、线性历史、禁止强推/删除。隔离测试 PR #2 故意令 `checks` 失败；其 `quality-gate` 同样失败，GitHub 的 `mergeable_state=blocked`；该 PR 随后已关闭，未合并。正式 PR #1 等待 Ruby 审核，尚未发布。

2026-10-26 / P1-04 部分交付（Pages 发布底座）/ IN_PROGRESS：Ruby 授权首次部署并选择项目 Pages 地址。已建立独立 `Deploy GitHub Pages` workflow、静态子路径构建和部署恢复手册；GitHub Pages API 返回 201，发布源为 Actions，HTTPS 已开启。本地 Node 24.19.0 的 `pnpm check` 通过（7 项单元、hooks 场景、6 项浏览器测试）；`GITHUB_PAGES_BASE_PATH=/personal-blog pnpm build` 通过。以 `/personal-blog/` 挂载的本地浏览器验证首页、样式和脚本加载正常，资源请求无 4xx/5xx。P1-04 的文章深链、sitemap/RSS、图片适配仍待 P1-01 至 P1-03 后完成。本条在远端 CI、发布和线上访问验证后补充最终结果。
