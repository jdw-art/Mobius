## Context

**问题**: Defects和Risks API返回500错误，前端使用fallback mock数据。各Tab页签数据流需要验证。

**目标**:
1. 修复backend API错误
2. 移除前端mock fallback（可选）
3. 使用Playwright MCP进行端到端测试

## Goals / Non-Goals

**Goals:**
- 修复defects和risks API的500错误
- 验证所有Tab页签数据正确渲染
- 使用Playwright MCP进行自动化测试验证
- 移除所有mock数据，所有数据从后端接口获取

**Non-Goals:**
- 不开发新API（仅修复现有API）
- 不改变前端组件结构


## Decisions

### 1. Playwright MCP集成
使用Playwright MCP进行浏览器自动化测试，验证页面渲染和数据正确性。

### 2. API前后端调试范围
所有前端页面的Tab页签数据流都需要验证。
