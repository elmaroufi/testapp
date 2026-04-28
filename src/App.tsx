import { useState, useEffect, useMemo } from 'react';
import { format, isSameDay, parseISO, startOfDay, addDays } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, CheckCircle2, LayoutGrid, ListTodo, Settings, Bell } from 'lucide-react';
import { Task } from './types';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import NotificationManager from './components/NotificationManager';
import { cn } from './lib/utils';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('waqti_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'daily' | 'all'>('daily');

  useEffect(() => {
    localStorage.setItem('waqti_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'notified'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
      notified: false,
    };
    setTasks((prev) => [...prev, newTask].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    ));
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const markAsNotified = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, notified: true } : t))
    );
  };

  const filteredTasks = useMemo(() => {
    if (activeTab === 'all') return tasks;
    return tasks.filter((t) => isSameDay(parseISO(t.startTime), selectedDate));
  }, [tasks, activeTab, selectedDate]);

  const nextSevenDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(startOfDay(new Date()), i));
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percentage };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-black font-sans selection:bg-black selection:text-white">
      <NotificationManager tasks={tasks} onNotify={markAsNotified} />
      
      {/* Sidebar / Navigation */}
      <nav className="fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-gray-100 hidden md:flex flex-col items-center py-8 gap-8 z-40">
        <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white font-black text-xl">
          W
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <button 
            onClick={() => setActiveTab('daily')}
            className={cn("p-3 rounded-2xl transition-all", activeTab === 'daily' ? "bg-black text-white" : "text-gray-400 hover:bg-gray-100")}
          >
            <Calendar size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('all')}
            className={cn("p-3 rounded-2xl transition-all", activeTab === 'all' ? "bg-black text-white" : "text-gray-400 hover:bg-gray-100")}
          >
            <ListTodo size={24} />
          </button>
          <button className="p-3 rounded-2xl text-gray-400 hover:bg-gray-100">
            <LayoutGrid size={24} />
          </button>
        </div>
        <button className="p-3 rounded-2xl text-gray-400 hover:bg-gray-100">
          <Settings size={24} />
        </button>
      </nav>

      {/* Main Content */}
      <main className="md:ml-20 p-6 md:p-12 max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="relative">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[120px] font-black leading-[0.8] tracking-tighter opacity-10 absolute -left-4 -top-8 select-none"
            >
              {format(selectedDate, 'dd')}
            </motion.span>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">
                {format(selectedDate, 'EEEE')}
              </h1>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm">
                {format(selectedDate, 'MMMM yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Progress</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black">{stats.percentage}%</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.percentage}%` }}
                    className="h-full bg-black"
                  />
                </div>
              </div>
            </div>
            <button 
              onClick={async () => {
                if ('Notification' in window) {
                  const permission = await Notification.requestPermission();
                  if (permission === 'granted') {
                    new Notification("Notifications Enabled", { body: "You will now receive alerts for your plans." });
                  }
                }
              }}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors relative"
            >
              <Bell size={20} />
              {tasks.some(t => !t.notified && !t.completed) && (
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </header>

        {/* Date Picker */}
        <section className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-4">
            {nextSevenDays.map((date) => {
              const isSelected = isSameDay(date, selectedDate);
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => {
                    setSelectedDate(date);
                    setActiveTab('daily');
                  }}
                  className={cn(
                    "flex flex-col items-center min-w-[80px] p-4 rounded-3xl transition-all",
                    isSelected ? "bg-black text-white shadow-xl scale-105" : "bg-white text-gray-400 hover:bg-gray-50"
                  )}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest mb-2">
                    {format(date, 'EEE')}
                  </span>
                  <span className="text-2xl font-black">
                    {format(date, 'dd')}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Task List */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              {activeTab === 'daily' ? 'Today\'s Schedule' : 'All Plans'}
              <span className="text-sm font-bold bg-gray-200 px-3 py-1 rounded-full">
                {filteredTasks.length}
              </span>
            </h2>
          </div>

          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No plans for this day</h3>
                  <p className="text-gray-400 max-w-xs">
                    Time is what we want most, but what we use worst. Start planning!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <TaskForm onAdd={addTask} />

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 flex md:hidden items-center justify-around px-6 z-40">
        <button 
          onClick={() => setActiveTab('daily')}
          className={cn("p-2", activeTab === 'daily' ? "text-black" : "text-gray-300")}
        >
          <Calendar size={24} />
        </button>
        <button 
          onClick={() => setActiveTab('all')}
          className={cn("p-2", activeTab === 'all' ? "text-black" : "text-gray-300")}
        >
          <ListTodo size={24} />
        </button>
        <div className="w-12 h-12" /> {/* Spacer for FAB */}
        <button className="p-2 text-gray-300">
          <LayoutGrid size={24} />
        </button>
        <button className="p-2 text-gray-300">
          <Settings size={24} />
        </button>
      </div>
    </div>
  );
}
