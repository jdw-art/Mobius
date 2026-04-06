import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Input, DatePicker, message, Popconfirm, Progress, Select } from 'antd';
import dayjs from 'dayjs';
import { getCodeReviewData } from '../../../services/reviewsService';
import { getOperationLogs } from '../../../services/commonService';
import OperationLogList from '../../common/OperationLogList';
import ReviewProcessItem from '../../common/ReviewProcessItem';
import type { OperationLog } from '../../../types';

const { Link } = Typography;
const { TextArea } = Input;

export interface ReviewProcess {
  id: string;
  title: string;
  description?: string;
  status?: 'pending' | 'approved' | 'rejected';
  reviewers?: string[];
  reviewTime?: string;
  comment?: string;
  commentEditable?: boolean;
}

export interface CodeReviewInfo {
  projectId: string;
  requirementId: string;
  creator: string;
  createTime: string;
  plannedCompleteTime: string;
  codeBranch: string;
  codeBranches?: string[];
  reviewProcesses?: ReviewProcess[];
}

interface CodeReviewProps {
  // 可以根据需要添加props
}

const CodeReview: React.FC<CodeReviewProps> = () => {
  // 获取代码评审数据
  const initialReviewInfo = getCodeReviewData();
  const [reviewInfo, setReviewInfo] = useState<CodeReviewInfo>(initialReviewInfo);
  const [reviewProcesses, setReviewProcesses] = useState<ReviewProcess[]>(initialReviewInfo.reviewProcesses || []);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [tempData, setTempData] = useState<Partial<CodeReviewInfo>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [operationLogs] = useState<OperationLog[]>(getOperationLogs());

  // 重置表单
  const handleReset = () => {
    setTempData({
      plannedCompleteTime: ''
    });
    setFormErrors({});
  };

  // 验证表单
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!tempData.plannedCompleteTime) {
      errors.plannedCompleteTime = '请选择计划完成时间';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 确认提交浮层提示
  const handleConfirmSubmitWithValidation = () => {
    if (!validateForm()) {
      return false;
    }
    handleConfirmSubmit();
    return true;
  };

  // 提交修改
  const handleConfirmSubmit = () => {
    // 更新评审信息
    setReviewInfo((prev: CodeReviewInfo) => ({
      ...prev,
      ...tempData
    }));

    setIsSubmitted(true);
    message.success('代码评审提交成功');
  };

  // 处理输入变化
  const handleInputChange = (field: string, value: string) => {
    setTempData((prev: Partial<CodeReviewInfo>) => ({ ...prev, [field]: value }));
    // 清除对应字段的错误信息
    if (formErrors[field]) {
      setFormErrors((prev: Record<string, string>) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // 处理日期选择
  const handleDateChange = (date: any) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD');
      handleInputChange('plannedCompleteTime', formattedDate);
    } else {
      handleInputChange('plannedCompleteTime', '');
    }
  };

  // 处理评论输入变化
  const handleCommentChange = (processId: string, comment: string) => {
    setReviewProcesses(prev => 
      prev.map(process => 
        process.id === processId ? { ...process, comment } : process
      )
    );
  };

  // 处理催一下操作
  const handleReminder = (processId: string) => {
    message.info('已发送提醒');
  };

  // 处理评审操作（通过/驳回）
  const handleReviewAction = (processId: string, status: 'approved' | 'rejected') => {
    setReviewProcesses(prev => 
      prev.map(process => {
        if (process.id === processId) {
          // 如果评审意见为空，则自动设置为"【无】"
          const finalComment = process.comment || '无';
          return { ...process, status, comment: finalComment, commentEditable: false };
        }
        return process;
      })
    );
    message.success(`${status === 'approved' ? '已通过' : '已驳回'}评审`);
  };

  return (
    <div>
      {/* 评审基本信息卡片 */}
      <Card className="review-card" style={{ marginBottom: 24 }}>
        {/* 第一行：创建人、项目ID、需求ID */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8} style={{ fontSize: '15px' }}>
            <strong style={{ fontSize: '15px' }}>创建人：</strong>
            <span style={{ fontSize: '15px' }}>{reviewInfo.creator}</span>
          </Col>
          <Col span={8} style={{ fontSize: '15px' }}>
            <strong style={{ fontSize: '15px' }}>项目ID：</strong>
            <span style={{ fontSize: '15px' }}>{reviewInfo.projectId}</span>
          </Col>
          <Col span={8} style={{ fontSize: '15px' }}>
            <strong style={{ fontSize: '15px' }}>需求ID：</strong>
            <span style={{ fontSize: '15px' }}>{reviewInfo.requirementId}</span>
          </Col>
        </Row>
        
        {/* 第二行：创建时间、计划完成时间 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={16} style={{ fontSize: '15px' }}>
            <strong style={{ fontSize: '15px' }}>创建时间：</strong>
            <span style={{ fontSize: '15px' }}>{reviewInfo.createTime}</span>
          </Col>
          <Col span={8} style={{ fontSize: '15px', display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
            <strong style={{ fontSize: '15px', marginRight: 8, whiteSpace: 'nowrap' }}>计划完成时间：</strong>
            {!isSubmitted && <span style={{ color: 'red', marginRight: 4 }}>*</span>}
            {!isSubmitted ? (
              <>
                <DatePicker
                  value={tempData.plannedCompleteTime ? 
                    dayjs(tempData.plannedCompleteTime) : null}
                  onChange={handleDateChange}
                  placeholder="请选择日期"
                  style={{ display: 'inline-block', width: 'calc(80% - 140px)' }}
                  format="YYYY-MM-DD"
                />
                {formErrors.plannedCompleteTime && (
                  <div style={{ color: 'red', fontSize: '12px', marginTop: 4 }}>
                    {formErrors.plannedCompleteTime}
                  </div>
                )}
              </>
            ) : (
              <span style={{ fontSize: '15px' }}>{reviewInfo.plannedCompleteTime}</span>
            )}
          </Col>
        </Row>
        
        {/* 第三行：代码分支 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={24} style={{ fontSize: '15px', display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
            <strong style={{ fontSize: '15px', marginRight: 8 }}>代码分支：</strong>
            <Select
              value={reviewInfo.codeBranch}
              style={{ width: 300 }}
              disabled={false}
              onChange={(value) => setReviewInfo(prev => ({ ...prev, codeBranch: value }))}
              options={reviewInfo.codeBranches?.map(branch => ({
                value: branch,
                label: branch
              })) || []}
            />
          </Col>
        </Row>
        
        {/* 提交和重置按钮 */}
        {!isSubmitted && (
          <Row style={{ marginTop: 24, justifyContent: 'flex-start' }}>
            <Popconfirm
              title="确认提交"
              onConfirm={handleConfirmSubmitWithValidation}
              okText="确定"
              cancelText="取消"
              placement="topRight"
            >
              <Button 
                type="primary" 
                size="small" 
                style={{ marginRight: 8 }}
              >
                提交
              </Button>
            </Popconfirm>
            <Button 
              size="small" 
              onClick={handleReset}
            >
              重置
            </Button>
          </Row>
        )}
      </Card>

      {/* 评审流程卡片 - 仅在提交确认后显示 */}
      {isSubmitted && (
        <Card className="review-card" style={{ marginBottom: 24 }}>
          <Row gutter={16} style={{ alignItems: 'center', marginBottom: 24 }}>
            <Col span={2} style={{ fontSize: '16px', fontWeight: 'bold' }}>
              代码评审
            </Col>
            <Col span={6}>
              <Progress percent={60} size="small" status="active" style={{ width: '75%' }} />
            </Col>
            <Col span={3} style={{ fontSize: '15px', textAlign: 'left' }}>
              <div style={{ marginTop: 4 }}>3/5 通过</div>
            </Col>
            <Col span={7} style={{ fontSize: '15px', textAlign: 'left' }}>
              <span>期望完成时间：</span>
              <span>{reviewInfo.plannedCompleteTime}</span>
            </Col>
          </Row>
          
          {reviewProcesses.map((process, index) => (
            <ReviewProcessItem
              key={process.id}
              process={process}
              index={index}
              totalLength={reviewProcesses.length}
              onCommentChange={handleCommentChange}
              onReminder={handleReminder}
              onReviewAction={handleReviewAction}
            />
          ))}
        </Card>
      )}

      {/* 操作日志卡片 */}
      <Row gutter={16} style={{ marginBottom: 5 }}>
          <Col span={24} style={{ fontSize: '16px', fontWeight: 'bold' }}>
          </Col>
        </Row>
        <OperationLogList logs={operationLogs} />
    </div>
  );
};

export default CodeReview;