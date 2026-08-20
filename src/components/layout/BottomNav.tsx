import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Settings,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", icon: LayoutDashboard, label: "Home" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-card/95 backdrop-blur-xl safe-area-inset-bottom">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive: routeActive }) =>
                cn(
                  "relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-none px-1 py-2 sm:px-2 sm:py-3 text-xs font-medium transition-all duration-200 active:bg-muted/50",
                  routeActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute inset-x-0 top-0 h-1 w-6 rounded-full bg-primary mx-auto" />
              )}
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="line-clamp-1 text-xs">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
