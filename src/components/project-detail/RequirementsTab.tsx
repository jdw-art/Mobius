import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getMockRequirements } from '../../services/mockData';
import type { Requirement } from '../../types';

const RequirementsTab: React.FC = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);

  useEffect(() => {
    // 获取模拟需求数据
    const mockRequirements = getMockRequirements();
    setRequirements(mockRequirements);
  }, []);

  // 定义表格列配置
  const columns: ColumnsType<Requirement> = [
    {
      title: '需求ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      align: 'center',
    },
    {
      title: '需求名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 200,
      align: 'center',
    },
    {
      title: '所属版本',
      dataIndex: 'version',
      key: 'version',
      width: 100,
      align: 'center',
    },
    {
      title: '所属应用',
      dataIndex: 'application',
      key: 'application',
      width: 150,
      align: 'center',
    },
    {
      title: '所属模块',
      dataIndex: 'module',
      key: 'module',
      width: 150,
      align: 'center',
    },
    {
      title: '需求等级',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      align: 'center',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
      align: 'center',
    },
  ];

  return (
    <div className="requirements-tab">
      <div className="requirements-content">
        <Table
          columns={columns}
          dataSource={requirements}
          rowKey="id"
          pagination={false}
          size="middle"
          className="requirements-table"
        />
      </div>
    </div>
  );
};

export default RequirementsTab;