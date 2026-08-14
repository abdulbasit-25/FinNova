import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ArrowDownLeft, ArrowUpRight, Repeat, Receipt, type LucideIcon } from 'lucide-react';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { Button } from '@/components/ui/button';

// ---- Quick actions config --------------------------------------------------
// Declarative list instead of four near-identical <Button> blocks — adding or
// reordering an action is now a one-line change instead of copy-pasting JSX.

interface QuickAction {
  label: string;
  icon: LucideIcon;
  to: string;
  variant: 'income' | 'expense' | 'neutral';
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Add Income', icon: ArrowDownLeft, to: '/add?type=income', variant: 'income' },
  { label: 'Add Expense', icon: ArrowUpRight, to: '/add?type=expense', variant: 'expense' },
  { label: 'Transfer', icon: Repeat, to: '/add?type=transfer', variant: 'neutral' },
  { label: 'Set Budget', icon: Receipt, to: '/budgets', variant: 'neutral' },
];

const VARIANT_CLASSES: Record<QuickAction['variant'], string> = {
  income: 'bg-success hover:bg-success/90 text-success-foreground',
  expense: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
  neutral: '',
};

function getGreeting(hour: number) {
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// ---- Page -------------------------------------------------------------

const Index = () => {
  const navigate = useNavigate();

  // Computed once per mount rather than on every render; a dashboard is
  // typically open for a while, so re-deriving this on unrelated re-renders
  // (e.g. a chart updating) would be wasted work.
  const greeting = useMemo(() => getGreeting(new Date().getHours()), []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-lg sm:text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {greeting} • Here's your financial overview
        </p>
      </motion.div>

      {/* Summary */}
      <motion.div variants={itemVariants}>
        <SummaryCards />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-2" role="group" aria-label="Quick actions">
        {QUICK_ACTIONS.map(({ label, icon: Icon, to, variant }) => (
          <Button
            key={to}
            size="sm"
            variant={variant === 'neutral' ? 'outline' : 'default'}
            onClick={() => navigate(to)}
            className={`gap-1.5 ${VARIANT_CLASSES[variant]}`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </Button>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        <SpendingChart />
        <WeeklyChart />
      </motion.div>

      {/* Recent Transactions */}
      <motion.div variants={itemVariants}>
        <RecentTransactions />
      </motion.div>
    </motion.div>
  );
};

export default Index;