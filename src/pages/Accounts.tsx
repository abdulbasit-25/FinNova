import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { generateId, formatCurrency } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Account } from '@/types/expense-tracker';

export default function Accounts() {
  const { data, addAccount, updateAccount, deleteAccount } = useApp();
  const { accounts, transactions, settings } = data;
  const sym = settings.currencySymbol;

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<Account['type']>('bank');
  const [balance, setBalance] = useState('');

  const openAdd = () => { setEditId(null); setName(''); setType('bank'); setBalance(''); setOpen(true); };
  const openEdit = (id: string) => {
    const a = accounts.find(x => x.id === id);
    if (!a) return;
    setEditId(id); setName(a.name); setType(a.type); setBalance(String(a.balance)); setOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (editId) {
      updateAccount(editId, { name, type, balance: Number(balance) || 0 });
    } else {
      addAccount({ id: generateId(), name, type, balance: Number(balance) || 0, icon: 'Wallet', color: '217 91% 60%' });
    }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Accounts</h1>
          <p className="text-sm text-muted-foreground">{accounts.length} accounts</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openAdd} className="gap-1.5"><Plus className="h-4 w-4" /> Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Account</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} className="mt-1" /></div>
              <div>
                <Label>Type</Label>
                <Select value={type} onValueChange={v => setType(v as Account['type'])}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="wallet">Wallet</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Balance</Label><Input type="number" step="0.01" value={balance} onChange={e => setBalance(e.target.value)} className="mt-1" /></div>
              <Button onClick={handleSave} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {accounts.map(a => {
          const txnCount = transactions.filter(t => t.accountId === a.id).length;
          return (
            <div key={a.id} className="glass-card-hover p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground capitalize">{a.type.replace('_', ' ')}</span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(a.id)} className="text-muted-foreground hover:text-foreground p-1"><Edit2 className="h-3.5 w-3.5" /></button>
                  <button onClick={() => deleteAccount(a.id)} className="text-muted-foreground hover:text-destructive p-1"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <p className="text-lg font-bold text-foreground">{a.name}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(a.balance, sym)}</p>
              <p className="text-xs text-muted-foreground mt-2">{txnCount} transactions</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
