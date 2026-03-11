import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { Plus, ExternalLink } from 'lucide-react';
import type { Subject } from '@/types/studyos';
import { SUBJECT_COLORS } from '@/types/studyos';
import { AddSubjectModal } from '@/components/modals/AddSubjectModal';

export default function Disciplinas() {
  const subjects = useStore((s) => s.subjects);
  const evaluations = useStore((s) => s.evaluations);
  const tasks = useStore((s) => s.tasks);
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  const getAverage = (subjectId: string) => {
    const evals = evaluations.filter((e) => e.subjectId === subjectId && e.score !== null);
    if (evals.length === 0) return null;
    const totalWeight = evals.reduce((sum, e) => sum + e.weight, 0);
    const weightedSum = evals.reduce((sum, e) => sum + (e.score || 0) * e.weight, 0);
    return totalWeight > 0 ? weightedSum / totalWeight : null;
  };

  const getTaskProgress = (subjectId: string) => {
    const t = tasks.filter((t) => t.subjectId === subjectId);
    const done = t.filter((t) => t.status === 'concluída').length;
    return { done, total: t.length };
  };

  const avgColor = (avg: number | null) => {
    if (avg === null) return 'text-text-secondary';
    if (avg >= 7) return 'text-success';
    if (avg >= 5) return 'text-warning';
    return 'text-destructive';
  };

  const statusLabel = (s: Subject['status']) => {
    const map = { ativa: 'Ativa', concluída: 'Concluída', trancada: 'Trancada' };
    return map[s];
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold text-foreground">Disciplinas</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-heading text-sm font-medium hover:bg-primary/90 transition-colors glow-focus"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {subjects.map((subj) => {
          const avg = getAverage(subj.id);
          const { done, total } = getTaskProgress(subj.id);
          return (
            <div
              key={subj.id}
              onClick={() => navigate(`/disciplinas/${subj.id}`)}
              className="card-surface-hover p-5 cursor-pointer group"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="h-3 w-3 rounded-full mt-1 shrink-0" style={{ backgroundColor: subj.color }} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {subj.name}
                  </h3>
                  <p className="font-mono text-xs text-text-tertiary">{subj.code}</p>
                </div>
              </div>

              <p className="text-xs text-text-secondary mb-3">{subj.professor}</p>

              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary font-mono">{subj.credits} créditos · {subj.creditHours}h</span>
                <span className={`font-heading font-semibold ${avgColor(avg)}`}>
                  {avg !== null ? avg.toFixed(1) : '—'}
                </span>
              </div>

              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="text-text-secondary">{done}/{total} atividades</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary text-text-secondary font-heading">
                  {statusLabel(subj.status)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {subjects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-secondary font-heading text-sm">Nenhuma disciplina cadastrada</p>
          <button onClick={() => setShowAdd(true)} className="mt-3 text-primary text-sm font-heading hover:underline">
            Adicionar disciplina
          </button>
        </div>
      )}

      {showAdd && <AddSubjectModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
