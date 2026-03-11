import { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { useTasks, useSubjects, useTaskMutations } from '@/hooks/useSupabaseData';
import { AddTaskModal } from '@/components/modals/AddTaskModal';

export default function Tarefas() {
  const { data: tasks = [] } = useTasks();
  const { data: subjects = [] } = useSubjects();
  const { toggleTask, deleteTask } = useTaskMutations();
  const [showAdd, setShowAdd] = useState(false);
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const getSubject = (id: string) => subjects.find((s: any) => s.id === id);

  let filtered = [...tasks] as any[];
  if (filterSubject) filtered = filtered.filter(t => t.subject_id === filterSubject);
  if (filterStatus) filtered = filtered.filter(t => t.status === filterStatus);
  if (filterPriority) filtered = filtered.filter(t => t.priority === filterPriority);
  filtered.sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''));

  const now = new Date();

  const priorityDot = (p: string) => {
    if (p === 'alta') return 'bg-destructive';
    if (p === 'média') return 'bg-warning';
    return 'bg-muted-foreground/60';
  };

  const relativeDate = (d: string) => {
    if (!d) return { text: '—', cls: 'text-muted-foreground' };
    const days = differenceInDays(parseISO(d), now);
    if (days < 0) return { text: `atrasada há ${Math.abs(days)}d`, cls: 'text-destructive' };
    if (days === 0) return { text: 'hoje', cls: 'text-destructive' };
    if (days === 1) return { text: 'amanhã', cls: 'text-warning' };
    if (days <= 7) return { text: `em ${days}d`, cls: 'text-warning' };
    return { text: format(parseISO(d), 'dd/MM'), cls: 'text-muted-foreground' };
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold text-foreground">Tarefas</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-heading text-sm font-medium hover:bg-primary/90 transition-colors glow-focus">
          <Plus className="h-4 w-4" /> Nova Tarefa
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="h-8 px-2 rounded-md bg-secondary border border-border text-xs font-heading text-foreground">
          <option value="">Todas as disciplinas</option>
          {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-8 px-2 rounded-md bg-secondary border border-border text-xs font-heading text-foreground">
          <option value="">Todos os status</option>
          <option value="a_fazer">A fazer</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluída">Concluída</option>
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="h-8 px-2 rounded-md bg-secondary border border-border text-xs font-heading text-foreground">
          <option value="">Todas as prioridades</option>
          <option value="alta">Alta</option>
          <option value="média">Média</option>
          <option value="baixa">Baixa</option>
        </select>
      </div>

      <div className="space-y-2">
        {filtered.map((task: any) => {
          const subj = getSubject(task.subject_id) as any;
          const rel = relativeDate(task.due_date);
          const isDone = task.status === 'concluída';
          return (
            <div key={task.id} className="card-surface p-4 flex items-center gap-3 group">
              <button
                onClick={() => toggleTask.mutate({ id: task.id, currentStatus: task.status })}
                className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isDone ? 'bg-success border-success' : 'border-border hover:border-primary'}`}
              >
                {isDone && <Check className="h-3 w-3 text-success-foreground" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-heading ${isDone ? 'line-through text-muted-foreground/60' : 'text-foreground'}`}>{task.title}</p>
                  <div className={`h-1.5 w-1.5 rounded-full ${priorityDot(task.priority)}`} />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {subj && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-heading" style={{ backgroundColor: subj.color + '22', color: subj.color }}>{subj.name}</span>
                  )}
                  <span className={`text-xs font-mono ${rel.cls}`}>{rel.text}</span>
                  {task.estimated_minutes > 0 && (
                    <span className="text-[10px] text-muted-foreground/60 font-mono">{task.estimated_minutes >= 60 ? `${(task.estimated_minutes / 60).toFixed(1)}h` : `${task.estimated_minutes}min`}</span>
                  )}
                </div>
              </div>
              <button onClick={() => deleteTask.mutate(task.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground/60 hover:text-destructive transition-all">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground font-heading text-sm">Nenhuma tarefa encontrada</p>
          <button onClick={() => setShowAdd(true)} className="mt-3 text-primary text-sm font-heading hover:underline">Criar tarefa</button>
        </div>
      )}

      {showAdd && <AddTaskModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
