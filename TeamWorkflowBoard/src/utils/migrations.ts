// src/utils/migrations.ts
import { Task } from '../types/task';

export const CURRENT_SCHEMA_VERSION = 2;

interface StoredData {
  schemaVersion: number;
  tasks: Task[];
}

export function migrateData(rawData: { schemaVersion?: number; tasks?: Array<{ createdAt?: string; updatedAt?: string; tags?: string[] }> }): StoredData {
  if (!rawData || typeof rawData !== 'object') {
    return { schemaVersion: CURRENT_SCHEMA_VERSION, tasks: [] };
  }

  let version = rawData.schemaVersion || 1;
  let tasks = rawData.tasks || [];

  // Migration from v1 to v2
  if (version === 1) {
    tasks = tasks.map((task: { createdAt?: string; updatedAt?: string; tags?: string[] }) => ({
      ...task,
      // Convert date strings to Date objects
      createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
      updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),
      // Ensure tags is always an array
      tags: task.tags || [],
    }));
    version = 2;
  }

  return {
    schemaVersion: version,
    tasks,
  };
}