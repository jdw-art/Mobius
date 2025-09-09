import { TestCase } from '../types';

// 模拟测试环境测试用例数据
export const getTestEnvironmentTestCases = (): TestCase[] => {
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
export const getUATEnvironmentTestCases = (): TestCase[] => {
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