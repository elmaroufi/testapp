import { useEffect, useCallback } from 'react';
import { Task } from '../types';
import { isAfter, isBefore, addMinutes, parseISO } from 'date-fns';

interface NotificationManagerProps {
  tasks: Task[];
  onNotify: (taskId: string) => void;
}

export default function NotificationManager({ tasks, onNotify }: NotificationManagerProps) {
  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  const sendNotification = useCallback((task: Task) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Task Starting: ${task.title}`, {
        body: task.description || 'It\'s time to start your planned task!',
        icon: '/favicon.ico', // Fallback icon
      });
    }
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    const checkTasks = () => {
      const now = new Date();
      tasks.forEach((task) => {
        if (!task.completed && !task.notified) {
          const startTime = parseISO(task.startTime);
          // Notify 2 minutes before or exactly at start time
          const notifyWindowStart = addMinutes(startTime, -2);
          
          if (isAfter(now, notifyWindowStart) && isBefore(now, addMinutes(startTime, 1))) {
            sendNotification(task);
            onNotify(task.id);
          }
        }
      });
    };

    const interval = setInterval(checkTasks, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [tasks, onNotify, sendNotification]);

  return null;
}
