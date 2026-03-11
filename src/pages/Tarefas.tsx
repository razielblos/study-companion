import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Plus, Check, X } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AddTaskModal } from '@/components/modals/AddTaskModal';

export default function Tarefas() {
  const tasks = useStore((s) => s.tasks);
  const subjects = useStore((s) => s.subjects);
  const toggleTask = useStore((s) => s.toggleTask);
  const deleteTask = useStore((s) => s.deleteTask);
  const [showAdd, setShowAdd] = useState(false);
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const getSubject = (id: string) => subjects.find((s) => s.id === id);

  let filtered = [...tasks];
  if (filterSubject) filtered = filtered.filter((t) => t.subjectId === filterSubject);
  if (filterStatus) filtered = filtered.filter((t) => t.status === filterStatus);
  if (filterPriority) filtered = filtered.filter((t) => t.priority === filterPriority);
  filtered.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const now = new Date();

  const priorityDot = (p: string) => {
    if (p === 'alta') return 'bg-destructive';
    if (p === 'média') return 'bg-warning';
    return 'bg-text-tertiary';
  };

  const relativeDate = (d: string) => {
    const days = differenceInDays(parseISO(d), now);
    if (days < 0) return { text: `atrasada há ${Math.abs(days)}d`, cls: 'text-destructive' };
    if (days === 0) return { text: 'hoje', cls: 'text-destructive' };
    if (days === 1) return { text: 'amanhã', cls: 'text-warning' };
    if (days <= 7) return { text: `em ${days}d`, cls: 'text-warning' };
    return { text: format(parseISO(d), 'dd/MM'), cls: 'text-text-secondary' };
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold text-foreground">Tarefas</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-heading text-sm font-medium hover:bg-primary/90 transition-colors glow-focus">
          <Plus className="h-4 w-4" /> Nova Tarefa
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="h-8 px-2 rounded-md bg-secondary border border-border text-xs font-heading text-foreground">
          <option value="">Todas as disciplinas</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 px-2 rounded-md bg-secondary border border-border text-xs font-heading text-foreground">
          <option value="">Todos os status</option>
          <option value="a_fazer">A fazer</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluída">Concluída</option>
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="h-8 px-2 rounded-md bg-secondary border border-border text-xs font-heading text-foreground">
          <option value="">Todas as prioridades</option>
          <option value="alta">Alta</option>
          <option value="média">Média</option>
          <option value="baixa">Baixa</option>
        </select>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {filtered.map((task) => {
          const subj = getSubject(task.subjectId);
          const rel = relativeDate(task.dueDate);
          const isDone = task.status === 'concluída';
          return (
            <div key={task.id} className="card-surface p-4 flex items-center gap-3 group">
              <button
                onClick={() => toggleTask(task.id)}
                className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isDone ? 'bg-success border-success' : 'border-border hover:border-primary'}`}
              >
                {isDone && <Check className="h-3 w-3 text-success-foreground" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-heading ${isDone ? 'line-through text-text-tertiary' : 'text-foreground'}`}>{task.title}</p>
                  <div className={`h-1.5 w-1.5 rounded-full ${priorityDot(task.priority)}`} />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {subj && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-heading" style={{ backgroundColor: subj.color + '22', color: subj.color }}>
                      {subj.name}
                    </span>
                  )}
                  <span className={`text-xs font-mono ${rel.cls}`}>{rel.text}</span>
                  {task.estimatedMinutes > 0 && (
                    <span className="text-[10px] text-text-tertiary font-mono">{task.estimatedMinutes >= 60 ? `${(task.estimatedMinutes / 60).toFixed(1)}h` : `${task.estimatedMinutes}min`}</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-destructive transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-secondary font-heading text-sm">Nenhuma tarefa encontrada</p>
          <button onClick={() => setShowAdd(true)} className="mt-3 text-primary text-sm font-heading hover:underline">Criar tarefa</button>
        </div>
      )}

      {showAdd && <AddTaskModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
