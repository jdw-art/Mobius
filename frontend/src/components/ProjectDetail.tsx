import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Button, Tag } from 'antd';
import { ClockCircleOutlined, EditOutlined, MoreOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { getProjectDetail } from '@/services/overviewService';
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

const ProjectDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [projectData, setProjectData] = useState<Project | null>(null);

  useEffect(() => {
    if (id) {
      const data = getProjectDetail(id);
      setProjectData(data);
    }
  }, [id]);

  if (!projectData) {
    return <div>加载中...</div>;
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
            <RequirementsTab />
          </TabPane>
          <TabPane tab="应用" key="applications">
            <ApplicationsTab />
          </TabPane>
          <TabPane tab="构建列表" key="builds">
            <BuildsTab />
          </TabPane>
          <TabPane tab="产品验收" key="acceptance">
            <AcceptanceTab />
          </TabPane>
          <TabPane tab="测试缺陷" key="defects">
            <DefectsTab />
          </TabPane>
          <TabPane tab="评审" key="review">
            <ReviewTab />
          </TabPane>
          <TabPane tab="文档" key="documents">
            <DocumentsTab />
          </TabPane>
          <TabPane tab="风险" key="risks">
            <RisksTab />
          </TabPane>
        </Tabs>
      </div>
    );
};

export default ProjectDetail;
