export type TaskStatus = 'Backlog' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFilters {
  statuses: TaskStatus[];
  priorities: TaskPriority[];
  search: string;
}

export interface TaskSort {
  field: 'createdAt' | 'updatedAt' | 'priority';
  order: 'asc' | 'desc';
}