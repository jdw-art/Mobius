# DevOps System - React + TypeScript

一个基于React和TypeScript的DevOps一体化平台，采用现代化的项目架构和最佳实践。

## 🚀 技术栈

- **前端框架**: React 18.2.0
- **开发语言**: TypeScript 5.0
- **UI组件库**: Ant Design 5.0
- **路由管理**: React Router DOM 6.8
- **日期处理**: Day.js 1.11
- **代码规范**: ESLint + TypeScript ESLint

## 📁 项目结构

```
src/
├── components/          # 组件目录
│   ├── common/         # 通用组件
│   ├── layout/         # 布局组件
│   ├── ProjectList.tsx # 项目列表组件
│   └── ProjectDetail.tsx # 项目详情组件
├── pages/              # 页面组件
│   ├── ProjectListPage.tsx
│   └── ProjectDetailPage.tsx
├── types/              # TypeScript类型定义
│   └── index.ts
├── constants/          # 常量定义
│   └── index.ts
├── utils/              # 工具函数
│   └── index.ts
├── hooks/              # 自定义Hooks
│   └── useProjects.ts
├── services/           # 服务层
│   └── mockData.ts
├── assets/             # 静态资源
│   ├── images/
│   └── icons/
├── App.tsx             # 主应用组件
└── index.tsx           # 应用入口
```

## 🛠️ 开发指南

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm start
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
npm run lint:fix
npm run type-check
```

## 🎯 主要功能

- **项目管理**: 项目列表展示、搜索、过滤
- **项目详情**: 项目信息、工作流状态、进度跟踪
- **团队协作**: 团队成员管理、角色分配
- **流程管理**: 工作流状态图、里程碑跟踪

## 🔧 开发规范

### 组件命名
- 使用PascalCase命名组件文件
- 页面组件以Page结尾
- 布局组件放在layout目录

### 类型定义
- 所有接口和类型定义放在types目录
- 使用TypeScript严格模式
- 为所有props定义接口

### 工具函数
- 通用工具函数放在utils目录
- 按功能模块组织工具函数
- 提供完整的TypeScript类型

### 状态管理
- 使用React Hooks管理状态
- 复杂状态逻辑封装为自定义Hook
- 避免过度使用全局状态

## 📝 代码示例

### 组件定义
```typescript
import React from 'react';
import { ComponentProps } from '@/types';

const MyComponent: React.FC<ComponentProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default MyComponent;
```

### 类型定义
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
}

export type UserRole = 'admin' | 'user' | 'guest';
```

### 自定义Hook
```typescript
export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  
  const updateUser = useCallback((newUser: User) => {
    setUser(newUser);
  }, []);
  
  return { user, updateUser };
};
```

## 🚀 部署

项目使用Create React App构建，支持以下部署方式：

- 静态文件部署
- Docker容器化部署
- 云平台部署

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目。
