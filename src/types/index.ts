// 项目相关类型定义
export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  createTime: string;
  pm: string;
  progress: string; // 改为string类型，与MOCK_PROJECTS保持一致
  plannedDesignTime: string;
  plannedTestSubmitTime: string;
  plannedTestCompleteTime: string;
  plannedReleaseTime: string;
  plannedDuration: string;
  budget: string;
  changeType: string;
  relatedProduct: string;
  appCount: number;
  taskCount: TaskCount;
  projectDuration: number;
  defectCount: DefectCount;
  testCaseCount: TestCaseCount;
  workflow: WorkflowStep[];
  activities: Activity[];
  team: TeamMember[];
  // 添加缺失的字段
  plannedDelivery: string;
}

export type ProjectType = '日常项目' | '紧急项目' | '新项目';
export type ProjectStatus = '进行中' | '测试' | '设计' | '开发' | '预发布' | '完成';

export interface TaskCount {
  completed: number;
  total: number;
}

export interface DefectCount {
  resolved: number;
  total: number;
}

export interface TestCaseCount {
  executed: number;
  total: number;
}

export interface WorkflowStep {
  step: number;
  name: string;
  status: 'completed' | 'current' | 'pending';
  time: string;
}

export interface Activity {
  type: string;
  time: string;
  user: string;
  action: string;
}

export interface TeamMember {
  role: string;
  name: string;
  avatar: string;
  empId: string;
}

// 表格列配置类型
export interface TableColumn<T = any> {
  title: string;
  dataIndex?: keyof T; // 使dataIndex可选
  key: string;
  width?: number;
  render?: (text: any, record: T, index: number) => React.ReactNode;
}

// 搜索和过滤类型
export interface SearchFilters {
  searchText: string;
  filterType: string;
}

// 路由参数类型 - 修复类型约束
export interface RouteParams {
  id: string;
  [key: string]: string | undefined; // 添加索引签名
}

// 组件Props类型
export interface ProjectListProps {}

export interface ProjectDetailProps {}

export interface LayoutProps {
  children: React.ReactNode;
}

// 通用类型
export type StatusColor = 'processing' | 'warning' | 'blue' | 'orange' | 'red' | 'green' | 'default';
export type WorkflowStatusColor = '#52c41a' | '#faad14' | '#d9d9d9';
