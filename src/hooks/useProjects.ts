import { useState, useCallback } from 'react';
import { MOCK_PROJECTS } from '@/constants';
import { filterUtils } from '@/utils';

export const useProjects = () => {
  const [projects] = useState(MOCK_PROJECTS);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');

  // 过滤后的项目列表
  const filteredProjects = useCallback(() => {
    return filterUtils.filterProjects(projects, searchText, filterType);
  }, [projects, searchText, filterType]);

  // 更新搜索文本
  const updateSearchText = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  // 更新过滤类型
  const updateFilterType = useCallback((type: string) => {
    setFilterType(type);
  }, []);

  // 重置过滤器
  const resetFilters = useCallback(() => {
    setSearchText('');
    setFilterType('all');
  }, []);

  return {
    projects: filteredProjects(),
    searchText,
    filterType,
    updateSearchText,
    updateFilterType,
    resetFilters
  };
};
