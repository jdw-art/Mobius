## Why

已完成项目模块基础CRUD联调，但项目详情页各Tab页签数据获取仍存在API fallback问题。需要验证并修复前后端接口联调，确保所有数据来自真实API而非mock数据。

## What Changes

2. **接口验证**: 验证项目列表和详情API返回真实数据
3. **Tab页签联调**: 确保requirements、applications、defects、documents、builds、risks等Tab调用真实API
4. **缺失API识别**: 识别完全没有后端API的Tab（overview、acceptance、reviews）

## Capabilities

### New Capabilities
- `project-crud-api`: 项目基础CRUD API能力验证
- `project-tab-apis`: 项目详情页各Tab的API联调

### Modified Capabilities
- 无

## Impact

### 受影响代码
- `backend/app/dependencies.py` - get_current_user Redis key格式修复
- `frontend/src/services/*.ts` - 各Service移除mock fallback
- `frontend/src/components/project-detail/*.tsx` - Tab组件数据获取

### 需要验证的API端点
- `GET /api/v1/projects` - 项目列表
- `GET /api/v1/projects/{id}` - 项目详情
- `GET /api/v1/projects/{id}/requirements` - 需求列表
- `GET /api/v1/projects/{id}/applications` - 应用列表
- `GET /api/v1/projects/{id}/defects` - 缺陷列表
- `GET /api/v1/projects/{id}/documents` - 文档列表
- `GET /api/v1/projects/{id}/risks` - 风险列表
- `GET /api/v1/projects/{id}/builds` - 构建列表
