import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { QuickAddButton } from "./QuickAddButton";
import MobileNav from "./MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/hooks/useTheme";

export function AppLayout() {
  const { data } = useApp();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  useTheme(data.settings.theme, data.settings.accentColor);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Desktop: sidebar on left, content on right with padding
  // Tablet: Sidebar (maybe collapsed), content adjusts
  // Mobile: MobileNav on top, BottomNav on bottom, content fills space

  const sidebarWidth = !sidebarCollapsed ? "lg:ml-60" : "lg:ml-16";
  const contentPadding = isMobile ? "pt-14 pb-20" : "lg:pt-0 lg:pb-0";

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background overflow-hidden">
      {/* Mobile/Tablet Navigation */}
      {isMobile && <MobileNav />}

      {/* Desktop Sidebar - Fixed */}
      {!isMobile && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 overflow-x-hidden overflow-y-auto ${contentPadding} ${sidebarWidth}`}
      >
        <div
          className={`mx-auto w-full max-w-7xl px-2 py-3 sm:px-4 md:py-4 lg:px-6`}
        >
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation - Sticky */}
      {isMobile && <BottomNav />}

      {/* Floating Action Button */}
      <QuickAddButton />
    </div>
  );
}
