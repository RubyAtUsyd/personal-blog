# 工程规则、审核与质量门禁

本文件是持续适用的工程规范。P0 的 hooks、质量检查和分支保护已接入，Pages 也已上线；后续章节中涉及 MongoDB、S3、FastAPI 和管理端的规则仍是待实现约束。当前交付范围与证据分别见 `docs/PRD.md`、`docs/DEVELOPMENT_HISTORY.md`，远程状态仍须在 GitHub 实际检查，不能以文档代替。

## 1. 设计原则

- 单一职责 SRP：组件负责呈现，用例负责业务流程，repository 负责持久化，adapter 负责外部服务。
- 依赖倒置 DIP：业务规则不直接依赖 Mongoose、S3 或模型 SDK；注入小而明确的能力接口。
- 接口隔离 ISP：读文章、写文章、上传图片不合并成巨大通用接口。
- 开闭原则与可替换性：mock/real provider 必须通过同一契约测试；不要改变 mock 行为来隐藏真实约束。
- KISS/YAGNI：仅对真实变化点建立抽象；不为每个 DTO 建工厂，不为简单页面引入全局 store。
- DRY：共享稳定业务语义，不因两段代码外观相似就抽取万能工具。禁止 services 间复制领域规则后分别修改。
- 单向依赖和显式副作用：domain 不 import HTTP/数据库；网络、文件、时钟等放在边界。禁止循环依赖和隐式模块初始化请求。

## 2. 前端规则

- TypeScript strict；禁止无解释 any、@ts-ignore、非空断言和大范围 eslint-disable。例外需最小作用域、原因和跟踪任务。
- ESLint flat config，包含 hooks、可访问性和 import 边界规则；Prettier 只负责格式，避免规则冲突。使用 ESLint CLI，不假设旧 next lint 命令存在。
- 页面组合 features/components，组件不直接连接数据库或云 SDK。仅必要的交互部分使用 client component。
- URL 管理筛选和分页；本地状态优先。未来管理端需要远程状态缓存时再引入 TanStack Query，不默认再加 Redux/Zustand。
- Markdown 禁止不可信 HTML、javascript: URL 和可执行 MDX；外链协议白名单，图片具有 alt 和尺寸。
- 不在 JSX 中堆放检索或格式转换业务逻辑；用户错误与系统诊断分开。
- 大型文件是拆分信号而非机械阈值；组件超过约 250 行时检查职责，确有必要可说明保留。

## 3. 后端与数据规则

- Controller/router 仅处理认证、校验、调用用例和响应映射；不用宽泛 catch 吞异常。
- DTO 入口做运行时校验。输出使用显式映射，禁止直接返回数据库 document、堆栈或内部 metadata。
- 查询由服务器构造，禁止把用户 JSON 原样作为 Mongo filter/operator；选择字段、限制排序字段与最大分页大小。
- 数据库连接池复用，有超时和健康检查；区分存活与依赖就绪，避免依赖故障引发重启风暴。
- 管理 API 的服务端权限校验覆盖每个操作；不依赖隐藏按钮。更新使用 revision/乐观锁避免丢失写入。
- 发布与任务创建使用可恢复一致性策略：优先事务/outbox；本地事务测试需 replica set。若不用事务，必须证明失败恢复与对账机制。
- NestJS/Fastify 不照搬只适用 Express 的中间件/上传库，先核对兼容性。
- FastAPI async handler 内不直接运行阻塞网络或 CPU 密集任务；使用异步 SDK、受限线程执行或后台任务系统。
- Python 代码标注类型，Pydantic 验证边界，Ruff/mypy 检查应用代码；CPU/网络任务有并发上限、取消、timeout 和有界退避。

## 4. 契约与依赖管理

- 内容 API 的公共 Zod DTO/schema 是内容契约来源，Nest 入口与输出遵循它；OpenAPI 从同一契约生成或建立自动一致性检查。
- AI API 的 Pydantic 模型是 AI 契约来源，导出 OpenAPI，再生成 TS 客户端。不维护两份手写 Python/TS 类型作为“共享契约”。
- CI 重新生成 schema/client 后检查 git diff，发现漂移失败；生成文件是否提交在 P0/P2 ADR 固定，默认提交可审查的 schema 和客户端。
- 新依赖说明用途、现有方案为何不够、运行时/许可证兼容性。优先稳定维护的软件，自动依赖更新按 PR 审核。
- pnpm-lock.yaml、uv.lock 必须提交。CI frozen/locked 安装；工具版本进入配置与文档。

## 5. Git 工作流与审核

流程：任务 → 短期分支 → 小步提交 → draft PR → 自动检查 → diff 审核 → 修复 → Ruby 决定合并 → 受控发布。

- 分支：feat/P1-02-article-reader、fix/P3-04-citation-validation 等；main 始终保持可发布。
- Conventional Commits：feat(web): add course navigation；fix(ai): reject stale citations。
- 每个 PR 一个目标；建议业务 diff 约 200–500 行，生成文件和初次脚手架可超出但注明原因。不要为行数上限拆出不可运行的碎片。
- 精确暂存本任务文件，提交前检查 staged diff；避免 git add . 意外带入其他工作。
- 禁止提交密钥、.env、真实私有笔记、客户资料、node_modules、虚拟环境、构建产物与大图片原件。
- 不自动合并，不启用无人审核自动合并，不修改远程权限来绕过检查。修复失败必须保留证据。

### 5.1 Bootstrap

全新空仓库先创建最小文档初始提交以建立 main，再在工程分支完成 P0。若没有远程仓库，先完成本地可审查提交与流程配置；创建远程和首次推送按用户授权执行。不要初始化父目录或把现有项目纳入博客仓库。

### 5.2 GitHub 分支保护

建议使用 ruleset 或 branch protection 保护 main：

- 必须通过 PR；禁止 force push 和删除 main。
- required status check 使用唯一且稳定的 `quality-gate`；必须测试该任务实际执行且失败能阻止合并。
- 要求对话解决、分支更新或等价的合并前验证；采用 squash merge 保持主线清楚。
- workflow 权限最小化；可行时保护规则也适用于管理员。
- 多人模式：至少 1 位有权限的独立维护者批准，新提交使旧批准失效；CODEOWNERS 指向真实维护者。
- 单人模式：PR 作者不能批准自己的 PR，不配置无法满足的 required approval 数量。Ruby 在 PR 留审核结论并手动合并，CI 仍强制。此时人工流程不能冒充平台强制独立审批；若需要强制独立审批，必须添加第二位维护者或明确授权的审核身份。
- 根据仓库可见性和 GitHub 方案核实保护功能可用性。不支持时明确写入限制，不宣称已强制执行。

Codex 自审与 AI review 是辅助证据，不替代人类批准。若同一 GitHub 账号创建 PR，也不能伪造第二个审批身份。

### 5.3 PR 模板

```markdown
## Problem and result

说明具体问题、用户可见行为、关联任务。

## Verification

- 实际运行的命令与结果
- UI 改动：截图/录屏与关键交互说明
- 尚未验证的真实集成及原因

## Risks and recovery

契约/数据/权限/部署变更、向后兼容、恢复方法。

## Review checklist

- [ ] 满足任务验收，无无关修改
- [ ] 检查通过；草稿/权限/错误路径已验证
- [ ] 配置、文档和任务日志同步
```

## 6. pre-commit hooks

只使用 Husky 管理 Git hooks；不同时安装 Python pre-commit 的 Git hook，以免覆盖同一个入口。Python 工具由 lint-staged 调用 uv 执行。

P0 实现根 package scripts：

| 命令契约             | 行为                                         |
| -------------------- | -------------------------------------------- |
| pnpm format:check    | 所有适用文件 Prettier 检查                   |
| pnpm lint            | TS/JS ESLint，--max-warnings=0               |
| pnpm typecheck       | 所有 TS 包项目级类型检查                     |
| pnpm test            | 确定性单元/契约测试，非 watch                |
| pnpm test:e2e        | 构建后的关键路径 Playwright                  |
| pnpm build           | 构建当前已实现应用                           |
| pnpm check           | 按顺序聚合当前阶段必须通过的本地检查         |
| pnpm contracts:check | schema/client 再生成与漂移检测，接口阶段引入 |

Python 阶段增加 uv run ruff check、uv run ruff format --check、uv run mypy、uv run pytest。脚本在 services/ai-api 的项目上下文中运行，不假设调用者 cwd；没有 Python 服务前不创建假成功的 Python 检查。

hooks 行为：

- pre-commit：lint-staged 对 staged TS/JS 依次 ESLint --fix --max-warnings=0、Prettier --write；JSON/YAML/Markdown/CSS 交给 Prettier；Python 文件依次 Ruff check --fix、Ruff format。
- commit-msg：commitlint 检查 Conventional Commit。
- pre-push：类型检查和快速确定性测试；完整 E2E、真实模型调用不放在每次提交中。
- 不在 hooks 自动执行 git add .；采用 lint-staged 自身对修改的管理，保留 partially staged 文件未暂存部分。避免重叠 glob 同时修改同一个文件。
- 不把 lint-staged 注入的文件名直接传给 tsc；类型检查必须基于 tsconfig 的完整项目。
- 脚本支持含空格文件名、删除文件和初次提交；使用参数数组/安全包装脚本，不通过不安全 shell 拼接执行文件路径。
- JS-only 提交不应要求 AI 密钥或在线数据库；涉及 Python 的提交必须有对应工具，缺少工具时清晰失败。
- hooks 只能改善本地反馈，可被外部绕过，因此不能“保证所有提交代码正确”；远程 CI 才是合并门禁。

P0 必须验证：故意的 lint 错误阻止提交、可修复格式被修复、错误提交信息被拒绝、合法提交成功、部分暂存和含空格文件名不丢改动。仅在临时测试仓库进行破坏性用例，不污染用户历史。

## 7. CI 与测试

PR/main 运行非特权质量 workflow：锁定安装 → 格式/lint → 类型 → 单元/契约 → 构建 → 集成/E2E → quality-gate。

- required workflow 不用顶层 path filter 导致检查永远 pending；按阶段调整 job，在每个 PR 总是运行 quality-gate。
- quality-gate 使用 always() 汇总所有应运行 job，任何失败/取消必须失败；仅允许明确不适用的 job 跳过。不能无条件 exit 0。
- P0 有实际 smoke/规则测试；尚未实现的测试套件明确未适用，不能用 passWithNoTests 假装覆盖业务。
- 内容 API 集成测试使用真实临时 MongoDB 验证索引、权限、分页与发布一致性；有事务时用 replica set。
- Web E2E 对静态构建产物启动文件服务器，测试直达/刷新文章、404、系列导航、搜索、主题、移动端和键盘流程。
- AI 默认 CI 使用确定性 embedding/LLM 替身测试适配器与业务逻辑；Atlas 真检索和真实模型评估放在受控 workflow，运行前有费用上限。
- 关键发布、权限、删除/撤回和引用校验分支必须有测试；不设整个仓库 100% 覆盖率，不靠快照替代行为断言。
- mock、API 和静态构建共享内容契约测试；覆盖日期、slug、中文锚点与草稿过滤。
- CI 不修改并推送源码；格式不符合时失败并提供修复命令。
- 密钥扫描与依赖漏洞检查纳入门禁。新引入且可利用的 high/critical 漏洞阻断；误报/无法升级例外须记录原因、补偿和到期时间，不能静默忽略。
- 未信任 PR 不可获得云/模型 secrets；禁止用 pull_request_target 检出并执行 PR 代码。
- Actions 固定可信 commit SHA，保留版本注释并自动提 PR 更新；依赖缓存不存凭证。

## 8. 部署、安全和恢复

- 本地、测试、生产配置分开；.env.example 只放变量名、说明和安全示例。
- Pages artifact 部署仅从受保护 main/批准发布触发；独立部署 workflow/job，最小 pages/id-token 权限。
- AWS CI 使用 OIDC 与限定 repo/ref/environment 的角色；避免长期 AWS key。第三方密钥通过 secret manager/部署 secrets 注入。
- 容器使用精简基础镜像、非 root、健康检查和不可变标签；不把凭证写入镜像层。
- Atlas 网络访问不能默认永久开放全网；决定服务部署方式时验证固定出口、私有连接或适当 allowlist，记录费用取舍。
- 管理员认证优先 OIDC Authorization Code + PKCE，服务端校验 issuer/audience/expiry 和管理员身份。若用 cookie，必须设计 SameSite/CSRF 与跨站限制；若用 bearer token，避免长期存 localStorage，且不得混用两个不完整方案。
- 公共读接口与内部索引接口分离；最小 MongoDB 权限。CORS 只允许实际前端 origin，不能视为安全边界。
- 上传、问答和管理端分别限流。公共 AI 接口设置预算、并发限制、超时与必要的滥用防护。
- 部署日志记录版本和 requestId；错误监控不得上传密钥、完整私人内容或默认采集完整问答。
- IaC 在云阶段引入，先生成 plan 和费用估计再创建资源；不为博客预先部署 Kubernetes。
- 每次生产变更说明恢复方式：应用回退上一镜像/静态 artifact；数据迁移考虑向后兼容，恢复备份需人工确认，不能把代码回退当成数据库回退。
- 备份计划包含恢复演练；AI 索引应能从 canonical 内容重建。模型版本或索引切换保留上一版本并记录兼容性。

## 9. 官方参考

以下是规范制定参考，实施时核实与选定版本一致：

- [Codex 工作流与仓库指令](https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex)
- [Husky 安装及可绕过性](https://typicode.github.io/husky/get-started.html)
- [lint-staged 的配置与暂存行为](https://github.com/lint-staged/lint-staged)
- [GitHub 分支保护](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Next.js 静态导出](https://nextjs.org/docs/app/guides/static-exports)
- [S3 预签名上传](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
- [CloudFront OAC](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
