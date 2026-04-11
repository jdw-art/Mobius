## Why

Mobius 前端已具备完整的 DevOps 管理界面（项目、需求、缺陷、评审、构建、文档等13个功能模块），但所有数据均为 Mock。前端迫切需要一个真实的后端服务来支撑业务运转，实现数据的持久化存储和 API 交互能力。同时，项目规划的 Agent（RAG 知识问答、代码评审、运维诊断）需要后端基础设施就绪后才能构建。

**当前痛点**：前端 Mock 数据无法持久化，多人无法协作，无法对接真实的 CI/CD 和监控工具。

## What Changes

1. **搭建 FastAPI + SQLAlchemy 后端服务**，端口 8081
2. **MySQL 数据库初始化**，库名 `mobius`，使用 Alembic 管理数据库迁移
3. **13个业务模块的 REST API 实现**，覆盖前端所有 Mock 数据场景：
   - 项目管理（Projects）
   - 需求管理（Requirements）
   - 应用管理（Applications）
   - 构建管理（Builds）
   - 缺陷管理（Defects）
   - 文档管理（Documents）
   - 评审管理（Reviews - 设计/代码/用例/发布）
   - 测试管理（Test Cases）
   - 产品验收（Acceptance）
   - 风险管理（Risks）
   - 团队管理（Team Members）
   - 工作流管理（Workflow Steps）
   - 活动日志（Activities）
4. **JWT 用户认证**，Header `Authorization: Bearer <token>` 方式传递，仅校验登录态
5. **API 前缀统一使用 `/api/v1`**
6. **预留 `rag/` 目录**，为 Phase 2 LlamaIndex + Qdrant RAG 做准备

## Capabilities

### New Capabilities
- `mobius-backend`: Mobius 平台后端 CRUD API 服务，提供项目全生命周期管理能力
- `mobius-auth`: 基于 JWT 的用户认证能力，仅校验登录态，不含细粒度权限控制
- `mobius-database`: MySQL 数据库结构设计与迁移管理

### Modified Capabilities
- 无（Phase 1 为全新建设阶段）

## Impact

**新增代码**：
- `backend/app/` — FastAPI 应用主体
- `backend/app/models/` — SQLAlchemy ORM 模型
- `backend/app/schemas/` — Pydantic 请求/响应模型
- `backend/app/crud/` — 数据库 CRUD 操作
- `backend/app/api/v1/` — REST API 路由
- `backend/alembic/` — 数据库迁移脚本
- `backend/tests/` — 单元测试

**配置文件**：
- `backend/requirements.txt` — 重写为 Phase 1 所需依赖
- `backend/.env` — 数据库连接、JWT 密钥等配置

**数据库**：
- MySQL `mobius` 库 — 13张核心业务表
- Qdrant 向量库（Phase 2 使用，端口 6333 已就绪）

**API 变更**：
- 新增 `/api/v1/*` 一系列 REST 接口
- JWT 认证中间件拦截所有需认证的请求

**前端影响**：
- 前端 `services/` 文件需改造，从 Mock 返回改为调用后端 API
- 前端需添加 `BASE_URL` 环境变量配置
