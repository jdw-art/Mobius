# mobius-auth

基于 JWT 的用户认证能力，仅校验登录态，不含细粒度权限控制。

## ADDED Requirements

### Requirement: 用户登录接口

系统 SHALL 提供用户登录接口 `/api/v1/auth/login`，验证用户名密码后返回 JWT token。

#### Scenario: 正确凭据登录成功
- **WHEN** POST `/api/v1/auth/login` with `{"username": "admin", "password": "correct_password"}`
- **THEN** 返回 200 OK
- **AND** 返回 `{"access_token": "<jwt_token>", "token_type": "bearer"}`

#### Scenario: 错误密码登录失败
- **WHEN** POST `/api/v1/auth/login` with `{"username": "admin", "password": "wrong_password"}`
- **THEN** 返回 401 Unauthorized
- **AND** 返回 `{"detail": "Incorrect username or password"}`

#### Scenario: 不存在用户登录失败
- **WHEN** POST `/api/v1/auth/login` with `{"username": "nonexistent", "password": "any"}`
- **THEN** 返回 401 Unauthorized

### Requirement: JWT Token 格式

登录返回的 JWT token SHALL 包含 `sub`（用户 ID）、`exp`（过期时间）字段，使用 HS256 签名算法。

#### Scenario: Token payload 验证
- **WHEN** 解码登录返回的 JWT token（不验证签名）
- **THEN** payload 包含 `sub` 字段（用户标识）
- **AND** payload 包含 `exp` 字段（Unix 时间戳）

### Requirement: Token 过期机制

JWT token SHALL 在 24 小时后自动过期。

#### Scenario: 过期 token 被拒绝
- **WHEN** 使用过期 token 请求任何受保护接口
- **THEN** 返回 401 Unauthorized
- **AND** 响应体包含 `"Token has expired"`

### Requirement: Token 校验依赖

FastAPI 依赖注入系统 SHALL 提供 `get_current_user` 依赖，从请求 header 提取并校验 token。

#### Scenario: 依赖正确提取用户
- **WHEN** 请求带有效 token，调用 `get_current_user` 依赖
- **THEN** 返回当前用户对象（包含 user_id）
- **AND** token 从请求中正确解析

### Requirement: 密码安全存储

用户密码 SHALL 使用 argon2 算法哈希后存储，原始密码不得明文保存。

#### Scenario: 密码哈希存储
- **WHEN** 用户注册或修改密码
- **THEN** 数据库中存储的是 argon2 哈希值
- **AND** 无法从哈希值反推出原始密码

#### Scenario: 登录时密码验证
- **WHEN** 用户登录时提供明文密码
- **THEN** 系统使用 argon2_verify 比对哈希
- **AND** 仅在匹配时返回 token
