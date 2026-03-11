import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { X } from 'lucide-react';
import type { TaskType, Priority, TaskStatus } from '@/types/studyos';

interface Props {
  onClose: () => void;
}

export function AddTaskModal({ onClose }: Props) {
  const addTask = useStore((s) => s.addTask);
  const subjects = useStore((s) => s.subjects);
  const kanbanColumns = useStore((s) => s.kanbanColumns);

  const [form, setForm] = useState({
    title: '',
    description: '',
    subjectId: subjects[0]?.id || '',
    type: 'atividade' as TaskType,
    dueDate: '',
    priority: 'média' as Priority,
    estimatedMinutes: 60,
    link: '',
    status: 'a_fazer' as TaskStatus,
    kanbanColumn: kanbanColumns[0]?.id || 'backlog',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.dueDate) return;
    addTask({ ...form, checklist: [] });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-background/75" />
      <div className="relative w-full max-w-lg card-surface shadow-2xl p-6 animate-scale-in max-h-[85vh] overflow-y-auto scrollbar-thin" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-lg font-bold text-foreground">Nova Tarefa</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-heading text-text-secondary mb-1.5">Título *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground glow-focus" />
          </div>

          <div>
            <label className="block text-xs font-heading text-text-secondary mb-1.5">Descrição</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm text-foreground resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading text-text-secondary mb-1.5">Disciplina</label>
              <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm font-heading text-foreground">
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-heading text-text-secondary mb-1.5">Tipo</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TaskType })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm font-heading text-foreground">
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
              <label className="block text-xs font-heading text-text-secondary mb-1.5">Data de entrega *</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
            </div>
            <div>
              <label className="block text-xs font-heading text-text-secondary mb-1.5">Prioridade</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm font-heading text-foreground">
                <option value="alta">Alta</option>
                <option value="média">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading text-text-secondary mb-1.5">Tempo estimado (minutos)</label>
            <input type="number" value={form.estimatedMinutes} onChange={(e) => setForm({ ...form, estimatedMinutes: Number(e.target.value) })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-10 rounded-md border border-border text-sm font-heading text-text-secondary hover:text-foreground transition-colors">Cancelar</button>
            <button type="submit" className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-heading font-medium hover:bg-primary/90 transition-colors glow-focus">Criar Tarefa</button>
          </div>
        </form>
      </div>
    </div>
  );
}
