import React, { useState } from 'react';
import { Plus, X, Clock, Tag, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, Priority, DEFAULT_CATEGORIES } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface TaskFormProps {
  onAdd: (task: Omit<Task, 'id' | 'completed' | 'notified'>) => void;
}

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [endTime, setEndTime] = useState(format(new Date(Date.now() + 3600000), "yyyy-MM-dd'T'HH:mm"));
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0].name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title,
      description,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      priority,
      category,
    });

    setTitle('');
    setDescription('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50"
      >
        <Plus size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[500px] bg-white rounded-3xl p-8 shadow-2xl z-50"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight">New Plan</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                    What's the plan?
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Morning Workout"
                    className="w-full text-xl font-medium border-b-2 border-gray-100 focus:border-black outline-none pb-2 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                    Details (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add some notes..."
                    className="w-full border-b-2 border-gray-100 focus:border-black outline-none pb-2 transition-colors resize-none"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block flex items-center gap-1">
                      <Clock size={12} /> Start
                    </label>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full text-sm border-b-2 border-gray-100 focus:border-black outline-none pb-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block flex items-center gap-1">
                      <Clock size={12} /> End
                    </label>
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full text-sm border-b-2 border-gray-100 focus:border-black outline-none pb-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block flex items-center gap-1">
                      <AlertCircle size={12} /> Priority
                    </label>
                    <div className="flex gap-2">
                      {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold capitalize border transition-all",
                            priority === p ? "bg-black text-white border-black" : "border-gray-200 text-gray-400 hover:border-gray-400"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block flex items-center gap-1">
                      <Tag size={12} /> Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-sm border-b-2 border-gray-100 focus:border-black outline-none pb-2 bg-transparent"
                    >
                      {DEFAULT_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 rounded-2xl font-bold tracking-wide hover:bg-gray-800 transition-colors shadow-lg"
                >
                  Create Plan
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
