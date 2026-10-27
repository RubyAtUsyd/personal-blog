# 产品详细规范与架构约束

本文件保留数据模型、API、内容安全和检索问答的详细验收约束。便于快速交接的产品目标、阶段范围和**当前真实状态**请先读 [PRD.md](PRD.md)；实施任务和实际完成证据见 [PLAN.md](PLAN.md)。以下条目是目标设计，除非在开发记录中有验收证据，否则不能视为已实现。

## 1. 目标与范围

为 Ruby 建立可长期维护的个人知识网站，同时形成 Full-stack / Applied AI 求职作品。访客能阅读技术分析、学习课程系列、了解作者，并基于已发布文章获得有引用的回答。

内容仅包含：技术博客、课程笔记、关于我。搜索与问答是这些内容的能力入口，不增加留言、支付、多租户、公开用户注册、社交动态或项目作品集。第一版采用 mock；后续真实数据来自 MongoDB，图片来自 S3。

默认英文导航，支持中文和英文文章；每篇设置语言，不要求每篇双语翻译。界面主题为清晰、安静的技术阅读体验，优先排版、可访问性和代码可读性。

## 2. 用户体验与验收

### 2.1 技术博客

- `/blog/`：标题、摘要、标签、日期、分页/筛选，筛选状态可通过 URL 分享。
- `/blog/[slug]/`：正文、目录、代码高亮/复制、封面与 alt、更新时间、返回列表。
- 支持长标题、长代码、无封面、空结果、失效 slug、图片加载失败。
- 单篇文章有独立 HTML、title、description、canonical、正确语言；草稿不出现在构建、搜索、sitemap 或 API 中。

### 2.2 课程笔记

- `/notes/` 列出系列；`/notes/[seriesSlug]/` 展示介绍和有序章节。
- `/notes/[seriesSlug]/[chapterSlug]/` 展示章节内容、系列目录、前后篇。
- 导航仅遍历已发布章节；第一篇不显示上一篇，最后一篇不显示下一篇。
- 删除、撤回或重排章节后不出现断链、循环或草稿泄漏。

### 2.3 关于我

- `/about/`：公开简介、技术方向、经历与社交链接。
- 联系方式仅用用户明确选择公开的信息；不得自动发布简历中的电话等资料。

### 2.4 关键词搜索

- 初始阶段为构建生成的本地搜索索引，支持中英文与精确技术词，例如 JWT、EF Core、C++。
- 返回标题、匹配摘要、类型与链接；提供清除、空结果和键盘操作。
- 与后续语义问答区分：搜索返回内容，问答综合来源。索引方案用中英文测试确定，不因工具热门直接采用。

### 2.5 文章检索问答

- `/ask/`：单轮输入、可选内容类型/系列过滤、回答、来源卡片、重试和取消。
- 只依据已发布文章；无足够证据时返回明确的 insufficient_evidence 状态。
- 来源包含文章标题、稳定 URL、标题锚点和简短摘录；服务器验证引用来自本次检索结果。
- 初期不用多轮记忆、自治 Agent、联网搜索或任意工具执行。
- 模型错误、超时、限流时不伪造答案；返回可理解的信息，允许用户回到关键词搜索。
- 前端 mock 演示必须标注样例答案；发布真实问答前去掉 mock 路径并通过集成验收。

### 2.6 通用体验

- 手机/桌面布局；320 CSS px 宽度下正文无意外横向滚动，代码块允许内部滚动。
- 深浅色模式、可见焦点、语义 HTML、键盘可操作、颜色对比、减少动画偏好。
- 主要路径进行自动可访问性检查与人工键盘检查，目标 WCAG 2.2 AA；不能仅凭工具报告宣称全面合规。
- 发布构建目标：本地受控环境下关键静态页面 Lighthouse 性能不低于 90，记录设备/网络设定；单次分数不等同真实用户性能。

## 3. 技术与部署决策

| 层         | 决策                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------ |
| Web        | Next.js 16 系列稳定补丁、兼容 React、TypeScript strict                                           |
| UI         | Tailwind CSS 4、shadcn/ui，统一设计 token                                                        |
| 正文       | Markdown、remark/rehype、Shiki；禁用任意 HTML/JS 执行                                            |
| 内容 API   | NestJS + Fastify，Mongoose，OpenAPI                                                              |
| AI API     | Python + FastAPI + Pydantic，官方模型 SDK，模型供应商 adapter                                    |
| 内容数据库 | MongoDB Atlas；本地开发允许容器 MongoDB                                                          |
| 检索       | 优先验证 Atlas Vector Search，并比较词法与混合检索；不可假设普通 MongoDB 容器具备 Atlas 搜索能力 |
| 媒体       | AWS S3 + CloudFront OAC；SDK v3；图片处理用有资源限制的任务                                      |
| 包管理     | pnpm workspace、uv；提交各自 lockfile                                                            |
| 检查       | ESLint、Prettier、Ruff、mypy、Vitest、pytest、Playwright                                         |
| 部署       | Web 静态导出至 GitHub Pages；API 使用容器部署，AWS 计算服务待预算/网络验证                       |

P0 核对兼容性与安全补丁，记录 Node LTS、Python 和依赖版本。不要写“latest”作为可复现版本，不为追版本使用 beta/canary。新增服务在对应阶段才搭建，不一次安装所有未来依赖。

GitHub Pages 没有请求时 SSR、ISR、Server Actions 或运行中的 Next API。动态 slug 在构建时枚举；深链刷新必须测试。静态图片使用明确尺寸及预处理变体或适配的 loader，不能依赖 Pages 上不存在的默认图片优化服务。

内容更新通过可信服务触发 GitHub Actions 构建；不要给浏览器 GitHub 凭证。站点更新有构建延迟。失败时保留上一版本。删除涉及隐私内容时必须同时重建静态站点并处理缓存，单纯删数据库不等于删除已公开页面。

## 4. 仓库与依赖方向

```text
apps/web/                  # 静态前台；未来管理端可另设部署
apps/content-api/          # 内容、权限、媒体、发布
services/ai-api/           # ingestion / retrieval / answer / evaluation
packages/contracts/       # 内容 DTO/Zod、导出的 API schema
packages/api-client/      # 由 OpenAPI 生成的 TS 客户端
packages/ui/              # 仅在真实共享需求出现时建立
fixtures/content/         # 可公开的 mock 文章与样例图片
evals/                    # 问题、证据标注、离线与在线评估
infra/                    # 部署与 IaC，云阶段才实现
docs/adr/                 # 关键技术决策
docs/runbooks/            # 故障、恢复、备份与发布说明
```

HTTP/UI adapter → application use case → domain/contracts；database/cloud/model adapters 实现端口，通过组合根注入。相同服务中不为每个简单函数强制增加 interface。

Web 的 ContentRepository 提供 listPublishedArticles、getPublishedArticle、listSeries、getSeries、getProfile。Mock 和 API provider 共享校验与契约测试。真实模式失败必须报错，不能自动退回 mock 以掩盖故障。

NestJS 是内容唯一写入方。FastAPI 从经过认证的内部内容端点读取文章；只能写检索/索引状态集合。TypeScript 不直接 import Python，也不把 Mongoose document 当公共 DTO。

## 5. 数据设计

- Article：id、slug、kind(blog/note)、title、excerpt、bodyMarkdown、language、tags、coverAssetId、status(draft/published/archived)、publishedAt、updatedAt、revision、schemaVersion。
- Series：id、slug、title、description、orderedArticleIds；章节引用必须存在、为 note 且没有重复。
- Profile：公开简介和链接，独立于管理员身份数据。
- MediaAsset：id、objectKey、variants、mimeType、bytes、width、height、alt、status(pending/validated/published/rejected)、createdAt。
- IndexRecord/Chunk：articleId、articleRevision、chunkId、headingPath、anchor、textHash、text、embeddingModel、embeddingDimensions、indexVersion、publicationGeneration。
- PublicationJob：事件 ID、articleId、revision、类型、状态、尝试次数和最后错误；必须可重试、可追踪。

公开 DTO 的 ID 为字符串、日期为 UTC ISO 8601，不泄露内部认证字段。唯一 slug、发布列表复合索引按实际查询设计；分页有上限。MongoDB schema 演化通过可重复的数据迁移脚本，先备份并说明回退兼容性。

Mock 至少含 8 篇完整样例：4 篇博客、两个系列各两章，另含不公开的草稿、重名标题不同 slug、长代码、中英文混合和缺图案例。所有样例可合法公开；seed 幂等，不覆盖用户编辑后的正文。

## 6. API 契约

内容公开接口：GET /v1/articles、/v1/articles/{slug}、/v1/series、/v1/series/{slug}、/v1/profile。
管理接口：文章 CRUD、publish/unpublish、系列排序、media/upload-intents、media/complete。精确定义用 OpenAPI 固化，包含状态码和分页。
内部接口：带服务认证的 published-content snapshot/manifest；支持 revision/ETag 或等价版本机制。

问答 POST /v1/answers 请求：question、language(可选)、filters(kind/seriesId)。默认问题长度上限 2000 字符、上下文块数和 token 上限由配置控制。
响应：requestId、status(answered/insufficient_evidence)、answer、citations[{articleId,revision,title,url,anchor,excerpt}]。技术诊断仅写日志，不向用户暴露内部 prompt 或密钥。
错误响应统一：code、message、requestId、details(仅安全校验信息)。分别处理 400/401/403/404/409/413/429/5xx；设置请求超时与有界重试。

未来管理端默认只允许 Ruby，采用托管 OIDC 登录与后端 token 校验；供应商在 P2 决定。开发身份替身仅允许 development/test，生产启动必须拒绝启用。浏览器不持有 client secret；CORS 不是认证。

## 7. 检索问答的正确性

1. 正文按标题及 token 预算分块，保留代码语义与标题锚点；清洗导航和重复模板。
2. 固定模型/维度、chunker 版本和内容 hash；更新 embedding 模型时建立新索引并回填，验证后切换，不混用维度。
3. 发布事件持久化，可重试且幂等；先写新 revision，再切换 active revision，最后清理旧块。开发期可用手动命令，生产必须有可靠任务状态与恢复方案。
4. 检索严格过滤已发布版本；在送模型之前与返回之前重新验证来源的有效发布状态。撤回后旧块不得再用于新回答；验证失败时 fail closed。
5. 选定中英文 embedding 后建立基线；比较关键词、向量与混合检索，reranker 仅在评估证明改进后加入。
6. 检索文本是非可信数据。不能执行其中指令、任意 URL 抓取、代码或工具；防止文章中的 prompt injection 改变系统规则。
7. 模型输出采用结构化 schema；只接受给定 chunk ID。应用构造来源 URL，过滤幻造引用；仅验证 ID 存在不代表回答有依据，还要评估支持程度。
8. 引用锚点由网站与索引使用同一规则，测试中文标题和重复标题。来源不包含未公开原文。
9. 不持久化读者完整问题作为默认日志；日志只含 requestId、耗时、模型、token 数、错误码和必要的匿名指标。
10. 公共端点有持久化/共享限流与全局预算，不依赖单实例内存计数。模型密钥仅在服务端。

验收数据：至少 40 题，含可回答中文/英文、精确技术词、跨段落、无答案、提示注入、撤回和更新案例；分开调参集与保留测试集。
初始发布门槛：可回答测试题 Hit@5 ≥ 85%；引用指向有效已发布来源 100%；人工抽样逐条主张证据支持率 ≥ 90%；无依据题正确拒答率 ≥ 90%；草稿/撤回内容泄漏 0。记录分母、模型、索引版本和失败样例，禁止宣称这些指标已经达到。
评估记录 p50/p95 延迟、tokens 与每次费用；P3 在选定供应商后确定上线预算和延迟 SLO。离线测试使用确定性模型替身；真实 Atlas/模型评估是独立门禁，mock 不能替代。

## 8. 图片工作流

管理员请求 upload intent → 服务端分配不可预测的 object key → 短时 S3 上传授权 → 上传完成确认 → 检查实际大小/文件签名/解码限制 → 生成变体 → 发布引用。

初期只允许 JPEG/PNG/WebP，最大 10 MiB 和受限像素数；拒绝 SVG 和任意可执行文件。上传授权不能信任客户端 MIME；限制对象范围和大小，处理孤立上传过期清理。私有桶 + CloudFront OAC，公开分发只访问 published 前缀，草稿另用受控路径。CloudFront 不会自动转换图片。

## 9. 非目标与后续决策

暂不引入 Kubernetes、Kafka、Redis、GraphQL、多 Agent、微调或训练模型。只有已观察到的需求才通过 ADR 引入。
已确定 GitHub 仓库 `RubyAtUsyd/personal-blog` 与 Pages 项目站点地址。仍待决定：云预算/region、管理员 OIDC、模型与 embedding 供应商、Atlas Search 配额、云网络访问方案。P1 本地 mock 工作不依赖它们；相关阶段必须明确决定后才创建付费资源。
