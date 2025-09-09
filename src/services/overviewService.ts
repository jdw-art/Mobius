import { Project, RiskData } from '../types';

// 模拟项目详情数据
export const getProjectDetail = (id: string): Project => {
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
export const getRiskData = (): RiskData => {
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