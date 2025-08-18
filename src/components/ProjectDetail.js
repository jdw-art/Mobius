import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  Button, 
  Tag, 
  Progress, 
  Avatar, 
  Space,
  Descriptions,
  Row,
  Col,
  Card,
  List,
  Divider
} from 'antd';
import { 
  ClockCircleOutlined, 
  EditOutlined, 
  MoreOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // 模拟项目数据
  const projectData = {
    id: 'PRJ001',
    name: '用户管理系统重构',
    type: '日常项目',
    status: '进行中',
    createTime: '2024-01-15',
    pm: '张三',
    progress: 65,
    plannedDesignTime: '2024-01-25',
    plannedTestSubmitTime: '2024-02-15',
    plannedTestCompleteTime: '2024-02-25',
    plannedReleaseTime: '2024-03-05',
    plannedDuration: '45个工作日',
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
      { type: '测试', time: '2024-02-10 14:00', user: '钱七', action: '开始单元测试' }
    ],
    team: [
      { role: '产品负责人', name: '张三', avatar: '张' },
      { role: '开发负责人', name: '李四', avatar: '李' },
      { role: 'PM', name: '王五', avatar: '王' },
      { role: '开发', name: '赵六', avatar: '赵' },
      { role: '测试', name: '钱七', avatar: '钱' },
      { role: '运维', name: '孙八', avatar: '孙' },
      { role: '预发布验证', name: '周九', avatar: '周' },
      { role: '生产验证', name: '吴十', avatar: '吴' }
    ]
  };

  const getStatusColor = (status) => {
    const colorMap = {
      '进行中': 'processing',
      '测试': 'warning',
      '设计': 'blue',
      '开发': 'processing',
      '预发布': 'orange'
    };
    return colorMap[status] || 'default';
  };

  const getWorkflowStatusColor = (status) => {
    const colorMap = {
      'completed': '#52c41a',
      'current': '#faad14',
      'pending': '#d9d9d9'
    };
    return colorMap[status] || '#d9d9d9';
  };

  const renderWorkflow = () => {
    const getSegmentMilestones = (fromStep) => {
      switch (fromStep) {
        case 1:
          return ['1. 设计评审'];
        case 2:
          return ['1. 代码扫描', '2. 提测', '3. 冒烟测试', '4. 代码评审', '5. 单元测试'];
        case 3:
          return ['1. 测试完成', '2. 产品验收'];
        case 4:
          return ['1. 预发验证'];
        case 5:
          return ['1. 生产验证'];
        default:
          return [];
      }
    };

    return (
      <div className="workflow-container">
        <h3>流程状态图</h3>
        <div className="workflow-horizontal">
          {projectData.workflow.map((step, index) => (
            <div className="workflow-item" key={step.step}>
              <div className="workflow-node-wrap">
                <div
                  className="workflow-node small"
                  style={{
                    background: getWorkflowStatusColor(step.status),
                    color: step.status === 'pending' ? '#666' : 'white'
                  }}
                >
                  {step.step}
                </div>
                <div className="workflow-node-text">
                  <div className="workflow-name">{step.name}</div>
                  <div className="workflow-time">
                    {step.status === 'completed' || step.status === 'current'
                      ? step.time
                      : '待开始'}
                  </div>
                </div>
              </div>

              {index < projectData.workflow.length - 1 && (
                <div className="workflow-segment">
                  <div className="workflow-line-horizontal" />
                  <div className="workflow-milestones">
                    {getSegmentMilestones(step.step).map((m, i) => (
                      <div key={i} className="workflow-milestone">{m}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProgressSection = () => {
    return (
      <div className="progress-section">
        <h3>项目进度</h3>
        <div className="progress-grid">
          <div className="progress-item">
            <div className="progress-number">{projectData.appCount}</div>
            <div className="progress-label">应用数</div>
          </div>
          <div className="progress-item">
            <div className="progress-number">{projectData.taskCount.completed}/{projectData.taskCount.total}</div>
            <div className="progress-label">任务数（已完成/总数）</div>
            <Progress percent={Math.round((projectData.taskCount.completed / projectData.taskCount.total) * 100)} size="small" />
          </div>
          <div className="progress-item">
            <div className="progress-number">{projectData.progress}%</div>
            <div className="progress-label">项目进展</div>
            <Progress percent={projectData.progress} size="small" />
          </div>
          <div className="progress-item">
            <div className="progress-number">{projectData.projectDuration}</div>
            <div className="progress-label">项目进行时长（工作日）</div>
          </div>
          <div className="progress-item">
            <div className="progress-number">{projectData.defectCount.resolved}/{projectData.defectCount.total}</div>
            <div className="progress-label">缺陷（已处理/总数）</div>
            <Progress percent={Math.round((projectData.defectCount.resolved / projectData.defectCount.total) * 100)} size="small" />
          </div>
          <div className="progress-item">
            <div className="progress-number">{projectData.testCaseCount.executed}/{projectData.testCaseCount.total}</div>
            <div className="progress-label">用例执行（已处理/总数）</div>
            <Progress percent={Math.round((projectData.testCaseCount.executed / projectData.testCaseCount.total) * 100)} size="small" />
          </div>
        </div>
      </div>
    );
  };

  const renderOverviewTab = () => {
    return (
      <div>
        {/* 项目基本信息 */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={24}>
            <Col span={8}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="计划设计完成时间">{projectData.plannedDesignTime}</Descriptions.Item>
                <Descriptions.Item label="资金安全">{projectData.budget}</Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={8}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="计划提交测试时间">{projectData.plannedTestSubmitTime}</Descriptions.Item>
                <Descriptions.Item label="变更类型">{projectData.changeType}</Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={8}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="计划测试完成时间">{projectData.plannedTestCompleteTime}</Descriptions.Item>
                <Descriptions.Item label="关联产品">{projectData.relatedProduct}</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
          <Row gutter={24} style={{ marginTop: 16 }}>
            <Col span={8}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="计划发布完成时间">{projectData.plannedReleaseTime}</Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={8}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="计划工期">{projectData.plannedDuration}</Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={8}>
              {/* 预留空间保持对齐 */}
            </Col>
          </Row>
        </Card>

        {/* 流程状态图 */}
        {renderWorkflow()}

        {/* 项目进度 */}
        {renderProgressSection()}

        {/* 动态和团队 */}
        <div className="content-split">
          <div className="content-panel">
            <div className="panel-title">动态</div>
            <List
              dataSource={projectData.activities}
              renderItem={(item) => (
                <div className="activity-item">
                  <div className="activity-icon">
                    {item.type === '创建' && <CheckCircleOutlined />}
                    {item.type === '设计' && <EditOutlined />}
                    {item.type === '开发' && <PlayCircleOutlined />}
                    {item.type === '测试' && <ExclamationCircleOutlined />}
                  </div>
                  <div className="activity-content">
                    <div className="activity-action">{item.user} {item.action}</div>
                    <div className="activity-time">{item.time}</div>
                  </div>
                </div>
              )}
            />
          </div>

          <div className="content-panel">
            <div className="panel-title">团队</div>
            <List
              dataSource={projectData.team}
              renderItem={(item) => (
                <div className="team-member">
                  <Avatar style={{ backgroundColor: '#1890ff' }} className="member-avatar">
                    {item.avatar}
                  </Avatar>
                  <div className="member-info">
                    <div className="member-name">{item.name}</div>
                    <div className="member-role">{item.role}</div>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* 项目头部 */}
      <div className="project-header">
        <div>
          <div className="project-title">{projectData.id} - {projectData.name}</div>
          <div className="project-subtitle">创建时间：{projectData.createTime}</div>
        </div>
        <div className="project-actions">
          <Tag color={getStatusColor(projectData.status)}>{projectData.status}</Tag>
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
          {renderOverviewTab()}
        </TabPane>
        <TabPane tab="任务" key="tasks">
          <div>任务管理页面</div>
        </TabPane>
        <TabPane tab="需求" key="requirements">
          <div>需求管理页面</div>
        </TabPane>
        <TabPane tab="应用" key="applications">
          <div>应用管理页面</div>
        </TabPane>
        <TabPane tab="产品验收" key="acceptance">
          <div>产品验收页面</div>
        </TabPane>
        <TabPane tab="测试缺陷" key="defects">
          <div>测试缺陷页面</div>
        </TabPane>
        <TabPane tab="评审" key="review">
          <div>评审页面</div>
        </TabPane>
        <TabPane tab="文档" key="documents">
          <div>文档管理页面</div>
        </TabPane>
        <TabPane tab="风险" key="risks">
          <div>风险管理页面</div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
