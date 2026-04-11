import { useState, useCallback, useEffect } from 'react';
import { projectService, ProjectListItem } from '../services/projectService';
import { filterUtils } from '@/utils';

export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects(1, 100);
      setProjects(response.items || []);
      setError(null);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Filtered projects
  const filteredProjects = useCallback(() => {
    return filterUtils.filterProjects(projects, searchText, filterType);
  }, [projects, searchText, filterType]);

  // Update search text
  const updateSearchText = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  // Update filter type
  const updateFilterType = useCallback((type: string) => {
    setFilterType(type);
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchText('');
    setFilterType('all');
  }, []);

  return {
    projects: filteredProjects(),
    loading,
    error,
    searchText,
    filterType,
    updateSearchText,
    updateFilterType,
    resetFilters,
    refetch: fetchProjects,
  };
};
