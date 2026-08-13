import { useApp } from '@/contexts/AppContext';
import { getMonthKey, getTransactionsForMonth, getTotalIncome, getTotalExpenses, formatCurrency, getCategoryTotals } from '@/lib/helpers';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function Reports() {
  const { data } = useApp();
  const { transactions, categories, settings } = data;
  const sym = settings.currencySymbol;

  // Last 6 months data
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = getMonthKey(d);
    const txns = getTransactionsForMonth(transactions, key);
    monthlyData.push({
      month: d.toLocaleString('default', { month: 'short' }),
      income: getTotalIncome(txns),
      expenses: getTotalExpenses(txns),
    });
  }

  const currentMonthTxns = getTransactionsForMonth(transactions, getMonthKey());
  const income = getTotalIncome(currentMonthTxns);
  const expenses = getTotalExpenses(currentMonthTxns);
  const savingsRate = income > 0 ? ((income - expenses) / income * 100).toFixed(1) : '0';

  const catTotals = getCategoryTotals(currentMonthTxns);
  const topCategories = Object.entries(catTotals)
    .map(([id, amount]) => ({ name: categories.find(c => c.id === id)?.name || 'Other', amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Find highest spending day
  const dayTotals: Record<string, number> = {};
  currentMonthTxns.filter(t => t.type === 'expense').forEach(t => {
    dayTotals[t.date] = (dayTotals[t.date] || 0) + t.amount;
  });
  const highestDay = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0];

  const handleExportCSV = () => {
    const header = 'Date,Type,Category,Amount,Notes\n';
    const rows = transactions.map(t => {
      const cat = categories.find(c => c.id === t.categoryId)?.name || '';
      return `${t.date},${t.type},${cat},${t.amount},"${t.notes}"`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'transactions.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">Your financial analytics</p>
        </div>
        <button onClick={handleExportCSV} className="text-sm text-primary hover:underline">Export CSV</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Savings Rate</p>
          <p className="text-2xl font-bold text-foreground mt-1">{savingsRate}%</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Top Category</p>
          <p className="text-lg font-bold text-foreground mt-1">{topCategories[0]?.name || '-'}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Highest Day</p>
          <p className="text-sm font-bold text-foreground mt-1">{highestDay ? `${highestDay[0]} (${formatCurrency(highestDay[1], sym)})` : '-'}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Daily</p>
          <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(expenses / (new Date().getDate()), sym)}</p>
        </div>
      </div>

      {/* Income vs Expense chart */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Income vs Expenses (6 Months)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
            <Legend />
            <Bar dataKey="income" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Income" />
            <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top spending categories */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Top Spending Categories</h3>
        <div className="space-y-3">
          {topCategories.map(c => (
            <div key={c.name} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{c.name}</span>
              <span className="text-sm font-semibold text-foreground">{formatCurrency(c.amount, sym)}</span>
            </div>
          ))}
          {topCategories.length === 0 && <p className="text-sm text-muted-foreground text-center">No data</p>}
        </div>
      </div>
    </div>
  );
}
