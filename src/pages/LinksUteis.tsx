import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Plus, ExternalLink, Star, X } from 'lucide-react';

export default function LinksUteis() {
  const links = useStore((s) => s.links);
  const subjects = useStore((s) => s.subjects);
  const addLink = useStore((s) => s.addLink);
  const updateLink = useStore((s) => s.updateLink);
  const deleteLink = useStore((s) => s.deleteLink);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', url: '', description: '', category: 'outro', subjectId: '', favicon: '', favorite: false });

  const getSubject = (id: string) => subjects.find((s) => s.id === id);

  const CATEGORIES = ['ava', 'biblioteca', 'videoaula', 'artigo', 'ferramenta', 'documentação', 'youtube', 'outro'];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url.trim()) return;
    addLink({ ...form, title: form.title || form.url });
    setForm({ title: '', url: '', description: '', category: 'outro', subjectId: '', favicon: '', favorite: false });
    setShowAdd(false);
  };

  const favorites = links.filter((l) => l.favorite);
  const others = links.filter((l) => !l.favorite);

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
              <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="URL *" className="h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título" className="h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-9 px-3 rounded-md bg-secondary border border-border text-xs font-heading text-foreground capitalize">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} className="h-9 px-3 rounded-md bg-secondary border border-border text-xs font-heading text-foreground">
                <option value="">Sem disciplina</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-sm text-text-secondary">Cancelar</button>
              <button type="submit" className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-heading">Salvar</button>
            </div>
          </form>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="mb-6">
          <h2 className="font-heading text-sm font-semibold text-text-secondary mb-3">Favoritos</h2>
          <div className="space-y-2">
            {favorites.map((link) => <LinkCard key={link.id} link={link} getSubject={getSubject} onToggleFav={() => updateLink(link.id, { favorite: !link.favorite })} onDelete={() => deleteLink(link.id)} />)}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {others.map((link) => <LinkCard key={link.id} link={link} getSubject={getSubject} onToggleFav={() => updateLink(link.id, { favorite: !link.favorite })} onDelete={() => deleteLink(link.id)} />)}
      </div>

      {links.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-secondary font-heading text-sm">Nenhum link salvo</p>
        </div>
      )}
    </div>
  );
}

function LinkCard({ link, getSubject, onToggleFav, onDelete }: { link: any; getSubject: (id: string) => any; onToggleFav: () => void; onDelete: () => void }) {
  const subj = getSubject(link.subjectId);
  return (
    <div className="card-surface p-4 flex items-center gap-3 group">
      <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center text-text-tertiary text-xs font-mono shrink-0">
        {link.url.replace(/https?:\/\//, '').slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-heading text-foreground truncate">{link.title}</p>
        <p className="text-xs text-text-tertiary truncate">{link.url}</p>
      </div>
      {subj && <span className="text-[10px] px-1.5 py-0.5 rounded shrink-0" style={{ backgroundColor: subj.color + '22', color: subj.color }}>{subj.name}</span>}
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-text-secondary font-heading capitalize">{link.category}</span>
      <button onClick={onToggleFav} className="text-text-tertiary hover:text-warning transition-colors">
        <Star className={`h-3.5 w-3.5 ${link.favorite ? 'fill-warning text-warning' : ''}`} />
      </button>
      <a href={link.url} target="_blank" rel="noopener" className="text-text-tertiary hover:text-primary transition-colors">
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
      <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-destructive transition-all">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
