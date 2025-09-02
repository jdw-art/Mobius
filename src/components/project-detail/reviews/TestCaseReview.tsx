import React, { useState, useEffect } from 'react';
import { Card, Row, Col, DatePicker, Button, Popconfirm, message, Progress } from 'antd';
import dayjs from 'dayjs';
import { getMockTestCaseReviewData, getMockOperationLogs, getMockUATEnvironmentTestCases } from '../../../services/mockData';
import ReviewProcessItem from '../../common/ReviewProcessItem';
import OperationLogList from '../../common/OperationLogList';
import type { TestCaseReviewInfo, ReviewProcess } from '../../../services/mockData';
import type { OperationLog } from '@/types';
import type { Dayjs } from 'dayjs';

interface TestCaseReviewProps {
  // 可以根据需要添加props
}

const TestCaseReview: React.FC<TestCaseReviewProps> = () => {
  // 评审信息状态
  const [reviewInfo, setReviewInfo] = useState<TestCaseReviewInfo>(getMockTestCaseReviewData());
  const [tempData, setTempData] = useState<Partial<TestCaseReviewInfo>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [reviewProcesses, setReviewProcesses] = useState<ReviewProcess[]>([]);
  const [operationLogs, setOperationLogs] = useState<OperationLog[]>([]);

  // 初始化数据
  useEffect(() => {
    // 获取模拟测试用例评审数据
    const mockTestCaseReviewData = getMockTestCaseReviewData();
    setReviewInfo(mockTestCaseReviewData);
    setTempData({ ...mockTestCaseReviewData });
    setReviewProcesses(mockTestCaseReviewData.reviewProcesses);
    
    // 获取操作日志数据
    const mockOperationLogs = getMockOperationLogs();
    setOperationLogs(mockOperationLogs);
  }, []);

  // 表单验证
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!tempData.plannedCompleteTime) {
      errors.plannedCompleteTime = '请选择计划完成时间';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 重置表单
  const handleReset = () => {
    setTempData({ ...reviewInfo });
    setFormErrors({});
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
    setReviewInfo(prev => ({
      ...prev,
      ...tempData
    }));

    setIsSubmitted(true);
    message.success('测试用例评审提交成功');
  };

  // 处理日期变化
  const handleDateChange = (value: Dayjs | null) => {
    if (value) {
      setTempData(prev => ({ ...prev, plannedCompleteTime: value.format('YYYY-MM-DD') }));
      // 清除对应字段的错误信息
      if (formErrors.plannedCompleteTime) {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.plannedCompleteTime;
          return newErrors;
        });
      }
    }
  };

  // 处理评论变化
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

  // 计算评审进度
  const calculateProgress = () => {
    const total = reviewProcesses.length;
    const approved = reviewProcesses.filter(p => p.status === 'approved').length;
    return total > 0 ? Math.round((approved / total) * 100) : 0;
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
                  onChange={handleDateChange}
                  placeholder="请选择日期"
                  style={{ display: 'inline-block', width: 'calc(80% - 140px)', fontSize: '15px' }}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
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
        
        {/* 第三行：测试用例数 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={24} style={{ fontSize: '15px' }}>
            <strong style={{ fontSize: '15px' }}>测试用例数：</strong>
            <span style={{ fontSize: '15px', color: '#1890ff' }}>{reviewInfo.testCaseCount}</span>
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
            <Col span={3} style={{ fontSize: '16px', fontWeight: 'bold' }}>
              测试用例评审
            </Col>
            <Col span={6}>
              <Progress percent={calculateProgress()} size="small" status="active" style={{ width: '75%' }} />
            </Col>
            <Col span={3} style={{ fontSize: '15px', textAlign: 'left' }}>
              <div style={{ marginTop: 4 }}>
                {reviewProcesses.filter(p => p.status === 'approved').length}/{reviewProcesses.length} 通过
              </div>
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

export default TestCaseReview;