import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, DatePicker, message, Popconfirm, Progress, Table, Checkbox, Input, Form, Space } from 'antd';
import dayjs from 'dayjs';
import { getReleaseReviewData, getReleaseVerificationData } from '../../../services/reviewsService';
import { getOperationLogs } from '../../../services/commonService';
import { getRiskData } from '../../../services/overviewService';
import OperationLogList from '../../common/OperationLogList';
import ReviewProcessItem from '../../common/ReviewProcessItem';
import type { OperationLog, RiskData, RiskItem } from '../../../types';

// 定义需要的类型
interface ReviewProcess {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewers: string[];
  reviewTime: string;
  comment?: string;
  commentEditable: boolean;
}

interface ReleaseReviewInfo {
  projectId: string;
  requirementId: string;
  creator: string;
  createTime: string;
  preReleaseTime: string;
  prodReleaseTime: string;
  plannedCompleteTime: string;
  reviewProcesses?: ReviewProcess[];
}

interface ReleaseVerificationData {
  type: string;
  processed: number;
  total: number;
  rate: string;
}

const { Link } = Typography;

interface ReleaseReviewProps {
  // 可以根据需要添加props
}

const ReleaseReview: React.FC<ReleaseReviewProps> = () => {
  // 获取发布评审数据
  const initialReviewInfo = getReleaseReviewData();
  const [reviewInfo, setReviewInfo] = useState<ReleaseReviewInfo>(initialReviewInfo);
  const [reviewProcesses, setReviewProcesses] = useState<ReviewProcess[]>(initialReviewInfo.reviewProcesses || []);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [tempData, setTempData] = useState<Partial<ReleaseReviewInfo>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [operationLogs] = useState<OperationLog[]>(getOperationLogs());
  const [riskData, setRiskData] = useState<RiskData>({ riskItems: [] });
  const [form] = Form.useForm();
  const [verificationData, setVerificationData] = useState<ReleaseVerificationData[]>([]);

  // 获取风险数据
  useEffect(() => {
    const data = getRiskData();
    setRiskData(data);
  }, []);

  // 获取发布验证数据
  useEffect(() => {
    const data = getReleaseVerificationData();
    setVerificationData(data);
  }, []);

  // 处理风险认定变更
  const handleRiskStatusChange = (id: string, status: 'yes' | 'no' | undefined) => {
    setRiskData((prev: RiskData) => ({
      ...prev,
      riskItems: prev.riskItems.map((item: RiskItem) => 
        item.id === id ? { ...item, riskStatus: status } : item
      )
    }));
  };

  // 处理备注变更
  const handleRemarkChange = (id: string, remark: string) => {
    setRiskData((prev: RiskData) => ({
      ...prev,
      riskItems: prev.riskItems.map((item: RiskItem) => 
        item.id === id ? { ...item, remark } : item
      )
    }));
  };

  // 计算相同风险类型的单元格合并信息
  const getRowSpanConfig = (dataSource: RiskItem[]): number[] => {
    const rowSpanMap: Record<string, number> = {};
    const rowSpanArray: number[] = [];
    const skipMap: Record<number, boolean> = {};

    // 统计每种风险类型出现的次数
    dataSource.forEach((item: RiskItem) => {
      rowSpanMap[item.riskType] = (rowSpanMap[item.riskType] || 0) + 1;
    });

    // 生成每行的rowSpan值
    dataSource.forEach((item: RiskItem, index: number) => {
      if (skipMap[index]) return;
      
      const span = rowSpanMap[item.riskType];
      rowSpanArray[index] = span;
      
      // 标记需要跳过的行
      for (let i = 1; i < span; i++) {
        if (index + i < dataSource.length) {
          rowSpanArray[index + i] = 0;
          skipMap[index + i] = true;
        }
      }
    });

    return rowSpanArray;
  };

  // 重置表单
  const handleReset = () => {
    setTempData({
      plannedCompleteTime: '',
      preReleaseTime: '',
      prodReleaseTime: ''
    });
    setFormErrors({});
  };

  // 验证表单
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!tempData.plannedCompleteTime) {
      errors.plannedCompleteTime = '请选择计划完成时间';
    }
    
    if (!tempData.preReleaseTime) {
      errors.preReleaseTime = '请选择预发布时间';
    }
    
    if (!tempData.prodReleaseTime) {
      errors.prodReleaseTime = '请选择生产发布时间';
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
    setReviewInfo((prev: ReleaseReviewInfo) => ({
      ...prev,
      ...tempData
    }));

    setIsSubmitted(true);
    message.success('发布评审提交成功');
  };

  // 处理输入变化
  const handleInputChange = (field: string, value: string) => {
    setTempData((prev: Partial<ReleaseReviewInfo>) => ({ ...prev, [field]: value }));
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
  const handleDateChange = (field: 'plannedCompleteTime' | 'preReleaseTime' | 'prodReleaseTime', date: any) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD');
      handleInputChange(field, formattedDate);
    } else {
      handleInputChange(field, '');
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
        
        {/* 第二行：创建时间、预发布时间、生产发布时间 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8} style={{ fontSize: '15px' }}>
            <strong style={{ fontSize: '15px' }}>创建时间：</strong>
            <span style={{ fontSize: '15px' }}>{reviewInfo.createTime}</span>
          </Col>
          <Col span={8} style={{ fontSize: '15px' }}>
            <strong style={{ fontSize: '15px' }}>预发布时间：<span style={{ color: 'red' }}>*</span></strong>
            <DatePicker
              value={tempData.preReleaseTime ? dayjs(tempData.preReleaseTime) : null}
              onChange={(date) => handleDateChange('preReleaseTime', date)}
              placeholder="请选择日期"
              style={{ display: 'inline-block', width: 'calc(80% - 140px)' }}
            />
            {formErrors.preReleaseTime && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                {formErrors.preReleaseTime}
              </div>
            )}
          </Col>
          <Col span={8} style={{ fontSize: '15px' }}>
            <strong style={{ fontSize: '15px' }}>生产发布时间：<span style={{ color: 'red' }}>*</span></strong>
            <DatePicker
              value={tempData.prodReleaseTime ? dayjs(tempData.prodReleaseTime) : null}
              onChange={(date) => handleDateChange('prodReleaseTime', date)}
              placeholder="请选择日期"
              style={{ display: 'inline-block', width: 'calc(80% - 140px)' }}
            />
            {formErrors.prodReleaseTime && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                {formErrors.prodReleaseTime}
              </div>
            )}
          </Col>
        </Row>
        
        {/* 第三行：计划完成时间 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8} style={{ fontSize: '15px' }}>
            <strong style={{ fontSize: '15px' }}>计划完成时间：<span style={{ color: 'red' }}>*</span></strong>
            <DatePicker
              value={tempData.plannedCompleteTime ? dayjs(tempData.plannedCompleteTime) : null}
              onChange={(date) => handleDateChange('plannedCompleteTime', date)}
              placeholder="请选择日期"
              style={{ display: 'inline-block', width: 'calc(80% - 140px)' }}
            />
            {formErrors.plannedCompleteTime && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                {formErrors.plannedCompleteTime}
              </div>
            )}
          </Col>
        </Row>
        
        {/* 风险信息区域 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8} style={{ fontSize: '15px', marginTop: '8px' }}>
            <strong style={{ fontSize: '15px' }}>风险评估</strong>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Row>
              <Col span={24}>
                <Table
                  dataSource={riskData.riskItems}
                  rowKey="id"
                  bordered
                  pagination={false}
                  columns={[
                    {
                      title: '风险类型',
                      dataIndex: 'riskType',
                      key: 'riskType',
                      width: 150,
                      align: 'center',
                      // 配置单元格合并和样式
                      onCell: (_, index) => {
                        const rowSpanArray = getRowSpanConfig(riskData.riskItems);
                        // 确保index是有效数字再使用
                        const rowSpan = typeof index === 'number' ? (rowSpanArray[index] || 0) : 0;
                        
                        return {
                          rowSpan,
                          style: rowSpan > 0 ? { verticalAlign: 'middle' } : { display: 'none' }
                        };
                      }
                    },
                    {
                      title: '风险项',
                      dataIndex: 'riskItem',
                      key: 'riskItem',
                      width: 300,
                      align: 'center',
                    },
                    {
                      title: '风险认定',
                      key: 'isRisk',
                      width: 100,
                      align: 'center',
                      render: (_: any, record: RiskItem) => (
                        <span style={{ fontSize: '14px' }}>
                          {record.riskStatus === 'yes' ? '是' : '否'}
                        </span>
                      )
                    },
                    {
                      title: '备注',
                      key: 'remark',
                      width: 300,
                      align: 'center',
                      render: (_: any, record: RiskItem) => (
                        <span style={{ fontSize: '14px' }}>
                          {record.remark || '-'}
                        </span>
                      ),
                    },
                  ]}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        
        {/* 发布验证确认信息 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8} style={{ fontSize: '15px', marginTop: '8px' }}>
            <strong style={{ fontSize: '15px' }}>发布验证确认</strong>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Table
              dataSource={verificationData}
              rowKey="type"
              bordered
              pagination={false}
              columns={[
                {
                  title: '类型',
                  dataIndex: 'type',
                  key: 'type',
                  align: 'center',
                },
                {
                  title: '已处理',
                  dataIndex: 'processed',
                  key: 'processed',
                  align: 'center',
                  render: (text: number) => <span style={{ color: '#1890ff' }}>{text}</span>
                },
                {
                  title: '总数',
                  dataIndex: 'total',
                  key: 'total',
                  align: 'center',
                  render: (text: number) => <span style={{ color: '#1890ff' }}>{text}</span>
                },
                {
                  title: '通过率',
                  dataIndex: 'rate',
                  key: 'rate',
                  align: 'center',
                  render: (text: string) => <span style={{ color: '#1890ff' }}>{text}</span>
                },
              ]}
            />
          </Col>
        </Row>

        {/* 操作按钮行 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={24} style={{ textAlign: 'left' }}>
            <Popconfirm
              title="确认提交"
              onConfirm={handleConfirmSubmitWithValidation}
              okText="确定"
              cancelText="取消"
              placement="topRight"
              getPopupContainer={(triggerNode) => triggerNode.parentElement!}
            >
              <Button type="primary" style={{ marginRight: '8px' }}>
                提交
              </Button>
            </Popconfirm>
            <Button onClick={handleReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Card>
      
      {/* 评审流程卡片 - 仅在提交确认后显示 */}
      {isSubmitted && (
        <Card className="review-card" style={{ marginBottom: 24 }}>
          <Row gutter={16} style={{ alignItems: 'center', marginBottom: 24 }}>
            <Col span={3} style={{ fontSize: '16px', fontWeight: 'bold' }}>
              发布评审
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
              onReviewAction={handleReviewAction}
              onReminder={handleReminder}
            />
          ))}
        </Card>
      )}
      
      {/* 操作日志 */}
      <OperationLogList logs={operationLogs} />
    </div>
  );
};

export default ReleaseReview;