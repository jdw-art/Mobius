import React, { useState, useEffect } from 'react';
import { Select, Table, Input, Button, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import OperationLogList from '../common/OperationLogList';
import { 
  getAcceptanceTestEnvironmentTestCases, 
  getAcceptanceUATEnvironmentTestCases,
  calculateTestCaseStats,
  getAcceptanceTestEnvironmentSummary,
  getAcceptanceUATEnvironmentSummary,
  getAcceptanceTestEnvironmentUntestedReason,
  getAcceptanceUATEnvironmentUntestedReason,
  getAcceptanceOperationLogs,
  type TestCaseStats
} from '../../services/acceptanceService';

const { Option } = Select;

const AcceptanceTab: React.FC = () => {
  const [environment, setEnvironment] = useState<string>('test');
  const [testCaseStats, setTestCaseStats] = useState<TestCaseStats>({ total: 0, completed: 0, passed: 0, failed: 0, untested: 0 });
  const [testSummary, setTestSummary] = useState<string>('');
  const [untestedReason, setUntestedReason] = useState<string>('');
  const [deliveryAnalysis, setDeliveryAnalysis] = useState<string>('');
  const [operationLogs, setOperationLogs] = useState<any[]>([]);
  const [analysisSubmitted, setAnalysisSubmitted] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 表格列配置
  const columns: ColumnsType<TestCaseStats> = [
    {
      title: '总用例数',
      dataIndex: 'total',
      key: 'total',
      align: 'center',
      render: (value) => <span style={{ color: '#1890ff' }}>{value}</span>
    },
    {
      title: '已完成',
      dataIndex: 'completed',
      key: 'completed',
      align: 'center',
      render: (value) => <span style={{ color: '#1890ff' }}>{value}</span>
    },
    {
      title: '通过',
      dataIndex: 'passed',
      key: 'passed',
      align: 'center',
      render: (value) => <span style={{ color: '#1890ff' }}>{value}</span>
    },
    {
      title: '失败',
      dataIndex: 'failed',
      key: 'failed',
      align: 'center',
      render: (value) => <span style={{ color: '#1890ff' }}>{value}</span>
    },
    {
      title: '未测',
      dataIndex: 'untested',
      key: 'untested',
      align: 'center',
      render: (value) => <span style={{ color: '#1890ff' }}>{value}</span>
    }
  ];

  // 加载数据
  const loadData = (env: string) => {
    let testCases;
    
    if (env === 'test') {
      testCases = getAcceptanceTestEnvironmentTestCases();
      setTestSummary(getAcceptanceTestEnvironmentSummary());
      setUntestedReason(getAcceptanceTestEnvironmentUntestedReason());
    } else {
      testCases = getAcceptanceUATEnvironmentTestCases();
      setTestSummary(getAcceptanceUATEnvironmentSummary());
      setUntestedReason(getAcceptanceUATEnvironmentUntestedReason());
    }
    
    // 计算统计数据
    const stats = calculateTestCaseStats(testCases);
    setTestCaseStats(stats);
    
    // 加载操作日志
    setOperationLogs(getAcceptanceOperationLogs());
  };

  // 环境切换时重新加载数据
  useEffect(() => {
    loadData(environment);
  }, [environment]);

  // 验证表单
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!deliveryAnalysis?.trim()) {
      errors.deliveryAnalysis = '请输入交付结果分析';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 处理输入变化
  const handleDeliveryAnalysisChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDeliveryAnalysis(e.target.value);
    // 清除对应字段的错误信息
    if (formErrors.deliveryAnalysis) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.deliveryAnalysis;
        return newErrors;
      });
    }
  };

  // 提交交付结果分析
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    message.success('交付结果分析已提交');
    setAnalysisSubmitted(true);
  };

  // 重置交付结果分析
  const handleReset = () => {
    setDeliveryAnalysis('');
  };

  return (
    <div className="acceptance-content">
      
      {/* 执行环境选择 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
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
      </div>
      
      {/* 测试用例执行情况表格 */}
      <div style={{ marginBottom: '24px' }}>
        <Table
          columns={columns}
          dataSource={[testCaseStats]}
          pagination={false}
          rowKey="total"
        />
      </div>
      
      {/* 测试总结分析 */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ marginBottom: '8px' }}>测试总结分析</h4>
        <Input.TextArea
          value={testSummary}
          rows={6}
          readOnly
          style={{ backgroundColor: '#f5f5f5' }}
        />
      </div>
      
      {/* 未测原因说明 */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ marginBottom: '8px' }}>未测原因说明</h4>
        <Input.TextArea
          value={untestedReason}
          rows={4}
          readOnly
          style={{ backgroundColor: '#f5f5f5' }}
        />
      </div>
      
      {/* 交付结果分析 */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ marginBottom: '8px' }}>交付结果分析 <span style={{ color: 'red' }}>*</span></h4>
        <p style={{ color: 'red', fontSize: '12px', marginBottom: '8px' }}>说明该项软件的开发是否已达到预定目标，能否交付使用</p>
        <Input.TextArea
          value={deliveryAnalysis}
          onChange={handleDeliveryAnalysisChange}
          rows={6}
          placeholder="请输入交付结果分析..."
          disabled={analysisSubmitted}
          style={analysisSubmitted ? { backgroundColor: '#f5f5f5' } : undefined}
        />
        {formErrors.deliveryAnalysis && (
          <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
            {formErrors.deliveryAnalysis}
          </div>
        )}
        {!analysisSubmitted && (
          <div style={{ marginTop: '12px', display: 'flex' }}>
            <Popconfirm
              title="确认提交"
              onConfirm={handleSubmit}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary" style={{ marginRight: '12px' }}>
                提交
              </Button>
            </Popconfirm>
            <Button onClick={handleReset}>
              重置
            </Button>
          </div>
        )}
      </div>
      
      {/* 操作日志 */}
      <OperationLogList logs={operationLogs} />
    </div>
  );
};

export default AcceptanceTab;