import React, { useState, useEffect } from 'react';
import { Input, Button, Space, Table, Tag, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { getDefects } from '../../../services/defectsService';
import { Defect, TableColumn } from '../../../types';

const TestDefects: React.FC = () => {
  const [defectName, setDefectName] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [defects, setDefects] = useState<Defect[]>([]);
  const [filteredDefects, setFilteredDefects] = useState<Defect[]>([]);

  // 初始化加载缺陷数据
  useEffect(() => {
    const defectsData = getDefects();
    setDefects(defectsData);
    setFilteredDefects(defectsData);
  }, []);

  // 搜索缺陷
  const handleSearch = () => {
    if (!defectName.trim()) {
      setFilteredDefects(defects);
    } else {
      const filtered = defects.filter(defect => 
        defect.name.toLowerCase().includes(defectName.toLowerCase())
      );
      setFilteredDefects(filtered);
    }
    // 重置选中状态
    setSelectedRowKeys([]);
  };

  // 处理添加缺陷
  const handleAddDefect = () => {
    console.log('添加缺陷');
    // 添加缺陷逻辑将在这里实现
    // 实际项目中会打开一个添加缺陷的模态框
  };

  // 处理删除缺陷
  const handleDeleteDefect = () => {
    if (selectedRowKeys.length === 0) {
      console.log('请先选择要删除的缺陷');
      return;
    }
    console.log('删除缺陷:', selectedRowKeys);
    // 模拟删除逻辑
    const newDefects = defects.filter(defect => 
      !selectedRowKeys.includes(defect.id)
    );
    setDefects(newDefects);
    setFilteredDefects(newDefects.filter(defect => 
      !defectName.trim() || defect.name.toLowerCase().includes(defectName.toLowerCase())
    ));
    setSelectedRowKeys([]);
  };

  // 查看缺陷详情
  const handleViewDefect = (defect: Defect) => {
    console.log('查看缺陷详情:', defect);
    // 实际项目中会打开一个缺陷详情的模态框
  };

  // 修复缺陷
  const handleFixDefect = (defect: Defect) => {
    console.log('修复缺陷:', defect);
    // 模拟修复缺陷逻辑
    const updatedDefects = defects.map(item => 
      item.id === defect.id ? { ...item, status: '修复中' as const } : item
    );
    setDefects(updatedDefects);
    setFilteredDefects(updatedDefects.filter(item => 
      !defectName.trim() || item.name.toLowerCase().includes(defectName.toLowerCase())
    ));
  };

  // 获取状态标签颜色
  const getStatusColor = (status: string): string => {
    switch (status) {
      case '打开':
        return 'red';
      case '修复中':
        return 'orange';
      case '关闭':
        return 'green';
      default:
        return 'default';
    }
  };

  // 表格列配置
  const columns: TableColumn<Defect>[] = [
    {
      title: '缺陷ID',
      dataIndex: 'id',
      key: 'id',
      width: 100
    },
    {
      title: '缺陷名称',
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: '环境',
      dataIndex: 'environment',
      key: 'environment',
      width: 100,
      render: (environment) => (
        <Tag color={environment === '测试环境' ? 'blue' : 'purple'}>
          {environment}
        </Tag>
      )
    },
    {
      title: '所属应用',
      dataIndex: 'application',
      key: 'application',
      width: 150
    },
    {
      title: '开发负责人',
      dataIndex: 'developer',
      key: 'developer',
      width: 120
    },
    {
      title: '测试负责人',
      dataIndex: 'tester',
      key: 'tester',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            size="small" 
            type="link" 
            onClick={() => handleViewDefect(record)}
          >
            详情
          </Button>
          <Popconfirm
            title="确定要开始修复该缺陷吗？"
            onConfirm={() => handleFixDefect(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              size="small" 
              type="link" 
              disabled={record.status === '关闭'}
            >
              修复
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 表格选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    }
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
            onPressEnter={handleSearch}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} />
        </div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddDefect}>
            添加缺陷
          </Button>
          <Popconfirm
            title="确定要删除选中的缺陷吗？"
            onConfirm={handleDeleteDefect}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="default" 
              danger
              disabled={selectedRowKeys.length === 0}
            >
              删除缺陷
            </Button>
          </Popconfirm>
        </Space>
      </div>
      
      <div className="test-defects-details">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredDefects}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1500 }}
        />
      </div>
    </div>
  );
};

export default TestDefects;