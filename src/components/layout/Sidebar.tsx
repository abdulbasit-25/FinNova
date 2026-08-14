import { NavLink } from 'react-router-dom';
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
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/categories', icon: Tag, label: 'Categories' },
  { to: '/budgets', icon: Receipt, label: 'Budgets' },
  { to: '/accounts', icon: Wallet, label: 'Accounts' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/about', icon: Info, label: 'About' },
];

const PORTFOLIO_URL = 'https://abdulbasit-archer.vercel.app/';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
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
          <img src="/image.png" alt="FinNova Logo" className="h-9 w-9 shrink-0 rounded-lg object-cover" />
          {!collapsed && (
            <span className="text-sm font-bold tracking-tight text-foreground truncate">FinNova</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="ml-1 h-8 w-8 shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide px-3 py-4" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                isActive
                  ? 'bg-primary/15 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground active:bg-muted'
              )
            }
            title={collapsed ? item.label : undefined}
            aria-label={item.label}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="border-t border-border p-4">
        <a
          href={PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Built by Archer — opens portfolio in a new tab"
          title="Built by Archer"
          className={cn(
            'group flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors',
            'hover:bg-muted hover:text-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
          )}
        >
          {collapsed ? (
            <span className="font-semibold text-xs" aria-hidden="true">
              A
            </span>
          ) : (
            <>
              <span aria-hidden="true">Built by</span>
              <span className="font-semibold" aria-hidden="true">
                Archer
              </span>
              <ExternalLink
                className="h-3 w-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                aria-hidden="true"
              />
            </>
          )}
        </a>
      </div>
    </aside>
  );
}