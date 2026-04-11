## Context

Mobius DevOps 平台 Phase 1 后端 CRUD 已完成，前端登录/注册已实现。但：
- 前端部分 service 层仍使用 mock 数据，未与后端 API 联调
- 数据库为空，需要 seed 脚本写入模拟数据以支撑业务流程验证

**现有数据模型：** projects, requirements, applications, defects, documents, reviews, test_cases, risks, builds, team_members, activities, workflow_steps

## Goals / Non-Goals

**Goals:**
- 创建数据库 seed 脚本，写入完整模拟数据
- 前端所有 service 层改造为真实 API 调用
- 完整业务流程验证：登录 → 项目列表 → 项目详情 → 各 Tab

**Non-Goals:**
- 不修改现有后端 API 逻辑
- 不实现数据导出/导入功能
- 不实现自动化测试

## Decisions

### 1. Seed 数据方式

**选择：** 使用 Python 脚本通过 SQLAlchemy ORM 直接写入数据库

**替代方案考虑：**
- Alembic seed → 需要额外 alembic 配置，复杂度高
- 直接 SQL INSERT → 缺少 ORM 的类型安全

### 2. 前端 Service 联调策略

**选择：** 保持现有同步 mock 接口，内部调用异步 API，失败时 fallback 到 mock

**替代方案考虑：**
- 全面改造为 async/await → 工作量大，需同步改造所有消费组件
- 全部使用 mock → 未实现联调目标

### 3. 前端 Types 不匹配问题

**问题：** 后端使用 snake_case，前端 types 使用 camelCase

**解决方案：** request.ts 的 response interceptor 已实现 snake_case → camelCase 自动转换

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 数据库已有数据 | seed 脚本重复执行会冲突 | seed 前先清空或使用 INSERT OR IGNORE |
| 前端 types 与后端不匹配 | TypeScript 类型错误 | 已添加 response transformer |
| 部分复杂 service 改造工作量大 | 进度延迟 | 采用 mock fallback 策略 |

## Migration Plan

1. **Seed 脚本** → 运行脚本写入模拟数据
2. **Service 层改造** → 逐步改造各 service 文件
3. **手动验证** → 启动前后端，验证完整流程

## Open Questions

1. **Seed 数据量**：每个模块写入多少条数据？（建议：1个项目 + 各模块 5-10 条）
2. **数据一致性**：子模块数据是否必须关联到已存在的 project_id？（是）
