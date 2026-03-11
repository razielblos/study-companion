import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, parseISO, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Cronograma() {
  const events = useStore((s) => s.events);
  const tasks = useStore((s) => s.tasks);
  const subjects = useStore((s) => s.subjects);
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart); // 0 = Sunday

  const getSubject = (id: string) => subjects.find((s) => s.id === id);

  const dayEvents = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const evts = events.filter((e) => e.date === dateStr);
    const tks = tasks.filter((t) => t.dueDate === dateStr && t.status !== 'concluída');
    return [...evts.map((e) => ({ type: 'event' as const, ...e })), ...tks.map((t) => ({ type: 'task' as const, id: t.id, title: t.title, subjectId: t.subjectId }))];
  };

  const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold text-foreground">Cronograma</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="h-8 w-8 rounded-md flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-secondary transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-heading text-sm font-semibold text-foreground min-w-[140px] text-center capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="h-8 w-8 rounded-md flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-secondary transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-heading hover:bg-primary/20 transition-colors">
            Hoje
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="card-surface overflow-hidden">
        <div className="grid grid-cols-7">
          {WEEKDAYS.map((d) => (
            <div key={d} className="px-2 py-3 text-center text-xs font-heading text-text-secondary border-b border-border">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: startPad }).map((_, i) => (
            <div key={`pad-${i}`} className="min-h-[100px] border-b border-r border-border/50 bg-background-secondary/30" />
          ))}
          {days.map((day) => {
            const items = dayEvents(day);
            const today = isToday(day);
            return (
              <div key={day.toISOString()} className={`min-h-[100px] border-b border-r border-border/50 p-1.5 ${today ? 'bg-primary/5' : ''}`}>
                <span className={`text-xs font-mono block mb-1 ${today ? 'text-primary font-bold' : 'text-text-secondary'}`}>
                  {format(day, 'd')}
                </span>
                <div className="space-y-0.5">
                  {items.slice(0, 3).map((item) => {
                    const subj = getSubject(item.subjectId);
                    return (
                      <div key={item.id} className="flex items-center gap-1 px-1 py-0.5 rounded text-[10px] truncate" style={{ backgroundColor: (subj?.color || '#666') + '22' }}>
                        <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: subj?.color || '#666' }} />
                        <span className="truncate text-foreground">{item.title}</span>
                      </div>
                    );
                  })}
                  {items.length > 3 && (
                    <span className="text-[10px] text-text-tertiary px-1">+{items.length - 3} mais</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
