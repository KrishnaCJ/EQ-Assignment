import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTaskStore } from '../../store/useTaskStore';
import { Button } from '../ui/Button';
import { TextInput } from '../ui/TextInput';
import { TextArea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import { Task } from '../../types/task';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['Backlog', 'In Progress', 'Done']),
  priority: z.enum(['Low', 'Medium', 'High']),
  assignee: z.string().optional(),
  tags: z.array(z.string()),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSuccess, onCancel }) => {
  const { addTask, updateTask, setToast } = useTaskStore();
  const [hasChanges, setHasChanges] = useState(false);
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee,
      tags: task.tags,
    } : {
      title: '',
      description: '',
      status: 'Backlog',
      priority: 'Medium',
      assignee: '',
      tags: [],
    },
  });

  useEffect(() => {
    const subscription = watch(() => {
      setHasChanges(isDirty);
    });
    return () => subscription.unsubscribe();
  }, [watch, isDirty]);

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

  const onSubmit = (data: TaskFormData) => {
    const finalTags = tags.filter(tag => tag.trim());
    
    if (task) {
      updateTask(task.id, {
        ...data,
        tags: finalTags,
        updatedAt: new Date(),
      });
      setToast({ message: 'Task updated successfully', type: 'success' });
    } else {
      const newTask: Task = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: finalTags,
        assignee: data.assignee || '',
      };
      addTask(newTask);
    }
    onSuccess();
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <TextInput
        label="Title"
        {...register('title')}
        error={errors.title?.message}
        placeholder="Enter task title"
      />

      <TextArea
        label="Description"
        {...register('description')}
        error={errors.description?.message}
        placeholder="Enter task description"
        rows={4}
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Status
          </label>
          <Select
            {...register('status')}
            options={[
              { value: 'Backlog', label: 'Backlog' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Done', label: 'Done' },
            ]}
            className="text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Priority
          </label>
          <Select
            {...register('priority')}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
            ]}
            className="text-xs"
          />
        </div>
      </div>

      <TextInput
        label="Assignee"
        {...register('assignee')}
        placeholder="Enter assignee name"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <TextInput
              placeholder="Enter tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              fullWidth
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addTag}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-blue-600 hover:text-blue-800 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" size="sm">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};