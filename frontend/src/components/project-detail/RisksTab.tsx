import React, { useState, useEffect } from 'react';
import { Table, Checkbox, Input, Form, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getRiskData } from '@/services/overviewService';
import { RiskItem, RiskData } from '@/types';

const RisksTab: React.FC = () => {
  const [riskData, setRiskData] = useState<RiskData>({ riskItems: [] });
  const [form] = Form.useForm();

  // 获取风险数据
  useEffect(() => {
    const data = getRiskData();
    setRiskData(data);
  }, []);

  // 处理风险认定变更
  const handleRiskStatusChange = (id: string, status: 'yes' | 'no' | undefined) => {
    setRiskData(prev => ({
      ...prev,
      riskItems: prev.riskItems.map(item => 
        item.id === id ? { ...item, riskStatus: status } : item
      )
    }));
  };

  // 处理备注变更
  const handleRemarkChange = (id: string, remark: string) => {
    setRiskData(prev => ({
      ...prev,
      riskItems: prev.riskItems.map(item => 
        item.id === id ? { ...item, remark } : item
      )
    }));
  };

  // 计算相同风险类型的单元格合并信息
  const getRowSpanConfig = (dataSource: RiskItem[]) => {
    const rowSpanMap: Record<string, number> = {};
    const rowSpanArray: number[] = [];
    const skipMap: Record<number, boolean> = {};

    // 统计每种风险类型出现的次数
    dataSource.forEach(item => {
      rowSpanMap[item.riskType] = (rowSpanMap[item.riskType] || 0) + 1;
    });

    // 生成每行的rowSpan值
    dataSource.forEach((item, index) => {
      if (skipMap[index]) return;
      
      const span = rowSpanMap[item.riskType];
      rowSpanArray[index] = span;
      
      // 标记需要跳过的行
      for (let i = 1; i < span; i++) {
        if (index + i < dataSource.length) {
          rowSpanArray[index + i] = 0;
          skipMap[index + i] = true;
        }
      }
    });

    return rowSpanArray;
  };

  // 表格列配置
  const columns: ColumnsType<RiskItem> = [
    {
      title: '风险类型',
      dataIndex: 'riskType',
      key: 'riskType',
      width: 150,
      align: 'center',
      // 配置单元格合并和样式
      onCell: (_, index) => {
        const rowSpanArray = getRowSpanConfig(riskData.riskItems);
        // 确保index是有效数字再使用
        const rowSpan = typeof index === 'number' ? (rowSpanArray[index] || 0) : 0;
        
        return {
          rowSpan,
          style: rowSpan > 0 ? { verticalAlign: 'middle' } : { display: 'none' }
        };
      }
    },
    {
      title: '风险项',
      dataIndex: 'riskItem',
      key: 'riskItem',
        width: 300,
        align: 'center',
    },
    {
      title: '风险认定',
      key: 'isRisk',
        width: 100,
        align: 'center',
      render: (_: any, record: RiskItem) => (
        <Space>
          <Checkbox
            checked={record.riskStatus === 'yes'}
            onChange={(e) => {
              if (e.target.checked) {
                handleRiskStatusChange(record.id, 'yes');
              } else if (record.riskStatus === 'yes') {
                handleRiskStatusChange(record.id, undefined);
              }
            }}
            className="round-checkbox"
            style={{color: '#1890ff'}}
          >
            是
          </Checkbox>
          <Checkbox
            checked={record.riskStatus === 'no'}
            onChange={(e) => {
              if (e.target.checked) {
                handleRiskStatusChange(record.id, 'no');
              } else if (record.riskStatus === 'no') {
                handleRiskStatusChange(record.id, undefined);
              }
            }}
            className="round-checkbox"
            style={{color: '#1890ff'}}
          >
            否
          </Checkbox>
        </Space>
      )
    },
    {
      title: '备注',
      key: 'remark',
        width: 300,
        align: 'center',
      render: (_: any, record: RiskItem) => (
        <Input
          value={record.remark || ''}
          onChange={(e) => handleRemarkChange(record.id, e.target.value)}
          disabled={record.riskStatus !== 'yes'}
          placeholder="若涉及，请详细说明，并提出应对措施"
        />
      ),
    },
  ];

  return (
    <div className="risks-tab-container">
      <div className="risks-content">
        <Table
          columns={columns}
          dataSource={riskData.riskItems}
          rowKey="id"
          bordered
          pagination={false}
        />
      </div>
    </div>
  );
};

export default RisksTab;