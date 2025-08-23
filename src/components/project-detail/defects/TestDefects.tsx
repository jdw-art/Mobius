import React, { useState } from 'react';
import { Input, Button, Space } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

const TestDefects: React.FC = () => {
  const [defectName, setDefectName] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 搜索缺陷
  const handleSearch = () => {
    console.log('搜索缺陷:', { defectName });
    // 实际搜索逻辑将在这里实现
    // 重置选中状态
    setSelectedRowKeys([]);
  };

  // 处理添加缺陷
  const handleAddDefect = () => {
    console.log('添加缺陷');
    // 添加缺陷逻辑将在这里实现
  };

  // 处理删除缺陷
  const handleDeleteDefect = () => {
    if (selectedRowKeys.length === 0) {
      console.log('请先选择要删除的缺陷');
      return;
    }
    console.log('删除缺陷:', selectedRowKeys);
    // 实际删除逻辑将在这里实现
    setSelectedRowKeys([]);
  };

  return (
    <div className="test-defects-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h4 style={{ marginRight: '16px', marginBottom: 0 }}>缺陷名称</h4>
          <Input
            placeholder="缺陷名称查询"
            style={{ width: 200, marginRight: '12px' }}
            value={defectName}
            onChange={(e) => setDefectName(e.target.value)}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} />
        </div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddDefect}>
            添加缺陷
          </Button>
          <Button 
            type="default" 
            danger
            onClick={handleDeleteDefect}
          >
            删除缺陷
          </Button>
        </Space>
      </div>
      
      <div className="test-defects-details">
        {/* 测试缺陷内容将在这里实现 */}
        <p>测试缺陷功能正在开发中...</p>
      </div>
    </div>
  );
};

export default TestDefects;