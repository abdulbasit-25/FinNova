import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Menu,
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Settings,
  Wallet,
  Tag,
  Receipt,
  Target,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/categories", label: "Categories", icon: Tag },
  { to: "/budgets", label: "Budgets", icon: Receipt },
  { to: "/accounts", label: "Accounts", icon: Wallet },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        aria-label="Open navigation"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
      />

      <aside
        id="mobile-nav"
        ref={panelRef}
        className={`fixed left-0 top-0 z-50 h-full w-72 transform bg-card shadow-lg transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">ET</div>
            <div>
              <div className="text-sm font-semibold">ExpenseTracker</div>
              <div className="text-xs text-muted-foreground">Personal finance</div>
            </div>
          </div>

          <button aria-label="Close navigation" onClick={() => setOpen(false)} className="p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="mt-4 border-t border-border pt-4">
            <Link to="/add" onClick={() => setOpen(false)} className="block w-full rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground">
              Add Transaction
            </Link>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <a
              href="https://abdulbasit-archer.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              <span>Powered by</span>
              <span className="font-semibold">Archer</span>
            </a>
          </div>
        </nav>
      </aside>
    </>
  );
}
