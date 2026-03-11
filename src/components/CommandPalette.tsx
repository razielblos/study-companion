import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, BookOpen, CheckSquare, Link2, X } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface Props {
  onClose: () => void;
}

export function CommandPalette({ onClose }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const subjects = useStore((s) => s.subjects);
  const tasks = useStore((s) => s.tasks);
  const notes = useStore((s) => s.notes);
  const links = useStore((s) => s.links);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const q = query.toLowerCase();
  const results: { type: string; icon: typeof Search; label: string; sub: string; action: () => void }[] = [];

  if (q) {
    subjects.filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)).forEach((s) => {
      results.push({ type: 'Disciplina', icon: BookOpen, label: s.name, sub: s.code, action: () => { navigate(`/disciplinas/${s.id}`); onClose(); } });
    });
    tasks.filter((t) => t.title.toLowerCase().includes(q)).forEach((t) => {
      results.push({ type: 'Tarefa', icon: CheckSquare, label: t.title, sub: t.status, action: () => { navigate('/tarefas'); onClose(); } });
    });
    notes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)).forEach((n) => {
      results.push({ type: 'Nota', icon: FileText, label: n.title, sub: '', action: () => { navigate('/notas'); onClose(); } });
    });
    links.filter((l) => l.title.toLowerCase().includes(q)).forEach((l) => {
      results.push({ type: 'Link', icon: Link2, label: l.title, sub: l.url, action: () => { navigate('/links'); onClose(); } });
    });
  }

  // Commands
  if (q.startsWith('/')) {
    const cmds = [
      { label: 'Nova tarefa', action: () => { navigate('/tarefas'); onClose(); } },
      { label: 'Ir para calendário', action: () => { navigate('/cronograma'); onClose(); } },
      { label: 'Ir para kanban', action: () => { navigate('/kanban'); onClose(); } },
      { label: 'Configurações', action: () => { navigate('/configuracoes'); onClose(); } },
    ];
    cmds.filter((c) => c.label.toLowerCase().includes(q.slice(1))).forEach((c) => {
      results.push({ type: 'Comando', icon: Search, label: c.label, sub: '', action: c.action });
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-background/75" />
      <div
        className="relative w-full max-w-lg card-surface shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="h-5 w-5 text-text-secondary" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ou digite / para comandos..."
            className="flex-1 bg-transparent text-foreground font-heading text-sm placeholder:text-text-tertiary outline-none"
          />
          <button onClick={onClose} className="text-text-secondary hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto scrollbar-thin p-2">
            {results.slice(0, 12).map((r, i) => (
              <li key={i}>
                <button
                  onClick={r.action}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left hover:bg-secondary transition-colors"
                >
                  <r.icon className="h-4 w-4 text-text-secondary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-heading text-foreground truncate">{r.label}</p>
                    {r.sub && <p className="text-xs text-text-secondary truncate">{r.sub}</p>}
                  </div>
                  <span className="text-[10px] font-mono text-text-tertiary">{r.type}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query && results.length === 0 && (
          <p className="p-6 text-center text-text-secondary text-sm">Nenhum resultado encontrado</p>
        )}

        {!query && (
          <div className="p-6 text-center text-text-secondary text-sm">
            <p>Digite para buscar ou <span className="font-mono text-text-tertiary">/</span> para comandos</p>
          </div>
        )}
      </div>
    </div>
  );
}
