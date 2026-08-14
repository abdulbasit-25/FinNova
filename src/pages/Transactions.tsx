import { useState, useMemo, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { formatCurrency } from '@/lib/helpers';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Search, ArrowLeftRight, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Transaction } from '@/types/expense-tracker';

type TypeFilter = 'all' | 'income' | 'expense' | 'transfer';
type SortBy = 'newest' | 'oldest' | 'highest' | 'lowest';

const FALLBACK_COLOR = '220 10% 46%';

export default function Transactions() {
  const { data, deleteTransaction, deleteTransactions } = useApp();
  const { transactions, categories, settings } = data;
  const sym = settings.currencySymbol;

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [confirmingBulkDelete, setConfirmingBulkDelete] = useState(false);

  // O(1) lookups instead of `categories.find(...)` re-run per transaction,
  // both inside the search filter and again during render.
  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((t) => {
        const cat = categoryMap.get(t.categoryId);
        return cat?.name.toLowerCase().includes(s) || t.notes?.toLowerCase().includes(s);
      });
    }
    if (typeFilter !== 'all') list = list.filter((t) => t.type === typeFilter);
    list.sort((a, b) => {
      if (sortBy === 'newest') return b.date.localeCompare(a.date);
      if (sortBy === 'oldest') return a.date.localeCompare(b.date);
      if (sortBy === 'highest') return b.amount - a.amount;
      return a.amount - b.amount;
    });
    return list;
  }, [transactions, categoryMap, search, typeFilter, sortBy]);

  const visibleIds = useMemo(() => filtered.map((t) => t.id), [filtered]);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));
  const someVisibleSelected = visibleIds.some((id) => selected.has(id));

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAllVisible = useCallback(() => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visibleIds.forEach((id) => next.delete(id));
      } else {
        visibleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }, [allVisibleSelected, visibleIds]);

  const handleBulkDelete = () => {
    deleteTransactions(Array.from(selected));
    setSelected(new Set());
    setConfirmingBulkDelete(false);
  };

  const handleSingleDelete = (id: string) => {
    deleteTransaction(id);
    setPendingDeleteId(null);
    setSelected((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const rowMeta = (t: Transaction) => {
    const cat = categoryMap.get(t.categoryId);
    const color = cat?.color || FALLBACK_COLOR;
    if (t.type === 'transfer') {
      return {
        label: cat?.name || 'Transfer',
        sign: '',
        amountClass: 'text-foreground',
        badgeContent: <ArrowLeftRight className="h-3.5 w-3.5" />,
        badgeColor: FALLBACK_COLOR,
      };
    }
    return {
      label: cat?.name || 'Unknown',
      sign: t.type === 'income' ? '+' : '-',
      amountClass: t.type === 'income' ? 'text-success' : 'text-destructive',
      badgeContent: cat?.name.charAt(0).toUpperCase() || '?',
      badgeColor: color,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-foreground">Transactions</h1>
        <p className="text-sm text-muted-foreground">{transactions.length} total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm"
            aria-label="Search transactions"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
          <SelectTrigger className="w-full sm:w-32" aria-label="Filter by type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
          <SelectTrigger className="w-full sm:w-32" aria-label="Sort by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="highest">Highest</SelectItem>
            <SelectItem value="lowest">Lowest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk selection bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
          <span className="text-sm text-muted-foreground">{selected.size} selected</span>
          {confirmingBulkDelete ? (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-muted-foreground">Delete {selected.size} transactions?</span>
              <Button size="sm" variant="destructive" onClick={handleBulkDelete} className="gap-1">
                <Check className="h-3.5 w-3.5" /> Confirm
              </Button>
              <Button size="sm" variant="outline" onClick={() => setConfirmingBulkDelete(false)} className="gap-1">
                <X className="h-3.5 w-3.5" /> Cancel
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setConfirmingBulkDelete(true)}
              className="gap-1.5 ml-auto"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          )}
        </div>
      )}

      {/* List */}
      <div className="glass-card divide-y divide-border">
        {filtered.length === 0 ? (
          <p className="p-4 sm:p-8 text-center text-sm text-muted-foreground">
            {transactions.length === 0 ? 'No transactions yet' : 'No transactions match your filters'}
          </p>
        ) : (
          <>
            {/* Select all row */}
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-muted/20">
              <Checkbox
                checked={allVisibleSelected ? true : someVisibleSelected ? 'indeterminate' : false}
                onCheckedChange={toggleSelectAllVisible}
                aria-label={allVisibleSelected ? 'Deselect all' : 'Select all'}
              />
              <span className="text-xs text-muted-foreground">
                {allVisibleSelected ? 'All selected' : 'Select all'}
              </span>
            </div>

            {filtered.map((t) => {
              const { label, sign, amountClass, badgeContent, badgeColor } = rowMeta(t);
              const isConfirmingThis = pendingDeleteId === t.id;

              return (
                <div
                  key={t.id}
                  className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 hover:bg-muted/30 transition-colors"
                >
                  <Checkbox
                    checked={selected.has(t.id)}
                    onCheckedChange={() => toggleSelect(t.id)}
                    aria-label={`Select transaction: ${label}`}
                    className="shrink-0"
                  />
                  <div
                    className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                    style={{
                      backgroundColor: `hsl(${badgeColor} / 0.15)`,
                      color: `hsl(${badgeColor})`,
                    }}
                  >
                    {badgeContent}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">{label}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {t.date} · {t.notes || t.paymentMethod}
                    </p>
                  </div>
                  <span className={`text-xs sm:text-sm font-semibold whitespace-nowrap tabular-nums ${amountClass}`}>
                    {sign}
                    {formatCurrency(t.amount, sym)}
                  </span>

                  {isConfirmingThis ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleSingleDelete(t.id)}
                        className="text-destructive hover:text-destructive/80 p-1"
                        aria-label={`Confirm delete: ${label}`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setPendingDeleteId(null)}
                        className="text-muted-foreground hover:text-foreground p-1"
                        aria-label="Cancel delete"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setPendingDeleteId(t.id)}
                      className="text-muted-foreground hover:text-destructive p-1 shrink-0"
                      aria-label={`Delete transaction: ${label}`}
                    >
                      <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </motion.div>
  );
}