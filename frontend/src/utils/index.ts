import dayjs from 'dayjs';
import { STATUS_COLOR_MAP, PROJECT_TYPE_COLOR_MAP, PROGRESS_COLOR_MAP, WORKFLOW_STATUS_COLOR_MAP } from '@/constants';

// 日期时间格式化工具
export const dateUtils = {
  // 标准化日期时间
  normalizeDateTime: (value: string | null | undefined): dayjs.Dayjs | null => {
    if (!value) return null;
    const trimmed = String(value).trim();
    const hasMinutesOnly = /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}$/.test(trimmed);
    const candidate = hasMinutesOnly ? `${trimmed}:00` : trimmed;
    const parsed = dayjs(candidate);
    return parsed.isValid() ? parsed : null;
  },

  // 格式化日期
  formatDate: (value: string | null | undefined): string => {
    const d = dateUtils.normalizeDateTime(value);
    return d ? d.format('YYYY-MM-DD') : '';
  },

  // 格式化时间
  formatTime: (value: string | null | undefined): string => {
    const d = dateUtils.normalizeDateTime(value);
    return d ? d.format('HH:mm:ss') : '';
  },

  // 格式化日期时间
  formatDateTime: (value: string | null | undefined): string => {
    const d = dateUtils.normalizeDateTime(value);
    return d ? d.format('YYYY-MM-DD HH:mm:ss') : '';
  }
};

// 状态颜色工具
export const statusUtils = {
  // 获取项目状态颜色
  getProjectStatusColor: (status: string): string => {
    return STATUS_COLOR_MAP[status] || 'default';
  },

  // 获取项目类型颜色
  getProjectTypeColor: (type: string): string => {
    return PROJECT_TYPE_COLOR_MAP[type] || 'blue';
  },

  // 获取进展状态颜色
  getProgressColor: (progress: string): string => {
    return PROGRESS_COLOR_MAP[progress] || 'default';
  },

  // 获取工作流状态颜色
  getWorkflowStatusColor: (status: string): string => {
    return WORKFLOW_STATUS_COLOR_MAP[status] || '#d9d9d9';
  }
};

// 数据过滤工具
export const filterUtils = {
  // 过滤项目列表
  filterProjects: (
    projects: any[],
    searchText: string,
    filterType: string
  ): any[] => {
    return projects.filter(project => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchText.toLowerCase()) ||
        project.id.toLowerCase().includes(searchText.toLowerCase()) ||
        project.pm.toLowerCase().includes(searchText.toLowerCase());
      const matchesType = filterType === 'all' || project.type === filterType;
      return matchesSearch && matchesType;
    });
  }
};

// 计算工具
export const calculationUtils = {
  // 计算百分比
  calculatePercentage: (completed: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  },

  // 计算工作日
  calculateWorkDays: (startDate: string, endDate: string): number => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    let workDays = 0;
    let current = start.clone();
    
    while (current.isBefore(end) || current.isSame(end, 'day')) {
      if (current.day() !== 0 && current.day() !== 6) {
        workDays++;
      }
      current = current.add(1, 'day');
    }
    
    return workDays;
  }
};
