import { BuildingProject, UnbuiltProject, Environment, EnvironmentType } from '../types';

// 模拟构建环境数据
export const getEnvironmentBuildConfig = (env: EnvironmentType): any => {
  const baseConfig = {
    selectedAppId: 'APP001',
    selectedAppName: '用户中心',
    oldVersion: 'V2.0.0',
    newVersion: 'V2.1.0',
    packageName: 'user-center-2.1.0.jar',
    buildMethod: 'maven',
    deployMethod: 'docker',
    branch: 'feature/user-management-refactor',
    servers: [
      { ip: '192.168.1.101', deployStatus: true },
      { ip: '192.168.1.102', deployStatus: true },
      { ip: '192.168.1.103', deployStatus: false }
    ],
    buildStatus: '未构建',
    deployStatus: '未部署',
    buildProgress: 0,
    deployProgress: 0
  };

  // 根据环境类型返回不同的配置
  if (env === '测试环境') {
    return { ...baseConfig, buildStatus: '构建成功', deployStatus: '部署成功', buildProgress: 100, deployProgress: 100, branch: 'feature/user-management-refactor' };
  } else if (env === '预发布环境') {
    return { ...baseConfig, buildStatus: '构建成功', deployStatus: '部署中', buildProgress: 100, deployProgress: 50 };
  } else {
    return baseConfig;
  }
};

// 模拟构建中项目数据
export const getBuildingProjects = (): BuildingProject[] => {
  return [
    {
      id: 'BUILD001',
      branch: 'feature/user-management',
      projectName: '用户管理系统',
      projectId: 'PRJ001',
      tester: '钱七',
      coverage: 78,
      canUpdateCoverage: true
    },
    {
      id: 'BUILD002',
      branch: 'develop',
      projectName: '统一认证服务',
      projectId: 'PRJ002',
      tester: '孙八',
      coverage: 65,
      canUpdateCoverage: true
    },
    {
      id: 'BUILD003',
      branch: 'feature/report',
      projectName: '数据分析平台',
      projectId: 'PRJ003',
      tester: '周九',
      coverage: 90,
      canUpdateCoverage: false
    }
  ];
};

// 模拟未构建项目数据
export const getUnbuiltProjects = (): UnbuiltProject[] => {
  return [
    {
      id: 'UNBUILD001',
      branch: 'master',
      projectName: '订单管理系统',
      projectId: 'PRJ004',
      tester: '吴十'
    },
    {
      id: 'UNBUILD002',
      branch: 'feature/payment',
      projectName: '支付服务',
      projectId: 'PRJ005',
      tester: '郑十一'
    }
  ];
};

// 模拟代码分支数据
export const getCodeBranches = (): string[] => {
  return [
    'main',
    'develop',
    'feature/code-review-2024',
    'feature/performance-optimization',
    'bugfix/login-issue'
  ];
};