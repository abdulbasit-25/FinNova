import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { useApp } from '@/contexts/AppContext';
import { getMonthKey, getTransactionsForMonth, getTotalIncome, getTotalExpenses } from '@/lib/helpers';

export function SummaryCards() {
  const { data } = useApp();
  const { transactions, settings } = data;
  const sym = settings.currencySymbol;

  const monthTxns = getTransactionsForMonth(transactions, getMonthKey());
  const income = getTotalIncome(monthTxns);
  const expenses = getTotalExpenses(monthTxns);
  const balance = income - expenses;
  const savings = Math.max(0, balance);

  const cards = [
    { label: 'Total Balance', value: balance, icon: Wallet, iconColor: 'text-primary' },
    { label: 'Income', value: income, icon: TrendingUp, iconColor: 'text-success' },
    { label: 'Expenses', value: expenses, icon: TrendingDown, iconColor: 'text-destructive' },
    { label: 'Savings', value: savings, icon: PiggyBank, iconColor: 'text-warning' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(card => (
        <div key={card.label} className="glass-card p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {card.label}
            </span>
            <card.icon className={`h-5 w-5 ${card.iconColor}`} />
          </div>
          <div className="text-2xl font-bold text-foreground">
            <AnimatedCounter value={card.value} symbol={sym} />
          </div>
        </div>
      ))}
    </div>
  );
}
