## Why

前端已完成登录/注册页面和路由守卫，后端已完成基础 CRUD API。但前端大部分 service 层仍使用 mock 数据，未与后端联调。同时数据库为空，需要写入模拟数据以支撑完整的业务流程验证。

## What Changes

### 数据层
- 创建数据库 seed 脚本，写入模拟项目数据
- 数据需覆盖：projects, requirements, applications, defects, documents, builds, reviews, test_cases, risks, team_members, activities

### 前端-后端联调
- 改造剩余 service 层，将 mock 数据替换为真实 API 调用
- 确保所有 Tab 页面（需求、应用、构建、缺陷、评审、文档、风险）能正确显示后端数据
- 完成项目列表 → 项目详情 → 各子模块的完整数据流

### 流程验证
- 验证登录 → 项目列表 → 项目详情 → 各 Tab 流转正常
- 验证 CRUD 操作（创建/编辑/删除）能正确读写数据库

## Capabilities

### New Capabilities
- `data-seed`: 数据库模拟数据种子脚本，覆盖所有业务表
- `frontend-integration`: 前端 service 层与后端 API 联调

### Modified Capabilities
- （无现有 spec 需修改）

## Impact

| 范围 | 影响 |
|------|------|
| **数据库** | 新增 seed 脚本，写入模拟数据 |
| **前端** | 改造 service 层为异步 API 调用，修复 types 不匹配问题 |
| **后端** | 无变更（API 已就绪） |
| **测试** | 需手动验证完整业务流程 |
