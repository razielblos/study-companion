import { useState } from 'react';
import { useEvents, useTasks, useSubjects } from '@/hooks/useSupabaseData';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Cronograma() {
  const { data: events = [] } = useEvents();
  const { data: tasks = [] } = useTasks();
  const { data: subjects = [] } = useSubjects();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);

  const getSubject = (id: string) => subjects.find((s: any) => s.id === id);

  const dayEvents = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const evts = events.filter((e: any) => e.date === dateStr);
    const tks = tasks.filter((t: any) => t.due_date === dateStr && t.status !== 'concluída');
    return [
      ...evts.map((e: any) => ({ type: 'event' as const, id: e.id, title: e.title, subject_id: e.subject_id })),
      ...tks.map((t: any) => ({ type: 'task' as const, id: t.id, title: t.title, subject_id: t.subject_id })),
    ];
  };

  const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold text-foreground">Cronograma</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-heading text-sm font-semibold text-foreground min-w-[140px] text-center capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-heading hover:bg-primary/20 transition-colors">Hoje</button>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="grid grid-cols-7">
          {WEEKDAYS.map(d => (
            <div key={d} className="px-2 py-3 text-center text-xs font-heading text-muted-foreground border-b border-border">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: startPad }).map((_, i) => (
            <div key={`pad-${i}`} className="min-h-[100px] border-b border-r border-border/50 bg-background/30" />
          ))}
          {days.map(day => {
            const items = dayEvents(day);
            const today = isToday(day);
            return (
              <div key={day.toISOString()} className={`min-h-[100px] border-b border-r border-border/50 p-1.5 ${today ? 'bg-primary/5' : ''}`}>
                <span className={`text-xs font-mono block mb-1 ${today ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{format(day, 'd')}</span>
                <div className="space-y-0.5">
                  {items.slice(0, 3).map(item => {
                    const subj = getSubject(item.subject_id) as any;
                    return (
                      <div key={item.id} className="flex items-center gap-1 px-1 py-0.5 rounded text-[10px] truncate" style={{ backgroundColor: (subj?.color || '#666') + '22' }}>
                        <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: subj?.color || '#666' }} />
                        <span className="truncate text-foreground">{item.title}</span>
                      </div>
                    );
                  })}
                  {items.length > 3 && <span className="text-[10px] text-muted-foreground/60 px-1">+{items.length - 3} mais</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
