import { create } from 'zustand';
import { Task, TaskFilters, TaskSort } from '../types/task';

interface TaskStore {
  tasks: Task[];
  filters: TaskFilters;
  sort: TaskSort;
  toast: { message: string; type: string } | null;
  migrationPerformed: boolean;
  
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  setSort: (sort: TaskSort) => void;
  setToast: (toast: { message: string; type: string } | null) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design System Setup',
    description: 'Create reusable component library with consistent theming using Tailwind CSS',
    status: 'Backlog',
    priority: 'High',
    assignee: 'Alice Chen',
    tags: ['design', 'ui', 'frontend'],
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-22'),
  },
  {
    id: '2',
    title: 'Implement Task Board',
    description: 'Create the main board view with drag and drop functionality',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Bob Wilson',
    tags: ['feature', 'core'],
    createdAt: new Date('2024-03-21'),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Write Unit Tests',
    description: 'Cover core components with Jest and React Testing Library',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Carol Davis',
    tags: ['testing', 'quality'],
    createdAt: new Date('2024-03-19'),
    updatedAt: new Date('2024-03-22'),
  },
  {
    id: '4',
    title: 'Setup CI/CD Pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: 'Backlog',
    priority: 'Medium',
    assignee: 'David Kim',
    tags: ['devops', 'automation'],
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-20'),
  },
  {
    id: '5',
    title: 'Review Pull Requests',
    description: 'Review and merge pending PRs from the team',
    status: 'Done',
    priority: 'Low',
    assignee: 'Emma Watson',
    tags: ['review', 'collaboration'],
    createdAt: new Date('2024-03-22'),
    updatedAt: new Date('2024-03-23'),
  },
];

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  filters: {
    statuses: ['Backlog', 'In Progress', 'Done'],
    priorities: ['Low', 'Medium', 'High'],
    search: '',
  },
  sort: { field: 'updatedAt', order: 'desc' },
  toast: null,
  migrationPerformed: false,

  addTask: (task) => {
    set((state) => ({ tasks: [...state.tasks, task] }));
    get().saveToStorage();
    get().setToast({ message: 'Task created successfully', type: 'success' });
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      ),
    }));
    get().saveToStorage();
  },

  deleteTask: (id) => {
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
    get().saveToStorage();
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  setSort: (sort) => {
    set({ sort });
  },

  setToast: (toast) => {
    set({ toast });
    if (toast) {
      setTimeout(() => set({ toast: null }), 3000);
    }
  },

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem('workflow-board-data');
      if (stored) {
        const parsed = JSON.parse(stored);
        const tasks = parsed.tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
        set({ tasks });
      } else {
        set({ tasks: SAMPLE_TASKS });
        get().saveToStorage();
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      set({ tasks: SAMPLE_TASKS });
    }
  },

  saveToStorage: () => {
    try {
      const data = {
        schemaVersion: 2,
        tasks: get().tasks,
      };
      localStorage.setItem('workflow-board-data', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  },
}));