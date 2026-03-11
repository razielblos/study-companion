import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function Kanban() {
  const tasks = useStore((s) => s.tasks);
  const subjects = useStore((s) => s.subjects);
  const kanbanColumns = useStore((s) => s.kanbanColumns);
  const moveTask = useStore((s) => s.moveTask);
  const [filterSubject, setFilterSubject] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const getSubject = (id: string) => subjects.find((s) => s.id === id);

  let filtered = tasks.filter((t) => t.status !== 'cancelada');
  if (filterSubject) filtered = filtered.filter((t) => t.subjectId === filterSubject);

  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold text-foreground">Kanban</h1>
        <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="h-8 px-2 rounded-md bg-secondary border border-border text-xs font-heading text-foreground">
          <option value="">Todas as disciplinas</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {kanbanColumns.sort((a, b) => a.order - b.order).map((col) => {
          const colTasks = filtered.filter((t) => t.kanbanColumn === col.id);
          return (
            <div key={col.id} className="min-w-[280px] w-[280px] shrink-0">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-heading text-sm font-semibold text-foreground">{col.title}</h3>
                <span className="text-xs font-mono text-text-tertiary bg-secondary px-2 py-0.5 rounded">{colTasks.length}</span>
              </div>

              <div
                className="space-y-2 min-h-[200px] p-2 rounded-lg bg-background-secondary border border-border-subtle transition-colors"
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-primary/40'); }}
                onDragLeave={(e) => { e.currentTarget.classList.remove('border-primary/40'); }}
                onDrop={(e) => {
                  e.currentTarget.classList.remove('border-primary/40');
                  const taskId = e.dataTransfer.getData('taskId');
                  if (taskId) moveTask(taskId, col.id);
                }}
              >
                {colTasks.map((task) => {
                  const subj = getSubject(task.subjectId);
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => { e.dataTransfer.setData('taskId', task.id); setDraggedTaskId(task.id); }}
                      onDragEnd={() => setDraggedTaskId(null)}
                      className={`card-surface p-3 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-all ${draggedTaskId === task.id ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        {subj && <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: subj.color }} />}
                        <p className="text-sm font-heading text-foreground truncate">{task.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {subj && <span className="text-[10px] text-text-tertiary font-heading">{subj.name}</span>}
                        <span className="text-[10px] font-mono text-text-tertiary ml-auto">{task.dueDate ? task.dueDate.slice(5) : ''}</span>
                        <div className={`h-1.5 w-1.5 rounded-full ${task.priority === 'alta' ? 'bg-destructive' : task.priority === 'média' ? 'bg-warning' : 'bg-text-tertiary'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
