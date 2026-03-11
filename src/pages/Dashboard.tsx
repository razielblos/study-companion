import { useProfile } from '@/hooks/useSupabaseData';
import { useSubjects, useTasks, useEvents, useEvaluations } from '@/hooks/useSupabaseData';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { format, differenceInDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, BookOpen, CheckSquare, CalendarDays, TrendingUp } from 'lucide-react';

const QUOTES = [
  '"A única maneira de fazer um excelente trabalho é amar o que você faz." — Steve Jobs',
  '"O conhecimento é o único recurso que aumenta quando compartilhado." — Autor desconhecido',
  '"A educação é a arma mais poderosa que você pode usar para mudar o mundo." — Nelson Mandela',
];

export default function Dashboard() {
  const { data: profile } = useProfile();
  const { activeWorkspace } = useWorkspace();
  const { data: subjects = [] } = useSubjects();
  const { data: tasks = [] } = useTasks();
  const { data: evaluations = [] } = useEvaluations();

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const quote = QUOTES[now.getDate() % QUOTES.length];

  let semesterProgress = 0;
  let semesterWeek = 0;
  let totalWeeks = 0;
  if (activeWorkspace) {
    const start = parseISO(activeWorkspace.start_date);
    const end = parseISO(activeWorkspace.end_date);
    const total = differenceInDays(end, start);
    const elapsed = differenceInDays(now, start);
    semesterProgress = Math.min(100, Math.max(0, (elapsed / total) * 100));
    totalWeeks = activeWorkspace.total_weeks;
    semesterWeek = Math.min(totalWeeks, Math.max(1, Math.ceil(elapsed / 7)));
  }

  const activeSubjects = subjects.filter((s: any) => s.status === 'ativa');
  const pendingTasks = tasks.filter((t: any) => t.status !== 'concluída' && t.status !== 'cancelada');
  const completedTasks = tasks.filter((t: any) => t.status === 'concluída');

  const upcomingTasks = pendingTasks
    .filter((t: any) => t.due_date)
    .sort((a: any, b: any) => (a.due_date || '').localeCompare(b.due_date || ''));
  const nextDeadline = upcomingTasks[0] as any;
  const nextDays = nextDeadline ? differenceInDays(parseISO(nextDeadline.due_date), now) : null;

  const subjectAverages = activeSubjects.map((subj: any) => {
    const evals = evaluations.filter((e: any) => e.subject_id === subj.id && e.score !== null);
    if (evals.length === 0) return null;
    const totalWeight = evals.reduce((sum: number, e: any) => sum + e.weight, 0);
    const weightedSum = evals.reduce((sum: number, e: any) => sum + (e.score || 0) * e.weight, 0);
    return totalWeight > 0 ? weightedSum / totalWeight : null;
  }).filter((a: any): a is number => a !== null);
  const overallAvg = subjectAverages.length > 0 ? (subjectAverages.reduce((a, b) => a + b, 0) / subjectAverages.length) : null;

  const next7 = upcomingTasks.filter((t: any) => {
    const d = differenceInDays(parseISO(t.due_date), now);
    return d >= 0 && d <= 7;
  });

  const getSubject = (id: string) => subjects.find((s: any) => s.id === id);

  const urgencyColor = (dueDate: string) => {
    const d = differenceInDays(parseISO(dueDate), now);
    if (d <= 1) return 'text-destructive';
    if (d <= 3) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="card-surface p-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          {greeting}, {profile?.name || 'Estudante'} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {format(now, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
        <p className="text-muted-foreground/60 text-xs mt-3 italic font-body">{quote}</p>
      </div>

      {activeWorkspace && (
        <div className="card-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-heading text-sm font-semibold text-foreground">Progresso do Semestre</p>
            <span className="font-mono text-xs text-muted-foreground">
              Semana {semesterWeek} de {totalWeeks}
            </span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${semesterProgress}%` }} />
          </div>
          <p className="text-right text-xs text-muted-foreground/60 mt-1 font-mono">{semesterProgress.toFixed(0)}%</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Disciplinas Ativas" value={String(activeSubjects.length)} />
        <StatCard icon={CheckSquare} label="Tarefas" value={`${completedTasks.length}/${tasks.length}`} sub="concluídas" />
        <StatCard
          icon={CalendarDays}
          label="Próxima Entrega"
          value={nextDays !== null ? (nextDays <= 0 ? 'Hoje!' : `${nextDays}d`) : '—'}
          sub={nextDeadline?.title?.slice(0, 30)}
          highlight={nextDays !== null && nextDays <= 1}
        />
        <StatCard
          icon={TrendingUp}
          label="Média Geral"
          value={overallAvg !== null ? overallAvg.toFixed(1) : '—'}
          highlight={overallAvg !== null && overallAvg >= 7}
          highlightColor={overallAvg !== null ? (overallAvg >= 7 ? 'text-success' : overallAvg >= 5 ? 'text-warning' : 'text-destructive') : undefined}
        />
      </div>

      <div className="card-surface p-5">
        <h2 className="font-heading text-sm font-semibold text-foreground mb-4">Próximas Entregas (7 dias)</h2>
        {next7.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4 text-center">Nenhuma entrega nos próximos 7 dias 🎉</p>
        ) : (
          <ul className="space-y-2">
            {next7.map((t: any) => {
              const subj = getSubject(t.subject_id);
              return (
                <li key={t.id} className="flex items-center gap-3 p-3 rounded-md bg-secondary/50">
                  <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: (subj as any)?.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-heading text-foreground truncate">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{(subj as any)?.name}</p>
                  </div>
                  <span className={`text-xs font-mono ${urgencyColor(t.due_date)}`}>
                    {format(parseISO(t.due_date), 'dd/MM')}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, highlight, highlightColor }: {
  icon: typeof Clock; label: string; value: string; sub?: string; highlight?: boolean; highlightColor?: string;
}) {
  return (
    <div className="card-surface p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-heading text-muted-foreground">{label}</span>
      </div>
      <p className={`text-2xl font-heading font-bold ${highlightColor || (highlight ? 'text-primary' : 'text-foreground')}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-muted-foreground/60 mt-0.5 truncate">{sub}</p>}
    </div>
  );
}
