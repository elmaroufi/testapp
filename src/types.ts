export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  completed: boolean;
  priority: Priority;
  category: string;
  notified: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Work', color: '#3b82f6' },
  { id: '2', name: 'Personal', color: '#10b981' },
  { id: '3', name: 'Health', color: '#ef4444' },
  { id: '4', name: 'Education', color: '#8b5cf6' },
];
