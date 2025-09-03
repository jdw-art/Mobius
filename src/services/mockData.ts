import { Project, Requirement, Application, Document, EnvironmentType, BuildingProject, UnbuiltProject, OperationLog, BuildStatus, DeployStatus, RiskData, Defect, Environment, DefectStatus } from '@/types';

// 模拟项目详情数据
export const getMockProjectDetail = (id: string): Project => {
  return {
    id: 'PRJ001',
    name: '用户管理系统重构',
    type: '日常项目',
    status: '进行中',
    createTime: '2024-01-15',
    pm: '张三',
    progress: '进行中', // 改为字符串类型，与接口一致
    plannedDesignTime: '2024-01-25',
    plannedTestSubmitTime: '2024-02-15',
    plannedTestCompleteTime: '2024-02-25',
    plannedReleaseTime: '2024-03-05',
    plannedDuration: '45个工作日',
    plannedDelivery: '2024-03-15', // 添加缺失的字段
    budget: '资金安全',
    changeType: '功能优化',
    relatedProduct: '用户中心',
    appCount: 3,
    taskCount: { completed: 12, total: 18 },
    projectDuration: 25,
    defectCount: { resolved: 8, total: 12 },
    testCaseCount: { executed: 45, total: 60 },
    workflow: [
      { step: 1, name: '创建', status: 'completed', time: '2024-01-15 09:00' },
      { step: 2, name: '设计', status: 'completed', time: '2024-01-25 17:00' },
      { step: 3, name: '开发', status: 'current', time: '2024-02-10 14:00' },
      { step: 4, name: '测试', status: 'pending', time: '' },
      { step: 5, name: '预发布', status: 'pending', time: '' },
      { step: 6, name: '生产发布', status: 'pending', time: '' },
      { step: 7, name: '合并主干', status: 'pending', time: '' }
    ],
    activities: [
      { type: '创建', time: '2024-01-15 09:00', user: '张三', action: '创建了项目' },
      { type: '设计', time: '2024-01-20 14:30', user: '李四', action: '完成了系统设计文档' },
      { type: '开发', time: '2024-01-25 16:00', user: '王五', action: '开始前端开发' },
      { type: '开发', time: '2024-02-01 10:00', user: '赵六', action: '完成后端API开发' },
      { type: '测试', time: '2024-02-10 14:00', user: '钱七', action: '开始单元测试' },
      { type: '开发', time: '2024-02-12 11:20', user: '王五', action: '集成了用户鉴权模块' },
      { type: '评审', time: '2024-02-13 15:45', user: '李四', action: '完成代码评审并给出修改意见' },
      { type: '测试', time: '2024-02-14 09:30', user: '钱七', action: '提交第一轮冒烟测试报告' },
      { type: '开发', time: '2024-02-15 18:05', user: '赵六', action: '根据评审意见修复若干问题' },
      { type: '测试', time: '2024-02-16 13:22', user: '钱七', action: '新增接口自动化用例' },
      { type: '预发布', time: '2024-02-18 10:10', user: '周九', action: '预发环境完成部署' },
      { type: '运维', time: '2024-02-19 17:40', user: '孙八', action: '完成资源扩容与监控配置' }
    ],
    team: [
      { role: '产品负责人', name: '张三', avatar: '张', empId: '10001' },
      { role: '开发负责人', name: '李四', avatar: '李', empId: '10002' },
      { role: 'PM', name: '王五', avatar: '王', empId: '10003' },
      { role: '开发', name: '赵六', avatar: '赵', empId: '10004' },
      { role: '测试', name: '钱七', avatar: '钱', empId: '10005' },
      { role: '运维', name: '孙八', avatar: '孙', empId: '10006' },
      { role: '预发布验证', name: '周九', avatar: '周', empId: '10007' },
      { role: '生产验证', name: '吴十', avatar: '吴', empId: '10008' }
    ]
  };
};

// 获取工作流里程碑
export const getWorkflowMilestones = (fromStep: number): string[] => {
  switch (fromStep) {
    case 1:
      return [];
    case 2:
      return ['1. 设计评审'];
    case 3:
      return ['1. 代码扫描', '2. 提测', '3. 冒烟测试', '4. 代码评审', '5. 单元测试'];
    case 4:
      return ['1. 测试完成', '2. 产品验收'];
    case 5:
      return ['1. 预发验证'];
    case 6:
      return ['1. 生产验证'];
    default:
      return [];
  }
};

// 模拟风险数据
export const getMockRiskData = (): RiskData => {
  return {
    riskItems: [
      { id: 'RISK001', riskType: '代码质量风险', riskItem: '是否有未解决的Bug', riskStatus: undefined },
      { id: 'RISK002', riskType: '代码质量风险', riskItem: '新功能是否影响原有功能', riskStatus: undefined },
      { id: 'RISK003', riskType: '基础设施与依赖风险', riskItem: '是否接入第三方服务', riskStatus: undefined },
      { id: 'RISK004', riskType: '数据风险', riskItem: '是否涉及数据库迁移', riskStatus: undefined },
      { id: 'RISK005', riskType: '数据风险', riskItem: '新老版本数据是否能兼容', riskStatus: undefined },
      { id: 'RISK006', riskType: '业务风险', riskItem: '产品或系统业务方面是否涉及关键业务点风险', riskStatus: undefined },
      { id: 'RISK007', riskType: '业务风险', riskItem: '是否涉及灰度方案设计', riskStatus: undefined },
    ]
  };
};

// 模拟需求数据
export const getMockRequirements = (): Requirement[] => {
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

// 模拟文档数据
export const getMockDocuments = (): Document[] => {
  return [
    {
      id: 'DOC001',
      type: '需求文档',
      name: '用户管理系统需求规格说明书',
      link: 'https://example.com/docs/req001.pdf',
      creator: '张三',
      createTime: '2024-01-10'
    },
    {
      id: 'DOC002',
      type: '详细设计',
      name: '用户管理系统架构设计文档',
      link: 'https://example.com/docs/design001.pdf',
      creator: '李四',
      createTime: '2024-01-15'
    }
  ];
};

// 模拟应用数据
export const getMockApplications = (): Application[] => {
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

// 模拟构建环境数据
export const getMockEnvironmentBuildConfig = (env: EnvironmentType): any => {
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
    buildStatus: '未构建' as BuildStatus,
    deployStatus: '未部署' as DeployStatus,
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
export const getMockBuildingProjects = (): BuildingProject[] => {
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

// 评审流程接口定义
export interface ReviewProcess {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewers: string[];
  reviewTime: string;
  comment?: string;
  commentEditable: boolean;
}

// 模拟设计评审数据
export const getMockDesignReviewData = () => {
  return {
    title: '用户管理系统架构设计评审',
    projectId: 'PRJ001',
    requirementId: 'REQ001',
    creator: '李四',
    createTime: '2024-01-20 14:30',
    updateTime: '2024-01-22 16:45',
    plannedCompleteTime: '2024-01-25',
    designDocumentLink: 'https://example.com/docs/design001.pdf',
    reviewProcesses: [
      {
        id: 'test-review',
        title: '测试评审',
        description: '测试负责人确认设计的可测试性',
        status: 'pending' as const,
        reviewers: ['钱七', '孙八'],
        reviewTime: '2024-01-23 10:15:30',
        comment: '',
        commentEditable: true
      },
      {
        id: 'tech-review',
        title: '技术团队负责人评审',
        description: '技术负责人确认设计的技术可行性',
        status: 'pending' as const,
        reviewers: ['李四'],
        reviewTime: '2024-01-24 14:30:45',
        comment: '',
        commentEditable: true
      },
      {
        id: 'product-review',
        title: '产品评审',
        description: '产品负责人确认设计符合产品需求',
        status: 'pending' as const,
        reviewers: ['张三'],
        reviewTime: '2024-01-25 16:20:10',
        comment: '',
        commentEditable: true
      }
    ]
  };
};

// 模拟未构建项目数据
export const getMockUnbuiltProjects = (): UnbuiltProject[] => {
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
export const getMockCodeBranches = (): string[] => {
  return [
    'main',
    'develop',
    'feature/code-review-2024',
    'feature/performance-optimization',
    'bugfix/login-issue'
  ];
};

// 模拟代码评审数据
export const getMockCodeReviewData = () => {
  return {
    projectId: 'PRJ001',
    requirementId: 'REQ001',
    creator: '赵六',
    createTime: '2024-02-10 09:15',
    plannedCompleteTime: '2024-02-15',
    codeBranch: 'feature/code-review-2024',
    codeBranches: getMockCodeBranches(),
    reviewProcesses: [
      {
        id: 'backend-review',
        title: '技术团队负责人评审',
        description: '后端代码规范和质量检查',
        status: 'pending' as const,
        reviewers: ['赵六', '吴十'],
        reviewTime: '2024-02-12 10:30:00',
        comment: '',
        commentEditable: true
      }
    ]
  };
};

// 测试用例相关类型引入
import { TestCase } from '../types';

// 模拟测试环境测试用例数据
export const getMockTestEnvironmentTestCases = (): TestCase[] => {
  return [
    {
      id: 'TC001',
      name: '用户登录功能验证',
      application: '用户中心',
      creator: '钱七',
      createTime: '2024-02-10 10:15:30',
      status: '通过'
    },
    {
      id: 'TC002', 
      name: '用户信息修改测试',
      application: '用户中心',
      creator: '钱七',
      createTime: '2024-02-10 10:20:15',
      status: '失败'
    },
    {
      id: 'TC003',
      name: '角色权限分配测试',
      application: '统一认证',
      creator: '孙八',
      createTime: '2024-02-10 11:30:45',
      status: '未开始'
    },
    {
      id: 'TC004',
      name: '数据报表生成测试',
      application: '数据分析平台',
      creator: '周九',
      createTime: '2024-02-10 14:20:10',
      status: '通过'
    },
    {
      id: 'TC005',
      name: '性能压力测试',
      application: '用户中心',
      creator: '吴十',
      createTime: '2024-02-11 09:10:22',
      status: '失败'
    }
  ];
};

// 模拟UAT环境测试用例数据
export const getMockUATEnvironmentTestCases = (): TestCase[] => {
  return [
    {
      id: 'TC001',
      name: '用户登录功能验证',
      application: '用户中心',
      creator: '钱七',
      createTime: '2024-02-10 10:15:30',
      status: '未开始'
    },
    {
      id: 'TC002',
      name: '用户信息修改测试',
      application: '用户中心',
      creator: '钱七',
      createTime: '2024-02-10 10:20:15',
      status: '通过'
    },
    {
      id: 'TC003',
      name: '角色权限分配测试',
      application: '统一认证',
      creator: '孙八',
      createTime: '2024-02-10 11:30:45',
      status: '失败'
    },
    {
      id: 'TC004',
      name: '数据报表生成测试',
      application: '数据分析平台',
      creator: '周九',
      createTime: '2024-02-10 14:20:10',
      status: '未开始'
    },
    {
      id: 'TC005',
      name: '性能压力测试',
      application: '用户中心',
      creator: '吴十',
      createTime: '2024-02-11 09:10:22',
      status: '通过'
    }
  ];
};

// 测试用例评审接口定义
export interface TestCaseReviewInfo {
  title: string;
  projectId: string;
  requirementId: string;
  creator: string;
  createTime: string;
  plannedCompleteTime: string;
  testCaseCount: number;
  reviewProcesses: ReviewProcess[];
}

// 发布评审接口定义
export interface ReleaseReviewInfo {
  projectId: string;
  requirementId: string;
  creator: string;
  createTime: string;
  preReleaseTime: string;
  prodReleaseTime: string;
  plannedCompleteTime: string;
  reviewProcesses?: ReviewProcess[];
}

// 模拟测试用例评审数据
export const getMockTestCaseReviewData = (): TestCaseReviewInfo => {
  const testCases = getMockUATEnvironmentTestCases();
  return {
    title: '用户管理系统测试用例评审',
    projectId: 'PRJ001',
    requirementId: 'REQ001',
    creator: '钱七',
    createTime: '2024-03-10 09:30',
    plannedCompleteTime: '2024-03-15',
    testCaseCount: testCases.length,
    reviewProcesses: [
      {
        id: 'product-review',
        title: '产品评审',
        description: '产品负责人确认测试用例是否覆盖所有需求',
        status: 'pending' as const,
        reviewers: ['张三'],
        reviewTime: '2024-03-12 10:00:00',
        comment: '',
        commentEditable: true
      },
      {
        id: 'dev-review',
        title: '开发人员评审',
        description: '开发负责人确认测试用例的技术可行性',
        status: 'pending' as const,
        reviewers: ['李四', '赵六'],
        reviewTime: '2024-03-14 14:00:00',
        comment: '',
        commentEditable: true
      }
    ]
  };
};

// 模拟发布评审数据
export const getMockReleaseReviewData = (): ReleaseReviewInfo => {
  return {
    projectId: 'PRJ001',
    requirementId: 'REQ001',
    creator: '王五',
    createTime: '2024-03-15 10:00',
    preReleaseTime: '2024-03-20 14:30',
    prodReleaseTime: '2024-03-25 10:00',
    plannedCompleteTime: '2024-03-28',
    reviewProcesses: [
      {
        id: 'pm-review',
        title: '项目经理评审',
        description: '项目经理确认项目整体状态和发布准备情况',
        status: 'pending' as const,
        reviewers: ['王五'],
        reviewTime: '2024-03-16 10:00:00',
        comment: '',
        commentEditable: true
      },
      {
        id: 'tech-lead-review',
        title: '技术负责人评审',
        description: '技术负责人确认技术架构和代码质量符合要求',
        status: 'pending' as const,
        reviewers: ['李四'],
        reviewTime: '2024-03-18 14:00:00',
        comment: '',
        commentEditable: true
      },
      {
        id: 'ops-review',
        title: '运维负责人评审',
        description: '运维负责人确认部署方案和监控策略',
        status: 'pending' as const,
        reviewers: ['孙八'],
        reviewTime: '2024-03-20 10:00:00',
        comment: '',
        commentEditable: true
      }
    ]
  };
};

// 定义发布验证确认数据接口
export interface ReleaseVerificationData {
  type: string;
  processed: number;
  total: number;
  rate: string;
}

// 模拟发布验证确认数据
export const getMockReleaseVerificationData = (): ReleaseVerificationData[] => {
  return [
    {
      type: '测试用例',
      processed: 45,
      total: 60,
      rate: '75%'
    },
    {
      type: '测试缺陷',
      processed: 8,
      total: 12,
      rate: '66.7%'
    }
  ];
};

// 模拟操作日志数据
export const getMockOperationLogs = (): OperationLog[] => {
  return [
    {
      time: '2024-02-20 10:15:30',
      user: '张三',
      action: '开始构建用户中心V2.1.0'
    },
    {
      time: '2024-02-20 10:30:45',
      user: '系统',
      action: '构建成功'
    },
    {
      time: '2024-02-20 10:35:10',
      user: '李四',
      action: '开始部署到测试环境'
    },
    {
      time: '2024-02-20 11:00:22',
      user: '系统',
      action: '部署成功'
    },
    {
      time: '2024-02-20 14:20:05',
      user: '王五',
      action: '开始构建到预发布环境'
    },
    {
      time: '2024-02-20 14:45:33',
      user: '系统',
      action: '预发布环境构建成功'
    },
    {
      time: '2024-02-20 15:00:12',
      user: '赵六',
      action: '开始部署到预发布环境'
    },
    {
      time: '2024-02-20 15:30:55',
      user: '系统',
      action: '预发布环境部署成功'
    },
    {
      time: '2024-02-21 09:10:22',
      user: '钱七',
      action: '开始构建到正式环境'
    },
    {
      time: '2024-02-21 09:35:44',
      user: '系统',
      action: '正式环境构建成功'
    },
    {
      time: '2024-02-21 10:00:18',
      user: '孙八',
      action: '开始部署到正式环境'
    },
    {
      time: '2024-02-21 10:45:33',
      user: '系统',
      action: '正式环境部署成功'
    },
    {
      time: '2024-02-21 11:00:55',
      user: '周九',
      action: '验证正式环境功能正常'
    },
    {
      time: '2024-02-21 14:20:11',
      user: '吴十',
      action: '更新文档版本到V2.1.0'
    }
  ];
};

// 模拟缺陷数据
export const getMockDefects = (): Defect[] => {
  return [
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
};
