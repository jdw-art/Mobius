import { TestCase, OperationLog } from '../types';

// 模拟产品验收测试环境测试用例统计数据
export interface TestCaseStats {
  total: number;
  completed: number;
  passed: number;
  failed: number;
  untested: number;
}

// 模拟产品验收测试环境测试用例数据
export const getAcceptanceTestEnvironmentTestCases = (): TestCase[] => {
  return [
    {
      id: 'ATC001',
      name: '登录功能验证',
      application: '用户中心',
      creator: '钱七',
      createTime: '2024-03-10 10:15:30',
      status: '通过'
    },
    {
      id: 'ATC002',
      name: '用户信息修改',
      application: '用户中心',
      creator: '钱七',
      createTime: '2024-03-10 10:20:15',
      status: '通过'
    },
    {
      id: 'ATC003',
      name: '角色权限分配',
      application: '统一认证',
      creator: '孙八',
      createTime: '2024-03-10 11:30:45',
      status: '通过'
    },
    {
      id: 'ATC004',
      name: '数据报表生成',
      application: '数据分析平台',
      creator: '周九',
      createTime: '2024-03-10 14:20:10',
      status: '失败'
    },
    {
      id: 'ATC005',
      name: '性能压力测试',
      application: '用户中心',
      creator: '吴十',
      createTime: '2024-03-11 09:10:22',
      status: '失败'
    },
    {
      id: 'ATC006',
      name: '安全性测试',
      application: '统一认证',
      creator: '吴十',
      createTime: '2024-03-12 14:20:10',
      status: '通过'
    },
    {
      id: 'ATC007',
      name: '兼容性测试',
      application: '用户中心',
      creator: '钱七',
      createTime: '2024-03-13 09:30:45',
      status: '未开始'
    }
  ];
};

// 模拟产品验收UAT环境测试用例数据
export const getAcceptanceUATEnvironmentTestCases = (): TestCase[] => {
  return [
    {
      id: 'ATC001',
      name: '登录功能验证',
      application: '用户中心',
      creator: '钱七',
      createTime: '2024-03-15 10:15:30',
      status: '未开始'
    },
    {
      id: 'ATC002',
      name: '用户信息修改',
      application: '用户中心',
      creator: '钱七',
      createTime: '2024-03-15 10:20:15',
      status: '通过'
    },
    {
      id: 'ATC003',
      name: '角色权限分配',
      application: '统一认证',
      creator: '孙八',
      createTime: '2024-03-15 11:30:45',
      status: '失败'
    },
    {
      id: 'ATC004',
      name: '数据报表生成',
      application: '数据分析平台',
      creator: '周九',
      createTime: '2024-03-15 14:20:10',
      status: '未开始'
    },
    {
      id: 'ATC005',
      name: '性能压力测试',
      application: '用户中心',
      creator: '吴十',
      createTime: '2024-03-16 09:10:22',
      status: '通过'
    },
    {
      id: 'ATC006',
      name: '安全性测试',
      application: '统一认证',
      creator: '吴十',
      createTime: '2024-03-16 14:20:10',
      status: '通过'
    },
    {
      id: 'ATC007',
      name: '兼容性测试',
      application: '用户中心',
      creator: '钱七',
      createTime: '2024-03-17 09:30:45',
      status: '通过'
    },
    {
      id: 'ATC008',
      name: '数据导入导出功能',
      application: '数据分析平台',
      creator: '周九',
      createTime: '2024-03-17 14:20:10',
      status: '通过'
    }
  ];
};

// 计算测试用例统计数据
export const calculateTestCaseStats = (testCases: TestCase[]): TestCaseStats => {
  const total = testCases.length;
  const completed = testCases.filter(tc => tc.status === '通过' || tc.status === '失败').length;
  const passed = testCases.filter(tc => tc.status === '通过').length;
  const failed = testCases.filter(tc => tc.status === '失败').length;
  const untested = testCases.filter(tc => tc.status === '未开始').length;
  
  return {
    total,
    completed,
    passed,
    failed,
    untested
  };
};

// 模拟产品验收测试环境测试总结分析
export const getAcceptanceTestEnvironmentSummary = (): string => {
  return `测试环境共执行了6个测试用例，其中4个通过，2个失败，1个未开始。\n\n通过的测试用例包括：登录功能验证、用户信息修改、角色权限分配、安全性测试。\n\n失败的测试用例为：数据报表生成、性能压力测试。\n\n未开始的测试用例为：兼容性测试。\n\n整体测试通过率为66.7%，需要重点关注失败的测试用例，并尽快修复相关问题。`;
};

// 模拟产品验收UAT环境测试总结分析
export const getAcceptanceUATEnvironmentSummary = (): string => {
  return `UAT环境共执行了8个测试用例，其中5个通过，1个失败，2个未开始。\n\n通过的测试用例包括：用户信息修改、性能压力测试、安全性测试、兼容性测试、数据导入导出功能。\n\n失败的测试用例为：角色权限分配。\n\n未开始的测试用例为：登录功能验证、数据报表生成。\n\n整体测试通过率为71.4%，需要重点关注失败的测试用例，并尽快修复相关问题。`;
};

// 模拟产品验收测试环境未测原因说明
export const getAcceptanceTestEnvironmentUntestedReason = (): string => {
  return `兼容性测试未开始的原因：\n1. 测试资源有限，优先测试了核心功能；\n2. 相关测试环境尚未完全准备就绪；\n3. 测试人员正在准备兼容性测试的具体方案。`;
};

// 模拟产品验收UAT环境未测原因说明
export const getAcceptanceUATEnvironmentUntestedReason = (): string => {
  return `登录功能验证和数据报表生成未开始的原因：\n1. 相关环境配置尚未完成；\n2. 测试团队正在处理其他紧急任务；\n3. 测试数据准备工作尚未完成。`;
};

// 模拟产品验收操作日志数据
export const getAcceptanceOperationLogs = (): OperationLog[] => {
  return [
    {
      time: '2024-03-10 09:00:00',
      user: '张三',
      action: '开始产品验收测试'
    },
    {
      time: '2024-03-10 10:15:30',
      user: '钱七',
      action: '执行登录功能验证，结果通过'
    },
    {
      time: '2024-03-10 10:20:15',
      user: '钱七',
      action: '执行用户信息修改测试，结果通过'
    },
    {
      time: '2024-03-10 11:30:45',
      user: '孙八',
      action: '执行角色权限分配测试，结果通过'
    },
    {
      time: '2024-03-10 14:20:10',
      user: '周九',
      action: '执行数据报表生成测试，结果失败'
    },
    {
      time: '2024-03-11 09:10:22',
      user: '吴十',
      action: '执行性能压力测试，结果失败'
    },
    {
      time: '2024-03-12 14:20:10',
      user: '吴十',
      action: '执行安全性测试，结果通过'
    },
    {
      time: '2024-03-15 09:00:00',
      user: '王五',
      action: '开始UAT环境验收测试'
    },
    {
      time: '2024-03-15 10:20:15',
      user: '钱七',
      action: '执行用户信息修改测试，结果通过'
    },
    {
      time: '2024-03-15 11:30:45',
      user: '孙八',
      action: '执行角色权限分配测试，结果失败'
    },
    {
      time: '2024-03-16 09:10:22',
      user: '吴十',
      action: '执行性能压力测试，结果通过'
    },
    {
      time: '2024-03-16 14:20:10',
      user: '吴十',
      action: '执行安全性测试，结果通过'
    },
    {
      time: '2024-03-17 09:30:45',
      user: '钱七',
      action: '执行兼容性测试，结果通过'
    },
    {
      time: '2024-03-17 14:20:10',
      user: '周九',
      action: '执行数据导入导出功能测试，结果通过'
    }
  ];
};