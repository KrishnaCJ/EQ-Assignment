import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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

  const {
    register,
    control,
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
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
    if (task) {
      updateTask(task.id, {
        ...data,
        updatedAt: new Date(),
      });
      setToast({ message: 'Task updated successfully', type: 'success' });
    } else {
      const newTask: Task = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: data.tags.filter(tag => tag.trim()),
        assignee: data.assignee || '',
      };
      addTask(newTask);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          {...register('status')}
          options={[
            { value: 'Backlog', label: 'Backlog' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Done', label: 'Done' },
          ]}
        />

        <Select
          label="Priority"
          {...register('priority')}
          options={[
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' },
          ]}
        />
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
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <TextInput
              {...register(`tags.${index}`)}
              placeholder="Enter tag"
              fullWidth
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append('')}
        >
          + Add Tag
        </Button>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};