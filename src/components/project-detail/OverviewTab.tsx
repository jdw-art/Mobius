import { useState, useEffect } from 'react';
import { Descriptions, Row, Col, Card, List, Progress } from 'antd';
import { getWorkflowMilestones } from '@/services/mockData';
import { statusUtils, dateUtils, calculationUtils } from '@/utils';
import { Project } from '@/types';

interface OverviewTabProps {
  projectData: Project;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ projectData }) => {
  // 将字符串进度转换为数字，用于进度条显示
  const getProgressNumber = (progressStr: string): number => {
    const progressMap: Record<string, number> = {
      '设计': 20,
      '开发': 40,
      '测试': 60,
      '预发布': 80,
      '进行中': 50
    };
    return progressMap[progressStr] || 0;
  };

  // 简化团队成员分组逻辑
  const getTeamByRole = () => {
    const roleMap = new Map<string, string[]>();
    projectData.team.forEach(member => {
      if (!roleMap.has(member.role)) {
        roleMap.set(member.role, []);
      }
      roleMap.get(member.role)!.push(`${member.name}_${member.empId}`);
    });
    return Array.from(roleMap.entries());
  };

  const renderWorkflow = () => {
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
                    background: statusUtils.getWorkflowStatusColor(step.status),
                    color: step.status === 'pending' ? '#666' : 'white'
                  }}
                >
                  {step.step}
                </div>
                <div className="workflow-node-text">
                  <div className="workflow-name">{step.name}</div>
                  <div className="workflow-time">
                    {(step.status === 'completed' || step.status === 'current') && step.time
                      ? (
                        <>
                          <div className="workflow-time-date">{dateUtils.formatDate(step.time)}</div>
                          <div className="workflow-time-clock">{dateUtils.formatTime(step.time)}</div>
                        </>
                      ) : (
                        '待开始'
                      )}
                  </div>
                </div>
              </div>

              {index < projectData.workflow.length - 1 && (
                <div className="workflow-segment">
                  <div className="workflow-line-horizontal" />
                  <div className="workflow-milestones">
                    {getWorkflowMilestones(step.step).map((m, i) => (
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
            <Progress 
              percent={calculationUtils.calculatePercentage(projectData.taskCount.completed, projectData.taskCount.total)} 
              size="small" 
            />
          </div>
          <div className="progress-item">
            <div className="progress-number">{projectData.progress}</div>
            <div className="progress-label">项目进展</div>
            <Progress percent={getProgressNumber(projectData.progress)} size="small" />
          </div>
          <div className="progress-item">
            <div className="progress-number">{projectData.projectDuration}</div>
            <div className="progress-label">项目进行时长（工作日）</div>
          </div>
          <div className="progress-item">
            <div className="progress-number">{projectData.defectCount.resolved}/{projectData.defectCount.total}</div>
            <div className="progress-label">缺陷（已处理/总数）</div>
            <Progress 
              percent={calculationUtils.calculatePercentage(projectData.defectCount.resolved, projectData.defectCount.total)} 
              size="small" 
            />
          </div>
          <div className="progress-item">
            <div className="progress-number">{projectData.testCaseCount.executed}/{projectData.testCaseCount.total}</div>
            <div className="progress-label">用例执行（已处理/总数）</div>
            <Progress 
              percent={calculationUtils.calculatePercentage(projectData.testCaseCount.executed, projectData.testCaseCount.total)} 
              size="small" 
            />
          </div>
        </div>
      </div>
    );
  };

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
        <div className="content-panel" style={{display:'flex',flexDirection:'column',height:'100%'}}>
          <div className="panel-title">动态</div>
          <List
            dataSource={projectData.activities}
            pagination={{ pageSize: 7, showSizeChanger: false }}
            renderItem={(item) => (
              <div className="activity-item">
                <div className="activity-line">
                  <span className="time">{item.time}</span>
                  <span className="user">{item.user}</span>
                  <span className="action">{item.action}</span>
                </div>
              </div>
            )}
          />
        </div>

        <div className="content-panel" style={{display:'flex',flexDirection:'column',height:'100%'}}>
          <div className="panel-title">团队</div>
          <div className="team-lines">
            {getTeamByRole().map(([role, members]) => (
              <div key={role} className="team-line">
                <span className="team-role">{role}:</span>
                <span className="team-members">
                  {members.join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;