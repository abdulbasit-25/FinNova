import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { generateId, formatCurrency, getMonthKey, getTransactionsForMonth, getTotalExpenses } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, AlertTriangle } from 'lucide-react';

export default function Budgets() {
  const { data, setBudget, deleteBudget } = useApp();
  const { budgets, categories, transactions, settings } = data;
  const sym = settings.currencySymbol;
  const monthKey = getMonthKey();
  const monthTxns = getTransactionsForMonth(transactions, monthKey);
  const totalExpenses = getTotalExpenses(monthTxns);

  const [open, setOpen] = useState(false);
  const [catId, setCatId] = useState<string>('overall');
  const [amount, setAmount] = useState('');

  const handleSave = () => {
    if (!amount || Number(amount) <= 0) return;
    setBudget({
      id: generateId(),
      categoryId: catId === 'overall' ? null : catId,
      amount: Number(amount),
      month: monthKey,
    });
    setOpen(false);
    setAmount('');
  };

  const monthBudgets = budgets.filter(b => b.month === monthKey);

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const remainingDays = daysInMonth - now.getDate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Budgets</h1>
          <p className="text-sm text-muted-foreground">{remainingDays} days remaining this month</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Set Budget</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Set Budget</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select value={catId} onValueChange={setCatId}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overall">Overall Budget</SelectItem>
                    {categories.filter(c => c.type === 'expense' || c.type === 'both').map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount</Label>
                <Input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1" placeholder="0.00" />
              </div>
              <Button onClick={handleSave} className="w-full">Save Budget</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {monthBudgets.length === 0 ? (
        <div className="glass-card p-8 text-center text-sm text-muted-foreground">
          No budgets set for this month. Create one to start tracking!
        </div>
      ) : (
        <div className="space-y-4">
          {monthBudgets.map(b => {
            const cat = b.categoryId ? categories.find(c => c.id === b.categoryId) : null;
            const spent = b.categoryId
              ? monthTxns.filter(t => t.categoryId === b.categoryId && t.type === 'expense').reduce((s, t) => s + t.amount, 0)
              : totalExpenses;
            const pct = Math.min((spent / b.amount) * 100, 100);
            const isWarning = pct >= 80;
            const isOver = pct >= 100;

            return (
              <div key={b.id} className="glass-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isWarning && <AlertTriangle className={`h-4 w-4 ${isOver ? 'text-destructive' : 'text-warning'}`} />}
                    <span className="text-sm font-semibold text-foreground">{cat?.name || 'Overall Budget'}</span>
                  </div>
                  <button onClick={() => deleteBudget(b.id)} className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
                </div>
                <Progress value={pct} className={`h-2 ${isOver ? '[&>div]:bg-destructive' : isWarning ? '[&>div]:bg-warning' : ''}`} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(spent, sym)} spent</span>
                  <span>{formatCurrency(b.amount, sym)} budget</span>
                </div>
                {isOver && <p className="text-xs text-destructive font-medium">⚠️ Budget exceeded!</p>}
                {isWarning && !isOver && <p className="text-xs text-warning font-medium">⚠️ Approaching budget limit</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
