import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Select, Dropdown, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, PlusOutlined, FileTextOutlined, CodeOutlined, ScanOutlined } from '@ant-design/icons';
import { applicationsService } from '../../services/applicationsService';
import type { Application } from '../../types';

interface ApplicationsTabProps {
  projectId: string;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ projectId }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [deployMethod, setDeployMethod] = useState<string>('');
  const [appName, setAppName] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载应用数据
  useEffect(() => {
    setLoading(true);
    applicationsService.getByProject(projectId)
      .then((data) => {
        setAllApplications(data);
        setApplications(data);
      })
      .catch((error) => {
        console.error('Failed to load applications:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectId]);

  // 监听筛选条件变化，自动触发筛选
  useEffect(() => {
    filterApplications();
  }, [deployMethod, appName, allApplications]);

  // 处理搜索
  const handleSearch = () => {
    // 实现实际的搜索逻辑
    console.log('搜索条件:', { deployMethod, appName });
    filterApplications();
  };

  // 过滤应用列表
  const filterApplications = () => {
    // 根据筛选条件过滤应用列表
    const filteredApplications = allApplications.filter(app => {
      // 部署方式筛选
      const matchesDeployMethod = !deployMethod || app.deployMethod === deployMethod;
      // 应用名称筛选
      const matchesAppName = !appName || app.name.toLowerCase().includes(appName.toLowerCase());
      // 同时满足两个条件
      return matchesDeployMethod && matchesAppName;
    });
    // 更新表格数据
    setApplications(filteredApplications);
  };

  // 处理添加应用
  const handleAddApplication = () => {
    console.log('添加应用');
  };

  // 处理发布计划
  const handleReleasePlan = () => {
    console.log('发布计划');
  };

  // 处理构建列表
  const handleBuildList = (app: Application) => {
    console.log('构建列表:', app.name);
  };

  // 处理代码评审
  const handleCodeReview = (app: Application) => {
    console.log('代码评审:', app.name);
  };

  // 处理删除应用
  const handleDeleteApplication = () => {
    if (selectedRowKeys.length === 0) {
      console.log('请先选择要删除的应用');
      return;
    }
    console.log('删除应用:', selectedRowKeys);
    // 在实际应用中，这里会调用API删除选中的应用
    // 这里仅做前端模拟删除
    const updatedApplications = applications.filter(app => !selectedRowKeys.includes(app.id));
    setApplications(updatedApplications);
    setSelectedRowKeys([]);
  };

  // 处理代码扫描
  const handleCodeScan = (type: string, app: Application) => {
    console.log(`代码扫描 - ${type}:`, app.name);
  };

  // 定义行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: Application) => ({
      disabled: false,
    }),
  };

  // 定义表格列配置
  const columns: ColumnsType<Application> = [
    {
      title: '应用名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      align: 'center',
    },
    {
      title: '分支名',
      dataIndex: 'branch',
      key: 'branch',
      width: 150,
      align: 'center',
    },
    {
      title: '版本号',
      dataIndex: 'version',
      key: 'version',
      width: 100,
      align: 'center',
    },
    {
      title: '测试状态',
      dataIndex: 'testStatus',
      key: 'testStatus',
      width: 80,
      align: 'center',
    },
    {
      title: '部署方式',
      dataIndex: 'deployMethod',
      key: 'deployMethod',
      width: 100,
      align: 'center',
    },
    {      title: '单元测试',      dataIndex: 'unitTest',      key: 'unitTest',      width: 80,      render: (text) => <span style={{ color: '#1890ff' }}>{text}</span>,      align: 'center',    },    {      title: '代码扫描',      dataIndex: 'codeScan',      key: 'codeScan',      width: 80,      render: (text) => <span style={{ color: '#1890ff' }}>{text}</span>,      align: 'center',    },    {      title: '代码评审',      dataIndex: 'codeReview',      key: 'codeReview',      width: 100,      render: (text) => <span style={{ color: '#1890ff' }}>{text}</span>,      align: 'center',    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space direction="vertical" size="middle">
          <Button 
            size="small" 
            type="link" 
            icon={<FileTextOutlined />} 
            onClick={() => handleBuildList(record)}
          >
            构建列表
          </Button>
          <Button 
            size="small" 
            type="link" 
            icon={<CodeOutlined />} 
            onClick={() => handleCodeReview(record)}
          >
            代码评审
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  label: (
                    <Button 
                      size="small" 
                      type="link" 
                      icon={<ScanOutlined />}
                      onClick={() => handleCodeScan('全部扫描', record)}
                    >
                      全部扫描
                    </Button>
                  ),
                },
                {
                  key: '2',
                  label: (
                    <Button 
                      size="small" 
                      type="link" 
                      icon={<CodeOutlined />}
                      onClick={() => handleCodeScan('单元测试', record)}
                    >
                      单元测试
                    </Button>
                  ),
                },
                {
                  key: '3',
                  label: (
                    <Button 
                      size="small" 
                      type="link" 
                      icon={<ScanOutlined />}
                      onClick={() => handleCodeScan('代码扫描', record)}
                    >
                      代码扫描
                    </Button>
                  ),
                },
              ],
            }}
          >
            <Button 
              size="small" 
              type="link" 
              icon={<ScanOutlined />}
            >
              代码扫描
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="applications-tab">
      {/* 搜索和操作区域 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '16px', fontSize: '16px', fontWeight: 'bold' }}>应用列表</span>
          <Select
            placeholder="选择部署方式"
            style={{ width: 150, marginRight: '12px' }}
            value={deployMethod}
            onChange={setDeployMethod}
            options={[
              { value: '', label: '全部' },
              { value: 'maven', label: 'maven' },
              { value: 'dubbo', label: 'dubbo' },
              { value: 'tomcat', label: 'tomcat' },
            ]}
          />
          <Input
            placeholder="应用名称查询"
            style={{ width: 200, marginRight: '12px' }}
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} />
        </div>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddApplication}
          >
            添加应用
          </Button>
          <Popconfirm
            title="确认删除"
            onConfirm={handleDeleteApplication}
            okText="确定"
            cancelText="取消"
            placement="topRight"
          >
            <Button 
              type="default" 
              danger
            >
              删除应用
            </Button>
          </Popconfirm>
          <Button 
            type="default" 
            style={{ backgroundColor: '#fa8c16', color: 'white', border: 'none' }}
            onClick={handleReleasePlan}
          >
            发布计划
          </Button>
        </Space>
      </div>

      {/* 应用列表 */}
      <div className="applications-content">
        <Table
          columns={columns}
          dataSource={applications}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="middle"
          className="applications-table"
          rowSelection={rowSelection}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ApplicationsTab;