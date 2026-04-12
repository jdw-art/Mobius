## Why

项目详情页各Tab页签（概况、需求、应用、构建、产品验收、测试、评审、文档、风险）需要完成前后端接口联调，并使用Playwright MCP进行端到端验证，确保页面数据正确渲染和交互正常。

## What Changes

1. **API问题修复**: 修复defects和risks API返回500错误的问题
2. **前端Mock数据清理**: 移除各service中的fallback mock数据，强制使用真实API
3. **Playwright MCP测试**: 使用Playwright MCP验证各Tab页面和数据互通
4. **缺失功能识别**: 识别完全没有后端API支持的Tab（评审、产品验收等）

## Capabilities

### New Capabilities
- `project-detail-e2e`: 项目详情页端到端测试能力
- `api-integration-fix`: API问题修复能力

### Modified Capabilities
- 无

## Impact

### 受影响代码
- `backend/app/api/v1/projects.py` - 项目详情Tab API
- `backend/app/schemas/defect.py` - 缺陷Schema修复
- `backend/app/schemas/risk.py` - 风险Schema修复
- `frontend/src/services/*.ts` - 移除mock fallback
- `frontend/src/components/project-detail/*.tsx` - 各Tab组件

### 需要验证的Tab页签
1. 项目概况 (Overview) - 复用项目详情数据
2. 需求列表 (Requirements) - /api/v1/projects/{id}/requirements
3. 应用 (Applications) - /api/v1/projects/{id}/applications
4. 构建列表 (Builds) - /api/v1/projects/{id}/builds
5. 产品验收 (Acceptance) - 需要确认API支持
6. 测试缺陷 (Defects) - /api/v1/projects/{id}/defects (需要修复)
7. 评审 (Review) - 需要确认API支持
8. 文档 (Documents) - /api/v1/projects/{id}/documents
9. 风险 (Risks) - /api/v1/projects/{id}/risks (需要修复)
