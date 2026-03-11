import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Download, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Configuracoes() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const semesters = useStore((s) => s.semesters);
  const addSemester = useStore((s) => s.addSemester);
  const setActiveSemester = useStore((s) => s.setActiveSemester);
  const exportData = useStore((s) => s.exportData);
  const importData = useStore((s) => s.importData);
  const clearAllData = useStore((s) => s.clearAllData);

  const [newSem, setNewSem] = useState({ name: '', startDate: '', endDate: '' });
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studyos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup exportado com sucesso!');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        importData(ev.target?.result as string);
        toast.success('Dados importados com sucesso!');
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClear = () => {
    clearAllData();
    toast.success('Todos os dados foram limpos.');
    setShowConfirmClear(false);
  };

  const handleAddSemester = () => {
    if (!newSem.name) return;
    addSemester({ ...newSem, active: false, archived: false });
    setNewSem({ name: '', startDate: '', endDate: '' });
    toast.success('Semestre adicionado!');
  };

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="font-heading text-xl font-bold text-foreground">Configurações</h1>

      {/* Profile */}
      <section className="card-surface p-5 space-y-4">
        <h2 className="font-heading text-sm font-semibold text-foreground">Perfil</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-heading text-text-secondary mb-1.5">Nome</label>
            <input value={profile.name} onChange={(e) => updateProfile({ name: e.target.value })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground glow-focus" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-heading text-text-secondary mb-1.5">Curso</label>
              <input value={profile.course} onChange={(e) => updateProfile({ course: e.target.value })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
            </div>
            <div>
              <label className="block text-xs font-heading text-text-secondary mb-1.5">Universidade</label>
              <input value={profile.university} onChange={(e) => updateProfile({ university: e.target.value })} className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-heading text-text-secondary mb-1.5">Email</label>
            <input value={profile.email} onChange={(e) => updateProfile({ email: e.target.value })} placeholder="seu@email.com" className="w-full h-9 px-3 rounded-md bg-secondary border border-border text-sm text-foreground" />
          </div>
        </div>
      </section>

      {/* Semesters */}
      <section className="card-surface p-5 space-y-4">
        <h2 className="font-heading text-sm font-semibold text-foreground">Semestres</h2>
        <div className="space-y-2">
          {semesters.map((sem) => (
            <div key={sem.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
              <div>
                <span className="text-sm font-heading text-foreground">{sem.name}</span>
                <span className="text-xs text-text-tertiary ml-2 font-mono">{sem.startDate} — {sem.endDate}</span>
              </div>
              <button
                onClick={() => setActiveSemester(sem.id)}
                className={`text-xs px-2 py-1 rounded font-heading ${sem.active ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-foreground'}`}
              >
                {sem.active ? 'Ativo' : 'Ativar'}
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newSem.name} onChange={(e) => setNewSem({ ...newSem, name: e.target.value })} placeholder="2025/2" className="h-8 px-2 rounded bg-secondary border border-border text-sm text-foreground flex-1" />
          <input type="date" value={newSem.startDate} onChange={(e) => setNewSem({ ...newSem, startDate: e.target.value })} className="h-8 px-2 rounded bg-secondary border border-border text-sm text-foreground" />
          <input type="date" value={newSem.endDate} onChange={(e) => setNewSem({ ...newSem, endDate: e.target.value })} className="h-8 px-2 rounded bg-secondary border border-border text-sm text-foreground" />
          <button onClick={handleAddSemester} className="px-3 py-1 rounded bg-primary text-primary-foreground text-sm font-heading">+</button>
        </div>
      </section>

      {/* Data */}
      <section className="card-surface p-5 space-y-4">
        <h2 className="font-heading text-sm font-semibold text-foreground">Dados</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm font-heading text-text-secondary hover:text-foreground transition-colors">
            <Download className="h-4 w-4" /> Exportar JSON
          </button>
          <button onClick={handleImport} className="flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm font-heading text-text-secondary hover:text-foreground transition-colors">
            <Upload className="h-4 w-4" /> Importar JSON
          </button>
          <button onClick={() => setShowConfirmClear(true)} className="flex items-center gap-2 px-4 py-2 rounded-md border border-destructive/30 text-sm font-heading text-destructive hover:bg-destructive/10 transition-colors">
            <Trash2 className="h-4 w-4" /> Limpar Tudo
          </button>
        </div>
        {showConfirmClear && (
          <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-foreground mb-3">Tem certeza? Todos os dados serão perdidos.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirmClear(false)} className="px-3 py-1.5 text-sm text-text-secondary">Cancelar</button>
              <button onClick={handleClear} className="px-3 py-1.5 rounded bg-destructive text-destructive-foreground text-sm font-heading">Confirmar</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
