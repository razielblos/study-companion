import { useState } from 'react';
import { Plus, ExternalLink, Star, X } from 'lucide-react';
import { useLinks, useSubjects, useLinkMutations } from '@/hooks/useSupabaseData';

export default function LinksUteis() {
  const { data: links = [] } = useLinks();
  const { data: subjects = [] } = useSubjects();
  const { addLink, updateLink, deleteLink } = useLinkMutations();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', url: '', description: '', category: 'outro', subject_id: '' as string | null, favicon: '', favorite: false });

  const getSubject = (id: string) => subjects.find((s: any) => s.id === id) as any;
  const CATEGORIES = ['ava', 'biblioteca', 'videoaula', 'artigo', 'ferramenta', 'documentação', 'youtube', 'outro'];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url.trim()) return;
    addLink.mutate({ ...form, title: form.title || form.url, subject_id: form.subject_id || null });
    setForm({ title: '', url: '', description: '', category: 'outro', subject_id: '', favicon: '', favorite: false });
    setShowAdd(false);
  };

  const favorites = links.filter((l: any) => l.favorite);
  const others = links.filter((l: any) => !l.favorite);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold text-foreground">Links Úteis</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-heading text-sm font-medium hover:bg-primary/90 transition-colors glow-focus">
          <Plus className="h-4 w-4" /> Adicionar
        </button>
      </div>

      {showAdd && (
        <div className="card-surface p-5 mb-6 animate-scale-in">
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="URL *" className="h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Título" className="h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="h-9 px-3 rounded-md bg-secondary border border-border text-xs font-heading text-foreground capitalize">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={form.subject_id || ''} onChange={e => setForm({ ...form, subject_id: e.target.value || null })} className="h-9 px-3 rounded-md bg-secondary border border-border text-xs font-heading text-foreground">
                <option value="">Sem disciplina</option>
                {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-sm text-muted-foreground">Cancelar</button>
              <button type="submit" className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-heading">Salvar</button>
            </div>
          </form>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="mb-6">
          <h2 className="font-heading text-sm font-semibold text-muted-foreground mb-3">Favoritos</h2>
          <div className="space-y-2">
            {favorites.map((link: any) => <LinkCard key={link.id} link={link} getSubject={getSubject} onToggleFav={() => updateLink.mutate({ id: link.id, favorite: !link.favorite })} onDelete={() => deleteLink.mutate(link.id)} />)}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {others.map((link: any) => <LinkCard key={link.id} link={link} getSubject={getSubject} onToggleFav={() => updateLink.mutate({ id: link.id, favorite: !link.favorite })} onDelete={() => deleteLink.mutate(link.id)} />)}
      </div>

      {links.length === 0 && <div className="text-center py-16"><p className="text-muted-foreground font-heading text-sm">Nenhum link salvo</p></div>}
    </div>
  );
}

function LinkCard({ link, getSubject, onToggleFav, onDelete }: { link: any; getSubject: (id: string) => any; onToggleFav: () => void; onDelete: () => void }) {
  const subj = getSubject(link.subject_id);
  return (
    <div className="card-surface p-4 flex items-center gap-3 group">
      <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center text-muted-foreground/60 text-xs font-mono shrink-0">
        {link.url.replace(/https?:\/\//, '').slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-heading text-foreground truncate">{link.title}</p>
        <p className="text-xs text-muted-foreground/60 truncate">{link.url}</p>
      </div>
      {subj && <span className="text-[10px] px-1.5 py-0.5 rounded shrink-0" style={{ backgroundColor: subj.color + '22', color: subj.color }}>{subj.name}</span>}
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-heading capitalize">{link.category}</span>
      <button onClick={onToggleFav} className="text-muted-foreground/60 hover:text-warning transition-colors">
        <Star className={`h-3.5 w-3.5 ${link.favorite ? 'fill-warning text-warning' : ''}`} />
      </button>
      <a href={link.url} target="_blank" rel="noopener" className="text-muted-foreground/60 hover:text-primary transition-colors">
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
      <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 text-muted-foreground/60 hover:text-destructive transition-all">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
