import { Search, Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useSupabaseData';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceSwitcher } from '@/components/workspace/WorkspaceSwitcher';

interface HeaderProps {
  onOpenSearch: () => void;
}

export function AppHeader({ onOpenSearch }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const displayName = profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário';
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="h-14 border-b border-border bg-card/50 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <WorkspaceSwitcher />
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onOpenSearch} className="flex items-center gap-2 h-9 px-3 rounded-md bg-card border border-border text-muted-foreground text-sm font-heading hover:border-primary/30 transition-colors">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Buscar...</span>
          <kbd className="hidden sm:inline-flex items-center text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground/60 font-mono">⌘K</kbd>
        </button>

        <button className="relative h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
          <Bell className="h-[18px] w-[18px]" />
        </button>

        <div className="relative">
          <button onClick={() => setShowUserMenu(!showUserMenu)} className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-heading font-bold bg-primary/15 text-primary hover:bg-primary/25 transition-colors">
            {initials || 'U'}
          </button>
          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-11 w-56 card-surface p-1.5 shadow-xl animate-scale-in z-50">
                <div className="px-3 py-2 border-b border-border mb-1">
                  <p className="font-heading text-sm font-semibold text-foreground truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <button onClick={() => { setShowUserMenu(false); navigate('/configuracoes'); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card rounded transition-colors">
                  <User className="h-4 w-4" /> Meu perfil
                </button>
                <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded transition-colors">
                  <LogOut className="h-4 w-4" /> Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
