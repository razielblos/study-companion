import { Search, Bell } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useState } from 'react';

interface HeaderProps {
  onOpenSearch: () => void;
}

export function AppHeader({ onOpenSearch }: HeaderProps) {
  const profile = useStore((s) => s.profile);
  const semesters = useStore((s) => s.semesters);
  const notifications = useStore((s) => s.notifications);
  const activeSemester = semesters.find((s) => s.active);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [showNotifs, setShowNotifs] = useState(false);
  const markNotificationRead = useStore((s) => s.markNotificationRead);

  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-14 border-b border-border bg-background-secondary flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {activeSemester && (
          <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
            {activeSemester.name}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 h-9 px-3 rounded-md bg-card border border-border text-text-secondary text-sm font-heading hover:border-primary/30 transition-colors"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Buscar...</span>
          <kbd className="hidden sm:inline-flex items-center text-xs px-1.5 py-0.5 rounded bg-muted text-text-tertiary font-mono">⌘K</kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative h-9 w-9 rounded-md flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-card transition-colors"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-heading font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-11 w-80 card-surface p-3 shadow-xl animate-scale-in z-50">
              <p className="font-heading text-sm font-semibold mb-2">Notificações</p>
              {notifications.length === 0 ? (
                <p className="text-text-secondary text-sm py-4 text-center">Nenhuma notificação</p>
              ) : (
                <ul className="space-y-1 max-h-60 overflow-y-auto scrollbar-thin">
                  {notifications.slice(0, 10).map((n) => (
                    <li
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`text-sm p-2 rounded cursor-pointer transition-colors ${n.read ? 'text-text-secondary' : 'text-foreground bg-card'}`}
                    >
                      {n.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-heading font-bold"
          style={{ backgroundColor: profile.avatarColor + '22', color: profile.avatarColor }}
        >
          {initials || 'U'}
        </div>
      </div>
    </header>
  );
}
