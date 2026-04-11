import { request } from '../utils/request';
import { Document } from '../types';

// Mock data - kept for backwards compatibility
const MOCK_DOCUMENTS: Document[] = [
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

// Sync version for backwards compatibility
export const getDocuments = (): Document[] => {
  return MOCK_DOCUMENTS;
};

// Async API version
export interface DocumentCreate {
  name: string;
  type: string;
  link: string;
}

export interface DocumentUpdate {
  name?: string;
  type?: string;
  link?: string;
}

export const documentsService = {
  getByProject: async (projectId: string): Promise<Document[]> => {
    try {
      const response = await request.get(`/api/v1/projects/${projectId}/documents`);
      return response.data;
    } catch (error) {
      return MOCK_DOCUMENTS;
    }
  },

  create: async (projectId: string, data: DocumentCreate): Promise<Document> => {
    const response = await request.post(`/api/v1/projects/${projectId}/documents`, data);
    return response.data;
  },

  update: async (projectId: string, documentId: string, data: DocumentUpdate): Promise<Document> => {
    const response = await request.put(`/api/v1/projects/${projectId}/documents/${documentId}`, data);
    return response.data;
  },

  delete: async (projectId: string, documentId: string): Promise<void> => {
    await request.delete(`/api/v1/projects/${projectId}/documents/${documentId}`);
  },
};
