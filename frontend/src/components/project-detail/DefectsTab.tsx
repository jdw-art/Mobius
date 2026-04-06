import React, { useState } from 'react';
import { Tabs } from 'antd';
import TestPlan from './defects/TestPlan';
import TestDefects from './defects/TestDefects';

const { TabPane } = Tabs;

const DefectsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('plan');

  return (
    <div className="defects-page">
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        size="middle"
        className="defects-tabs"
      >
        <TabPane tab="测试计划" key="plan">
          <TestPlan />
        </TabPane>
        <TabPane tab="测试缺陷" key="defects">
          <TestDefects />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DefectsTab;