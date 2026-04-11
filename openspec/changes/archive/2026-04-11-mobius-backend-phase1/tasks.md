## 1. 项目初始化

- [x] 1.1 创建 `backend/` 目录结构（app/, alembic/, tests/）
- [x] 1.2 重写 `backend/requirements.txt`，移除 Banana Blog 残留依赖，添加 FastAPI/SQLAlchemy/Alembic/aiomysql/python-jose/argon2 等 Phase 1 依赖
- [x] 1.3 创建 `backend/.env` 文件，配置 MySQL 连接参数、JWT 密钥、端口 8081
- [x] 1.4 初始化 Python 虚拟环境并 `pip install -r requirements.txt`
- [x] 1.5 验证 MySQL 连接：`mysql -h localhost -u root -p -e "SHOW DATABASES;"`

## 2. FastAPI 应用骨架

- [x] 2.1 创建 `backend/app/__init__.py`
- [x] 2.2 创建 `backend/app/config.py`，使用 pydantic-settings 加载环境变量
- [x] 2.3 创建 `backend/app/database.py`，配置 SQLAlchemy async engine 和 session
- [x] 2.4 创建 `backend/app/main.py`，初始化 FastAPI app，注册路由，添加 CORS 中间件
- [x] 2.5 添加 `GET /health` 健康检查端点
- [x] 2.6 启动服务验证 `uvicorn app.main:app --host 0.0.0.0 --port 8081` 可正常运行

## 3. 数据库模型设计

- [x] 3.1 创建 `backend/app/models/__init__.py`
- [x] 3.2 创建 `backend/app/models/project.py`，包含 `Project` ORM model（含 team, workflow, activities 关联）
- [x] 3.3 创建 `backend/app/models/requirement.py`
- [x] 3.4 创建 `backend/app/models/application.py`
- [x] 3.5 创建 `backend/app/models/defect.py`
- [x] 3.6 创建 `backend/app/models/document.py`
- [x] 3.7 创建 `backend/app/models/review.py`（含 ReviewProcess 关联）
- [x] 3.8 创建 `backend/app/models/test_case.py`
- [x] 3.9 创建 `backend/app/models/risk.py`
- [x] 3.10 创建 `backend/app/models/build.py`
- [x] 3.11 创建 `backend/app/models/activity.py`
- [x] 3.12 创建 `backend/app/models/team_member.py`
- [x] 3.13 创建 `backend/app/models/workflow_step.py`
- [x] 3.14 创建 `backend/app/models/user.py`（认证用）
- [x] 3.15 创建 `backend/app/models/base.py`（共用 SQLAlchemy Base 类）

## 4. Pydantic Schema 设计

- [x] 4.1 创建 `backend/app/schemas/__init__.py`
- [x] 4.2 创建 `backend/app/schemas/project.py`（ProjectCreate, ProjectUpdate, ProjectResponse）
- [x] 4.3 创建 `backend/app/schemas/requirement.py`
- [x] 4.4 创建 `backend/app/schemas/application.py`
- [x] 4.5 创建 `backend/app/schemas/defect.py`
- [x] 4.6 创建 `backend/app/schemas/document.py`
- [x] 4.7 创建 `backend/app/schemas/review.py`
- [x] 4.8 创建 `backend/app/schemas/test_case.py`
- [x] 4.9 创建 `backend/app/schemas/risk.py`
- [x] 4.10 创建 `backend/app/schemas/build.py`
- [x] 4.11 创建 `backend/app/schemas/activity.py`
- [x] 4.12 创建 `backend/app/schemas/team_member.py`
- [x] 4.13 创建 `backend/app/schemas/workflow_step.py`
- [x] 4.14 创建 `backend/app/schemas/user.py`（LoginRequest, TokenResponse）
- [x] 4.15 创建 `backend/app/schemas/common.py`（分页参数/响应、错误响应）

## 5. CRUD 操作实现

- [x] 5.1 创建 `backend/app/crud/__init__.py`
- [x] 5.2 创建 `backend/app/crud/project.py`（含 get_project, get_projects, create_project, update_project, delete_project）
- [x] 5.3 创建 `backend/app/crud/requirement.py`
- [x] 5.4 创建 `backend/app/crud/application.py`
- [x] 5.5 创建 `backend/app/crud/defect.py`
- [x] 5.6 创建 `backend/app/crud/document.py`
- [x] 5.7 创建 `backend/app/crud/review.py`
- [x] 5.8 创建 `backend/app/crud/test_case.py`
- [x] 5.9 创建 `backend/app/crud/risk.py`
- [x] 5.10 创建 `backend/app/crud/build.py`
- [x] 5.11 创建 `backend/app/crud/activity.py`
- [x] 5.12 创建 `backend/app/crud/team_member.py`
- [x] 5.13 创建 `backend/app/crud/workflow_step.py`
- [x] 5.14 创建 `backend/app/crud/user.py`（get_user_by_username, verify_password, create_user）
- [x] 5.15 创建 `backend/app/crud/utils.py`（分页辅助函数）

## 6. JWT 认证实现

- [x] 6.1 创建 `backend/app/dependencies.py`，实现 `create_access_token` 函数（HS256，24h过期）
- [x] 6.2 实现 `get_current_user` FastAPI 依赖（从 Authorization header 解析 JWT）
- [x] 6.3 创建 `POST /api/v1/auth/login` 端点
- [x] 6.4 添加密码哈希工具函数（argon2 hash/verify）
- [x] 6.5 创建初始管理员账号种子脚本（可选）

## 7. REST API 路由实现

- [x] 7.1 创建 `backend/app/api/__init__.py`
- [x] 7.2 创建 `backend/app/api/v1/__init__.py`
- [x] 7.3 创建 `backend/app/api/v1/router.py`，聚合所有子路由
- [x] 7.4 创建 `backend/app/api/v1/auth.py`（/auth/login）
- [x] 7.5 创建 `backend/app/api/v1/projects.py`（/projects 嵌套子资源路由）
- [x] 7.6 在 `main.py` 中注册 `/api/v1` 路由前缀

## 8. Alembic 迁移配置

- [x] 8.1 初始化 Alembic：`alembic init alembic`
- [x] 8.2 配置 `alembic.ini` 中的数据库 URL 指向 MySQL mobius
- [x] 8.3 修改 `alembic/env.py` 以导入 SQLAlchemy Base
- [x] 8.4 运行 `alembic autogenerate -m "initial schema"` 生成初始迁移
- [x] 8.5 执行 `alembic upgrade head` 应用迁移
- [x] 8.6 验证数据库表已创建：`mysql -h localhost -u root -p mobius -e "SHOW TABLES;"`

## 9. RAG 目录预留

- [x] 9.1 创建 `backend/app/rag/__init__.py`（空文件）
- [x] 9.2 创建 `backend/app/rag/placeholder.py`（注释说明 Phase 2 实现）

## 10. 测试验证

- [x] 10.1 启动后端服务 `uvicorn app.main:app --host 0.0.0.0 --port 8081`
- [x] 10.2 验证 `GET /health` 返回 `{"status": "healthy"}`
- [x] 10.3 验证 `POST /api/v1/auth/login` 可用（测试账号）
- [x] 10.4 验证无 token 访问 `/api/v1/projects` 返回 401
- [x] 10.5 验证带 token 访问 `/api/v1/projects` 返回 200
- [x] 10.6 验证 `GET /api/v1/projects/{id}` 返回完整嵌套数据
- [x] 10.7 验证 CRUD 操作（创建/更新/删除）正常
- [x] 10.8 清理 `backend/requirements.txt`（确认无 Banana Blog 残留）
