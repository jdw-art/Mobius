import { Document } from '../types';

// 模拟文档数据
export const getDocuments = (): Document[] => {
  return [
    {
      id: 'DOC001',
      type: '需求文档',
      name: '用户管理系统需求规格说明书',
      link: 'https://example.com/docs/req001.pdf',
      creator: '张三',
      createTime: '2024-01-10'
    },
    {
      id: 'DOC002',
      type: '详细设计',
      name: '用户管理系统架构设计文档',
      link: 'https://example.com/docs/design001.pdf',
      creator: '李四',
      createTime: '2024-01-15'
    }
  ];
};