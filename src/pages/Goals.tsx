import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { generateId, formatCurrency } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Target, Trash2 } from 'lucide-react';

export default function Goals() {
  const { data, addGoal, updateGoal, deleteGoal } = useApp();
  const { goals, settings } = data;
  const sym = settings.currencySymbol;

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSave = () => {
    if (!name.trim() || !target) return;
    addGoal({
      id: generateId(),
      name,
      targetAmount: Number(target),
      currentAmount: 0,
      deadline,
      icon: 'Target',
      color: '217 91% 60%',
    });
    setOpen(false);
    setName(''); setTarget(''); setDeadline('');
  };

  const handleAddFunds = (id: string) => {
    const amountStr = prompt('Enter amount to add:');
    if (!amountStr) return;
    const goal = goals.find(g => g.id === id);
    if (goal) updateGoal(id, { currentAmount: goal.currentAmount + Number(amountStr) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Savings Goals</h1>
          <p className="text-sm text-muted-foreground">{goals.length} goals</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> New Goal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Savings Goal</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Goal Name</Label><Input value={name} onChange={e => setName(e.target.value)} className="mt-1" placeholder="e.g., Emergency Fund" /></div>
              <div><Label>Target Amount</Label><Input type="number" step="0.01" value={target} onChange={e => setTarget(e.target.value)} className="mt-1" /></div>
              <div><Label>Deadline</Label><Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="mt-1" /></div>
              <Button onClick={handleSave} className="w-full">Create Goal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No savings goals yet. Create one to start saving!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {goals.map(g => {
            const pct = Math.min((g.currentAmount / g.targetAmount) * 100, 100);
            const daysLeft = g.deadline ? Math.max(0, Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000)) : null;
            return (
              <div key={g.id} className="glass-card-hover p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{g.name}</span>
                  <button onClick={() => deleteGoal(g.id)} className="text-muted-foreground hover:text-destructive p-1">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Progress value={pct} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(g.currentAmount, sym)} / {formatCurrency(g.targetAmount, sym)}</span>
                  <span>{pct.toFixed(0)}%</span>
                </div>
                {daysLeft !== null && <p className="text-xs text-muted-foreground">{daysLeft} days remaining</p>}
                <Button size="sm" variant="outline" onClick={() => handleAddFunds(g.id)} className="w-full">Add Funds</Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
