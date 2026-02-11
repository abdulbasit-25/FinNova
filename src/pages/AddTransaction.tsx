import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { generateId } from '@/lib/helpers';
import { TransactionType, PaymentMethod } from '@/types/expense-tracker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

export default function AddTransaction() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { data, addTransaction } = useApp();
  const { categories, accounts } = data;

  const [type, setType] = useState<TransactionType>((params.get('type') as TransactionType) || 'expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [toAccountId, setToAccountId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));

  const filteredCategories = categories.filter(c => c.type === type || c.type === 'both');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    addTransaction({
      id: generateId(),
      type,
      amount: Number(amount),
      categoryId: categoryId || filteredCategories[0]?.id || 'cat-other',
      date,
      time,
      paymentMethod,
      accountId,
      toAccountId: type === 'transfer' ? toAccountId : undefined,
      notes,
      isRecurring: false,
      createdAt: new Date().toISOString(),
    });

    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">Add Transaction</h1>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5 max-w-lg">
        {/* Type selector */}
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(['income', 'expense', 'transfer'] as TransactionType[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors capitalize ${
                type === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div>
          <Label>Amount</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="text-2xl font-bold h-14 mt-1"
            autoFocus
          />
        </div>

        {type !== 'transfer' && (
          <div>
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {filteredCategories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Time</Label>
            <Input type="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1" />
          </div>
        </div>

        <div>
          <Label>Account</Label>
          <Select value={accountId} onValueChange={setAccountId}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {accounts.map(a => (
                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {type === 'transfer' && (
          <div>
            <Label>To Account</Label>
            <Select value={toAccountId} onValueChange={setToAccountId}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select destination" /></SelectTrigger>
              <SelectContent>
                {accounts.filter(a => a.id !== accountId).map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label>Payment Method</Label>
          <Select value={paymentMethod} onValueChange={v => setPaymentMethod(v as PaymentMethod)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Notes</Label>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes..." className="mt-1" rows={2} />
        </div>

        <Button type="submit" className="w-full h-12 text-base font-semibold">
          Add {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      </form>
    </div>
  );
}
