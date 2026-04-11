## Context

Mobius DevOps 平台 Phase 1 已完成后端基础 CRUD，前端已有完整页面和 mock 数据。但整体缺少用户认证体系：

**现状问题：**
- 后端使用无状态 JWT（Token 自验证），无法实现服务端 Token 失效
- 无登录/注册页面，前端无法进行身份认证
- 无路由守卫，未登录用户可访问所有页面

**技术约束：**
- Redis: `redis://:jdw112233@127.0.0.1:6379/0`，TTL 12小时
- 后端端口: 8081
- 前端: React + TypeScript + Ant Design + React Router 6
- 现有密码加密: Argon2（已在 dependencies.py 中使用）

## Goals / Non-Goals

**Goals:**
- 实现完整的用户认证流程（注册/登录/登出）
- Token 存储于 Redis，实现有状态认证
- 前端实现登录/注册页面，与后端联调
- 前端引入路由守卫，保护需要认证的页面
- 改造所有 service 层，从 mock 数据改为真实 API 调用

**Non-Goals:**
- 不实现第三方登录（OAuth等）
- 不实现权限管理/RBAC（Phase 2）
- 不改变现有业务 API 的路径结构
- 不重构现有数据库模型（新增 users 表，不修改现有表）

## Decisions

### 1. Token 方案: Redis 有状态 Token 取代 JWT

**选择方案：**
- 后端生成 UUID 作为 Token，将 `Token → UserID` 映射存储于 Redis
- 前端登录成功后存储 Token，调用 API 时通过 Header `Authorization: Bearer <token>` 传递
- 后端通过 Redis 验证 Token 有效性

**替代方案考虑：**
- 保持 JWT 无状态认证 → 缺点：无法实现服务端 logout，Token 泄露后无法撤销
- Session + Cookie → 缺点：需要处理跨域，CSRF 防护复杂

### 2. Redis Key 设计

```
Key: auth:token:<uuid_token>
Value: <user_id>
TTL: 43200 (12小时)
```

### 3. 后端模块设计

```
backend/app/
├── models/
│   └── user.py          # 新增 User 模型
├── schemas/
│   └── user.py          # 新增 User 相关的 Pydantic schemas
├── api/v1/
│   └── auth.py          # 新增 auth 路由（登录/注册/登出）
├── dependencies.py      # 改造 get_current_user，查询 Redis
└── utils/
    └── redis.py         # 新增 Redis 客户端工具
```

### 4. 前端目录设计

```
frontend/src/
├── contexts/
│   └── AuthContext.tsx      # 认证状态管理
├── pages/
│   ├── LoginPage.tsx        # 登录页
│   └── RegisterPage.tsx     # 注册页
├── components/common/
│   └── ProtectedRoute.tsx   # 路由守卫
├── services/
│   └── authService.ts       # 认证 API 调用
└── utils/
    └── request.ts           # axios 实例配置（Bearer Token）
```

### 5. API 接口设计

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | `/api/v1/auth/register` | 用户注册 | 否 |
| POST | `/api/v1/auth/login` | 用户登录 | 否 |
| POST | `/api/v1/auth/logout` | 用户登出 | 是 |

**请求/响应格式：**

```json
// POST /api/v1/auth/register
Request: { "username": "string", "password": "string" }
Response: { "id": "string", "username": "string" }

// POST /api/v1/auth/login
Request: { "username": "string", "password": "string" }
Response: { "access_token": "string", "token_type": "bearer" }

// POST /api/v1/auth/logout
Request: (Header Authorization: Bearer <token>)
Response: { "message": "Logged out successfully" }
```

### 6. 数据库 Schema

```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 7. 前端 Token 存储

- 存储位置: `localStorage.getItem('mobius_token')`
- 携带方式: axios 请求拦截器自动添加 `Authorization: Bearer <token>`
- 登出: 清除 localStorage 中的 token

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| Redis 连接失败 | 用户无法登录 | 后端启动时检查 Redis 连接，失败则拒绝启动 |
| Token 泄露 | 安全风险 | HTTPS 传输，12h TTL 限制 |
| 前端 token 存储 XSS | 安全风险 | 使用 httpOnly cookie 更安全，但实现复杂，Phase 2 考虑 |
| 大量 service 文件改造 | 工作量大易出错 | 按模块分批改造，每批自测 |

## Migration Plan

1. **后端改造**（无破坏性变更）
   - 新增 users 表（Alembic migration）
   - 新增 Redis 工具模块
   - 新增 auth 路由
   - 改造 dependencies.py

2. **前端改造**（新增页面路由，不影响现有功能）
   - 新增 LoginPage、RegisterPage
   - 新增 AuthContext
   - 新增 ProtectedRoute
   - 改造 App.tsx 添加路由
   - 逐步改造 service 文件

3. **验证步骤**
   - 后端: `curl` 测试 register/login/logout
   - 前端: 登录 → 访问项目列表 → 登出 → 验证 token 清除

## Open Questions

1. **admin 初始账号**: 是否需要数据库 seed 脚本创建 admin 账号？（Phase 1 手动通过 register 创建）
2. **axios 实例**: 是创建统一的 request.ts 还是每个 service 独立配置？（统一 request.ts 更佳）
3. **错误处理**: 后端 401 响应时前端如何处理跳转登录页？（axios 拦截器统一处理）
