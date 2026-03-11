import { useState } from 'react';
import { useWorkspace, Workspace } from '@/contexts/WorkspaceContext';
import { ChevronDown, Plus, Check, Archive } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { WorkspaceModal } from './WorkspaceModal';

export function WorkspaceSwitcher() {
  const { workspaces, activeWorkspace, switchWorkspace } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  if (!activeWorkspace) return null;

  const activeWs = workspaces.filter(w => w.status === 'active');
  const archivedWs = workspaces.filter(w => w.status === 'archived');

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 h-9 px-3 rounded-md bg-card border border-border text-sm font-heading hover:border-primary/30 transition-colors max-w-[220px]"
        >
          <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
          <span className="truncate text-foreground">{activeWorkspace.name}</span>
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-11 w-72 card-surface p-1.5 shadow-xl animate-scale-in z-50">
              <p className="px-3 py-1.5 text-[10px] font-heading text-muted-foreground uppercase tracking-wider">Workspaces</p>
              
              {activeWs.map(w => (
                <button
                  key={w.id}
                  onClick={() => { switchWorkspace(w.id); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left hover:bg-secondary/50 transition-colors"
                >
                  <div className={`h-2 w-2 rounded-full shrink-0 ${w.id === activeWorkspace.id ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-heading text-foreground truncate">{w.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {format(parseISO(w.start_date), 'MMM yyyy', { locale: ptBR })} – {format(parseISO(w.end_date), 'MMM yyyy', { locale: ptBR })}
                    </p>
                  </div>
                  {w.id === activeWorkspace.id && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </button>
              ))}

              {archivedWs.length > 0 && (
                <>
                  <div className="border-t border-border my-1" />
                  <p className="px-3 py-1.5 text-[10px] font-heading text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Archive className="h-3 w-3" /> Arquivados
                  </p>
                  {archivedWs.map(w => (
                    <button
                      key={w.id}
                      onClick={() => { switchWorkspace(w.id); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-secondary/50 transition-colors opacity-60"
                    >
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30 shrink-0" />
                      <p className="text-sm font-heading text-foreground truncate">{w.name}</p>
                    </button>
                  ))}
                </>
              )}

              <div className="border-t border-border mt-1 pt-1">
                <button
                  onClick={() => { setOpen(false); setShowCreate(true); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-heading text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Novo workspace
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showCreate && <WorkspaceModal onClose={() => setShowCreate(false)} />}
    </>
  );
}
