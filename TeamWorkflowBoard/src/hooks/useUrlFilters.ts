// src/hooks/useUrlFilters.ts
import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TaskFilters, TaskSort, TaskStatus, TaskPriority } from '../types/task';

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getFiltersFromUrl = useCallback((): TaskFilters => {
    const statuses = searchParams.get('statuses')?.split(',') as TaskStatus[] || 
                     ['Backlog', 'In Progress', 'Done'];
    const priorities = searchParams.get('priorities')?.split(',') as TaskPriority[] || 
                       ['Low', 'Medium', 'High'];
    const search = searchParams.get('search') || '';

    return { statuses, priorities, search };
  }, [searchParams]);

  const getSortFromUrl = useCallback((): TaskSort => {
    const field = (searchParams.get('sortField') as TaskSort['field']) || 'updatedAt';
    const order = (searchParams.get('sortOrder') as TaskSort['order']) || 'desc';
    return { field, order };
  }, [searchParams]);

  const updateUrl = useCallback((filters: TaskFilters, sort: TaskSort) => {
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
  }, [setSearchParams]);

  return { getFiltersFromUrl, getSortFromUrl, updateUrl };
}