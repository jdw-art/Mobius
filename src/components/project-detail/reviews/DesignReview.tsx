import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button, Input, DatePicker, message, Popconfirm, Progress } from 'antd';
import dayjs from 'dayjs';
import { getMockDesignReviewData, ReviewProcess, getMockOperationLogs } from '@/services/mockData';
import OperationLogList from '../../common/OperationLogList';
import ReviewProcessItem from '../../common/ReviewProcessItem';
import type { OperationLog } from '../../../types';

const { Link } = Typography;
const { TextArea } = Input;

export interface DesignReviewInfo {
  title: string;
  projectId: string;
  requirementId: string;
  creator: string;
  createTime: string;
  updateTime: string;
  plannedCompleteTime: string;
  designDocumentLink: string;
  reviewProcesses?: ReviewProcess[];
}

interface DesignReviewProps {
  // 可以根据需要添加props
}

const DesignReview: React.FC<DesignReviewProps> = () => {
  // 获取设计评审数据
  const initialReviewInfo = getMockDesignReviewData();
  const [reviewInfo, setReviewInfo] = useState<DesignReviewInfo>(initialReviewInfo);
  const [reviewProcesses, setReviewProcesses] = useState<ReviewProcess[]>(initialReviewInfo.reviewProcesses || []);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [tempData, setTempData] = useState<Partial<DesignReviewInfo>>({
    title: initialReviewInfo.title,
    plannedCompleteTime: initialReviewInfo.plannedCompleteTime,
    designDocumentLink: initialReviewInfo.designDocumentLink
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [operationLogs] = useState<OperationLog[]>(getMockOperationLogs());

  // 重置表单
  const handleReset = () => {
    setTempData({
      title: '',
      plannedCompleteTime: '',
      designDocumentLink: ''
    });
    setFormErrors({});
  };

  // 验证表单
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!tempData.title?.trim()) {
      errors.title = '请输入标题';
    }
    
    if (!tempData.plannedCompleteTime) {
      errors.plannedCompleteTime = '请选择计划完成时间';
    }
    
    if (!tempData.designDocumentLink?.trim()) {
      errors.designDocumentLink = '请输入设计文档链接';
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
    setReviewInfo(prev => ({
      ...prev,
      ...tempData,
      updateTime: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(/\//g, '-')
    }));

    setIsSubmitted(true);
    message.success('设计评审提交成功');
  };

  // 处理输入变化
  const handleInputChange = (field: keyof Partial<DesignReviewInfo>, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误信息
    if (formErrors[field]) {
      setFormErrors(prev => {
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
        {/* 第一行：评审标题 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={24} style={{ fontSize: '15px' }}>
            <strong style={{ fontSize: '15px' }}>标题：</strong>
            {!isSubmitted && <span style={{ color: 'red', marginRight: 4 }}>*</span>}
            {!isSubmitted ? (
              <>
                <Input
                  value={tempData.title || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)}
                  placeholder="请输入评审标题"
                  style={{ display: 'inline-block', width: 'calc(100% - 60px)', marginLeft: 4, fontSize: '15px' }}
                />
                {formErrors.title && (
                  <div style={{ color: 'red', fontSize: '12px', marginTop: 4 }}>
                    {formErrors.title}
                  </div>
                )}
              </>
            ) : (
              <span style={{ fontSize: '15px' }}>{reviewInfo.title}</span>
            )}
          </Col>
        </Row>
        
        {/* 第二行：创建人、项目ID、需求ID */}
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
        
        {/* 第三行：创建时间、更新时间、计划完成时间 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8} style={{ fontSize: '15px' }}>
            <strong style={{ fontSize: '15px' }}>创建时间：</strong>
            <span style={{ fontSize: '15px' }}>{reviewInfo.createTime}</span>
          </Col>
          <Col span={8} style={{ fontSize: '15px' }}>
            <strong style={{ fontSize: '15px' }}>更新时间：</strong>
            <span style={{ fontSize: '15px' }}>{reviewInfo.updateTime}</span>
          </Col>
          <Col span={8} style={{ fontSize: '15px' }}>
            <strong style={{ fontSize: '15px' }}>计划完成时间：</strong>
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
        
        {/* 第四行：设计文档链接 */}
        <Row gutter={16}>
          <Col span={24} style={{ fontSize: '15px' }}>
            <strong style={{ fontSize: '15px' }}>设计文档链接：</strong>
            {!isSubmitted && <span style={{ color: 'red', marginRight: 4 }}>*</span>}
            {!isSubmitted ? (
              <>
                <Input
                  value={tempData.designDocumentLink || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('designDocumentLink', e.target.value)}
                  placeholder="请输入设计文档链接"
                  style={{ display: 'inline-block', width: 'calc(100% - 120px)', marginLeft: 4, fontSize: '15px' }}
                />
                {formErrors.designDocumentLink && (
                  <div style={{ color: 'red', fontSize: '12px', marginTop: 4 }}>
                    {formErrors.designDocumentLink}
                  </div>
                )}
              </>
            ) : (
              <Link href={reviewInfo.designDocumentLink} target="_blank" style={{ fontSize: '15px' }}>
                {reviewInfo.designDocumentLink}
              </Link>
            )}
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
              设计评审
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

export default DesignReview;