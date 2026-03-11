import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export interface Workspace {
  id: string;
  user_id: string;
  name: string;
  course: string;
  university: string;
  start_date: string;
  end_date: string;
  total_weeks: number;
  description: string;
  status: string;
  is_active: boolean;
  created_at: string;
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  loading: boolean;
  switchWorkspace: (id: string) => Promise<void>;
  createWorkspace: (w: Omit<Workspace, 'id' | 'user_id' | 'created_at'>) => Promise<Workspace | null>;
  updateWorkspace: (id: string, w: Partial<Workspace>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  refetchWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  workspaces: [],
  activeWorkspace: null,
  loading: true,
  switchWorkspace: async () => {},
  createWorkspace: async () => null,
  updateWorkspace: async () => {},
  deleteWorkspace: async () => {},
  refetchWorkspaces: async () => {},
});

export const useWorkspace = () => useContext(WorkspaceContext);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('workspaces')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    const ws = (data || []) as Workspace[];
    setWorkspaces(ws);
    
    const active = ws.find(w => w.is_active) || ws[0] || null;
    setActiveWorkspace(active);
    return ws;
  };

  // Auto-create workspace on first login
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    
    const init = async () => {
      const ws = await fetchWorkspaces();
      if (!ws || ws.length === 0) {
        // Get profile for course/university
        const { data: profile } = await supabase
          .from('profiles')
          .select('course, university')
          .eq('id', user.id)
          .single();

        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        const sem = month < 6 ? '1' : '2';
        const startDate = month < 6 ? `${year}-02-01` : `${year}-07-01`;
        const endDate = month < 6 ? `${year}-07-01` : `${year}-12-15`;

        const { data: newWs } = await supabase
          .from('workspaces')
          .insert({
            user_id: user.id,
            name: `${year}/${sem}`,
            course: profile?.course || '',
            university: profile?.university || '',
            start_date: startDate,
            end_date: endDate,
            total_weeks: 18,
            description: '',
            status: 'active',
            is_active: true,
          })
          .select()
          .single();

        if (newWs) {
          // Create default kanban columns
          await supabase.from('kanban_columns').insert([
            { user_id: user.id, workspace_id: newWs.id, title: 'Backlog', order: 0 },
            { user_id: user.id, workspace_id: newWs.id, title: 'A Fazer', order: 1 },
            { user_id: user.id, workspace_id: newWs.id, title: 'Em Andamento', order: 2 },
            { user_id: user.id, workspace_id: newWs.id, title: 'Concluído', order: 3 },
          ]);

          setWorkspaces([newWs as Workspace]);
          setActiveWorkspace(newWs as Workspace);
        }
      }
      setLoading(false);
    };

    init();
  }, [user]);

  const switchWorkspace = async (id: string) => {
    if (!user) return;
    // Deactivate all, activate selected
    await supabase.from('workspaces').update({ is_active: false }).eq('user_id', user.id);
    await supabase.from('workspaces').update({ is_active: true }).eq('id', id);
    
    const target = workspaces.find(w => w.id === id);
    if (target) {
      setWorkspaces(prev => prev.map(w => ({ ...w, is_active: w.id === id })));
      setActiveWorkspace({ ...target, is_active: true });
      queryClient.invalidateQueries();
    }
  };

  const createWorkspace = async (w: Omit<Workspace, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return null;
    // Deactivate all first if new one is active
    if (w.is_active) {
      await supabase.from('workspaces').update({ is_active: false }).eq('user_id', user.id);
    }
    
    const { data } = await supabase
      .from('workspaces')
      .insert({ ...w, user_id: user.id })
      .select()
      .single();

    if (data) {
      // Create default kanban columns
      await supabase.from('kanban_columns').insert([
        { user_id: user.id, workspace_id: data.id, title: 'Backlog', order: 0 },
        { user_id: user.id, workspace_id: data.id, title: 'A Fazer', order: 1 },
        { user_id: user.id, workspace_id: data.id, title: 'Em Andamento', order: 2 },
        { user_id: user.id, workspace_id: data.id, title: 'Concluído', order: 3 },
      ]);

      await fetchWorkspaces();
      if (w.is_active) {
        setActiveWorkspace(data as Workspace);
      }
      queryClient.invalidateQueries();
      return data as Workspace;
    }
    return null;
  };

  const updateWorkspace = async (id: string, updates: Partial<Workspace>) => {
    await supabase.from('workspaces').update(updates).eq('id', id);
    await fetchWorkspaces();
    queryClient.invalidateQueries();
  };

  const deleteWorkspace = async (id: string) => {
    await supabase.from('workspaces').delete().eq('id', id);
    await fetchWorkspaces();
    queryClient.invalidateQueries();
  };

  const refetchWorkspaces = async () => { await fetchWorkspaces(); };

  return (
    <WorkspaceContext.Provider value={{ workspaces, activeWorkspace, loading, switchWorkspace, createWorkspace, updateWorkspace, deleteWorkspace, refetchWorkspaces }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
