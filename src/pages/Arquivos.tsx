import { useState } from 'react';
import { Plus, FolderOpen, X, FileText } from 'lucide-react';
import { useFiles, useSubjects, useFileMutations } from '@/hooks/useSupabaseData';

export default function Arquivos() {
  const { data: files = [] } = useFiles();
  const { data: subjects = [] } = useSubjects();
  const { addFile, deleteFile } = useFileMutations();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', file_type: 'pdf', subject_id: '' as string | null, url: '', description: '', folder: '', size: '' });

  const getSubject = (id: string) => subjects.find((s: any) => s.id === id) as any;
  const FILE_TYPES = ['pdf', 'docx', 'xlsx', 'pptx', 'zip', 'img', 'outro'];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addFile.mutate({ ...form, subject_id: form.subject_id || null });
    setForm({ name: '', file_type: 'pdf', subject_id: '', url: '', description: '', folder: '', size: '' });
    setShowAdd(false);
  };

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
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nome do arquivo *" className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.file_type} onChange={e => setForm({ ...form, file_type: e.target.value })} className="h-9 px-3 rounded-md bg-secondary border border-border text-xs font-heading text-foreground uppercase">
                {FILE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={form.subject_id || ''} onChange={e => setForm({ ...form, subject_id: e.target.value || null })} className="h-9 px-3 rounded-md bg-secondary border border-border text-xs font-heading text-foreground">
                <option value="">Sem disciplina</option>
                {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="Link (Google Drive, OneDrive, etc.)" className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-sm text-muted-foreground">Cancelar</button>
              <button type="submit" className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-heading">Salvar</button>
            </div>
          </form>
        </div>
      )}

      {files.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen className="h-12 w-12 text-muted-foreground/60 mx-auto mb-3" />
          <p className="text-muted-foreground font-heading text-sm">Nenhum arquivo cadastrado</p>
          <button onClick={() => setShowAdd(true)} className="mt-3 text-primary text-sm font-heading hover:underline">Adicionar referência de arquivo</button>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file: any) => {
            const subj = getSubject(file.subject_id);
            return (
              <div key={file.id} className="card-surface p-4 flex items-center gap-3 group">
                <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-heading text-foreground truncate">{file.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-muted-foreground/60 uppercase">{file.file_type}</span>
                    {subj && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: subj.color + '22', color: subj.color }}>{subj.name}</span>}
                  </div>
                </div>
                {file.url && <a href={file.url} target="_blank" rel="noopener" className="text-primary text-xs font-heading hover:underline shrink-0">Abrir</a>}
                <button onClick={() => deleteFile.mutate(file.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground/60 hover:text-destructive transition-all">
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
