# mobius-database

MySQL 数据库结构设计与迁移管理，覆盖 Mobius DevOps 平台13个核心业务模块。

## ADDED Requirements

### Requirement: 数据库连接配置

系统 SHALL 通过环境变量配置 MySQL 连接参数：host、port、username、password、database。

#### Scenario: 环境变量加载
- **WHEN** FastAPI 应用启动
- **THEN** 从环境变量或 `.env` 文件加载 `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`
- **AND** 使用这些参数建立 SQLAlchemy async engine 连接

### Requirement: Projects 表

系统 SHALL 维护 `projects` 表，存储项目的核心信息。

#### Scenario: Projects 表结构
- **WHEN** Alembic migration 执行完毕
- **THEN** `projects` 表存在且包含字段：`id` (PK, VARCHAR), `name` (VARCHAR), `type` (ENUM), `status` (ENUM), `pm` (VARCHAR), `progress` (VARCHAR), `create_time` (DATETIME), `planned_design_time` (DATE), `planned_test_submit_time` (DATE), `planned_test_complete_time` (DATE), `planned_release_time` (DATE), `planned_delivery` (DATE), `planned_duration` (VARCHAR), `budget` (VARCHAR), `change_type` (VARCHAR), `related_product` (VARCHAR), `app_count` (INT), `project_duration` (INT)

### Requirement: Requirements 表

系统 SHALL 维护 `requirements` 表，通过 `project_id` 外键关联 projects。

#### Scenario: Requirements 表结构
- **WHEN** Alembic migration 执行完毕
- **THEN** `requirements` 表存在且包含字段：`id` (PK), `project_id` (FK → projects.id), `name` (VARCHAR), `version` (VARCHAR), `application` (VARCHAR), `module` (VARCHAR), `level` (ENUM), `creator` (VARCHAR), `create_time` (DATETIME)

### Requirement: Applications 表

系统 SHALL 维护 `applications` 表，存储应用信息。

#### Scenario: Applications 表结构
- **WHEN** Alembic migration 执行完毕
- **THEN** `applications` 表存在且包含字段：`id` (PK), `project_id` (FK → projects.id), `name` (VARCHAR), `branch` (VARCHAR), `version` (VARCHAR), `test_status` (ENUM), `deploy_method` (ENUM), `unit_test` (ENUM), `code_scan` (ENUM), `code_review` (ENUM), `status` (VARCHAR)

### Requirement: Defects 表

系统 SHALL 维护 `defects` 表，存储缺陷信息。

#### Scenario: Defects 表结构
- **WHEN** Alembic migration 执行完毕
- **THEN** `defects` 表存在且包含字段：`id` (PK), `project_id` (FK → projects.id), `application_id` (FK → applications.id, nullable), `name` (VARCHAR), `environment` (ENUM), `developer` (VARCHAR), `tester` (VARCHAR), `status` (ENUM), `creator` (VARCHAR), `create_time` (DATETIME)

### Requirement: Documents 表

系统 SHALL 维护 `documents` 表，存储项目文档。

#### Scenario: Documents 表结构
- **WHEN** Alembic migration 执行完毕
- **THEN** `documents` 表存在且包含字段：`id` (PK), `project_id` (FK → projects.id), `type` (ENUM: 需求文档/详细设计/测试报告), `name` (VARCHAR), `link` (VARCHAR), `creator` (VARCHAR), `create_time` (DATETIME)

### Requirement: Reviews 表

系统 SHALL 维护 `reviews` 表（含子类型：design/code/test-case/release），存储评审信息。

#### Scenario: Reviews 表结构
- **WHEN** Alembic migration 执行完毕
- **THEN** `reviews` 表存在且包含字段：`id` (PK), `project_id` (FK → projects.id), `type` (ENUM: design/code/test-case/release), `requirement_id` (FK → requirements.id, nullable), `title` (VARCHAR), `creator` (VARCHAR), `create_time` (DATETIME), `planned_complete_time` (DATE), `code_branch` (VARCHAR, nullable), `pre_release_time` (DATETIME, nullable), `prod_release_time` (DATETIME, nullable)

### Requirement: Review_Processes 表

系统 SHALL 维护 `review_processes` 表，存储评审流程节点。

#### Scenario: Review_Processes 表结构
- **WHEN** Alembic migration 执行完毕
- **THEN** `review_processes` 表存在且包含字段：`id` (PK), `review_id` (FK → reviews.id), `title` (VARCHAR), `description` (TEXT), `status` (ENUM: pending/approved/rejected), `reviewers` (JSON array), `review_time` (DATETIME), `comment` (TEXT, nullable), `comment_editable` (BOOLEAN)

### Requirement: Test_Cases 表

系统 SHALL 维护 `test_cases` 表，存储测试用例。

#### Scenario: Test_Cases 表结构
- **WHEN** Alembic migration 执行完毕
- **THEN** `test_cases` 表存在且包含字段：`id` (PK), `project_id` (FK → projects.id), `application_id` (FK → applications.id, nullable), `name` (VARCHAR), `creator` (VARCHAR), `create_time` (DATETIME), `status` (ENUM: 未开始/通过/失败)

### Requirement: Risks 表

系统 SHALL 维护 `risks` 表，存储风险信息。

#### Scenario: Risks 表结构
- **WHEN** Alembic migration 执行完毕
- **THEN** `risks` 表存在且包含字段：`id` (PK), `project_id` (FK → projects.id), `risk_type` (VARCHAR), `risk_item` (VARCHAR), `risk_status` (ENUM: yes/no, nullable), `remark` (TEXT, nullable)

### Requirement: Builds 表

系统 SHALL 维护 `builds` 表，存储构建记录。

#### Scenario: Builds 表结构
- **WHEN** Alembic migration 执行完毕
- **THEN** `builds` 表存在且包含字段：`id` (PK), `project_id` (FK → projects.id), `branch` (VARCHAR), `tester` (VARCHAR), `coverage` (INT), `can_update_coverage` (BOOLEAN), `build_status` (ENUM), `deploy_status` (ENUM)

### Requirement: Activities 表

系统 SHALL 维护 `activities` 表，存储项目活动日志。

#### Scenario: Activities 表结构
- **WHEN** Alembic migration 执行完毕
- **THEN** `activities` 表存在且包含字段：`id` (PK), `project_id` (FK → projects.id), `type` (VARCHAR), `time` (DATETIME), `user` (VARCHAR), `action` (VARCHAR)

### Requirement: Team_Members 表

系统 SHALL 维护 `team_members` 表，存储项目团队成员。

#### Scenario: Team_Members 表结构
- **WHEN** Alembic migration 执行完毕
- **THEN** `team_members` 表存在且包含字段：`id` (PK), `project_id` (FK → projects.id), `role` (VARCHAR), `name` (VARCHAR), `avatar` (VARCHAR), `emp_id` (VARCHAR)

### Requirement: Workflow_Steps 表

系统 SHALL 维护 `workflow_steps` 表，存储项目工作流步骤。

#### Scenario: Workflow_Steps 表结构
- **WHEN** Alembic migration 执行完毕
- **THEN** `workflow_steps` 表存在且包含字段：`id` (PK), `project_id` (FK → projects.id), `step` (INT), `name` (VARCHAR), `status` (ENUM: completed/current/pending), `time` (DATETIME, nullable)

### Requirement: Users 表

系统 SHALL 维护 `users` 表，存储用户信息用于认证。

#### Scenario: Users 表结构
- **WHEN** Alembic migration 执行完毕
- **THEN** `users` 表存在且包含字段：`id` (PK), `username` (VARCHAR, unique), `password_hash` (VARCHAR), `create_time` (DATETIME)

### Requirement: Alembic 迁移支持

数据库 schema 变更 SHALL 通过 Alembic 管理和执行，支持 `alembic upgrade head` 和 `alembic downgrade -1`。

#### Scenario: 执行最新迁移
- **WHEN** 执行 `alembic upgrade head`
- **THEN** 所有未应用的 migration 依次执行
- **AND** 数据库 schema 更新到最新版本

#### Scenario: 回滚上一个迁移
- **WHEN** 执行 `alembic downgrade -1`
- **THEN** 最近一个 migration 被回滚
- **AND** 数据库 schema 恢复到上一个版本
