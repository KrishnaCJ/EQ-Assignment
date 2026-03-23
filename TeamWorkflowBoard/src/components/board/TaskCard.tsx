import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Task, TaskPriority } from '../../types/task';
import { Card } from '../ui/Card';
import { Tag } from '../ui/Tag';
import { clsx } from 'clsx';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onStatusChange?: (status: Task['status']) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onStatusChange }) => {
  const updatedTimeAgo = formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true });

  return (
    <Card
      className="mb-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
      hoverable
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 text-sm">{task.title}</h3>
          <span className={clsx('px-2 py-1 rounded text-xs font-medium', priorityColors[task.priority])}>
            {task.priority}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>👤 {task.assignee || 'Unassigned'}</span>
          <span>•</span>
          <span>🕒 {updatedTimeAgo}</span>
        </div>
        
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <Tag key={tag} variant="secondary" size="sm">
                {tag}
              </Tag>
            ))}
          </div>
        )}
        
        {onStatusChange && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(e.target.value as Task['status'])}
            className="mt-2 text-xs border rounded px-2 py-1 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="Backlog">Backlog</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        )}
      </div>
    </Card>
  );
};