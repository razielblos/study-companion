import { useState } from 'react';
import { useWorkspace, Workspace } from '@/contexts/WorkspaceContext';
import { useProfile } from '@/hooks/useSupabaseData';
import { X } from 'lucide-react';
import { differenceInWeeks, parseISO } from 'date-fns';
import { toast } from 'sonner';

interface Props {
  onClose: () => void;
  editWorkspace?: Workspace;
}

export function WorkspaceModal({ onClose, editWorkspace }: Props) {
  const { createWorkspace, updateWorkspace, deleteWorkspace } = useWorkspace();
  const { data: profile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const [form, setForm] = useState({
    name: editWorkspace?.name || '',
    course: editWorkspace?.course || profile?.course || '',
    university: editWorkspace?.university || profile?.university || '',
    start_date: editWorkspace?.start_date || '',
    end_date: editWorkspace?.end_date || '',
    total_weeks: editWorkspace?.total_weeks || 18,
    description: editWorkspace?.description || '',
    status: editWorkspace?.status || 'active',
    is_active: editWorkspace?.is_active ?? true,
  });

  const calcWeeks = () => {
    if (form.start_date && form.end_date) {
      const weeks = differenceInWeeks(parseISO(form.end_date), parseISO(form.start_date));
      if (weeks > 0) setForm(f => ({ ...f, total_weeks: weeks }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.start_date || !form.end_date) return;
    setLoading(true);
    try {
      if (editWorkspace) {
        await updateWorkspace(editWorkspace.id, form);
        toast.success('Workspace atualizado!');
      } else {
        await createWorkspace(form);
        toast.success('Workspace criado!');
      }
      onClose();
    } catch {
      toast.error('Erro ao salvar workspace');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== editWorkspace?.name) return;
    setLoading(true);
    await deleteWorkspace(editWorkspace!.id);
    toast.success('Workspace excluído!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-background/75" />
      <div className="relative w-full max-w-lg card-surface shadow-2xl p-6 animate-scale-in max-h-[85vh] overflow-y-auto scrollbar-thin" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-lg font-bold text-foreground">
            {editWorkspace ? 'Editar Workspace' : 'Novo Workspace'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>

        {!showDeleteConfirm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-heading text-muted-foreground mb-1.5">Nome do workspace *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="2025/2 — SI" className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground glow-focus" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading text-muted-foreground mb-1.5">Curso</label>
                <input value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
              </div>
              <div>
                <label className="block text-xs font-heading text-muted-foreground mb-1.5">Universidade</label>
                <input value={form.university} onChange={e => setForm({ ...form, university: e.target.value })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading text-muted-foreground mb-1.5">Data de início *</label>
                <input type="date" value={form.start_date} onChange={e => { setForm({ ...form, start_date: e.target.value }); }} onBlur={calcWeeks} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
              </div>
              <div>
                <label className="block text-xs font-heading text-muted-foreground mb-1.5">Data de término *</label>
                <input type="date" value={form.end_date} onChange={e => { setForm({ ...form, end_date: e.target.value }); }} onBlur={calcWeeks} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-heading text-muted-foreground mb-1.5">Total de semanas</label>
              <input type="number" value={form.total_weeks} onChange={e => setForm({ ...form, total_weeks: Number(e.target.value) })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
            </div>
            <div>
              <label className="block text-xs font-heading text-muted-foreground mb-1.5">Descrição</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm text-foreground resize-none" />
            </div>

            {editWorkspace && (
              <div>
                <label className="block text-xs font-heading text-muted-foreground mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm font-heading text-foreground">
                  <option value="active">Ativo</option>
                  <option value="archived">Arquivado</option>
                </select>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 h-10 rounded-md border border-border text-sm font-heading text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
              <button type="submit" disabled={loading} className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-heading font-medium hover:bg-primary/90 transition-colors glow-focus disabled:opacity-50">
                {loading ? 'Salvando...' : editWorkspace ? 'Salvar' : 'Criar workspace'}
              </button>
            </div>

            {editWorkspace && (
              <button type="button" onClick={() => setShowDeleteConfirm(true)} className="w-full text-center text-sm text-destructive hover:underline mt-2">
                Excluir workspace
              </button>
            )}
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-foreground">
              Isso irá excluir todas as disciplinas, tarefas e dados deste semestre. Digite <strong>"{editWorkspace?.name}"</strong> para confirmar.
            </p>
            <input value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} placeholder={editWorkspace?.name} className="w-full h-9 px-3 rounded-md bg-secondary border border-destructive/30 text-sm text-foreground" />
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 h-10 rounded-md border border-border text-sm font-heading text-muted-foreground">Cancelar</button>
              <button onClick={handleDelete} disabled={deleteConfirmText !== editWorkspace?.name || loading} className="flex-1 h-10 rounded-md bg-destructive text-destructive-foreground text-sm font-heading disabled:opacity-50">
                {loading ? 'Excluindo...' : 'Excluir permanentemente'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
