import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { request } from '@/utils/request';
import DesignReview from './reviews/DesignReview';
import CodeReview from './reviews/CodeReview';
import TestCaseReview from './reviews/TestCaseReview';
import ReleaseReview from './reviews/ReleaseReview';

const { TabPane } = Tabs;

interface ReviewTabProps {
  projectId: string;
}

export interface Review {
  id: string;
  projectId: string;
  type: string;
  requirementId: string;
  title: string;
  creator: string;
  createTime: string;
  plannedCompleteTime?: string;
  codeBranch?: string;
  preReleaseTime?: string;
  prodReleaseTime?: string;
}

const ReviewTab: React.FC<ReviewTabProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState('design');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    request.get(`/api/v1/projects/${projectId}/reviews`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error('Failed to load reviews:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectId]);

  return (
    <div className="review-page">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="middle"
        className="review-tabs"
        tabBarExtraContent={loading ? '加载中...' : undefined}
      >
        <TabPane tab="设计评审" key="design">
          <DesignReview />
        </TabPane>
        <TabPane tab="代码评审" key="code">
          <CodeReview />
        </TabPane>
        <TabPane tab="用例评审" key="testcase">
          <TestCaseReview />
        </TabPane>
        <TabPane tab="发布评审" key="release">
          <ReleaseReview />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ReviewTab;