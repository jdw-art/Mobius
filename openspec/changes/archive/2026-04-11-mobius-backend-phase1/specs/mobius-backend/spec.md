# mobius-backend

Mobius 平台后端 CRUD API 服务，提供项目全生命周期管理能力。

## ADDED Requirements

### Requirement: API 服务可启动并响应请求

FastAPI 应用 SHALL 启动于端口 8081，并响应 `/api/v1/` 前缀下的 REST 请求。

#### Scenario: 服务启动成功
- **WHEN** 执行 `uvicorn app.main:app --host 0.0.0.0 --port 8081`
- **THEN** 服务启动成功，无报错
- **AND** `GET /api/v1/projects` 返回 200 OK 或空数组 `[]`

#### Scenario: 服务健康检查
- **WHEN** 请求 `GET /health`
- **THEN** 返回 JSON `{"status": "healthy"}`

### Requirement: 项目列表 API

系统 SHALL 提供项目列表查询接口 `/api/v1/projects`，返回所有项目概要信息。

#### Scenario: 获取项目列表
- **WHEN** GET `/api/v1/projects`
- **THEN** 返回 200 OK
- **AND** 返回 JSON 数组，每个元素包含 `id`, `name`, `type`, `pm`, `progress`, `plannedDelivery`, `status`

### Requirement: 项目详情 API

系统 SHALL 提供项目详情查询接口 `/api/v1/projects/{project_id}`，返回项目的完整信息包括团队、工作流、活动日志。

#### Scenario: 获取项目详情
- **WHEN** GET `/api/v1/projects/PRJ001`
- **THEN** 返回 200 OK
- **AND** 返回包含 `team`, `workflow`, `activities`, `defectCount`, `testCaseCount`, `taskCount` 等嵌套数据的完整项目信息

### Requirement: 项目 CRUD 操作

系统 SHALL 提供项目的创建（POST）、更新（PUT）、删除（DELETE）接口。

#### Scenario: 创建项目
- **WHEN** POST `/api/v1/projects` with valid project payload
- **THEN** 返回 201 Created
- **AND** 返回创建的项目对象（含生成的主键 id）

#### Scenario: 更新项目
- **WHEN** PUT `/api/v1/projects/{project_id}` with valid payload
- **THEN** 返回 200 OK
- **AND** 返回更新后的项目对象

#### Scenario: 删除项目
- **WHEN** DELETE `/api/v1/projects/{project_id}`
- **THEN** 返回 204 No Content
- **AND**该项目从数据库中删除

### Requirement: 嵌套子资源 API

系统 SHALL 提供项目嵌套子资源的查询接口，包括 requirements、applications、defects、documents、reviews、risks、activities、team、workflow、builds、test-plans、acceptance。

#### Scenario: 获取项目需求列表
- **WHEN** GET `/api/v1/projects/{project_id}/requirements`
- **THEN** 返回 200 OK
- **AND** 返回该项目的所有需求记录

#### Scenario: 获取项目评审列表
- **WHEN** GET `/api/v1/projects/{project_id}/reviews`
- **THEN** 返回 200 OK
- **AND** 返回该项目的所有评审记录（含 design/code/test-case/release 四种类型）

#### Scenario: 获取项目缺陷列表
- **WHEN** GET `/api/v1/projects/{project_id}/defects`
- **THEN** 返回 200 OK
- **AND** 返回该项目的所有缺陷记录

### Requirement: JWT 认证拦截

所有 `/api/v1/projects` 下的接口 SHALL 需通过 JWT 认证，无有效 token 的请求返回 401 Unauthorized。

#### Scenario: 无 token 请求被拦截
- **WHEN** GET `/api/v1/projects` without `Authorization` header
- **THEN** 返回 401 Unauthorized
- **AND** 返回 `{"detail": "Not authenticated"}`

#### Scenario: 有效 token 请求通过
- **WHEN** GET `/api/v1/projects` with valid `Authorization: Bearer <token>` header
- **THEN** 返回 200 OK

#### Scenario: 过期 token 被拒绝
- **WHEN** GET `/api/v1/projects` with expired token
- **THEN** 返回 401 Unauthorized
- **AND** 返回 `{"detail": "Token has expired"}`

### Requirement: 分页支持

列表类 API SHALL 支持分页参数 `page` 和 `page_size`。

#### Scenario: 分页查询项目列表
- **WHEN** GET `/api/v1/projects?page=1&page_size=10`
- **THEN** 返回 200 OK
- **AND** 返回最多10条项目记录
- **AND** 返回包含 `total`, `page`, `page_size` 的分页元数据
