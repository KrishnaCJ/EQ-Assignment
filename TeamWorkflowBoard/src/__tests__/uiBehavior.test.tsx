import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { useTaskStore } from '../store/useTaskStore';

jest.mock('../store/useTaskStore');

describe('UI Behavior: Filters and Status Changes', () => {
  const mockSetFilters = jest.fn();
  const mockSetSort = jest.fn();
  const mockUpdateTask = jest.fn();
  const mockLoadFromStorage = jest.fn();

  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'Backlog',
      priority: 'High',
      assignee: 'Alice',
      tags: ['design'],
      createdAt: new Date('2024-03-20'),
      updatedAt: new Date('2024-03-22'),
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: 'In Progress',
      priority: 'Medium',
      assignee: 'Bob',
      tags: ['feature'],
      createdAt: new Date('2024-03-21'),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      filters: {
        statuses: ['Backlog', 'In Progress', 'Done'],
        priorities: ['Low', 'Medium', 'High'],
        search: '',
      },
      sort: { field: 'updatedAt', order: 'desc' },
      toast: null,
      migrationPerformed: false,
      addTask: jest.fn(),
      updateTask: mockUpdateTask,
      deleteTask: jest.fn(),
      setFilters: mockSetFilters,
      setSort: mockSetSort,
      loadFromStorage: mockLoadFromStorage,
      setToast: jest.fn(),
    });
  });

  test('should filter tasks by status', async () => {
    render(<App />);

    const statusButtons = screen.getAllByRole('button', { name: /in progress/i });
    // Get the filter button (first one in the filters section)
    const inProgressButton = statusButtons[0];
    await userEvent.click(inProgressButton);

    expect(mockSetFilters).toHaveBeenCalledWith({
      statuses: ['Backlog', 'Done']
    });
  });

  test('should search tasks by title', async () => {
    render(<App />);

    const searchInput = screen.getByPlaceholderText(/search by title or description/i);
    await userEvent.type(searchInput, 'Task');

    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);

    expect(mockSetFilters).toHaveBeenCalledWith({
      search: 'Task'
    });
  });

  test('should clear all filters', async () => {
    render(<App />);

    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    await userEvent.click(clearButton);

    expect(mockSetFilters).toHaveBeenCalledWith({
      statuses: ['Backlog', 'In Progress', 'Done'],
      priorities: ['Low', 'Medium', 'High'],
      search: '',
    });
  });

  test('should change task status via dropdown', async () => {
    render(<App />);

    const statusSelects = screen.getAllByRole('combobox');
    // The last combobox in the task card is the status dropdown
    const taskStatusSelect = statusSelects[statusSelects.length - 1];

    fireEvent.change(taskStatusSelect, { target: { value: 'Done' } });

    expect(mockUpdateTask).toHaveBeenCalledWith(
      '2',
      expect.objectContaining({
        status: 'Done'
      })
    );
  });

  test('should sort tasks by priority', async () => {
    render(<App />);

    const sortSelects = screen.getAllByRole('combobox');
    // The first combobox in the filters is the sort dropdown
    const sortSelect = sortSelects[0];
    fireEvent.change(sortSelect, { target: { value: 'priority' } });

    expect(mockSetSort).toHaveBeenCalledWith({
      field: 'priority',
      order: 'desc'
    });
  });
});
