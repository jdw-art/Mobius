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

// 模拟设计评审数据
export const getDesignReviewData = () => {
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

// 模拟代码评审数据
export const getCodeReviewData = () => {
  return {
    projectId: 'PRJ001',
    requirementId: 'REQ001',
    creator: '赵六',
    createTime: '2024-02-10 09:15',
    plannedCompleteTime: '2024-02-15',
    codeBranch: 'feature/code-review-2024',
    codeBranches: ['main', 'develop', 'feature/code-review-2024', 'feature/performance-optimization', 'bugfix/login-issue'],
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

// 模拟测试用例评审数据
export const getTestCaseReviewData = (): TestCaseReviewInfo => {
  // 这里简化处理，实际应该从测试服务获取测试用例数据
  const testCasesCount = 8;
  return {
    title: '用户管理系统测试用例评审',
    projectId: 'PRJ001',
    requirementId: 'REQ001',
    creator: '钱七',
    createTime: '2024-03-10 09:30',
    plannedCompleteTime: '2024-03-15',
    testCaseCount: testCasesCount,
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
export const getReleaseReviewData = (): ReleaseReviewInfo => {
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
export const getReleaseVerificationData = (): ReleaseVerificationData[] => {
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