import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { formatCurrency } from '@/lib/helpers';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2, Search } from 'lucide-react';

export default function Transactions() {
  const { data, deleteTransaction, deleteTransactions } = useApp();
  const { transactions, categories, settings } = data;
  const sym = settings.currencySymbol;

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(t => {
        const cat = categories.find(c => c.id === t.categoryId);
        return cat?.name.toLowerCase().includes(s) || t.notes.toLowerCase().includes(s);
      });
    }
    if (typeFilter !== 'all') list = list.filter(t => t.type === typeFilter);
    list.sort((a, b) => {
      if (sortBy === 'newest') return b.date.localeCompare(a.date);
      if (sortBy === 'oldest') return a.date.localeCompare(b.date);
      if (sortBy === 'highest') return b.amount - a.amount;
      return a.amount - b.amount;
    });
    return list;
  }, [transactions, categories, search, typeFilter, sortBy]);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    deleteTransactions(Array.from(selected));
    setSelected(new Set());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <p className="text-sm text-muted-foreground">{transactions.length} total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="highest">Highest</SelectItem>
            <SelectItem value="lowest">Lowest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{selected.size} selected</span>
          <Button size="sm" variant="destructive" onClick={handleBulkDelete} className="gap-1.5">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      )}

      {/* List */}
      <div className="glass-card divide-y divide-border">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No transactions found</p>
        ) : (
          filtered.map(t => {
            const cat = categories.find(c => c.id === t.categoryId);
            const isIncome = t.type === 'income';
            return (
              <div key={t.id} className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors">
                <input
                  type="checkbox"
                  checked={selected.has(t.id)}
                  onChange={() => toggleSelect(t.id)}
                  className="rounded border-border"
                />
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                  style={{
                    backgroundColor: `hsl(${cat?.color || '220 10% 46%'} / 0.15)`,
                    color: `hsl(${cat?.color || '220 10% 46%'})`,
                  }}
                >
                  {cat?.name.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{cat?.name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">{t.date} · {t.notes || t.paymentMethod}</p>
                </div>
                <span className={`text-sm font-semibold ${isIncome ? 'text-success' : 'text-destructive'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(t.amount, sym)}
                </span>
                <button onClick={() => deleteTransaction(t.id)} className="text-muted-foreground hover:text-destructive p-1">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
