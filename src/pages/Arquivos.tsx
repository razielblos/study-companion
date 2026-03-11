import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Plus, FolderOpen, X, FileText, File } from 'lucide-react';

export default function Arquivos() {
  const files = useStore((s) => s.files);
  const subjects = useStore((s) => s.subjects);
  const addFile = useStore((s) => s.addFile);
  const deleteFile = useStore((s) => s.deleteFile);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'pdf', subjectId: '', link: '', description: '', folder: '', size: '' });

  const getSubject = (id: string) => subjects.find((s) => s.id === id);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addFile(form);
    setForm({ name: '', type: 'pdf', subjectId: '', link: '', description: '', folder: '', size: '' });
    setShowAdd(false);
  };

  const FILE_TYPES = ['pdf', 'docx', 'xlsx', 'pptx', 'zip', 'img', 'outro'];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold text-foreground">Arquivos</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-heading text-sm font-medium hover:bg-primary/90 transition-colors glow-focus">
          <Plus className="h-4 w-4" /> Adicionar
        </button>
      </div>

      {showAdd && (
        <div className="card-surface p-5 mb-6 animate-scale-in">
          <form onSubmit={handleAdd} className="space-y-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome do arquivo *" className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="h-9 px-3 rounded-md bg-secondary border border-border text-xs font-heading text-foreground uppercase">
                {FILE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} className="h-9 px-3 rounded-md bg-secondary border border-border text-xs font-heading text-foreground">
                <option value="">Sem disciplina</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="Link (Google Drive, OneDrive, etc.)" className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-sm text-text-secondary">Cancelar</button>
              <button type="submit" className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-heading">Salvar</button>
            </div>
          </form>
        </div>
      )}

      {files.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
          <p className="text-text-secondary font-heading text-sm">Nenhum arquivo cadastrado</p>
          <button onClick={() => setShowAdd(true)} className="mt-3 text-primary text-sm font-heading hover:underline">Adicionar referência de arquivo</button>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => {
            const subj = getSubject(file.subjectId);
            return (
              <div key={file.id} className="card-surface p-4 flex items-center gap-3 group">
                <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-heading text-foreground truncate">{file.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-text-tertiary uppercase">{file.type}</span>
                    {subj && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: subj.color + '22', color: subj.color }}>{subj.name}</span>}
                  </div>
                </div>
                {file.link && (
                  <a href={file.link} target="_blank" rel="noopener" className="text-primary text-xs font-heading hover:underline shrink-0">Abrir</a>
                )}
                <button onClick={() => deleteFile(file.id)} className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-destructive transition-all">
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
