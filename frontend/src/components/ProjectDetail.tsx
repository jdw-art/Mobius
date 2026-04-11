import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Button, Tag } from 'antd';
import { ClockCircleOutlined, EditOutlined, MoreOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { projectService, ProjectDetail as ProjectDetailType } from '@/services/projectService';
import { statusUtils } from '@/utils';
import { Project, RouteParams } from '@/types';
import OverviewTab from './project-detail/OverviewTab';
import RequirementsTab from './project-detail/RequirementsTab';
import ApplicationsTab from './project-detail/ApplicationsTab';
import BuildsTab from './project-detail/BuildsTab';
import AcceptanceTab from './project-detail/AcceptanceTab';
import DefectsTab from './project-detail/DefectsTab';
import ReviewTab from './project-detail/ReviewTab';
import DocumentsTab from './project-detail/DocumentsTab';
import RisksTab from './project-detail/RisksTab';

const { TabPane } = Tabs;

// Transform API response to Project type
const transformProjectDetail = (apiData: ProjectDetailType): Project => {
  return {
    id: apiData.id,
    name: apiData.name,
    type: apiData.type as Project['type'],
    status: apiData.status as Project['status'],
    createTime: apiData.createTime,
    pm: apiData.pm,
    progress: apiData.progress,
    plannedDesignTime: apiData.plannedDesignTime || '',
    plannedTestSubmitTime: apiData.plannedTestSubmitTime || '',
    plannedTestCompleteTime: apiData.plannedTestCompleteTime || '',
    plannedReleaseTime: apiData.plannedReleaseTime || '',
    plannedDuration: apiData.plannedDuration || '',
    plannedDelivery: apiData.plannedDelivery || '',
    budget: apiData.budget || '',
    changeType: apiData.changeType || '',
    relatedProduct: apiData.relatedProduct || '',
    appCount: apiData.appCount || 0,
    projectDuration: apiData.projectDuration || 0,
    taskCount: apiData.taskCount || { completed: 0, total: 0 },
    defectCount: apiData.defectCount || { resolved: 0, total: 0 },
    testCaseCount: apiData.testCaseCount || { executed: 0, total: 0 },
    workflow: (apiData.workflowSteps || []).map((step: any) => ({
      step: step.step,
      name: step.name,
      status: step.status,
      time: step.time || '',
    })),
    activities: (apiData.activities || []).map((act: any) => ({
      type: act.type,
      time: act.time,
      user: act.user,
      action: act.action,
    })),
    team: (apiData.teamMembers || []).map((member: any) => ({
      role: member.role,
      name: member.name,
      avatar: member.avatar || member.name[0],
      empId: member.empId,
    })),
  };
};

const ProjectDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      projectService.getProject(id)
        .then((data) => {
          setProjectData(transformProjectDetail(data));
        })
        .catch((error) => {
          console.error('Failed to load project:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!projectData) {
    return <div>项目不存在</div>;
  }

  return (
      <div>
        {/* 项目头部 */}
        <div className="project-header">
          <div>
            <div className="project-title">{projectData.id} - {projectData.name}</div>
            <div className="project-subtitle">创建时间：{projectData.createTime}</div>
          </div>
          <div className="project-actions">
            <Tag color={statusUtils.getProjectStatusColor(projectData.status)}>{projectData.status}</Tag>
            <Tag color="blue">{projectData.type}</Tag>
            <Button icon={<PauseCircleOutlined />}>挂起</Button>
            <Button icon={<ClockCircleOutlined />}>变更时间</Button>
            <Button icon={<EditOutlined />}>编辑</Button>
            <Button icon={<MoreOutlined />}>更多</Button>
          </div>
        </div>

        {/* 标签页 */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="概况" key="overview">
            <OverviewTab projectData={projectData} />
          </TabPane>
          <TabPane tab="需求" key="requirements">
            <RequirementsTab projectId={id!} />
          </TabPane>
          <TabPane tab="应用" key="applications">
            <ApplicationsTab projectId={id!} />
          </TabPane>
          <TabPane tab="构建列表" key="builds">
            <BuildsTab projectId={id!} />
          </TabPane>
          <TabPane tab="产品验收" key="acceptance">
            <AcceptanceTab />
          </TabPane>
          <TabPane tab="测试缺陷" key="defects">
            <DefectsTab projectId={id!} />
          </TabPane>
          <TabPane tab="评审" key="review">
            <ReviewTab projectId={id!} />
          </TabPane>
          <TabPane tab="文档" key="documents">
            <DocumentsTab projectId={id!} />
          </TabPane>
          <TabPane tab="风险" key="risks">
            <RisksTab projectId={id!} />
          </TabPane>
        </Tabs>
      </div>
    );
};

export default ProjectDetail;
