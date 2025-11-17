import { Home, Calendar, Activity, TrendingUp } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const tabs = [
  { name: 'Home', path: '/moto3', icon: Home },
  { name: 'Calendar', path: '/moto3/calendar', icon: Calendar },
  { name: 'Readiness', path: '/moto3/readiness', icon: Activity },
  { name: 'Progress', path: '/moto3/progress', icon: TrendingUp },
];

export function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto px-4">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path ||
                          (tab.path === '/moto3' && location.pathname === '/');
          const Icon = tab.icon;

          return (
            <button
              key={tab.name}
              onClick={() => navigate(tab.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all',
                'hover:bg-accent active:scale-95',
                isActive && 'text-red-500'
              )}
            >
              <Icon
                className={cn(
                  'w-6 h-6 transition-colors',
                  isActive ? 'stroke-[2.5]' : 'stroke-[2]'
                )}
              />
              <span className={cn(
                'text-xs font-medium',
                isActive && 'font-semibold'
              )}>
                {tab.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
