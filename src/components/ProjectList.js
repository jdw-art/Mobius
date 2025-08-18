import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Tag, Input, Select } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const ProjectList = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');

  // 模拟项目数据
  const projects = [
    {
      id: 'PRJ001',
      name: '用户管理系统重构',
      type: '日常项目',
      pm: '张三',
      progress: '进行中',
      plannedDelivery: '2024-03-15',
      status: '进行中'
    },
    {
      id: 'PRJ002',
      name: '支付接口优化',
      type: '紧急项目',
      pm: '李四',
      progress: '测试',
      plannedDelivery: '2024-02-28',
      status: '测试'
    },
    {
      id: 'PRJ003',
      name: '移动端APP开发',
      type: '新项目',
      pm: '王五',
      progress: '设计',
      plannedDelivery: '2024-04-30',
      status: '设计'
    },
    {
      id: 'PRJ004',
      name: '数据库性能优化',
      type: '日常项目',
      pm: '赵六',
      progress: '开发',
      plannedDelivery: '2024-03-20',
      status: '开发'
    },
    {
      id: 'PRJ005',
      name: '安全漏洞修复',
      type: '紧急项目',
      pm: '钱七',
      progress: '预发布',
      plannedDelivery: '2024-02-25',
      status: '预发布'
    }
  ];

  const getProgressColor = (progress) => {
    const colorMap = {
      '设计': 'blue',
      '开发': 'processing',
      '测试': 'warning',
      '预发布': 'orange',
      '进行中': 'processing'
    };
    return colorMap[progress] || 'default';
  };

  const columns = [
    {
      title: '项目编号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => navigate(`/project/${record.id}`)} style={{ color: '#1890ff' }}>
          {text}
        </a>
      )
    },
    {
      title: '项目类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (text) => {
        const color = text === '紧急项目' ? 'red' : text === '新项目' ? 'green' : 'blue';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'PM（项目经理）',
      dataIndex: 'pm',
      key: 'pm',
      width: 150
    },
    {
      title: '进展',
      dataIndex: 'progress',
      key: 'progress',
      width: 100,
      render: (text) => <Tag color={getProgressColor(text)}>{text}</Tag>
    },
    {
      title: '计划交付时间',
      dataIndex: 'plannedDelivery',
      key: 'plannedDelivery',
      width: 150
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small" onClick={() => navigate(`/project/${record.id}`)}>
            查看详情
          </Button>
          <Button type="link" size="small">
            编辑
          </Button>
        </Space>
      )
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         project.id.toLowerCase().includes(searchText.toLowerCase()) ||
                         project.pm.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = filterType === 'all' || project.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2>项目管理</h2>
        <p style={{ color: '#666', marginBottom: 16 }}>
          管理您参与的所有项目，跟踪项目进展和交付时间
        </p>
      </div>

      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <Search
            placeholder="搜索项目名称、编号或PM"
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={setSearchText}
          />
          <Select
            value={filterType}
            onChange={setFilterType}
            style={{ width: 150 }}
          >
            <Option value="all">全部类型</Option>
            <Option value="日常项目">日常项目</Option>
            <Option value="紧急项目">紧急项目</Option>
            <Option value="新项目">新项目</Option>
          </Select>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          新建项目
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredProjects}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
        }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default ProjectList;
