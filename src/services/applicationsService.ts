import { Application } from '../types';

// 模拟应用数据
export const getApplications = (): Application[] => {
  return [
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
};