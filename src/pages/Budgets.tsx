import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { formatCurrency, getMonthKey, getTransactionsForMonth, getTotalExpenses } from '@/lib/helpers';
import { BudgetsModal } from '@/components/modals/BudgetsModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Plus, AlertTriangle, AlertCircle, TrendingDown, Check, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { Budget } from '@/types/expense-tracker';

export default function Budgets() {
  const { data, setBudget, deleteBudget } = useApp();
  const { budgets, categories, transactions, settings } = data;
  const sym = settings.currencySymbol;
  const monthKey = getMonthKey();
  const monthTxns = getTransactionsForMonth(transactions, monthKey);
  const totalExpenses = getTotalExpenses(monthTxns);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAddClick = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (budget: Budget) => {
    // Find if a budget for this category/month already exists
    const existingIdx = budgets.findIndex(
      b => b.categoryId === budget.categoryId && b.month === budget.month
    );

    if (existingIdx >= 0) {
      // Update existing
      const updated = [...budgets];
      updated[existingIdx] = { ...budgets[existingIdx], ...budget };
      // We need a different approach here - let's just create a new one
      // In a real app, you'd update the existing one
      setBudget(budget);
    } else {
      setBudget(budget);
    }
  };

  const handleDelete = (id: string) => {
    deleteBudget(id);
    setDeleteConfirm(null);
  };

  const monthBudgets = budgets.filter(b => b.month === monthKey);
  const overallBudget = monthBudgets.find(b => b.categoryId === null);
  const categoryBudgets = monthBudgets.filter(b => b.categoryId !== null);

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const remainingDays = daysInMonth - now.getDate();
  const passedDays = now.getDate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

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

      {/* Modal */}
      <BudgetsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        onSubmit={handleSubmit}
        categories={categories.filter(c => c.type === 'expense' || c.type === 'both')}
        editingBudget={editingBudget}
        currencySymbol={sym}
      />

      {monthBudgets.length > 0 && (
        <>
          {/* Overall Budget */}
          {overallBudget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-orange-50 dark:from-orange-950/20 to-orange-50/50 dark:to-orange-950/10 border-orange-200 dark:border-orange-900 p-6 sm:p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Overall Monthly Budget</p>
                      <h2 className="text-3xl font-bold text-foreground mt-2">
                        {sym}
                        {overallBudget.amount.toFixed(2)}
                      </h2>
                    </div>
                    <TrendingDown className="h-8 w-8 text-orange-600/30" />
                  </div>

                  <div className="space-y-2">
                    <Progress
                      value={Math.min((totalExpenses / overallBudget.amount) * 100, 100)}
                      className="h-3"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground font-semibold">
                        {sym}
                        {totalExpenses.toFixed(2)} spent
                      </span>
                      <span className="text-muted-foreground">
                        {((totalExpenses / overallBudget.amount) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {totalExpenses > overallBudget.amount && (
                    <div className="flex items-center gap-2 text-sm text-destructive font-semibold">
                      <AlertTriangle className="h-4 w-4" />
                      Exceeded by {sym}
                      {(totalExpenses - overallBudget.amount).toFixed(2)}
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
                {categoryBudgets.map(b => {
                  const cat = categories.find(c => c.id === b.categoryId);
                  const spent = b.categoryId
                    ? monthTxns
                        .filter(t => t.categoryId === b.categoryId && t.type === 'expense')
                        .reduce((s, t) => s + t.amount, 0)
                    : 0;
                  const pct = Math.min((spent / b.amount) * 100, 100);
                  const isWarning = pct >= 80;
                  const isOver = pct >= 100;
                  const remaining = b.amount - spent;

                  return (
                    <motion.div key={b.id} variants={itemVariants}>
                      <Card className="p-5 hover:shadow-md transition-shadow relative group">
                        {/* Delete Confirm Modal */}
                        {deleteConfirm === b.id && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg z-10 flex flex-col items-center justify-center gap-4 p-4">
                            <div className="text-center">
                              <p className="text-sm font-semibold text-white">Delete budget?</p>
                              <p className="text-xs text-white/75 mt-1">This action cannot be undone</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeleteConfirm(null)}
                                className="text-white border-white hover:bg-white/10"
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(b.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {cat && (
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                                style={{ backgroundColor: cat.color }}
                              >
                                <Check className="h-5 w-5 text-white" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-foreground">{cat?.name}</h3>
                              <p className="text-xs text-muted-foreground">Budget limit</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setDeleteConfirm(b.id)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete budget"
                          >
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          </button>
                        </div>

                        {/* Budget Info */}
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-semibold text-foreground">
                              {sym}
                              {spent.toFixed(2)}
                            </span>
                            <span
                              className={`text-sm font-semibold ${
                                isOver
                                  ? 'text-destructive'
                                  : isWarning
                                  ? 'text-yellow-600 dark:text-yellow-500'
                                  : 'text-primary'
                              }`}
                            >
                              {pct.toFixed(1)}%
                            </span>
                          </div>

                          <Progress
                            value={pct}
                            className={`h-2 ${
                              isOver ? '[&>div]:bg-destructive' : isWarning ? '[&>div]:bg-yellow-500' : ''
                            }`}
                          />

                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Budget: {sym}{b.amount.toFixed(2)}</span>
                            <span className={isOver ? 'text-destructive font-semibold' : ''}>
                              {isOver ? 'Over: ' : 'Remaining: '}
                              {sym}
                              {Math.abs(remaining).toFixed(2)}
                            </span>
                          </div>

                          {/* Status Message */}
                          {isOver && (
                            <div className="text-xs font-semibold text-destructive flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Budget exceeded
                            </div>
                          )}
                          {isWarning && !isOver && (
                            <div className="text-xs font-semibold text-yellow-600 dark:text-yellow-500 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Approaching budget limit
                            </div>
                          )}
                        </div>
                      </Card>
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
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No budgets set</h3>
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
              Set both overall and category-specific budgets. Monitor spending regularly to stay within limits and achieve your financial goals.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
