import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { QuickAddButton } from './QuickAddButton';
import MobileNav from './MobileNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/hooks/useTheme';

export function AppLayout() {
  const { data } = useApp();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useTheme(data.settings.theme, data.settings.accentColor);

  const contentMargin = !isMobile ? (sidebarCollapsed ? 'ml-16' : 'ml-60') : '';

  return (
    <div className="flex min-h-screen w-full bg-background">
      {isMobile && <MobileNav />}
      {!isMobile && (
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      )}
      <main className={`flex-1 ${isMobile ? 'pb-20' : ''} overflow-auto`}>
        <div className={`${contentMargin} mx-auto max-w-6xl p-4 md:p-6`}>
          <Outlet />
        </div>
      </main>
      {isMobile && <BottomNav />}
      <QuickAddButton />
    </div>
  );
}
