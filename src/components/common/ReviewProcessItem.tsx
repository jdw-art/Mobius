import React from 'react';
import { Row, Col, Button, Input } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';

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

interface ReviewProcessItemProps {
  process: ReviewProcess;
  index: number;
  totalLength: number;
  onCommentChange: (processId: string, comment: string) => void;
  onReminder: (processId: string) => void;
  onReviewAction: (processId: string, status: 'approved' | 'rejected') => void;
}

const ReviewProcessItem: React.FC<ReviewProcessItemProps> = ({
  process,
  index,
  totalLength,
  onCommentChange,
  onReminder,
  onReviewAction
}) => {
  return (
    <div 
      key={process.id} 
      style={{ marginBottom: 24, position: 'relative' }}
      className={index < totalLength - 1 ? 'review-process-with-border' : ''}
    >
      {/* 第一行：箭头图标+加粗标题，空两个字符，灰色描述文字 */}
      <Row gutter={8} style={{ marginBottom: 12 }}>
        <Col span={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CaretDownOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
        </Col>
        <Col span={23}>
          <Row gutter={8} style={{ alignItems: 'flex-end' }}>
            <Col style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {process.title}
            </Col>
            <Col style={{ fontSize: '13px', color: '#999' }}>
              {process.description}
            </Col>
          </Row>
        </Col>
      </Row>

      {/* 第二行：测试人员、时间、按钮 */}
      <Row gutter={8} style={{ marginBottom: 12, marginLeft: 24, alignItems: 'center' }}>
            <Col style={{ fontSize: '13px', color: '#999' }}>
              {(process.reviewers || []).join('、')}
            </Col>
        <Col style={{ fontSize: '13px', color: '#999' }}>
          {process.reviewTime}
        </Col>
        <Col>
          {process.status === 'approved' ? (
            <span style={{ fontSize: '13px', color: '#1890ff', fontWeight: 'bold' }}>通过</span>
          ) : process.status === 'rejected' ? (
            <span style={{ fontSize: '13px', color: '#ff4d4f', fontWeight: 'bold' }}>驳回</span>
          ) : (
            <>
              <Button 
                size="small" 
                type="link" 
                style={{ marginRight: 2, fontSize: '13px', color: '#1890ff' }}
                onClick={() => onReminder(process.id)}
              >
                催一下
              </Button>
              <Button 
                size="small" 
                type="link" 
                style={{ marginRight: 2, fontSize: '13px', color: '#1890ff' }}
                onClick={() => onReviewAction(process.id, 'approved')}
              >
                通过
              </Button>
              <Button 
                size="small" 
                type="link" 
                style={{ fontSize: '13px', color: '#ff4d4f' }}
                onClick={() => onReviewAction(process.id, 'rejected')}
              >
                驳回
              </Button>
            </>
          )}
        </Col>
      </Row>

      {/* 第三行：可编辑文本框 */}
      <Row gutter={8} style={{ marginLeft: 24 }}>
        <Col span={24}>
          <Input
            value={process.comment || ''}
            onChange={(e) => onCommentChange(process.id, e.target.value)}
            placeholder="请输入评审意见"
            disabled={!process.commentEditable}
            style={{ fontSize: '14px' }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ReviewProcessItem;