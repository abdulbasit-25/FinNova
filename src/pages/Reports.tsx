import { useMemo, useCallback } from "react";
import { useApp } from "@/contexts/AppContext";
import {
  getMonthKey,
  getTransactionsForMonth,
  getTotalIncome,
  getTotalExpenses,
  formatCurrency,
  getCategoryTotals,
} from "@/lib/helpers";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

// ---- CSV export -----------------------------------------------------------

/**
 * Escapes a single CSV field per RFC 4180: wraps in quotes and doubles any
 * embedded quotes whenever the value contains a comma, quote, or newline.
 * The previous implementation only ever quoted `notes`, and didn't escape
 * quotes inside it — a note like `He said "hi", then left` would have
 * silently corrupted the row (and shifted every column after it).
 */
function escapeCsvField(value: string | number): string {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  // Some browsers (notably Firefox) require the anchor to be in the DOM
  // for the click-to-download to fire reliably.
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---- Page -------------------------------------------------------------

export default function Reports() {
  const { data } = useApp();
  const { transactions, categories, settings } = data;
  const sym = settings.currencySymbol;

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );

  // Last 6 months of income/expense totals.
  const monthlyData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = getMonthKey(d);
      const txns = getTransactionsForMonth(transactions, key);
      months.push({
        month: d.toLocaleString("default", { month: "short" }),
        income: getTotalIncome(txns),
        expenses: getTotalExpenses(txns),
      });
    }
    return months;
  }, [transactions]);

  const currentMonthTxns = useMemo(
    () => getTransactionsForMonth(transactions, getMonthKey()),
    [transactions],
  );

  const income = useMemo(
    () => getTotalIncome(currentMonthTxns),
    [currentMonthTxns],
  );
  const expenses = useMemo(
    () => getTotalExpenses(currentMonthTxns),
    [currentMonthTxns],
  );
  const savingsRate =
    income > 0 ? (((income - expenses) / income) * 100).toFixed(1) : "0";
  const avgDaily = expenses / new Date().getDate();

  const topCategories = useMemo(() => {
    const catTotals = getCategoryTotals(currentMonthTxns);
    return Object.entries(catTotals)
      .map(([id, amount]) => ({
        id,
        name: categoryMap.get(id)?.name || "Uncategorized",
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [currentMonthTxns, categoryMap]);

  const highestDay = useMemo(() => {
    const dayTotals: Record<string, number> = {};
    for (const t of currentMonthTxns) {
      if (t.type !== "expense") continue;
      dayTotals[t.date] = (dayTotals[t.date] || 0) + t.amount;
    }
    const entries = Object.entries(dayTotals).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) return null;
    const [dateStr, amount] = entries[0];
    const formatted = new Date(dateStr).toLocaleDateString("default", {
      month: "short",
      day: "numeric",
    });
    return { dateStr, formatted, amount };
  }, [currentMonthTxns]);

  const handleExportCSV = useCallback(() => {
    const header = "Date,Type,Category,Amount,Notes\n";
    const rows = transactions
      .map((t) => {
        const cat = categoryMap.get(t.categoryId)?.name || "";
        return [t.date, t.type, cat, t.amount, t.notes ?? ""]
          .map(escapeCsvField)
          .join(",");
      })
      .join("\n");
    const stamp = getMonthKey();
    downloadCsv(`transactions-${stamp}.csv`, header + rows);
  }, [transactions, categoryMap]);

  const tooltipFormatter = useCallback(
    (value: number) => formatCurrency(value, sym),
    [sym],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-foreground">
            Reports
          </h1>
          <p className="text-sm text-muted-foreground">
            Your financial analytics
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
          aria-label="Export all transactions as CSV"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Savings Rate
          </p>
          <p className="text-2xl font-bold text-foreground mt-1 tabular-nums">
            {savingsRate}%
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Top Category
          </p>
          <p className="text-lg font-bold text-foreground mt-1 truncate">
            {topCategories[0]?.name || "-"}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Highest Day
          </p>
          <p className="text-sm font-bold text-foreground mt-1 tabular-nums">
            {highestDay
              ? `${highestDay.formatted} (${formatCurrency(highestDay.amount, sym)})`
              : "-"}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Avg Daily
          </p>
          <p className="text-lg font-bold text-foreground mt-1 tabular-nums">
            {formatCurrency(avgDaily, sym)}
          </p>
        </div>
      </div>

      {/* Income vs Expense chart */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Income vs Expenses (6 Months)
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
              }}
            />
            <Legend />
            <Bar
              dataKey="income"
              fill="hsl(var(--success))"
              radius={[4, 4, 0, 0]}
              name="Income"
            />
            <Bar
              dataKey="expenses"
              fill="hsl(var(--destructive))"
              radius={[4, 4, 0, 0]}
              name="Expenses"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top spending categories */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Top Spending Categories
        </h3>
        <div className="space-y-3">
          {topCategories.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3">
              <span className="text-sm text-foreground truncate">{c.name}</span>
              <span className="text-sm font-semibold text-foreground tabular-nums shrink-0">
                {formatCurrency(c.amount, sym)}
              </span>
            </div>
          ))}
          {topCategories.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">No data</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
