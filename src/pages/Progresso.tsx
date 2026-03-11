import { useStore } from '@/store/useStore';
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function Progresso() {
  const subjects = useStore((s) => s.subjects);
  const evaluations = useStore((s) => s.evaluations);
  const tasks = useStore((s) => s.tasks);
  const semesters = useStore((s) => s.semesters);
  const activeSemester = semesters.find((s) => s.active);

  const activeSubjects = subjects.filter((s) => s.status === 'ativa');

  const subjectData = useMemo(() => activeSubjects.map((subj) => {
    const evals = evaluations.filter((e) => e.subjectId === subj.id && e.score !== null);
    const tw = evals.reduce((s, e) => s + e.weight, 0);
    const ws = evals.reduce((s, e) => s + (e.score || 0) * e.weight, 0);
    const avg = tw > 0 ? ws / tw : null;

    const subjTasks = tasks.filter((t) => t.subjectId === subj.id);
    const done = subjTasks.filter((t) => t.status === 'concluída').length;

    return { name: subj.name.split(' ')[0], avg, done, total: subjTasks.length, color: subj.color, credits: subj.credits, fullName: subj.name };
  }), [activeSubjects, evaluations, tasks]);

  const passing = subjectData.filter((s) => s.avg !== null && s.avg >= 6).length;
  const atRisk = subjectData.filter((s) => s.avg !== null && s.avg < 6).length;
  const noGrade = subjectData.filter((s) => s.avg === null).length;

  const pieData = [
    { name: 'Aprovando', value: passing, color: 'hsl(142, 71%, 45%)' },
    { name: 'Em risco', value: atRisk, color: 'hsl(0, 84%, 60%)' },
    { name: 'Sem nota', value: noGrade, color: 'hsl(218, 12%, 58%)' },
  ].filter((d) => d.value > 0);

  const taskBarData = subjectData.map((s) => ({
    name: s.name,
    concluídas: s.done,
    pendentes: s.total - s.done,
  }));

  const overallAvg = subjectData.filter((s) => s.avg !== null).length > 0
    ? subjectData.filter((s) => s.avg !== null).reduce((sum, s) => sum + (s.avg || 0), 0) / subjectData.filter((s) => s.avg !== null).length
    : null;

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="font-heading text-xl font-bold text-foreground">Progresso & Métricas</h1>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-surface p-4">
          <p className="text-xs font-heading text-text-secondary mb-1">Disciplinas Ativas</p>
          <p className="text-2xl font-heading font-bold text-foreground">{activeSubjects.length}</p>
        </div>
        <div className="card-surface p-4">
          <p className="text-xs font-heading text-text-secondary mb-1">Média Geral</p>
          <p className={`text-2xl font-heading font-bold ${overallAvg !== null ? (overallAvg >= 7 ? 'text-success' : overallAvg >= 5 ? 'text-warning' : 'text-destructive') : 'text-text-tertiary'}`}>
            {overallAvg !== null ? overallAvg.toFixed(1) : '—'}
          </p>
        </div>
        <div className="card-surface p-4">
          <p className="text-xs font-heading text-text-secondary mb-1">Tarefas Concluídas</p>
          <p className="text-2xl font-heading font-bold text-foreground">
            {tasks.filter((t) => t.status === 'concluída').length}/{tasks.length}
          </p>
        </div>
        <div className="card-surface p-4">
          <p className="text-xs font-heading text-text-secondary mb-1">Créditos do Semestre</p>
          <p className="text-2xl font-heading font-bold text-primary font-mono">
            {activeSubjects.reduce((s, subj) => s + subj.credits, 0)}
          </p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Subject status pie */}
        <div className="card-surface p-5">
          <h3 className="font-heading text-sm font-semibold text-foreground mb-4">Status das Disciplinas</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(220, 20%, 8%)', border: '1px solid hsl(220, 16%, 16%)', borderRadius: 8, color: 'hsl(220, 30%, 93%)' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-text-secondary text-sm py-8">Sem dados</p>}
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-text-secondary">{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks per subject */}
        <div className="card-surface p-5">
          <h3 className="font-heading text-sm font-semibold text-foreground mb-4">Tarefas por Disciplina</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={taskBarData} barGap={2}>
              <XAxis dataKey="name" tick={{ fill: 'hsl(218, 12%, 58%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(218, 12%, 58%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(220, 20%, 8%)', border: '1px solid hsl(220, 16%, 16%)', borderRadius: 8, color: 'hsl(220, 30%, 93%)' }} />
              <Bar dataKey="concluídas" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pendentes" fill="hsl(220, 16%, 16%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject table */}
      <div className="card-surface overflow-hidden">
        <h3 className="font-heading text-sm font-semibold text-foreground p-5 pb-3">Desempenho por Disciplina</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 font-heading text-text-secondary text-xs">Disciplina</th>
              <th className="text-center px-3 py-3 font-heading text-text-secondary text-xs">Créditos</th>
              <th className="text-center px-3 py-3 font-heading text-text-secondary text-xs">Média</th>
              <th className="text-center px-3 py-3 font-heading text-text-secondary text-xs">Tarefas</th>
              <th className="text-right px-5 py-3 font-heading text-text-secondary text-xs">Status</th>
            </tr>
          </thead>
          <tbody>
            {subjectData.map((s) => (
              <tr key={s.fullName} className="border-b border-border/50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-foreground font-heading">{s.fullName}</span>
                  </div>
                </td>
                <td className="text-center px-3 py-3 text-text-secondary font-mono">{s.credits}</td>
                <td className={`text-center px-3 py-3 font-mono font-semibold ${s.avg !== null ? (s.avg >= 6 ? 'text-success' : 'text-destructive') : 'text-text-tertiary'}`}>
                  {s.avg !== null ? s.avg.toFixed(1) : '—'}
                </td>
                <td className="text-center px-3 py-3 text-text-secondary font-mono">{s.done}/{s.total}</td>
                <td className="text-right px-5 py-3">
                  <span className={`text-xs font-heading ${s.avg !== null ? (s.avg >= 6 ? 'text-success' : 'text-destructive') : 'text-text-secondary'}`}>
                    {s.avg !== null ? (s.avg >= 6 ? 'Aprovando' : 'Em risco') : 'Sem nota'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
