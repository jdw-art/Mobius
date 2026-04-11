import { useState, useEffect } from 'react';
import { Tabs, Select, Input, Button, Table, Space, Progress, Tag } from 'antd';
import OperationLogList from '../common/OperationLogList';
import type { TabsProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ArrowRightOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { Application, EnvironmentType, BuildingProject, UnbuiltProject, OperationLog, BuildStatus, DeployStatus } from '../../types';
import { applicationsService } from '../../services/applicationsService';
import { getEnvironmentBuildConfig, getBuildingProjects, getUnbuiltProjects, buildsService, Build } from '../../services/buildsService';
import { getOperationLogs } from '../../services/commonService';

interface BuildsTabProps {
  projectId: string;
}

const BuildsTab: React.FC<BuildsTabProps> = ({ projectId }) => {
  // 状态管理
  const [activeTab, setActiveTab] = useState<EnvironmentType>('测试环境');
  const [applications, setApplications] = useState<Application[]>([]);
  const [buildConfig, setBuildConfig] = useState<any>(getEnvironmentBuildConfig('测试环境'));
  const [buildingProjects] = useState<BuildingProject[]>(getBuildingProjects());
  const [unbuiltProjects] = useState<UnbuiltProject[]>(getUnbuiltProjects());
  const [operationLogs] = useState<OperationLog[]>(getOperationLogs());
  const [selectedAppId, setSelectedAppId] = useState<string>('APP001');
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  // 分页配置 - 与概况动态部分保持一致
  const paginationConfig = {
    pageSize: 10, // 每页10条数据
    showSizeChanger: false
  };

  // 加载应用和构建数据
  useEffect(() => {
    setLoading(true);
    Promise.all([
      applicationsService.getByProject(projectId),
      buildsService.getByProject(projectId),
    ])
      .then(([apps, buildList]) => {
        setApplications(apps);
        setBuilds(buildList);
        if (apps.length > 0) {
          setSelectedAppId(apps[0].id);
        }
      })
      .catch((error) => {
        console.error('Failed to load data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectId]);

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    const environment = key as EnvironmentType;
    setActiveTab(environment);
    // 获取对应环境的构建配置
    setBuildConfig(getEnvironmentBuildConfig(environment));
  };

  // 处理应用选择变更
  const handleAppChange = (value: string) => {
    setSelectedAppId(value);
    const selectedApp = applications.find(app => app.id === value);
    if (selectedApp) {
      setBuildConfig((prev: any) => ({
        ...prev,
        selectedAppId: value,
        selectedAppName: selectedApp.name,
        buildMethod: selectedApp.deployMethod,
        deployMethod: selectedApp.deployMethod === 'maven' ? 'docker' : selectedApp.deployMethod
      }));
    }
  };

  // 处理构建+部署按钮点击
  const handleBuildDeploy = () => {
    // 模拟构建和部署过程
    console.log('开始构建和部署:', buildConfig);
    setBuildConfig((prev: any) => ({
      ...prev,
      buildStatus: '构建中',
      deployStatus: '未部署',
      buildProgress: 30
    }));
  };

  // 处理更新覆盖率
  const handleUpdateCoverage = (id: string) => {
    console.log('更新覆盖率:', id);
    // 实际应用中这里会调用API更新覆盖率
  };

  // 处理退出构建
  const handleExitBuild = (id: string) => {
    console.log('退出构建:', id);
    // 实际应用中这里会调用API退出构建
  };

  // 处理进入构建
  const handleEnterBuild = (id: string) => {
    console.log('进入构建:', id);
    // 实际应用中这里会调用API进入构建
  };

  // 构建中列表的列配置
  const buildingColumns: ColumnsType<BuildingProject> = [
    {
      title: '分支名',
      dataIndex: 'branch',
      key: 'branch',
      width: 150,
      align: 'center',
    },
    {
      title: '所属项目',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 150,
      align: 'center',
    },
    {
      title: '所属项目编号',
      dataIndex: 'projectId',
      key: 'projectId',
      width: 120,
      align: 'center',
    },
    {
      title: '测试人员',
      dataIndex: 'tester',
      key: 'tester',
      width: 100,
      align: 'center',
    },
    {
      title: '增量覆盖率',
      key: 'coverage',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <span>{record.coverage}%</span>
          {record.canUpdateCoverage && (
            <Button size="small" type="link" style={{ fontSize: '12px' }} onClick={() => handleUpdateCoverage(record.id)}>
              更新
            </Button>
          )}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button size="small" danger type="link" style={{ fontSize: '12px' }} onClick={() => handleExitBuild(record.id)}>
          退出构建
        </Button>
      ),
    },
  ];

  // 未构建列表的列配置
  const unbuiltColumns: ColumnsType<UnbuiltProject> = [
    {
      title: '分支名',
      dataIndex: 'branch',
      key: 'branch',
      width: 150,
      align: 'center',
    },
    {
      title: '所属项目',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 150,
      align: 'center',
    },
    {
      title: '所属项目编号',
      dataIndex: 'projectId',
      key: 'projectId',
      width: 120,
      align: 'center',
    },
    {
      title: '测试人员',
      dataIndex: 'tester',
      key: 'tester',
      width: 100,
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Button size="small" type="link" style={{ fontSize: '12px' }} onClick={() => handleEnterBuild(record.id)}>
          进入构建
        </Button>
      ),
    },
  ];

  // 渲染构建状态标签
  const renderBuildStatus = (status: string) => {
    switch (status) {
      case '构建成功':
        return <Tag color="blue">构建完成</Tag>;
      case '构建失败':
        return <Tag color="red">构建失败</Tag>;
      case '构建中':
        return <Tag color="processing">构建中</Tag>;
      default:
        return <Tag color="default">未构建</Tag>;
    }
  };

  // 渲染部署状态标签
  const renderDeployStatus = (status: string) => {
    switch (status) {
      case '部署成功':
        return <Tag color="blue">部署完成</Tag>;
      case '部署失败':
        return <Tag color="red">部署失败</Tag>;
      case '部署中':
        return <Tag color="processing">部署中</Tag>;
      default:
        return <Tag color="default">未部署</Tag>;
    }
  };

  // 渲染服务器部署状态
  const renderServerStatus = (ip: string, status: boolean) => (
    <span style={{ marginRight: '16px' }}>
      {ip} <Tag color={status ? 'green' : 'blue'}>{status ? '部署完成' : '部署中'}</Tag>
    </span>
  );

  // 标签页配置
  const tabItems: TabsProps['items'] = [
    {
      key: '测试环境',
      label: '测试环境',
      children: (
        <div className="environment-content">
          {/* 环境配置区域 */}
          <div className="environment-config" style={{ marginBottom: '24px', padding: '16px', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
            {/* 第一行：应用名、版本号和空白占位 */}
            <div style={{ display: 'flex', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>应用名：</span>
                <Select
                  value={selectedAppId}
                  style={{ width: 200, marginLeft: '8px' }}
                  onChange={handleAppChange}
                  options={applications.map(app => ({ value: app.id, label: app.name }))}
                />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>版本号：</span>
                <span style={{ margin: '0 8px' }}>{buildConfig.oldVersion}</span>
                <ArrowRightOutlined />
                <span style={{ marginLeft: '8px' }}>{buildConfig.newVersion}</span>
              </div>
              <div style={{ flex: 1 }}></div> {/* 空白占位，确保与第二行3列对齐 */}
            </div>

            {/* 第二行：安装包名、构建方式、部署方式 */}
            <div style={{ display: 'flex', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>安装包名：</span>
                <span>{buildConfig.packageName}</span>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>构建方式：</span>
                <span>{buildConfig.buildMethod}</span>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>部署方式：</span>
                <span>{buildConfig.deployMethod}</span>
              </div>
            </div>

            {/* 部署分支行 */}
            <div style={{ display: 'flex', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>部署分支：</span>
                <span>{buildConfig.branch || 'main'}</span>
              </div>
            </div>

            {/* 第三行：部署列表 */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ marginRight: '8px', fontWeight: 600 }}>部署列表：</span>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {buildConfig.servers.map((server: any, index: number) => (
                  <span key={index} style={{ marginRight: '16px' }}>
                    {renderServerStatus(server.ip, server.deployStatus)}
                  </span>
                ))}
              </div>
            </div>

            {/* 第四行：备注 */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ color: 'red' }}>备注：部署完成后请确认是否已正常</span>
            </div>

            {/* 第五行：进度条和构建部署按钮 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1, maxWidth: '250px' }}>
                <Progress
                  percent={buildConfig.buildProgress}
                  status={buildConfig.buildProgress === 100 ? 'success' : 'active'}
                  strokeColor={buildConfig.buildStatus === '构建失败' ? '#ff4d4f' : undefined}
                  style={{ flex: 1 }}
                />
              </div>
              <div style={{ margin: '0 16px' }}>
                {renderBuildStatus(buildConfig.buildStatus)}
              </div>
              <div style={{ flex: 1, maxWidth: '250px' }}>
                <Progress
                  percent={buildConfig.deployProgress}
                  status={buildConfig.deployProgress === 100 ? 'success' : 'active'}
                  strokeColor={buildConfig.deployStatus === '部署失败' ? '#ff4d4f' : undefined}
                  style={{ flex: 1 }}
                />
              </div>
              <div style={{ margin: '0 16px' }}>
                {renderDeployStatus(buildConfig.deployStatus)}
              </div>
              <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleBuildDeploy}>
                构建+部署
              </Button>
            </div>
          </div>

          {/* 构建中列表 */}
          <div className="building-list" style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px' }}>构建中列表</h4>
            <Table
              columns={buildingColumns}
              dataSource={buildingProjects}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </div>

          {/* 未构建列表 */}
          <div className="unbuilt-list" style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px' }}>未构建列表</h4>
            <Table
              columns={unbuiltColumns}
              dataSource={unbuiltProjects}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </div>

          {/* 操作日志 */}
          <OperationLogList logs={operationLogs} pagination={paginationConfig} />
        </div>
      ),
    },
    {
      key: '预发布环境',
      label: '预发布环境',
      children: (
        <div className="environment-content">
          {/* 预发布环境内容，与测试环境类似 */}
          {/* 环境配置区域 */}
          <div className="environment-config" style={{ marginBottom: '24px', padding: '16px', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
            {/* 第一行：应用名、版本号和空白占位 */}
            <div style={{ display: 'flex', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>应用名：</span>
                <Select
                  value={selectedAppId}
                  style={{ width: 200, marginLeft: '8px' }}
                  onChange={handleAppChange}
                  options={applications.map(app => ({ value: app.id, label: app.name }))}
                />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>版本号：</span>
                <span style={{ margin: '0 8px' }}>{buildConfig.oldVersion}</span>
                <ArrowRightOutlined />
                <span style={{ marginLeft: '8px' }}>{buildConfig.newVersion}</span>
              </div>
              <div style={{ flex: 1 }}></div> {/* 空白占位，确保与第二行3列对齐 */}
            </div>

            {/* 第二行：安装包名、构建方式、部署方式 */}
            <div style={{ display: 'flex', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>安装包名：</span>
                <span>{buildConfig.packageName}</span>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>构建方式：</span>
                <span>{buildConfig.buildMethod}</span>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>部署方式：</span>
                <span>{buildConfig.deployMethod}</span>
              </div>
            </div>

            {/* 部署分支行 */}
            <div style={{ display: 'flex', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>部署分支：</span>
                <span>{buildConfig.branch || 'main'}</span>
              </div>
            </div>

            {/* 第三行：部署列表 */}
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, marginRight: '8px' }}>部署列表：</span>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {buildConfig.servers.map((server: any, index: number) => (
                  <span key={index} style={{ marginRight: '16px' }}>
                    {renderServerStatus(server.ip, server.deployStatus)}
                  </span>
                ))}
              </div>
            </div>

            {/* 第四行：备注 */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ color: 'red' }}>备注：部署完成后请确认是否已正常</span>
            </div>

            {/* 第五行：进度条和构建部署按钮 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1, maxWidth: '250px' }}>
                <Progress
                  percent={buildConfig.buildProgress}
                  status={buildConfig.buildProgress === 100 ? 'success' : 'active'}
                  strokeColor={buildConfig.buildStatus === '构建失败' ? '#ff4d4f' : undefined}
                  style={{ flex: 1 }}
                />
              </div>
              <div style={{ margin: '0 16px' }}>
                {renderBuildStatus(buildConfig.buildStatus)}
              </div>
              <div style={{ flex: 1, maxWidth: '250px' }}>
                <Progress
                  percent={buildConfig.deployProgress}
                  status={buildConfig.deployProgress === 100 ? 'success' : 'active'}
                  strokeColor={buildConfig.deployStatus === '部署失败' ? '#ff4d4f' : undefined}
                  style={{ flex: 1 }}
                />
              </div>
              <div style={{ margin: '0 16px' }}>
                {renderDeployStatus(buildConfig.deployStatus)}
              </div>
              <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleBuildDeploy}>
                构建+部署
              </Button>
            </div>
          </div>

          {/* 构建中列表 */}
          <div className="building-list" style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px' }}>构建中列表</h4>
            <Table
              columns={buildingColumns}
              dataSource={buildingProjects}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </div>

          {/* 未构建列表 */}
          <div className="unbuilt-list" style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px' }}>未构建列表</h4>
            <Table
              columns={unbuiltColumns}
              dataSource={unbuiltProjects}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </div>

          {/* 操作日志 */}
          <OperationLogList logs={operationLogs} pagination={paginationConfig} />
        </div>
      ),
    },
    {
      key: '正式环境',
      label: '正式环境',
      children: (
        <div className="environment-content">
          {/* 正式环境内容，与测试环境类似 */}
          {/* 环境配置区域 */}
          <div className="environment-config" style={{ marginBottom: '24px', padding: '16px', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
            {/* 第一行：应用名、版本号和空白占位 */}
            <div style={{ display: 'flex', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>应用名：</span>
                <Select
                  value={selectedAppId}
                  style={{ width: 200, marginLeft: '8px' }}
                  onChange={handleAppChange}
                  options={applications.map(app => ({ value: app.id, label: app.name }))}
                />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>版本号：</span>
                <span style={{ margin: '0 8px' }}>{buildConfig.oldVersion}</span>
                <ArrowRightOutlined />
                <span style={{ marginLeft: '8px' }}>{buildConfig.newVersion}</span>
              </div>
              <div style={{ flex: 1 }}></div> {/* 空白占位，确保与第二行3列对齐 */}
            </div>

            {/* 第二行：安装包名、构建方式、部署方式 */}
            <div style={{ display: 'flex', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>安装包名：</span>
                <span>{buildConfig.packageName}</span>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>构建方式：</span>
                <span>{buildConfig.buildMethod}</span>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>部署方式：</span>
                <span>{buildConfig.deployMethod}</span>
              </div>
            </div>

            {/* 部署分支行 */}
            <div style={{ display: 'flex', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600 }}>部署分支：</span>
                <span>{buildConfig.branch || 'main'}</span>
              </div>
            </div>

            {/* 第三行：部署列表 */}
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, marginRight: '8px' }}>部署列表：</span>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {buildConfig.servers.map((server: any, index: number) => (
                  <span key={index} style={{ marginRight: '16px' }}>
                    {renderServerStatus(server.ip, server.deployStatus)}
                  </span>
                ))}
              </div>
            </div>

            {/* 第四行：备注 */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ color: 'red' }}>备注：部署完成后请确认是否已正常</span>
            </div>

            {/* 第五行：进度条和构建部署按钮 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1, maxWidth: '250px' }}>
                <Progress
                  percent={buildConfig.buildProgress}
                  status={buildConfig.buildProgress === 100 ? 'success' : 'active'}
                  strokeColor={buildConfig.buildStatus === '构建失败' ? '#ff4d4f' : undefined}
                  style={{ flex: 1 }}
                />
              </div>
              <div style={{ margin: '0 16px' }}>
                {renderBuildStatus(buildConfig.buildStatus)}
              </div>
              <div style={{ flex: 1, maxWidth: '250px' }}>
                <Progress
                  percent={buildConfig.deployProgress}
                  status={buildConfig.deployProgress === 100 ? 'success' : 'active'}
                  strokeColor={buildConfig.deployStatus === '部署失败' ? '#ff4d4f' : undefined}
                  style={{ flex: 1 }}
                />
              </div>
              <div style={{ margin: '0 16px' }}>
                {renderDeployStatus(buildConfig.deployStatus)}
              </div>
              <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleBuildDeploy}>
                构建+部署
              </Button>
            </div>
          </div>

          {/* 构建中列表 */}
          <div className="building-list" style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px' }}>构建中列表</h4>
            <Table
              columns={buildingColumns}
              dataSource={buildingProjects}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </div>

          {/* 未构建列表 */}
          <div className="unbuilt-list" style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px' }}>未构建列表</h4>
            <Table
              columns={unbuiltColumns}
              dataSource={unbuiltProjects}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </div>

          {/* 操作日志 */}
          <OperationLogList logs={operationLogs} pagination={paginationConfig} />
        </div>
      ),
    },
  ];

  return (
    <div className="builds-tab">
      <Tabs activeKey={activeTab} items={tabItems} onChange={handleTabChange} />
    </div>
  );
};

export default BuildsTab;