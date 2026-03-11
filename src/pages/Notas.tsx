import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Plus, Star, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function Notas() {
  const notes = useStore((s) => s.notes);
  const subjects = useStore((s) => s.subjects);
  const addNote = useStore((s) => s.addNote);
  const updateNote = useStore((s) => s.updateNote);
  const deleteNote = useStore((s) => s.deleteNote);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');

  const selected = notes.find((n) => n.id === selectedId);
  const getSubject = (id: string) => subjects.find((s) => s.id === id);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addNote({ title: newTitle, content: '', subjectId: newSubject, tags: [], starred: false });
    setNewTitle('');
    setShowAdd(false);
  };

  return (
    <div className="max-w-6xl flex gap-4 h-[calc(100vh-8rem)]">
      {/* Sidebar list */}
      <div className="w-72 shrink-0 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-heading text-xl font-bold text-foreground">Notas</h1>
          <button onClick={() => setShowAdd(true)} className="h-8 w-8 rounded-md flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {showAdd && (
          <div className="card-surface p-3 mb-3 space-y-2">
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Título da nota" className="w-full h-8 px-2 rounded bg-secondary border border-border text-sm text-foreground" autoFocus />
            <select value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="w-full h-8 px-2 rounded bg-secondary border border-border text-xs font-heading text-foreground">
              <option value="">Sem disciplina</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={() => setShowAdd(false)} className="text-xs text-text-secondary">Cancelar</button>
              <button onClick={handleAdd} className="text-xs text-primary font-heading">Criar</button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-1">
          {notes.map((note) => {
            const subj = getSubject(note.subjectId);
            return (
              <button
                key={note.id}
                onClick={() => setSelectedId(note.id)}
                className={`w-full text-left p-3 rounded-md transition-colors ${selectedId === note.id ? 'bg-secondary border border-primary/20' : 'hover:bg-secondary/50'}`}
              >
                <div className="flex items-center gap-2">
                  {note.starred && <Star className="h-3 w-3 text-warning fill-warning" />}
                  <p className="text-sm font-heading text-foreground truncate">{note.title}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {subj && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: subj.color + '22', color: subj.color }}>{subj.name}</span>}
                  <span className="text-[10px] text-text-tertiary font-mono">{format(parseISO(note.updatedAt), 'dd/MM')}</span>
                </div>
              </button>
            );
          })}
          {notes.length === 0 && (
            <p className="text-center py-8 text-text-secondary text-sm">Nenhuma nota criada</p>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 card-surface p-6 overflow-y-auto scrollbar-thin">
        {selected ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <input
                value={selected.title}
                onChange={(e) => updateNote(selected.id, { title: e.target.value })}
                className="bg-transparent text-lg font-heading font-bold text-foreground outline-none flex-1"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateNote(selected.id, { starred: !selected.starred })}
                  className="text-text-secondary hover:text-warning transition-colors"
                >
                  <Star className={`h-4 w-4 ${selected.starred ? 'fill-warning text-warning' : ''}`} />
                </button>
                <button
                  onClick={() => { deleteNote(selected.id); setSelectedId(null); }}
                  className="text-text-secondary hover:text-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-text-tertiary mb-4 font-mono">
              Atualizado em {format(parseISO(selected.updatedAt), "dd/MM/yyyy 'às' HH:mm")}
            </p>
            <textarea
              value={selected.content}
              onChange={(e) => updateNote(selected.id, { content: e.target.value })}
              placeholder="Comece a escrever..."
              className="flex-1 bg-transparent text-sm text-foreground font-body resize-none outline-none leading-relaxed"
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-text-secondary text-sm font-heading">Selecione uma nota ou crie uma nova</p>
          </div>
        )}
      </div>
    </div>
  );
}
