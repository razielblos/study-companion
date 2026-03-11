import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { SUBJECT_COLORS } from '@/types/studyos';
import { X } from 'lucide-react';
import type { Subject } from '@/types/studyos';

interface Props {
  onClose: () => void;
  editSubject?: Subject;
}

export function AddSubjectModal({ onClose, editSubject }: Props) {
  const addSubject = useStore((s) => s.addSubject);
  const updateSubject = useStore((s) => s.updateSubject);
  const semesters = useStore((s) => s.semesters);
  const activeSem = semesters.find((s) => s.active);

  const [form, setForm] = useState({
    name: editSubject?.name || '',
    code: editSubject?.code || '',
    professor: editSubject?.professor || '',
    creditHours: editSubject?.creditHours || 60,
    credits: editSubject?.credits || 4,
    semesterId: editSubject?.semesterId || activeSem?.id || '',
    color: editSubject?.color || SUBJECT_COLORS[0],
    description: editSubject?.description || '',
    avaLink: editSubject?.avaLink || '',
    status: editSubject?.status || 'ativa' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editSubject) {
      updateSubject(editSubject.id, { ...form, schedule: editSubject.schedule });
    } else {
      addSubject({ ...form, schedule: [] });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-background/75" />
      <div className="relative w-full max-w-lg card-surface shadow-2xl p-6 animate-scale-in max-h-[85vh] overflow-y-auto scrollbar-thin" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-lg font-bold text-foreground">
            {editSubject ? 'Editar Disciplina' : 'Nova Disciplina'}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nome *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Código" value={form.code} onChange={(v) => setForm({ ...form, code: v })} placeholder="SI204" />
          <Field label="Professor" value={form.professor} onChange={(v) => setForm({ ...form, professor: v })} />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Carga Horária" value={String(form.creditHours)} onChange={(v) => setForm({ ...form, creditHours: Number(v) })} type="number" />
            <Field label="Créditos" value={String(form.credits)} onChange={(v) => setForm({ ...form, credits: Number(v) })} type="number" />
          </div>

          <div>
            <label className="block text-xs font-heading text-text-secondary mb-1.5">Cor</label>
            <div className="flex gap-2">
              {SUBJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={`h-7 w-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading text-text-secondary mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'ativa' | 'concluída' | 'trancada' })}
              className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm font-heading text-foreground"
            >
              <option value="ativa">Ativa</option>
              <option value="concluída">Concluída</option>
              <option value="trancada">Trancada</option>
            </select>
          </div>

          <Field label="Link do AVA" value={form.avaLink} onChange={(v) => setForm({ ...form, avaLink: v })} placeholder="https://" />

          <div>
            <label className="block text-xs font-heading text-text-secondary mb-1.5">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm text-foreground resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-10 rounded-md border border-border text-sm font-heading text-text-secondary hover:text-foreground transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-heading font-medium hover:bg-primary/90 transition-colors glow-focus">
              {editSubject ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-heading text-text-secondary mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground placeholder:text-text-tertiary glow-focus"
      />
    </div>
  );
}
