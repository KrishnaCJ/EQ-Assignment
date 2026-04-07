import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { TaskCard } from './TaskCard';
import { Task, TaskStatus } from '../../types/task';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface BoardViewProps {
  onEditTask: (task: Task) => void;
}

const columns: TaskStatus[] = ['Backlog', 'In Progress', 'Done'];

export const BoardView: React.FC<BoardViewProps> = ({ onEditTask }) => {
  const { tasks, filters, sort, updateTask, setFilters } = useTaskStore();

  const getFilteredAndSortedTasks = () => {
    let filtered = tasks.filter((task) => {
      if (!filters.statuses.includes(task.status)) return false;
      if (!filters.priorities.includes(task.priority)) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });

    filtered.sort((a, b) => {
      if (sort.field === 'priority') {
        const priorityOrder = { Low: 1, Medium: 2, High: 3 };
        const aPriority = priorityOrder[a.priority];
        const bPriority = priorityOrder[b.priority];
        if (aPriority < bPriority) return sort.order === 'asc' ? -1 : 1;
        if (aPriority > bPriority) return sort.order === 'asc' ? 1 : -1;
        return 0;
      }

      const aVal = a[sort.field];
      const bVal = b[sort.field];

      if (aVal < bVal) return sort.order === 'asc' ? -1 : 1;
      if (aVal > bVal) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const filteredTasks = getFilteredAndSortedTasks();
  
  const hasActiveFilters = 
    filters.statuses.length < 3 || 
    filters.priorities.length < 3 || 
    filters.search !== '';

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  const clearFilters = () => {
    setFilters({
      statuses: ['Backlog', 'In Progress', 'Done'],
      priorities: ['Low', 'Medium', 'High'],
      search: '',
    });
  };

  if (tasks.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">No tasks yet</h3>
          <p className="text-gray-500">Get started by creating your first task</p>
        </div>
      </Card>
    );
  }

  if (filteredTasks.length === 0 && hasActiveFilters) {
    return (
      <Card className="text-center py-12">
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">No matching tasks</h3>
          <p className="text-gray-500">Try adjusting your filters to see more tasks</p>
          <Button variant="secondary" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {columns.map((status) => {
        const statusTasks = getTasksByStatus(status);
        
        return (
          <div key={status} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-700">{status}</h2>
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                {statusTasks.length}
              </span>
            </div>
            <div className="space-y-3 min-h-[200px]">
              {statusTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onEditTask(task)}
                  onStatusChange={(newStatus) => updateTask(task.id, { status: newStatus })}
                />
              ))}
              {statusTasks.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No tasks in {status.toLowerCase()}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};