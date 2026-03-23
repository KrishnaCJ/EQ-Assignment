import { useState, useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { Task } from '../types/task';

interface UseTaskFormProps {
  task?: Task | null;
  onSuccess: () => void;
}

export const useTaskForm = ({ task, onSuccess }: UseTaskFormProps) => {
  const { addTask, updateTask, setToast } = useTaskStore();
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'Backlog',
    priority: task?.priority || 'Medium',
    assignee: task?.assignee || '',
    tags: task?.tags || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 100) newErrors.title = 'Title is too long';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      if (task) {
        updateTask(task.id, {
          ...formData,
          updatedAt: new Date(),
        });
        setToast({ message: 'Task updated successfully', type: 'success' });
      } else {
        const newTask = {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: formData.tags.filter(tag => tag.trim()),
        };
        addTask(newTask);
      }
      onSuccess();
    } catch (error) {
      setToast({ message: 'Failed to save task', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Warn on navigation if has changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  return {
    formData,
    errors,
    hasChanges,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
};