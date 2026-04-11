## Why

前端项目已有完整页面和 mock 数据，后端 Phase 1 已完成基础 CRUD 支持。但目前整个系统缺少**用户认证体系**：无登录/注册页面，后端使用无状态 JWT（Token 自验证），无法实现服务端 Token 失效（ logout 功能）。

需要搭建完整的认证体系：Redis 存储 Token 实现有状态认证，前端实现登录/注册页面并与后端联调。

## What Changes

### 后端改造
- 新增 Redis 配置，Token 存储从无状态 JWT 改为 **Redis 有状态 Token**
- 新增用户注册接口 `/api/v1/auth/register`
- 新增用户登录接口 `/api/v1/auth/login`（返回 Redis Token）
- 新增登出接口 `/api/v1/auth/logout`
- 改造 `get_current_user` 依赖：查询 Redis 验证 Token 有效性
- 新增 `users` 数据库表（存储用户密码哈希）

### 前端改造
- 新增登录页面 `/login`
- 新增注册页面 `/register`
- 新增 `AuthContext` 全局认证状态管理
- 新增 `ProtectedRoute` 路由守卫组件
- 引入 `axios` 作为 HTTP 客户端
- 改造所有 service 层：从 mock 数据改为真实 API 调用
- Token 存储于 localStorage，使用 Bearer Token 方式

## Capabilities

### New Capabilities
- `user-auth`: 用户认证能力，包括注册、登录、登出、Token 管理
- `frontend-auth-integration`: 前端认证集成，包括登录注册页面、路由守卫、API 联调

### Modified Capabilities
- （无现有 spec 需修改，Phase 1 的 backend CRUD 未形成正式 spec）

## Impact

| 范围 | 影响 |
|------|------|
| **后端** | 新增 `users` 表，新增 3 个 auth 接口，修改 `dependencies.py` |
| **前端** | 新增 2 个页面 + AuthContext + ProtectedRoute，改造 10+ service 文件 |
| **配置** | `.env` 新增 Redis 配置 |
| **依赖** | 后端新增 `redis`/`aioredis`，前端新增 `axios` |
| **端口** | 后端 8081（不变），Redis 6379 |
