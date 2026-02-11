import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowDownLeft, ArrowUpRight, Repeat, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your financial overview</p>
      </div>

      {/* Summary */}
      <SummaryCards />

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => navigate('/add?type=income')} className="gap-1.5 bg-success hover:bg-success/90 text-success-foreground">
          <ArrowDownLeft className="h-4 w-4" /> Add Income
        </Button>
        <Button size="sm" onClick={() => navigate('/add?type=expense')} className="gap-1.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground">
          <ArrowUpRight className="h-4 w-4" /> Add Expense
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate('/add?type=transfer')} className="gap-1.5">
          <Repeat className="h-4 w-4" /> Transfer
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate('/budgets')} className="gap-1.5">
          <Receipt className="h-4 w-4" /> Set Budget
        </Button>
      </div>

      {/* Charts + Recent */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingChart />
        <WeeklyChart />
      </div>

      <RecentTransactions />
    </div>
  );
};

export default Index;
