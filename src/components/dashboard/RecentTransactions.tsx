import { useApp } from '@/contexts/AppContext';
import { formatCurrency } from '@/lib/helpers';
import { Trash2 } from 'lucide-react';

export function RecentTransactions() {
  const { data, deleteTransaction } = useApp();
  const { transactions, categories, settings } = data;
  const sym = settings.currencySymbol;

  const recent = transactions.slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="glass-card p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">Recent Transactions</h3>
        <p className="text-sm text-muted-foreground text-center py-6 sm:py-8">
          No transactions yet. Tap + to add your first one!
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 sm:p-6">
      <h3 className="text-sm font-semibold text-foreground mb-3 sm:mb-4">Recent Transactions</h3>
      <div className="space-y-2 sm:space-y-3">
        {recent.map(t => {
          const cat = categories.find(c => c.id === t.categoryId);
          const isIncome = t.type === 'income';
          return (
            <div key={t.id} className="flex items-center gap-2 sm:gap-3 animate-slide-in">
              <div
                className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                style={{ backgroundColor: `hsl(${cat?.color || '220 10% 46%'} / 0.15)`, color: `hsl(${cat?.color || '220 10% 46%'})` }}
              >
                {cat?.name.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-foreground truncate">{cat?.name || 'Unknown'}</p>
                <p className="text-xs text-muted-foreground">{t.date}</p>
              </div>
              <span className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${isIncome ? 'text-success' : 'text-destructive'}`}>
                {isIncome ? '+' : '-'}{formatCurrency(t.amount, sym)}
              </span>
              <button
                onClick={() => deleteTransaction(t.id)}
                className="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0"
              >
                <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
