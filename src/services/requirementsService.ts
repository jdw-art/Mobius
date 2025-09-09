import { Requirement } from '../types';

// 模拟需求数据
export const getRequirements = (): Requirement[] => {
  return [
    {
      id: 'REQ001',
      name: '用户管理功能优化',
      version: 'V2.1.0',
      application: '用户中心',
      module: '用户管理',
      level: '高',
      creator: '张三',
      createTime: '2024-01-15'
    },
    {
      id: 'REQ002',
      name: '登录流程重构',
      version: 'V2.1.0',
      application: '统一认证',
      module: '认证中心',
      level: '高',
      creator: '李四',
      createTime: '2024-01-16'
    },
    {
      id: 'REQ003',
      name: '新增数据报表功能',
      version: 'V2.1.0',
      application: '数据分析平台',
      module: '报表管理',
      level: '中',
      creator: '王五',
      createTime: '2024-01-17'
    },
    {
      id: 'REQ004',
      name: '性能优化',
      version: 'V2.1.0',
      application: '用户中心',
      module: '接口服务',
      level: '中',
      creator: '赵六',
      createTime: '2024-01-18'
    },
    {
      id: 'REQ005',
      name: '安全加固',
      version: 'V2.1.0',
      application: '统一认证',
      module: '安全模块',
      level: '高',
      creator: '钱七',
      createTime: '2024-01-19'
    }
  ];
};