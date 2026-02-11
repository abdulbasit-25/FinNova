import { useApp } from '@/contexts/AppContext';
import { getMonthKey, getTransactionsForMonth, getCategoryTotals } from '@/lib/helpers';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function SpendingChart() {
  const { data } = useApp();
  const { transactions, categories, settings } = data;
  const sym = settings.currencySymbol;

  const monthTxns = getTransactionsForMonth(transactions, getMonthKey());
  const catTotals = getCategoryTotals(monthTxns);

  const chartData = Object.entries(catTotals)
    .map(([catId, amount]) => {
      const cat = categories.find(c => c.id === catId);
      return { name: cat?.name || 'Other', value: amount, color: `hsl(${cat?.color || '220 10% 46%'})` };
    })
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Category Breakdown</h3>
        <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
          No expense data this month
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Category Breakdown</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${sym}${value.toFixed(2)}`}
            contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 flex flex-wrap gap-3">
        {chartData.slice(0, 5).map(d => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
}
