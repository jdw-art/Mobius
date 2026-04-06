// 项目状态颜色映射
export const STATUS_COLOR_MAP: Record<string, string> = {
  '进行中': 'processing',
  '测试': 'warning',
  '设计': 'blue',
  '开发': 'processing',
  '预发布': 'orange',
  '完成': 'success'
};

// 项目类型颜色映射
export const PROJECT_TYPE_COLOR_MAP: Record<string, string> = {
  '日常项目': 'blue',
  '紧急项目': 'red',
  '新项目': 'green'
};

// 进展状态颜色映射
export const PROGRESS_COLOR_MAP: Record<string, string> = {
  '设计': 'blue',
  '开发': 'processing',
  '测试': 'warning',
  '预发布': 'orange',
  '进行中': 'processing'
};

// 工作流状态颜色映射
export const WORKFLOW_STATUS_COLOR_MAP: Record<string, string> = {
  'completed': '#52c41a',
  'current': '#faad14',
  'pending': '#d9d9d9'
};

// 项目类型选项
export const PROJECT_TYPE_OPTIONS = [
  { label: '全部类型', value: 'all' },
  { label: '日常项目', value: '日常项目' },
  { label: '紧急项目', value: '紧急项目' },
  { label: '新项目', value: '新项目' }
];

// 表格分页配置
export const TABLE_PAGINATION_CONFIG = {
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => 
    `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
};

// 模拟项目数据
export const MOCK_PROJECTS = [
  {
    id: 'PRJ001',
    name: '用户管理系统重构',
    type: '日常项目',
    pm: '张三',
    progress: '进行中',
    plannedDelivery: '2024-03-15',
    status: '进行中'
  },
  {
    id: 'PRJ002',
    name: '支付接口优化',
    type: '紧急项目',
    pm: '李四',
    progress: '测试',
    plannedDelivery: '2024-02-28',
    status: '测试'
  },
  {
    id: 'PRJ003',
    name: '移动端APP开发',
    type: '新项目',
    pm: '王五',
    progress: '设计',
    plannedDelivery: '2024-04-30',
    status: '设计'
  },
  {
    id: 'PRJ004',
    name: '数据库性能优化',
    type: '日常项目',
    pm: '赵六',
    progress: '开发',
    plannedDelivery: '2024-03-20',
    status: '开发'
  },
  {
    id: 'PRJ005',
    name: '安全漏洞修复',
    type: '紧急项目',
    pm: '钱七',
    progress: '预发布',
    plannedDelivery: '2024-02-25',
    status: '预发布'
  }
];
