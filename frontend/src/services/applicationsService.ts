import { request } from '../utils/request';
import { Application } from '../types';

// Mock data - kept for backwards compatibility
const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'APP001',
    name: '用户中心',
    branch: 'master',
    version: 'V2.1.0',
    testStatus: '已测试',
    deployMethod: 'maven',
    unitTest: '通过',
    codeScan: '通过',
    codeReview: '评审通过',
    status: '正常'
  },
  {
    id: 'APP002',
    name: '统一认证',
    branch: 'develop',
    version: 'V2.1.0',
    testStatus: '已测试',
    deployMethod: 'dubbo',
    unitTest: '通过',
    codeScan: '通过',
    codeReview: '评审通过',
    status: '正常'
  },
  {
    id: 'APP003',
    name: '数据分析平台',
    branch: 'feature/report',
    version: 'V2.1.0',
    testStatus: '未测试',
    deployMethod: 'tomcat',
    unitTest: '未通过',
    codeScan: '未通过',
    codeReview: '驳回',
    status: '待修复'
  },
  {
    id: 'APP004',
    name: '订单管理系统',
    branch: 'master',
    version: 'V1.5.0',
    testStatus: '已测试',
    deployMethod: 'maven',
    unitTest: '通过',
    codeScan: '通过',
    codeReview: '评审通过',
    status: '正常'
  },
  {
    id: 'APP005',
    name: '支付服务',
    branch: 'develop',
    version: 'V1.2.0',
    testStatus: '未测试',
    deployMethod: 'dubbo',
    unitTest: '通过',
    codeScan: '通过',
    codeReview: '未开始',
    status: '开发中'
  }
];

// Sync version for backwards compatibility with existing components
export const getApplications = (): Application[] => {
  return MOCK_APPLICATIONS;
};

// Async API version for new code
export interface ApplicationCreate {
  name: string;
  branch: string;
  version: string;
  testStatus: string;
  deployMethod: string;
  unitTest: string;
  codeScan: string;
  codeReview: string;
  status: string;
}

export const applicationsService = {
  getByProject: async (projectId: string): Promise<Application[]> => {
    try {
      const response = await request.get(`/api/v1/projects/${projectId}/applications`);
      return response.data;
    } catch (error) {
      // Fallback to mock data on error
      return MOCK_APPLICATIONS;
    }
  },

  create: async (projectId: string, data: ApplicationCreate): Promise<Application> => {
    const response = await request.post(`/api/v1/projects/${projectId}/applications`, data);
    return response.data;
  },

  update: async (projectId: string, applicationId: string, data: Partial<ApplicationCreate>): Promise<Application> => {
    const response = await request.put(`/api/v1/projects/${projectId}/applications/${applicationId}`, data);
    return response.data;
  },

  delete: async (projectId: string, applicationId: string): Promise<void> => {
    await request.delete(`/api/v1/projects/${projectId}/applications/${applicationId}`);
  },
};
