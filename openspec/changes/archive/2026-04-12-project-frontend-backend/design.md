## Context

**问题**: 用户登录成功后闪退，已修复`dependencies.py`中Redis key不匹配问题。

**当前状态**:
- 认证模块正常工作
- 项目列表和详情API可用，但是页面不显示数据
- 部分Tab API有fallback mock数据

## Goals / Non-Goals

**Goals:**
- 验证所有项目相关API返回真实数据
- 前端页面显示后端接口调用返回的数据，完成前后端接口联调
- 移除不必要的mock fallback
- 识别缺失API

**Non-Goals:**
- 不开发新API
- 不重构数据模型
- 不改变前端组件结构

## Decisions

### 1. mock 数据替换
在前端代码中，将所有fallback mock数据替换，替换为后端接口调用返回的数据。

## Risks / Trade-offs

| 风险 | 影响 | Mitigation |
|------|------|------------|
| API数据格式不一致 | 页面显示异常 | response interceptor转换snake_case→camelCase |
| Redis连接失败 | 认证失败 | 检查Redis连接 |

## Open Questions

1. Reviews模块是否需要后端API？
2. Acceptance模块数据来源？
3. Overview Tab是否复用项目详情数据？
