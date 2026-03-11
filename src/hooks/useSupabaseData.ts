import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { toast } from 'sonner';

// ── Subjects ──
export function useSubjects() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  return useQuery({
    queryKey: ['subjects', activeWorkspace?.id],
    queryFn: async () => {
      if (!activeWorkspace) return [];
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('workspace_id', activeWorkspace.id)
        .order('name');
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!activeWorkspace,
  });
}

export function useSubjectMutations() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const key = ['subjects', activeWorkspace?.id];

  const addSubject = useMutation({
    mutationFn: async (s: { name: string; code?: string; professor?: string; credit_hours?: number; credits?: number; color?: string; description?: string; ava_link?: string; status?: string; schedule?: any }) => {
      const { error } = await supabase.from('subjects').insert({
        ...s,
        user_id: user!.id,
        workspace_id: activeWorkspace!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success('Disciplina adicionada!'); },
    onError: () => toast.error('Erro ao adicionar disciplina'),
  });

  const updateSubject = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [k: string]: any }) => {
      const { error } = await supabase.from('subjects').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success('Disciplina atualizada!'); },
  });

  const deleteSubject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('subjects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success('Disciplina excluída!'); },
  });

  return { addSubject, updateSubject, deleteSubject };
}

// ── Tasks ──
export function useTasks() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  return useQuery({
    queryKey: ['tasks', activeWorkspace?.id],
    queryFn: async () => {
      if (!activeWorkspace) return [];
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('workspace_id', activeWorkspace.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!activeWorkspace,
  });
}

export function useTaskMutations() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const key = ['tasks', activeWorkspace?.id];

  const addTask = useMutation({
    mutationFn: async (t: any) => {
      const { error } = await supabase.from('tasks').insert({
        ...t,
        user_id: user!.id,
        workspace_id: activeWorkspace!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success('Tarefa criada!'); },
    onError: () => toast.error('Erro ao criar tarefa'),
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [k: string]: any }) => {
      const { error } = await supabase.from('tasks').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success('Tarefa excluída!'); },
  });

  const toggleTask = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: string }) => {
      const newStatus = currentStatus === 'concluída' ? 'a_fazer' : 'concluída';
      const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const moveTask = useMutation({
    mutationFn: async ({ id, column }: { id: string; column: string }) => {
      const { error } = await supabase.from('tasks').update({ kanban_column: column }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { addTask, updateTask, deleteTask, toggleTask, moveTask };
}

// ── Events ──
export function useEvents() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  return useQuery({
    queryKey: ['events', activeWorkspace?.id],
    queryFn: async () => {
      if (!activeWorkspace) return [];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('workspace_id', activeWorkspace.id)
        .order('date');
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!activeWorkspace,
  });
}

export function useEventMutations() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const key = ['events', activeWorkspace?.id];

  const addEvent = useMutation({
    mutationFn: async (e: any) => {
      const { error } = await supabase.from('events').insert({
        ...e,
        user_id: user!.id,
        workspace_id: activeWorkspace!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success('Evento criado!'); },
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [k: string]: any }) => {
      const { error } = await supabase.from('events').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success('Evento excluído!'); },
  });

  return { addEvent, updateEvent, deleteEvent };
}

// ── Evaluations ──
export function useEvaluations() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  return useQuery({
    queryKey: ['evaluations', activeWorkspace?.id],
    queryFn: async () => {
      if (!activeWorkspace) return [];
      // Evaluations linked via subject, get all for workspace subjects
      const { data: subjects } = await supabase
        .from('subjects')
        .select('id')
        .eq('workspace_id', activeWorkspace.id);
      if (!subjects || subjects.length === 0) return [];
      const subjectIds = subjects.map(s => s.id);
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .in('subject_id', subjectIds)
        .order('date');
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!activeWorkspace,
  });
}

export function useEvaluationMutations() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();

  const addEvaluation = useMutation({
    mutationFn: async (e: { subject_id: string; name: string; weight: number; score?: number | null; date?: string }) => {
      const { error } = await supabase.from('evaluations').insert({
        ...e,
        user_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['evaluations'] }); toast.success('Avaliação adicionada!'); },
  });

  const updateEvaluation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [k: string]: any }) => {
      const { error } = await supabase.from('evaluations').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['evaluations'] }),
  });

  const deleteEvaluation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('evaluations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['evaluations'] }); toast.success('Avaliação excluída!'); },
  });

  return { addEvaluation, updateEvaluation, deleteEvaluation };
}

// ── Notes ──
export function useNotes() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  return useQuery({
    queryKey: ['notes', activeWorkspace?.id],
    queryFn: async () => {
      if (!activeWorkspace) return [];
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('workspace_id', activeWorkspace.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!activeWorkspace,
  });
}

export function useNoteMutations() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const key = ['notes', activeWorkspace?.id];

  const addNote = useMutation({
    mutationFn: async (n: { title: string; content?: string; subject_id?: string | null; tags?: any; starred?: boolean }) => {
      const { error } = await supabase.from('notes').insert({
        ...n,
        user_id: user!.id,
        workspace_id: activeWorkspace!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success('Nota criada!'); },
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [k: string]: any }) => {
      const { error } = await supabase.from('notes').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success('Nota excluída!'); },
  });

  return { addNote, updateNote, deleteNote };
}

// ── Links ──
export function useLinks() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  return useQuery({
    queryKey: ['links', activeWorkspace?.id],
    queryFn: async () => {
      if (!activeWorkspace) return [];
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('workspace_id', activeWorkspace.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!activeWorkspace,
  });
}

export function useLinkMutations() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const key = ['links', activeWorkspace?.id];

  const addLink = useMutation({
    mutationFn: async (l: any) => {
      const { error } = await supabase.from('links').insert({
        ...l,
        user_id: user!.id,
        workspace_id: activeWorkspace!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success('Link adicionado!'); },
  });

  const updateLink = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [k: string]: any }) => {
      const { error } = await supabase.from('links').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const deleteLink = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('links').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success('Link excluído!'); },
  });

  return { addLink, updateLink, deleteLink };
}

// ── Files ──
export function useFiles() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  return useQuery({
    queryKey: ['files', activeWorkspace?.id],
    queryFn: async () => {
      if (!activeWorkspace) return [];
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('workspace_id', activeWorkspace.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!activeWorkspace,
  });
}

export function useFileMutations() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const key = ['files', activeWorkspace?.id];

  const addFile = useMutation({
    mutationFn: async (f: any) => {
      const { error } = await supabase.from('files').insert({
        ...f,
        user_id: user!.id,
        workspace_id: activeWorkspace!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success('Arquivo adicionado!'); },
  });

  const deleteFile = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('files').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: key }); toast.success('Arquivo excluído!'); },
  });

  return { addFile, deleteFile };
}

// ── Kanban Columns ──
export function useKanbanColumns() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  return useQuery({
    queryKey: ['kanban_columns', activeWorkspace?.id],
    queryFn: async () => {
      if (!activeWorkspace) return [];
      const { data, error } = await supabase
        .from('kanban_columns')
        .select('*')
        .eq('workspace_id', activeWorkspace.id)
        .order('order');
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!activeWorkspace,
  });
}

// ── Profile ──
export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useProfileMutation() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (updates: Record<string, any>) => {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profile'] }); toast.success('Perfil atualizado!'); },
  });
}
