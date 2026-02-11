import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { generateId, formatCurrency, getMonthKey, getTransactionsForMonth } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function Categories() {
  const { data, addCategory, updateCategory, deleteCategory } = useApp();
  const { categories, transactions, settings } = data;
  const sym = settings.currencySymbol;

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense' | 'both'>('expense');
  const [color, setColor] = useState('217 91% 60%');

  const monthTxns = getTransactionsForMonth(transactions, getMonthKey());

  const openAdd = () => { setEditId(null); setName(''); setType('expense'); setColor('217 91% 60%'); setOpen(true); };
  const openEdit = (id: string) => {
    const c = categories.find(x => x.id === id);
    if (!c) return;
    setEditId(id); setName(c.name); setType(c.type); setColor(c.color); setOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (editId) {
      updateCategory(editId, { name, type, color });
    } else {
      addCategory({ id: generateId(), name, icon: 'Tag', color, type, isDefault: false });
    }
    setOpen(false);
  };

  const colorOptions = [
    '217 91% 60%', '142 71% 45%', '262 83% 58%', '0 84% 60%',
    '25 95% 53%', '38 92% 50%', '330 81% 60%', '180 70% 45%',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground">{categories.length} categories</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openAdd} className="gap-1.5"><Plus className="h-4 w-4" /> Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Category</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} className="mt-1" /></div>
              <div>
                <Label>Type</Label>
                <Select value={type} onValueChange={v => setType(v as typeof type)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex gap-2 mt-2">
                  {colorOptions.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`h-8 w-8 rounded-full border-2 transition-transform ${color === c ? 'border-foreground scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: `hsl(${c})` }}
                    />
                  ))}
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(c => {
          const spent = monthTxns.filter(t => t.categoryId === c.id && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
          return (
            <div key={c.id} className="glass-card-hover p-4 flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                style={{ backgroundColor: `hsl(${c.color} / 0.15)`, color: `hsl(${c.color})` }}
              >
                {c.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{c.type} · {formatCurrency(spent, sym)} this month</p>
              </div>
              <button onClick={() => openEdit(c.id)} className="text-muted-foreground hover:text-foreground p-1">
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              {!c.isDefault && (
                <button onClick={() => deleteCategory(c.id)} className="text-muted-foreground hover:text-destructive p-1">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
