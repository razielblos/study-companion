import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useState } from 'react';
import { ArrowLeft, ExternalLink, Plus, X } from 'lucide-react';

export default function SubjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const subjects = useStore((s) => s.subjects);
  const tasks = useStore((s) => s.tasks);
  const evaluations = useStore((s) => s.evaluations);
  const notes = useStore((s) => s.notes);
  const addEvaluation = useStore((s) => s.addEvaluation);
  const updateEvaluation = useStore((s) => s.updateEvaluation);
  const deleteEvaluation = useStore((s) => s.deleteEvaluation);

  const subject = subjects.find((s) => s.id === id);
  const [tab, setTab] = useState<'visao' | 'tarefas' | 'notas_acad' | 'anotacoes'>('visao');
  const [showAddEval, setShowAddEval] = useState(false);
  const [evalForm, setEvalForm] = useState({ name: '', weight: 0, score: '', date: '' });

  if (!subject) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary">Disciplina não encontrada</p>
        <button onClick={() => navigate('/disciplinas')} className="text-primary text-sm mt-2 hover:underline">Voltar</button>
      </div>
    );
  }

  const subjTasks = tasks.filter((t) => t.subjectId === id);
  const subjEvals = evaluations.filter((e) => e.subjectId === id);
  const subjNotes = notes.filter((n) => n.subjectId === id);

  const getAverage = () => {
    const scored = subjEvals.filter((e) => e.score !== null);
    if (scored.length === 0) return null;
    const tw = scored.reduce((s, e) => s + e.weight, 0);
    const ws = scored.reduce((s, e) => s + (e.score || 0) * e.weight, 0);
    return tw > 0 ? ws / tw : null;
  };

  const avg = getAverage();
  const TABS = [
    { id: 'visao', label: 'Visão Geral' },
    { id: 'tarefas', label: 'Tarefas' },
    { id: 'notas_acad', label: 'Notas' },
    { id: 'anotacoes', label: 'Anotações' },
  ] as const;

  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const handleAddEval = () => {
    if (!evalForm.name) return;
    addEvaluation({
      subjectId: subject.id,
      name: evalForm.name,
      weight: evalForm.weight,
      score: evalForm.score ? Number(evalForm.score) : null,
      date: evalForm.date,
    });
    setEvalForm({ name: '', weight: 0, score: '', date: '' });
    setShowAddEval(false);
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <button onClick={() => navigate('/disciplinas')} className="flex items-center gap-2 text-text-secondary text-sm font-heading mb-4 hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <div className="card-surface p-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: subject.color }} />
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground">{subject.name}</h1>
            <p className="font-mono text-xs text-text-tertiary">{subject.code} · {subject.professor}</p>
          </div>
        </div>
        {avg !== null && (
          <p className="mt-3 font-heading text-sm">
            Média atual: <span className={`font-bold ${avg >= 7 ? 'text-success' : avg >= 5 ? 'text-warning' : 'text-destructive'}`}>{avg.toFixed(1)}</span>
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-heading transition-colors border-b-2 -mb-px ${tab === t.id ? 'text-primary border-primary' : 'text-text-secondary border-transparent hover:text-foreground'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'visao' && (
        <div className="space-y-4">
          {subject.description && <div className="card-surface p-4"><p className="text-sm text-text-secondary font-body">{subject.description}</p></div>}
          <div className="card-surface p-4">
            <p className="font-heading text-sm font-semibold mb-2">Horários</p>
            {subject.schedule.length > 0 ? (
              <div className="space-y-1">
                {subject.schedule.map((s, i) => (
                  <p key={i} className="text-sm text-text-secondary">{days[s.day]} — {s.time}</p>
                ))}
              </div>
            ) : <p className="text-sm text-text-tertiary">Nenhum horário cadastrado</p>}
          </div>
          <div className="card-surface p-4 flex items-center justify-between">
            <span className="text-sm text-text-secondary font-mono">{subject.credits} créditos · {subject.creditHours}h</span>
            {subject.avaLink && (
              <a href={subject.avaLink} target="_blank" rel="noopener" className="flex items-center gap-1 text-primary text-sm hover:underline">
                AVA <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {tab === 'tarefas' && (
        <div className="space-y-2">
          {subjTasks.length === 0 ? (
            <p className="text-center py-8 text-text-secondary text-sm">Nenhuma tarefa para esta disciplina</p>
          ) : subjTasks.map((t) => (
            <div key={t.id} className="card-surface p-3 flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${t.status === 'concluída' ? 'bg-success' : 'bg-text-secondary'}`} />
              <div className="flex-1">
                <p className={`text-sm font-heading ${t.status === 'concluída' ? 'line-through text-text-tertiary' : 'text-foreground'}`}>{t.title}</p>
                <p className="text-xs text-text-tertiary font-mono">{t.dueDate}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'notas_acad' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-semibold text-foreground">Avaliações</h3>
            <button onClick={() => setShowAddEval(true)} className="flex items-center gap-1 text-primary text-sm font-heading hover:underline">
              <Plus className="h-3 w-3" /> Adicionar
            </button>
          </div>

          {showAddEval && (
            <div className="card-surface p-4 space-y-3">
              <input value={evalForm.name} onChange={(e) => setEvalForm({ ...evalForm, name: e.target.value })} placeholder="Nome (ex: Prova 1)" className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
              <div className="grid grid-cols-3 gap-3">
                <input type="number" value={evalForm.weight} onChange={(e) => setEvalForm({ ...evalForm, weight: Number(e.target.value) })} placeholder="Peso %" className="h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
                <input type="number" value={evalForm.score} onChange={(e) => setEvalForm({ ...evalForm, score: e.target.value })} placeholder="Nota" className="h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" step="0.1" />
                <input type="date" value={evalForm.date} onChange={(e) => setEvalForm({ ...evalForm, date: e.target.value })} className="h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAddEval(false)} className="px-3 py-1.5 text-sm text-text-secondary hover:text-foreground">Cancelar</button>
                <button onClick={handleAddEval} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-heading">Salvar</button>
              </div>
            </div>
          )}

          {subjEvals.length === 0 ? (
            <p className="text-center py-8 text-text-secondary text-sm">Nenhuma avaliação cadastrada</p>
          ) : (
            <div className="card-surface overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 font-heading text-text-secondary text-xs">Avaliação</th>
                    <th className="text-center px-4 py-3 font-heading text-text-secondary text-xs">Peso</th>
                    <th className="text-center px-4 py-3 font-heading text-text-secondary text-xs">Nota</th>
                    <th className="text-right px-4 py-3 font-heading text-text-secondary text-xs">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {subjEvals.map((ev) => (
                    <tr key={ev.id} className="border-b border-border/50">
                      <td className="px-4 py-3 text-foreground font-heading">{ev.name}</td>
                      <td className="px-4 py-3 text-center text-text-secondary font-mono">{ev.weight}%</td>
                      <td className={`px-4 py-3 text-center font-mono font-semibold ${ev.score !== null ? (ev.score >= 6 ? 'text-success' : 'text-destructive') : 'text-text-tertiary'}`}>
                        {ev.score !== null ? ev.score.toFixed(1) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-text-tertiary font-mono text-xs">{ev.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'anotacoes' && (
        <div className="space-y-2">
          {subjNotes.length === 0 ? (
            <p className="text-center py-8 text-text-secondary text-sm">Nenhuma anotação para esta disciplina</p>
          ) : subjNotes.map((n) => (
            <div key={n.id} className="card-surface p-4">
              <h4 className="font-heading text-sm font-semibold text-foreground">{n.title}</h4>
              <p className="text-xs text-text-tertiary mt-1 line-clamp-2 font-body">{n.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
