import { useState } from 'react';
import { useProfile, useProfileMutation } from '@/hooks/useSupabaseData';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { WorkspaceModal } from '@/components/workspace/WorkspaceModal';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Settings, Archive, Pencil } from 'lucide-react';

export default function Configuracoes() {
  const { data: profile } = useProfile();
  const updateProfile = useProfileMutation();
  const { workspaces, activeWorkspace, switchWorkspace } = useWorkspace();
  const [editWs, setEditWs] = useState<any>(null);
  const [showCreateWs, setShowCreateWs] = useState(false);

  if (!profile) return null;

  const activeWs = workspaces.filter(w => w.status === 'active');
  const archivedWs = workspaces.filter(w => w.status === 'archived');

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="font-heading text-xl font-bold text-foreground">Configurações</h1>

      {/* Profile */}
      <section className="card-surface p-5 space-y-4">
        <h2 className="font-heading text-sm font-semibold text-foreground">Perfil</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-heading text-muted-foreground mb-1.5">Nome</label>
            <input value={profile.name} onChange={e => updateProfile.mutate({ name: e.target.value })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground glow-focus" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-heading text-muted-foreground mb-1.5">Curso</label>
              <input value={profile.course} onChange={e => updateProfile.mutate({ course: e.target.value })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
            </div>
            <div>
              <label className="block text-xs font-heading text-muted-foreground mb-1.5">Universidade</label>
              <input value={profile.university} onChange={e => updateProfile.mutate({ university: e.target.value })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* Workspaces */}
      <section className="card-surface p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-semibold text-foreground">Workspaces</h2>
          <button onClick={() => setShowCreateWs(true)} className="text-primary text-xs font-heading hover:underline">+ Novo workspace</button>
        </div>

        <div className="space-y-2">
          {activeWs.map(ws => (
            <div key={ws.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${ws.id === activeWorkspace?.id ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                <div>
                  <span className="text-sm font-heading text-foreground">{ws.name}</span>
                  <span className="text-xs text-muted-foreground ml-2 font-mono">
                    {format(parseISO(ws.start_date), 'MMM yyyy', { locale: ptBR })} — {format(parseISO(ws.end_date), 'MMM yyyy', { locale: ptBR })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {ws.id !== activeWorkspace?.id && (
                  <button onClick={() => switchWorkspace(ws.id)} className="text-xs px-2 py-1 rounded text-muted-foreground hover:text-foreground font-heading">Ativar</button>
                )}
                {ws.id === activeWorkspace?.id && (
                  <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-heading">Ativo</span>
                )}
                <button onClick={() => setEditWs(ws)} className="text-muted-foreground hover:text-foreground">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {archivedWs.length > 0 && (
          <div>
            <p className="text-xs font-heading text-muted-foreground mb-2 flex items-center gap-1"><Archive className="h-3 w-3" /> Semestres anteriores</p>
            <div className="space-y-2">
              {archivedWs.map(ws => (
                <div key={ws.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/30 opacity-60">
                  <div>
                    <span className="text-sm font-heading text-foreground">{ws.name}</span>
                    <span className="text-[10px] ml-2 px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-heading">Arquivado</span>
                  </div>
                  <button onClick={() => setEditWs(ws)} className="text-muted-foreground hover:text-foreground">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {showCreateWs && <WorkspaceModal onClose={() => setShowCreateWs(false)} />}
      {editWs && <WorkspaceModal editWorkspace={editWs} onClose={() => setEditWs(null)} />}
    </div>
  );
}
