import { useMemo, useState, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { formatCurrency, getMonthKey, getTransactionsForMonth, getTotalExpenses, getIconComponent } from '@/lib/helpers';
import { BudgetsModal } from '@/components/modals/BudgetsModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit2, Trash2, AlertTriangle, AlertCircle, TrendingDown, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Budget, Transaction } from '@/types/expense-tracker';

// ---- Spend totals ---------------------------------------------------------
// Single pass over this month's expense transactions, grouped by category,
// instead of re-filtering monthTxns once per budget card in the render loop.

function useCategorySpend(monthTxns: Transaction[]) {
  return useMemo(() => {
    const spend = new Map<string, number>();
    for (const t of monthTxns) {
      if (t.type !== 'expense') continue;
      spend.set(t.categoryId, (spend.get(t.categoryId) ?? 0) + t.amount);
    }
    return spend;
  }, [monthTxns]);
}

function pctOf(spent: number, budgetAmount: number) {
  if (budgetAmount <= 0) return spent > 0 ? 100 : 0;
  return Math.min((spent / budgetAmount) * 100, 100);
}

// ---- Delete confirm overlay (shared) --------------------------------------

function DeleteConfirmOverlay({
  label,
  onCancel,
  onConfirm,
}: {
  label: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="alertdialog"
      aria-modal="true"
      aria-label={`Delete ${label}?`}
      className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-lg z-10 flex flex-col items-center justify-center gap-4 p-4"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel();
      }}
    >
      <div className="text-center">
        <p className="text-sm font-semibold text-white">Delete "{label}"?</p>
        <p className="text-xs text-white/75 mt-1">This action cannot be undone</p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onCancel} autoFocus className="text-white border-white hover:bg-white/10">
          Cancel
        </Button>
        <Button size="sm" variant="destructive" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </motion.div>
  );
}

// ---- Category budget card -------------------------------------------------

function CategoryBudgetCard({
  budget: b,
  categoryName,
  categoryColor,
  categoryIcon: IconComponent,
  spent,
  currencySymbol,
  onEdit,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  isConfirmingDelete,
}: {
  budget: Budget;
  categoryName: string;
  categoryColor: string;
  categoryIcon: React.ElementType;
  spent: number;
  currencySymbol: string;
  onEdit: () => void;
  onRequestDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  isConfirmingDelete: boolean;
}) {
  const pct = pctOf(spent, b.amount);
  const isOver = spent >= b.amount;
  const isWarning = pct >= 80 && !isOver;
  const remaining = b.amount - spent;

  return (
    <Card className="p-5 hover:shadow-md transition-shadow relative group overflow-hidden">
      <AnimatePresence>
        {isConfirmingDelete && (
          <DeleteConfirmOverlay label={categoryName} onCancel={onCancelDelete} onConfirm={onConfirmDelete} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: categoryColor }}
          >
            <IconComponent className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">{categoryName}</h3>
            <p className="text-xs text-muted-foreground">Budget limit</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label={`Edit ${categoryName} budget`}
          >
            <Edit2 className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={onRequestDelete}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label={`Delete ${categoryName} budget`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {formatCurrency(spent, currencySymbol)}
          </span>
          <span
            className={`text-sm font-semibold tabular-nums ${
              isOver ? 'text-destructive' : isWarning ? 'text-yellow-600 dark:text-yellow-500' : 'text-primary'
            }`}
          >
            {pct.toFixed(1)}%
          </span>
        </div>

        <Progress
          value={pct}
          className={`h-2 ${isOver ? '[&>div]:bg-destructive' : isWarning ? '[&>div]:bg-yellow-500' : ''}`}
        />

        <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
          <span>Budget: {formatCurrency(b.amount, currencySymbol)}</span>
          <span className={isOver ? 'text-destructive font-semibold' : ''}>
            {isOver ? 'Over: ' : 'Remaining: '}
            {formatCurrency(Math.abs(remaining), currencySymbol)}
          </span>
        </div>

        {isOver && (
          <div className="text-xs font-semibold text-destructive flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Budget exceeded
          </div>
        )}
        {isWarning && (
          <div className="text-xs font-semibold text-yellow-600 dark:text-yellow-500 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Approaching budget limit
          </div>
        )}
      </div>
    </Card>
  );
}

// ---- Page -------------------------------------------------------------

export default function Budgets() {
  const { data, setBudget, deleteBudget } = useApp();
  const { budgets, categories, transactions, settings } = data;
  const sym = settings.currencySymbol;
  const monthKey = getMonthKey();

  const monthTxns = useMemo(() => getTransactionsForMonth(transactions, monthKey), [transactions, monthKey]);
  const totalExpenses = useMemo(() => getTotalExpenses(monthTxns), [monthTxns]);
  const categorySpend = useCategorySpend(monthTxns);
  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAddClick = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const handleEditClick = useCallback((budget: Budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  }, []);

  const handleSubmit = (budget: Budget) => {
    // `setBudget` is expected to upsert by categoryId + month on the context
    // side. (The previous implementation searched for an existing budget,
    // built an "updated" array, and then discarded it — calling setBudget
    // unconditionally either way, so that lookup was dead code. If the
    // context does NOT already upsert, that logic needs to live there,
    // e.g. `setBudget({ ...existing, ...budget })` when a match is found.)
    setBudget(budget);
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const handleDelete = useCallback(
    (id: string) => {
      deleteBudget(id);
      setDeleteConfirm(null);
    },
    [deleteBudget]
  );

  const monthBudgets = useMemo(() => budgets.filter((b) => b.month === monthKey), [budgets, monthKey]);
  const overallBudget = useMemo(() => monthBudgets.find((b) => b.categoryId === null), [monthBudgets]);
  const categoryBudgets = useMemo(() => monthBudgets.filter((b) => b.categoryId !== null), [monthBudgets]);

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const remainingDays = daysInMonth - now.getDate();
  const passedDays = now.getDate();

  const overallPct = overallBudget ? pctOf(totalExpenses, overallBudget.amount) : 0;
  const overallOver = overallBudget ? totalExpenses > overallBudget.amount : false;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-3xl font-bold text-foreground">Budgets</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {passedDays} days passed • {remainingDays} days remaining this month
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2" size="lg">
          <Plus className="h-5 w-5" />
          Set Budget
        </Button>
      </div>

      <BudgetsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        onSubmit={handleSubmit}
        categories={categories.filter((c) => c.type === 'expense' || c.type === 'both')}
        editingBudget={editingBudget}
        currencySymbol={sym}
      />

      {monthBudgets.length > 0 && (
        <>
          {/* Overall Budget */}
          {overallBudget && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <Card className="bg-gradient-to-br from-orange-50 dark:from-orange-950/20 to-orange-50/50 dark:to-orange-950/10 border-orange-200 dark:border-orange-900 p-6 sm:p-8 relative overflow-hidden group">
                <AnimatePresence>
                  {deleteConfirm === overallBudget.id && (
                    <DeleteConfirmOverlay
                      label="Overall Monthly Budget"
                      onCancel={() => setDeleteConfirm(null)}
                      onConfirm={() => handleDelete(overallBudget.id)}
                    />
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                        Overall Monthly Budget
                      </p>
                      <h2 className="text-3xl font-bold text-foreground mt-2 tabular-nums">
                        {formatCurrency(overallBudget.amount, sym)}
                      </h2>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(overallBudget)}
                          className="p-2 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                          aria-label="Edit overall monthly budget"
                        >
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(overallBudget.id)}
                          className="p-2 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                          aria-label="Delete overall monthly budget"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                      <TrendingDown className="h-8 w-8 text-orange-600/30 ml-1" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Progress
                      value={overallPct}
                      className={`h-3 ${overallOver ? '[&>div]:bg-destructive' : ''}`}
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground font-semibold tabular-nums">
                        {formatCurrency(totalExpenses, sym)} spent
                      </span>
                      <span className="text-muted-foreground tabular-nums">{overallPct.toFixed(1)}%</span>
                    </div>
                  </div>

                  {overallOver && (
                    <div className="flex items-center gap-2 text-sm text-destructive font-semibold">
                      <AlertTriangle className="h-4 w-4" />
                      Exceeded by {formatCurrency(totalExpenses - overallBudget.amount, sym)}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Category Budgets */}
          {categoryBudgets.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">Category Budgets</h2>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
              >
                {categoryBudgets.map((b) => {
                  const cat = b.categoryId ? categoryMap.get(b.categoryId) : undefined;
                  const spent = b.categoryId ? categorySpend.get(b.categoryId) ?? 0 : 0;
                  const IconComponent = cat ? getIconComponent(cat.icon) : AlertCircle;

                  return (
                    <motion.div key={b.id} variants={itemVariants}>
                      <CategoryBudgetCard
                        budget={b}
                        categoryName={cat?.name ?? 'Unknown category'}
                        categoryColor={cat?.color ?? 'hsl(220 10% 46%)'}
                        categoryIcon={IconComponent}
                        spent={spent}
                        currencySymbol={sym}
                        onEdit={() => handleEditClick(b)}
                        onRequestDelete={() => setDeleteConfirm(b.id)}
                        onCancelDelete={() => setDeleteConfirm(null)}
                        onConfirmDelete={() => handleDelete(b.id)}
                        isConfirmingDelete={deleteConfirm === b.id}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {monthBudgets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-border rounded-xl">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <AlertCircle className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No budgets set</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
            Create a budget to set spending limits and track your expenses
          </p>
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="h-4 w-4" />
            Set Budget
          </Button>
        </div>
      )}

      {/* Info Banner */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 p-4">
        <div className="flex gap-3">
          <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Pro Tip</p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-0.5">
              Set both overall and category-specific budgets. Monitor spending regularly to stay within limits and
              achieve your financial goals.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}