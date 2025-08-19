import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Tag, Input, Select } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useProjects } from '@/hooks/useProjects';
import { statusUtils } from '@/utils';
import { PROJECT_TYPE_OPTIONS, TABLE_PAGINATION_CONFIG } from '@/constants';
import { Project, TableColumn } from '@/types';

const { Search } = Input;
const { Option } = Select;

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const { projects, searchText, filterType, updateSearchText, updateFilterType } = useProjects();

  const columns: TableColumn<Project>[] = [
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
        const color = statusUtils.getProjectTypeColor(text);
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
      render: (text) => <Tag color={statusUtils.getProgressColor(text)}>{text}</Tag>
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
            onChange={(e) => updateSearchText(e.target.value)}
            onSearch={updateSearchText}
          />
          <Select
            value={filterType}
            onChange={updateFilterType}
            style={{ width: 150 }}
          >
            {PROJECT_TYPE_OPTIONS.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          新建项目
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={projects}
        rowKey="id"
        pagination={TABLE_PAGINATION_CONFIG}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default ProjectList;
