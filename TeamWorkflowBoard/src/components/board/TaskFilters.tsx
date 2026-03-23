import React, { useState, useEffect } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Button } from '../ui/Button';
import { TextInput } from '../ui/TextInput';
import { Select } from '../ui/Select';
import { TaskStatus, TaskPriority } from '../../types/task';

const statusOptions: TaskStatus[] = ['Backlog', 'In Progress', 'Done'];
const priorityOptions: TaskPriority[] = ['Low', 'Medium', 'High'];

export const TaskFilters: React.FC = () => {
  const { filters, sort, setFilters, setSort } = useTaskStore();
  const [localSearch, setLocalSearch] = useState(filters.search);

  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  const handleStatusToggle = (status: TaskStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    
    setFilters({ statuses: newStatuses });
  };

  const handlePriorityToggle = (priority: TaskPriority) => {
    const newPriorities = filters.priorities.includes(priority)
      ? filters.priorities.filter(p => p !== priority)
      : [...filters.priorities, priority];
    
    setFilters({ priorities: newPriorities });
  };

  const handleSearch = () => {
    setFilters({ search: localSearch });
  };

  const clearFilters = () => {
    setFilters({
      statuses: ['Backlog', 'In Progress', 'Done'],
      priorities: ['Low', 'Medium', 'High'],
      search: '',
    });
    setLocalSearch('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(status => (
              <Button
                key={status}
                size="sm"
                variant={filters.statuses.includes(status) ? 'primary' : 'secondary'}
                onClick={() => handleStatusToggle(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <div className="flex flex-wrap gap-2">
            {priorityOptions.map(priority => (
              <Button
                key={priority}
                size="sm"
                variant={filters.priorities.includes(priority) ? 'primary' : 'secondary'}
                onClick={() => handlePriorityToggle(priority)}
              >
                {priority}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <div className="flex gap-2">
            <Select
              value={sort.field}
              onChange={(e) => setSort({ ...sort, field: e.target.value as any })}
              options={[
                { value: 'createdAt', label: 'Created Date' },
                { value: 'updatedAt', label: 'Updated Date' },
                { value: 'priority', label: 'Priority' },
              ]}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSort({ ...sort, order: sort.order === 'asc' ? 'desc' : 'asc' })}
            >
              {sort.order === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <div className="flex-1">
          <TextInput
            placeholder="Search by title or description..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
        <Button variant="secondary" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
};