import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { documentsService } from '@/services/documentsService';
import { TABLE_PAGINATION_CONFIG } from '@/constants';

interface Document {
  id: string;
  type: '需求文档' | '详细设计' | '测试报告';
  name: string;
  link: string;
  creator: string;
  createTime: string;
}

interface DocumentsTabProps {
  projectId: string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ projectId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // 初始化数据
  useEffect(() => {
    setLoading(true);
    documentsService.getByProject(projectId)
      .then(setDocuments)
      .catch((error) => {
        console.error('Failed to load documents:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectId]);

  // 表格列配置
  const columns: ColumnsType<Document> = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      align: 'center',
      render: (text: string) => {
        let color = '';
        switch (text) {
          case '需求文档':
            color = '#1890ff';
            break;
          case '详细设计':
            color = '#52c41a';
            break;
          case '测试报告':
            color = '#fa8c16';
            break;
          default:
            color = '#d9d9d9';
        }
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      align: 'center'
    },
    {
      title: '链接',
      dataIndex: 'link',
      key: 'link',
      align: 'center',
      render: (text: string) => (
        <a href={text} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
          查看文档
        </a>
      )
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      align: 'center',
      render: (text: string) => {
        // 确保时间精确到秒格式，示例格式：2024-01-10 12:30:45
        if (text.length === 10) { // 如果只有日期部分 YYYY-MM-DD
          return `${text} 00:00:00`;
        }
        return text;
      }
    }
  ];

  return (
    <div>

      <Table
        columns={columns}
        dataSource={documents}
        rowKey="id"
        pagination={false}
        scroll={{ x: 1000 }}
        loading={loading}
      />
    </div>
  );
};

export default DocumentsTab;