// src/App.tsx
import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useTaskStore } from './store/useTaskStore';
import { BoardView } from './components/board/BoardView';
import { TaskFilters } from './components/board/TaskFilters';
import { TaskForm } from './components/forms/TaskForm';
import { Button } from './components/ui/Button';
import { Modal } from './components/ui/Modal';
import { Toast } from './components/ui/Toast';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const { loadFromStorage, toast, setToast, migrationPerformed } = useTaskStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (migrationPerformed) {
      setToast({ message: 'Data migration completed successfully', type: 'info' });
    }
  }, [migrationPerformed, setToast]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Team Workflow Board</h1>
              <Button 
                onClick={() => setIsModalOpen(true)}
                data-testid="create-task-button"
              >
                + Create Task
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TaskFilters />
          <BoardView onEditTask={(task) => {
            setEditingTask(task);
            setIsModalOpen(true);
          }} />
        </main>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          title={editingTask ? 'Edit Task' : 'Create New Task'}
          size="lg"
        >
          <TaskForm
            task={editingTask}
            onSuccess={() => {
              setIsModalOpen(false);
              setEditingTask(null);
            }}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingTask(null);
            }}
          />
        </Modal>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type as any}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;