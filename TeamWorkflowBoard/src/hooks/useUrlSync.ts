import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTaskStore } from '../store/useTaskStore';
import { TaskFilters, TaskPriority, TaskSort, TaskStatus } from '../types/task';

export const useUrlSync = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, sort, setFilters, setSort } = useTaskStore();
  const isInitialMount = useRef(true);

  // Load from URL on mount
  useEffect(() => {
    const urlFilters: Partial<TaskFilters> = {};
    const urlSort: Partial<TaskSort> = {};

    const statuses = searchParams.get('statuses');
    if (statuses) urlFilters.statuses = statuses.split(',') as TaskStatus[];

    const priorities = searchParams.get('priorities');
    if (priorities) urlFilters.priorities = priorities.split(',') as TaskPriority[];

    const search = searchParams.get('search');
    if (search) urlFilters.search = search;

    const sortField = searchParams.get('sortField');
    if (sortField) urlSort.field = sortField as 'createdAt' | 'updatedAt' | 'priority';

    const sortOrder = searchParams.get('sortOrder');
    if (sortOrder) urlSort.order = sortOrder as 'asc' | 'desc';

    if (Object.keys(urlFilters).length) setFilters(urlFilters);
    if (Object.keys(urlSort).length) setSort(urlSort as TaskSort);

    isInitialMount.current = false;
  }, []);

  // Save to URL on changes
  useEffect(() => {
    if (isInitialMount.current) return;

    const params = new URLSearchParams();
    
    if (filters.statuses.length < 3) {
      params.set('statuses', filters.statuses.join(','));
    }
    
    if (filters.priorities.length < 3) {
      params.set('priorities', filters.priorities.join(','));
    }
    
    if (filters.search) {
      params.set('search', filters.search);
    }
    
    params.set('sortField', sort.field);
    params.set('sortOrder', sort.order);
    
    setSearchParams(params);
  }, [filters, sort, setSearchParams]);
};