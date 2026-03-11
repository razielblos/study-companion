import { useState } from 'react';
import { X } from 'lucide-react';
import { useSubjects, useKanbanColumns, useTaskMutations } from '@/hooks/useSupabaseData';

interface Props {
  onClose: () => void;
}

export function AddTaskModal({ onClose }: Props) {
  const { data: subjects = [] } = useSubjects();
  const { data: kanbanColumns = [] } = useKanbanColumns();
  const { addTask } = useTaskMutations();

  const [form, setForm] = useState({
    title: '',
    description: '',
    subject_id: (subjects[0] as any)?.id || null,
    type: 'atividade',
    due_date: '',
    priority: 'média',
    estimated_minutes: 60,
    link: '',
    status: 'a_fazer',
    kanban_column: (kanbanColumns[0] as any)?.id || 'backlog',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.due_date) return;
    addTask.mutate({ ...form, checklist: [], subject_id: form.subject_id || null });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-background/75" />
      <div className="relative w-full max-w-lg card-surface shadow-2xl p-6 animate-scale-in max-h-[85vh] overflow-y-auto scrollbar-thin" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-lg font-bold text-foreground">Nova Tarefa</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-heading text-muted-foreground mb-1.5">Título *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground glow-focus" />
          </div>

          <div>
            <label className="block text-xs font-heading text-muted-foreground mb-1.5">Descrição</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm text-foreground resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading text-muted-foreground mb-1.5">Disciplina</label>
              <select value={form.subject_id || ''} onChange={e => setForm({ ...form, subject_id: e.target.value || null })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm font-heading text-foreground">
                <option value="">Sem disciplina</option>
                {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-heading text-muted-foreground mb-1.5">Tipo</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm font-heading text-foreground">
                <option value="prova">Prova</option>
                <option value="trabalho">Trabalho</option>
                <option value="atividade">Atividade</option>
                <option value="fórum">Fórum</option>
                <option value="leitura">Leitura</option>
                <option value="revisão">Revisão</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading text-muted-foreground mb-1.5">Data de entrega *</label>
              <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
            </div>
            <div>
              <label className="block text-xs font-heading text-muted-foreground mb-1.5">Prioridade</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm font-heading text-foreground">
                <option value="alta">Alta</option>
                <option value="média">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading text-muted-foreground mb-1.5">Tempo estimado (minutos)</label>
            <input type="number" value={form.estimated_minutes} onChange={e => setForm({ ...form, estimated_minutes: Number(e.target.value) })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-10 rounded-md border border-border text-sm font-heading text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
            <button type="submit" className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-heading font-medium hover:bg-primary/90 transition-colors glow-focus">Criar Tarefa</button>
          </div>
        </form>
      </div>
    </div>
  );
}
