import { request } from '../utils/request';

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

export interface TeamMemberResponse {
  id: string;
  projectId: string;
  role: string;
  name: string;
  avatar: string;
  empId: string;
}

export interface WorkflowStepResponse {
  id: string;
  projectId: string;
  step: number;
  name: string;
  status: string;
  time: string | null;
}

export interface ActivityResponse {
  id: string;
  projectId: string;
  type: string;
  time: string;
  user: string;
  action: string;
}

export interface ProjectListItem {
  id: string;
  name: string;
  type: string;
  status: string;
  pm: string;
  progress: string;
  createTime: string;
}

export interface ProjectDetail extends ProjectListItem {
  appCount: number;
  projectDuration: number;
  plannedDesignTime?: string;
  plannedTestSubmitTime?: string;
  plannedTestCompleteTime?: string;
  plannedReleaseTime?: string;
  plannedDelivery?: string;
  plannedDuration?: string;
  budget?: string;
  changeType?: string;
  relatedProduct?: string;
  taskCount?: TaskCount;
  defectCount?: DefectCount;
  testCaseCount?: TestCaseCount;
  teamMembers?: TeamMemberResponse[];
  workflowSteps?: WorkflowStepResponse[];
  activities?: ActivityResponse[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export const projectService = {
  getProjects: async (page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<ProjectListItem>> => {
    const response = await request.get('/api/v1/projects', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  getProject: async (id: string): Promise<ProjectDetail> => {
    const response = await request.get(`/api/v1/projects/${id}`);
    return response.data;
  },
};
