# DevOps一体化平台

一个基于React和TypeScript的DevOps一体化平台，提供项目管理、需求管理、缺陷跟踪、代码评审、构建部署等一站式DevOps解决方案，采用现代化的项目架构和最佳实践。

## 🚀 技术栈

- **前端框架**: React 18.2.0
- **开发语言**: TypeScript 4.9.0
- **UI组件库**: Ant Design 5.0
- **路由管理**: React Router DOM 6.8
- **日期处理**: Day.js 1.11
- **构建工具**: CRA + Craco 7.1.0

## 📁 项目结构

```
src/
├── components/          # 组件目录
│   ├── common/         # 通用组件
│   │   ├── OperationLogList.tsx
│   │   └── ReviewProcessItem.tsx
│   ├── layout/         # 布局组件
│   ├── ProjectList.tsx # 项目列表组件
│   ├── ProjectDetail.tsx # 项目详情组件
│   └── project-detail/  # 项目详情子模块
│       ├── AcceptanceTab.tsx
│       ├── ApplicationsTab.tsx
│       ├── BuildsTab.tsx
│       ├── DefectsTab.tsx
│       ├── DocumentsTab.tsx
│       ├── OverviewTab.tsx
│       ├── RequirementsTab.tsx
│       ├── ReviewTab.tsx
│       ├── RisksTab.tsx
│       ├── TasksTab.tsx
│       └── reviews/     # 评审相关组件
│           ├── CodeReview.tsx
│           ├── DesignReview.tsx
│           ├── ReleaseReview.tsx
│           └── TestCaseReview.tsx
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

启动开发服务器，访问 http://localhost:3000 查看应用

### 构建生产版本

```bash
npm run build
```

构建应用到build目录

### 代码检查

```bash
npm run type-check
```

运行TypeScript类型检查

## 🎯 主要功能

- **项目管理**: 项目列表展示、搜索、过滤、项目信息管理
- **需求管理**: 需求跟踪、变更管理
- **任务管理**: 任务分配、状态跟踪、进度管理
- **缺陷管理**: 缺陷上报、分配、解决和验证
- **代码评审**: 代码审查流程、评审意见管理
- **设计评审**: 设计文档评审、评审流程管理、评审操作日志
- **测试管理**: 测试用例评审、测试计划跟踪
- **构建部署**: 多环境构建配置、部署状态跟踪
- **文档管理**: 项目文档集中管理
- **团队协作**: 团队成员管理、角色分配
- **流程管理**: 工作流状态图、里程碑跟踪

## 🔧 开发规范

### 组件命名
- 使用PascalCase命名组件文件
- 页面组件以Page结尾
- 布局组件放在layout目录
- 通用可复用组件放在common目录

### 类型定义
- 所有接口和类型定义放在types目录
- 使用TypeScript严格模式
- 为所有props定义接口
- 使用type-only import导入类型

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
