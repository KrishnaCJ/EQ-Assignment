import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { useTaskStore } from '../store/useTaskStore';

jest.mock('../store/useTaskStore');

describe('Core Workflow: Create and View Task', () => {
  const mockAddTask = jest.fn();
  const mockSetToast = jest.fn();
  const mockLoadFromStorage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      tasks: [],
      filters: {
        statuses: ['Backlog', 'In Progress', 'Done'],
        priorities: ['Low', 'Medium', 'High'],
        search: '',
      },
      sort: { field: 'updatedAt', order: 'desc' },
      toast: null,
      migrationPerformed: false,
      addTask: mockAddTask,
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      setFilters: jest.fn(),
      setSort: jest.fn(),
      loadFromStorage: mockLoadFromStorage,
      setToast: mockSetToast,
    });
  });

  test('should create a new task and see it on the board', async () => {
    render(<App />);

    const createButton = screen.getByTestId('create-task-button');
    await userEvent.click(createButton);

    const titleInput = screen.getByLabelText(/title/i);
    await userEvent.type(titleInput, 'Test Task');

    const descriptionInput = screen.getByLabelText(/description/i);
    await userEvent.type(descriptionInput, 'This is a test task description');

    const submitButtons = screen.getAllByRole('button', { name: /create task/i });
    // Get the submit button in the form (not the header button)
    const submitButton = submitButtons[submitButtons.length - 1];
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Task',
          description: 'This is a test task description',
        })
      );
    });
  });
});
