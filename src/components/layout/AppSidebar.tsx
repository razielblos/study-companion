import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Calendar, CheckSquare, Columns3,
  FileText, Link2, FolderOpen, BarChart3, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/disciplinas', icon: BookOpen, label: 'Disciplinas' },
  { to: '/cronograma', icon: Calendar, label: 'Cronograma' },
  { to: '/tarefas', icon: CheckSquare, label: 'Tarefas' },
  { to: '/kanban', icon: Columns3, label: 'Kanban' },
  { to: '/notas', icon: FileText, label: 'Notas' },
  { to: '/links', icon: Link2, label: 'Links Úteis' },
  { to: '/arquivos', icon: FolderOpen, label: 'Arquivos' },
  { to: '/progresso', icon: BarChart3, label: 'Progresso' },
  { to: '/configuracoes', icon: Settings, label: 'Configurações' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="font-heading text-lg font-bold text-foreground tracking-tight">
            Study<span className="text-primary">OS</span>
          </h1>
        )}
        {collapsed && (
          <span className="font-heading text-lg font-bold text-primary mx-auto">S</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto scrollbar-thin">
        <ul className="space-y-0.5 px-2">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
            return (
              <li key={to}>
                <NavLink
                  to={to}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-heading font-medium transition-all duration-200',
                    isActive
                      ? 'text-primary bg-sidebar-accent'
                      : 'text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
                  {!collapsed && <span>{label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-sidebar-border text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
