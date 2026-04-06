import React, { useState, useEffect } from 'react';
import { Select, Input, Button, Space, Table, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { getTestEnvironmentTestCases, getUATEnvironmentTestCases } from '../../../services/testingService';
import { TestCase } from '../../../types';

const { Option } = Select;

const TestPlan: React.FC = () => {
  const [environment, setEnvironment] = useState<string>('test');
  const [caseName, setCaseName] = useState<string>('');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 根据环境加载测试用例数据
  const loadTestCases = (env: string) => {
    if (env === 'test') {
      setTestCases(getTestEnvironmentTestCases());
    } else if (env === 'uat') {
      setTestCases(getUATEnvironmentTestCases());
    } else {
      setTestCases([]);
    }
  };

  // 搜索测试用例
  const handleSearch = () => {
    console.log('搜索用例:', { environment, caseName });
    let filteredCases: TestCase[] = [];
    if (environment === 'test') {
      filteredCases = getTestEnvironmentTestCases();
    } else if (environment === 'uat') {
      filteredCases = getUATEnvironmentTestCases();
    }

    if (caseName.trim()) {
      filteredCases = filteredCases.filter((item: TestCase) => 
        item.name.includes(caseName.trim())
      );
    }
    
    setTestCases(filteredCases);
    // 重置选中状态
    setSelectedRowKeys([]);
  };

  // 处理删除用例
  const handleDeleteTestCase = () => {
    if (selectedRowKeys.length === 0) {
      console.log('请先选择要删除的用例');
      return;
    }
    console.log('删除用例:', selectedRowKeys);
    // 前端模拟删除
    const updatedTestCases = testCases.filter(testCase => !selectedRowKeys.includes(testCase.id));
    setTestCases(updatedTestCases);
    setSelectedRowKeys([]);
  };

  // 定义行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: TestCase) => ({
      disabled: false,
    }),
  };

  // 初始化时加载默认环境数据
  useEffect(() => {
    loadTestCases(environment);
  }, [environment]);

  const handleAddCase = () => {
    console.log('添加用例');
    // 添加用例逻辑将在这里实现
  };

  const handleImportCase = () => {
    console.log('导入用例');
    // 导入用例逻辑将在这里实现
  };

  const handleTestComplete = () => {
    console.log('测试完成');
    // 测试完成逻辑将在这里实现
  };

  return (
    <div className="test-plan-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h4 style={{ marginRight: '16px', marginBottom: 0 }}>执行环境</h4>
          <Select
            placeholder="执行环境"
            style={{ width: 150, marginRight: '12px' }}
            value={environment}
            onChange={setEnvironment}
          >
            <Option value="test">测试环境</Option>
            <Option value="uat">UAT环境</Option>
          </Select>
          <Input
            placeholder="用例名称查询"
            style={{ width: 200, marginRight: '12px' }}
            value={caseName}
            onChange={(e) => setCaseName(e.target.value)}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} />
        </div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCase}>
            添加用例
          </Button>
          <Button onClick={handleImportCase}>
            导入用例
          </Button>
          <Popconfirm
            title="确认删除"
            onConfirm={handleDeleteTestCase}
            okText="确定"
            cancelText="取消"
            placement="topRight"
          >
            <Button 
              type="default" 
              danger
            >
              删除用例
            </Button>
          </Popconfirm>
          <Button 
            type="default" 
            style={{ backgroundColor: '#fa8c16', color: 'white', border: 'none' }}
            onClick={handleTestComplete}
          >
            测试完成
          </Button>
        </Space>
      </div>
      
      <div className="test-plan-details">
        {/* 测试用例列表 */}
        <Table
          columns={[
            {
              title: '用例编号',
              dataIndex: 'id',
              key: 'id',
              align: 'center'
            },
            {
              title: '用例名称',
              dataIndex: 'name',
              key: 'name',
              align: 'center'
            },
            {
              title: '所属应用',
              dataIndex: 'application',
              key: 'application',
              align: 'center'
            },
            {
              title: '创建人',
              dataIndex: 'creator',
              key: 'creator',
              align: 'center'
            },
            {
              title: '创建时间',
              dataIndex: 'createTime',
              key: 'createTime',
              align: 'center'
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              align: 'center',
              render: (status: string) => {
                if (status === '通过') {
                  return <CheckCircleOutlined style={{ color: 'green' }} />;
                } else if (status === '失败') {
                  return <CloseCircleOutlined style={{ color: 'red' }} />;
                } else {
                  return <CheckCircleOutlined style={{ color: 'grey' }} />;
                }
              }
            }
          ]}
          dataSource={testCases}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          style={{
            marginTop: '16px',
            textAlign: 'center' // 表格内容居中
          }}
          rowSelection={rowSelection}
        />
      </div>
    </div>
  );
};

export default TestPlan;