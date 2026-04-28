import { CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';
import { Task, DEFAULT_CATEGORIES } from '../types';
import { cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { motion } from 'motion/react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const category = DEFAULT_CATEGORIES.find(c => c.name === task.category);
  const startTime = parseISO(task.startTime);
  const endTime = parseISO(task.endTime);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        "group relative flex items-start gap-4 p-6 rounded-3xl transition-all border border-transparent",
        task.completed ? "bg-gray-50 opacity-60" : "bg-white shadow-sm hover:shadow-md hover:border-gray-100"
      )}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "mt-1 transition-colors",
          task.completed ? "text-green-500" : "text-gray-300 hover:text-black"
        )}
      >
        {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: category?.color || '#000' }} 
          />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {task.category}
          </span>
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
            task.priority === 'high' ? "bg-red-100 text-red-600" :
            task.priority === 'medium' ? "bg-orange-100 text-orange-600" :
            "bg-blue-100 text-blue-600"
          )}>
            {task.priority}
          </span>
        </div>

        <h3 className={cn(
          "text-lg font-bold tracking-tight mb-1 truncate",
          task.completed && "line-through"
        )}>
          {task.title}
        </h3>

        {task.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
}
