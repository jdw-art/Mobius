import { request } from '../utils/request';
import { Requirement } from '../types';

// Mock data - kept for backwards compatibility
const MOCK_REQUIREMENTS: Requirement[] = [
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

// Sync version for backwards compatibility
export const getRequirements = (): Requirement[] => {
  return MOCK_REQUIREMENTS;
};

// Async API version
export interface RequirementCreate {
  name: string;
  version: string;
  application: string;
  module: string;
  level: string;
}

export interface RequirementUpdate {
  name?: string;
  version?: string;
  application?: string;
  module?: string;
  level?: string;
}

export const requirementsService = {
  getByProject: async (projectId: string): Promise<Requirement[]> => {
    try {
      const response = await request.get(`/api/v1/projects/${projectId}/requirements`);
      return response.data;
    } catch (error) {
      return MOCK_REQUIREMENTS;
    }
  },

  create: async (projectId: string, data: RequirementCreate): Promise<Requirement> => {
    const response = await request.post(`/api/v1/projects/${projectId}/requirements`, data);
    return response.data;
  },

  update: async (projectId: string, requirementId: string, data: RequirementUpdate): Promise<Requirement> => {
    const response = await request.put(`/api/v1/projects/${projectId}/requirements/${requirementId}`, data);
    return response.data;
  },

  delete: async (projectId: string, requirementId: string): Promise<void> => {
    await request.delete(`/api/v1/projects/${projectId}/requirements/${requirementId}`);
  },
};
