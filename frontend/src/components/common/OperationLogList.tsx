import React from 'react';
import { List } from 'antd';
import type { OperationLog } from '../../types';

interface OperationLogListProps {
  logs: OperationLog[];
  pagination?: {
    pageSize: number;
    showSizeChanger?: boolean;
  };
}

const OperationLogList: React.FC<OperationLogListProps> = ({ 
  logs, 
  pagination = { pageSize: 10, showSizeChanger: false }
}) => {
  return (
    <div className="operation-logs">
      <h4 style={{ marginBottom: '16px' }}>操作日志</h4>
      <div style={{ padding: '16px', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
        <List
          dataSource={logs}
          pagination={pagination}
          renderItem={(log, index) => (
            <div key={index} style={{ marginBottom: '4px', whiteSpace: 'pre-line' }}>
              <span style={{ marginRight: '24px' }}>{log.time}</span>
              <span style={{ marginRight: '24px' }}>{log.user}</span>
              <span>{log.action}</span>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default OperationLogList;