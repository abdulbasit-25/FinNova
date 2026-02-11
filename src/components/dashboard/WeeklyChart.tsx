import { useApp } from '@/contexts/AppContext';
import { getWeeklyTotals } from '@/lib/helpers';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function WeeklyChart() {
  const { data } = useApp();
  const weekly = getWeeklyTotals(data.transactions);
  const sym = data.settings.currencySymbol;

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Spending</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={weekly}>
          <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            formatter={(value: number) => `${sym}${value.toFixed(2)}`}
            contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
          />
          <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
