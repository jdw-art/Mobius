## Context

Mobius 是一个 DevOps 一体化平台，前端使用 React + TypeScript + Ant Design 构建，已实现13个功能模块的完整 UI。当前前端所有数据均为 Mock 硬编码，无法持久化、无协作能力、无 AI 能力支撑。

**技术约束（已确认）**：
- Python 3.11+ / FastAPI / SQLAlchemy
- MySQL `mobius` 库（root/jdw112233 @ localhost:3306），Alembic 管理迁移
- Qdrant 向量库（localhost:6333，Phase 2 使用）
- JWT 认证，Header `Authorization: Bearer <token>`
- API 前缀 `/api/v1`，端口 8081
- Phase 2 才引入 LlamaIndex，Phase 1 不做 RAG

**Phase 1 目标**：最小可用后端，覆盖前端全部 Mock 数据，实现 CRUD 能力。

## Goals / Non-Goals

**Goals:**
- 搭建 FastAPI 后端服务，端口 8081，前端可通过 HTTP 调用
- 完成 MySQL 数据库设计与初始化（13张表 + Alembic 迁移）
- 实现13个业务模块的 RESTful API（嵌套资源结构）
- JWT 认证中间件，校验登录态，不做细粒度 RBAC
- 预留 `rag/` 目录和表结构，为 Phase 2 RAG 做好准备

**Non-Goals:**
- 不实现 LlamaIndex / RAG / Agent 能力（Phase 2）
- 不实现细粒度权限控制（RBAC 后期再执行）
- 不修改前端代码（前端联调在 Phase 1.5 或单独 change）
- 不实现 WebSocket / SSE 等实时能力

## Decisions

### Decision 1: 项目结构 — FastAPI 标准布局

**选择**：按功能分层（models/schemas/crud/api），而非按资源类型平铺。

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app 入口
│   ├── config.py             # pydantic-settings 环境变量
│   ├── database.py           # SQLAlchemy engine/session
│   ├── dependencies.py       # JWT 校验依赖
│   ├── models/               # SQLAlchemy ORM models
│   ├── schemas/              # Pydantic request/response models
│   ├── crud/                 # 数据库 CRUD 操作
│   ├── api/v1/               # REST API 路由
│   └── rag/                  # Phase 2 预留
├── alembic/
│   ├── env.py
│   └── versions/
├── tests/
├── requirements.txt
├── .env
└── alembic.ini
```

**理由**：这种结构是 FastAPI 社区事实标准，团队成员容易理解，也便于后续添加新模块。

### Decision 2: ORM 框架 — SQLAlchemy 2.0

**选择**：SQLAlchemy 2.0 + asyncpg（异步驱动）。

**理由**：
- FastAPI 原生支持 async，SQLAlchemy 2.0 的 async session 是最佳拍档
- asyncpg 比同步 pymysql 性能好很多
- 与 LlamaIndex 的 async 向量查询兼容（Phase 2）

### Decision 3: JWT 实现 — python-jose + pwdlib

**选择**：HS256 对称签名，token 中存放 user_id 和 exp。

```python
# token payload 结构
{
  "sub": "user_id",
  "exp": datetime.utcnow() + timedelta(hours=24)
}
```

**理由**：
- 无状态 JWT 无需 Redis 存储，最轻量
- HS256 比 RSA（RS256）简单，Phase 1 够用
- pwdlib 用于密码哈希（argon2 或 bcrypt）

### Decision 4: API 路由结构 — 嵌套资源（方案 A）

**选择**：所有子资源嵌套在 `projects/{project_id}/` 下。

```
/api/v1/projects
/api/v1/projects/{project_id}
/api/v1/projects/{project_id}/requirements
/api/v1/projects/{project_id}/applications
/api/v1/projects/{project_id}/defects
/api/v1/projects/{project_id}/documents
/api/v1/projects/{project_id}/reviews
/api/v1/projects/{project_id}/reviews/design
/api/v1/projects/{project_id}/reviews/code
/api/v1/projects/{project_id}/reviews/test-case
/api/v1/projects/{project_id}/reviews/release
/api/v1/projects/{project_id}/risks
/api/v1/projects/{project_id}/activities
/api/v1/projects/{project_id}/team
/api/v1/projects/{project_id}/workflow
/api/v1/projects/{project_id}/builds
/api/v1/projects/{project_id}/test-plans
/api/v1/projects/{project_id}/acceptance
```

**理由**：前端 services 层已按此结构设计，API 与前端一一对应降低联调成本。

### Decision 5: 数据库迁移 — Alembic

**选择**：Alembic 管理 schema 变更，不使用 `ensure_future` 自动建表。

**理由**：
- Alembic 是 SQLAlchemy 官方推荐的迁移工具
- 可版本化管理迁移历史，支持回滚
- 团队协作时migration 文件可 review

### Decision 6: 密码存储 — argon2

**选择**：argon2-cffi 库。

**理由**：argon2 是当前最佳实践（不如 bcrypt 有历史包袱），OWASP 推荐。

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| 前端 services 改造工作量大 | Phase 1 只做后端，前端联调在单独的 change 中处理 |
| 13张表一次性设计可能遗漏字段 | 先建最小可行 schema，增删字段用 Alembic migration |
| JWT token 无登出机制（无法主动失效） | Phase 1 可接受；如需主动失效后期引入 Redis 黑名单 |
| 异步 SQLAlchemy 学习成本 | 参考官方 SQLAlchemy 2.0 async tutorial |
| LlamaIndex Phase 2 接入可能需调整表结构 | rag/ 预留独立模块，文档表结构不绑定 RAG |

## Migration Plan

**Phase 1 实施步骤**：
1. 创建 `backend/` 目录结构，安装依赖
2. 配置 `.env` 数据库连接和 JWT 密钥
3. 设计并创建13张表的 SQLAlchemy Model
4. 运行 Alembic autogenerate 生成初始迁移脚本
5. 实现 JWT 认证（login/logout 接口）
6. 实现13个模块的 CRUD API
7. 启动服务验证 API 可用
8. 清理 `backend/requirements.txt`（移除 Banana Blog 残留依赖）

**回滚策略**：Alembic 支持 `alembic downgrade -1`，每次 migration 都有对应回滚脚本。

## Open Questions

1. **前端联调时机**：Phase 1 完成后立即联调前端，还是在单独的 change 中处理？
2. **用户注册**：Phase 1 是否需要用户注册接口？还是只有管理员预置账号？
3. **测试数据**：是否需要实现初始化测试数据的 seed/fixture 脚本？
4. **CORS 配置**：前端（端口 3000）和后端（8081）跨域问题，CORS 允许来源？
