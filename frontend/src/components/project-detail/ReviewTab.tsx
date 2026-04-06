import React, { useState } from 'react';
import { Tabs } from 'antd';
import DesignReview from './reviews/DesignReview';
import CodeReview from './reviews/CodeReview';
import TestCaseReview from './reviews/TestCaseReview';
import ReleaseReview from './reviews/ReleaseReview';

const { TabPane } = Tabs;

const ReviewTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('design');

  return (
    <div className="review-page">
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        size="middle"
        className="review-tabs"
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