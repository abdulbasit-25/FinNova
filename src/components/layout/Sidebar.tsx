import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tag,
  Wallet,
  BarChart3,
  Target,
  Settings,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/categories', icon: Tag, label: 'Categories' },
  { to: '/budgets', icon: Receipt, label: 'Budgets' },
  { to: '/accounts', icon: Wallet, label: 'Accounts' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/about', icon: Info, label: 'About' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 hidden h-screen flex-col border-r border-border bg-card/50 backdrop-blur-sm transition-all duration-300 ease-out lg:flex z-30',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src="/image.png"
            alt="FinNova Logo"
            className="h-9 w-9 shrink-0 rounded-lg object-cover"
          />
          {!collapsed && (
            <span className="text-sm font-bold tracking-tight text-foreground truncate">
              FinNova
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="ml-1 h-8 w-8 shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide px-3 py-4">
        {navItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive: routeActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  routeActive
                    ? 'bg-primary/15 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground active:bg-muted'
                )
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="border-t border-border p-4">
        <a
          href="https://abdulbasit-archer.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
          title="Built by Archer"
        >
          {!collapsed ? (
            <>
              <span>Built by</span>
              <span className="font-semibold">Archer</span>
            </>
          ) : (
            <span className="font-semibold text-xs">A</span>
          )}
        </a>
      </div>
    </aside>
  );
}
