import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import { useTaskStore } from '../store/useTaskStore';

// Mock the store
jest.mock('../store/useTaskStore');

describe('Team Workflow Board Tests', () => {
  const mockAddTask = jest.fn();
  const mockUpdateTask = jest.fn();
  const mockSetFilters = jest.fn();
  const mockSetSort = jest.fn();
  const mockLoadFromStorage = jest.fn();
  const mockSetToast = jest.fn();

  const mockTasks = [
    {
      id: '1',
      title: 'Design System',
      description: 'Create component library',
      status: 'Backlog',
      priority: 'High',
      assignee: 'Alice',
      tags: ['design'],
      createdAt: new Date('2024-03-20'),
      updatedAt: new Date('2024-03-22'),
    },
    {
      id: '2',
      title: 'Testing',
      description: 'Write unit tests',
      status: 'In Progress',
      priority: 'Medium',
      assignee: 'Bob',
      tags: ['testing'],
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
      addTask: mockAddTask,
      updateTask: mockUpdateTask,
      setFilters: mockSetFilters,
      setSort: mockSetSort,
      loadFromStorage: mockLoadFromStorage,
      setToast: mockSetToast,
    });
  });

  test('should render the app with tasks', () => {
    render(<App />);
    expect(screen.getByText('Team Workflow Board')).toBeInTheDocument();
    expect(screen.getByText('Design System')).toBeInTheDocument();
    expect(screen.getByText('Testing')).toBeInTheDocument();
  });

  test('should create a new task', async () => {
    render(<App />);
    
    const createButton = screen.getByText(/create task/i);
    fireEvent.click(createButton);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    
    await userEvent.type(titleInput, 'New Task');
    await userEvent.type(descriptionInput, 'New Description');
    
    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);
    
    expect(mockAddTask).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Task',
        description: 'New Description',
      })
    );
  });

  test('should edit an existing task', async () => {
    render(<App />);
    
    const taskCard = screen.getByText('Design System');
    fireEvent.click(taskCard);
    
    const titleInput = screen.getByLabelText(/title/i);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Updated Design');
    
    const updateButton = screen.getByRole('button', { name: /update task/i });
    fireEvent.click(updateButton);
    
    expect(mockUpdateTask).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        title: 'Updated Design',
      })
    );
  });

  test('should filter tasks by status', () => {
    render(<App />);
    
    const backlogButton = screen.getByRole('button', { name: /backlog/i });
    fireEvent.click(backlogButton);
    
    expect(mockSetFilters).toHaveBeenCalledWith({
      statuses: ['In Progress', 'Done']
    });
  });

  test('should search tasks', async () => {
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    await userEvent.type(searchInput, 'Design');
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
    
    expect(mockSetFilters).toHaveBeenCalledWith({
      search: 'Design'
    });
  });

  test('should clear filters', () => {
    render(<App />);
    
    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    fireEvent.click(clearButton);
    
    expect(mockSetFilters).toHaveBeenCalledWith({
      statuses: ['Backlog', 'In Progress', 'Done'],
      priorities: ['Low', 'Medium', 'High'],
      search: '',
    });
  });

  test('should show validation errors for empty title', async () => {
    render(<App />);
    
    const createButton = screen.getByText(/create task/i);
    fireEvent.click(createButton);
    
    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  test('should change task status', () => {
    render(<App />);
    
    const statusSelects = screen.getAllByRole('combobox');
    const firstTaskStatus = statusSelects[0];
    
    fireEvent.change(firstTaskStatus, { target: { value: 'Done' } });
    
    expect(mockUpdateTask).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        status: 'Done'
      })
    );
  });
});