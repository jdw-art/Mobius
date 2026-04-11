import { request } from '../utils/request';
import { Defect } from '../types';

export type Environment = '测试环境' | 'UAT环境';

// Mock data - kept for backwards compatibility
const MOCK_DEFECTS: Defect[] = [
  {
    id: 'DEF001',
    name: '登录页面输入框长度限制问题',
    environment: '测试环境',
    application: '用户管理系统',
    developer: '张三',
    tester: '钱七',
    status: '打开',
    creator: '钱七',
    createTime: '2024-02-15 10:30:00'
  },
  {
    id: 'DEF002',
    name: '用户列表分页功能异常',
    environment: '测试环境',
    application: '用户管理系统',
    developer: '李四',
    tester: '钱七',
    status: '修复中',
    creator: '钱七',
    createTime: '2024-02-16 14:20:00'
  },
  {
    id: 'DEF003',
    name: '权限验证逻辑错误',
    environment: 'UAT环境',
    application: '用户管理系统',
    developer: '王五',
    tester: '孙八',
    status: '关闭',
    creator: '孙八',
    createTime: '2024-02-14 09:45:00'
  },
  {
    id: 'DEF004',
    name: '数据导出功能无法正常使用',
    environment: '测试环境',
    application: '报表系统',
    developer: '赵六',
    tester: '钱七',
    status: '打开',
    creator: '钱七',
    createTime: '2024-02-17 11:15:00'
  },
  {
    id: 'DEF005',
    name: '界面响应速度慢',
    environment: 'UAT环境',
    application: '报表系统',
    developer: '赵六',
    tester: '孙八',
    status: '修复中',
    creator: '孙八',
    createTime: '2024-02-18 15:30:00'
  },
  {
    id: 'DEF006',
    name: '用户信息更新后缓存未更新',
    environment: '测试环境',
    application: '用户管理系统',
    developer: '张三',
    tester: '钱七',
    status: '关闭',
    creator: '钱七',
    createTime: '2024-02-12 16:45:00'
  },
  {
    id: 'DEF007',
    name: '特定条件下查询结果为空',
    environment: 'UAT环境',
    application: '报表系统',
    developer: '李四',
    tester: '孙八',
    status: '打开',
    creator: '孙八',
    createTime: '2024-02-19 10:20:00'
  },
  {
    id: 'DEF008',
    name: '密码重置功能验证码超时',
    environment: '测试环境',
    application: '用户管理系统',
    developer: '王五',
    tester: '钱七',
    status: '修复中',
    creator: '钱七',
    createTime: '2024-02-20 13:50:00'
  }
];

// Sync version for backwards compatibility
export const getDefects = (): Defect[] => {
  return MOCK_DEFECTS;
};

// Async API version
export interface DefectCreate {
  name: string;
  environment: Environment;
  application: string;
  developer: string;
  tester: string;
  status: string;
}

export interface DefectUpdate {
  name?: string;
  environment?: Environment;
  application?: string;
  developer?: string;
  tester?: string;
  status?: string;
}

export const defectsService = {
  getByProject: async (projectId: string): Promise<Defect[]> => {
    try {
      const response = await request.get(`/api/v1/projects/${projectId}/defects`);
      return response.data;
    } catch (error) {
      return MOCK_DEFECTS;
    }
  },

  create: async (projectId: string, data: DefectCreate): Promise<Defect> => {
    const response = await request.post(`/api/v1/projects/${projectId}/defects`, data);
    return response.data;
  },

  update: async (projectId: string, defectId: string, data: DefectUpdate): Promise<Defect> => {
    const response = await request.put(`/api/v1/projects/${projectId}/defects/${defectId}`, data);
    return response.data;
  },

  delete: async (projectId: string, defectId: string): Promise<void> => {
    await request.delete(`/api/v1/projects/${projectId}/defects/${defectId}`);
  },
};
