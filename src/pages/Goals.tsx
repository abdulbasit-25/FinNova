import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { formatCurrency } from '@/lib/helpers';
import { GoalsModal } from '@/components/modals/GoalsModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, Trash2, AlertCircle, Check, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { SavingsGoal } from '@/types/expense-tracker';

export default function Goals() {
  const { data, addGoal, updateGoal, deleteGoal } = useApp();
  const { goals, settings } = data;
  const sym = settings.currencySymbol;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [addingFundsGoalId, setAddingFundsGoalId] = useState<string | null>(null);
  const [addingFundsAmount, setAddingFundsAmount] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAddClick = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleSubmit = (goal: SavingsGoal) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, goal);
    } else {
      addGoal(goal);
    }
  };

  const handleDelete = (id: string) => {
    deleteGoal(id);
    setDeleteConfirm(null);
  };

  const handleAddFunds = (goalId: string) => {
    const amount = Number(addingFundsAmount);
    if (!amount || amount <= 0) return;

    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const newAmount = Math.min(
        goal.currentAmount + amount,
        goal.targetAmount
      );
      updateGoal(goalId, { currentAmount: newAmount });
      setAddingFundsGoalId(null);
      setAddingFundsAmount('');
    }
  };

  const getTotalProgress = () => {
    if (goals.length === 0) return 0;
    const totalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    return (totalCurrent / totalTarget) * 100;
  };

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
          <h1 className="text-lg sm:text-3xl font-bold text-foreground">Savings Goals</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {goals.length} goal{goals.length !== 1 ? 's' : ''} • Track your financial targets
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2" size="lg">
          <Plus className="h-5 w-5" />
          New Goal
        </Button>
      </div>

      {/* Modal */}
      <GoalsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleSubmit}
        editingGoal={editingGoal}
      />

      {goals.length > 0 && (
        <>
          {/* Overall Progress Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 p-6 sm:p-8">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Overall Progress</p>
                <h2 className="text-3xl font-bold text-foreground mt-2">
                  {getTotalProgress().toFixed(1)}%
                </h2>
              </div>
              <div className="space-y-2">
                <Progress value={getTotalProgress()} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {sym}
                    {goals.reduce((s, g) => s + g.currentAmount, 0).toFixed(2)}
                  </span>
                  <span>
                    {sym}
                    {goals.reduce((s, g) => s + g.targetAmount, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Goals Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {goals.map(g => {
              const pct = Math.min((g.currentAmount / g.targetAmount) * 100, 100);
              const daysLeft = g.deadline
                ? Math.max(
                    0,
                    Math.ceil(
                      (new Date(g.deadline).getTime() - Date.now()) / 86400000
                    )
                  )
                : null;
              const isCompleted = g.currentAmount >= g.targetAmount;

              return (
                <motion.div key={g.id} variants={itemVariants}>
                  <Card className="p-6 hover:shadow-md transition-shadow relative group">
                    {/* Delete Confirm Modal */}
                    {deleteConfirm === g.id && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg z-10 flex flex-col items-center justify-center gap-4 p-4">
                        <div className="text-center">
                          <p className="text-sm font-semibold text-white">Delete goal?</p>
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
                            onClick={() => handleDelete(g.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{g.name}</h3>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-1 rounded text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            <Check className="h-3 w-3" /> Completed
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(g)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="Edit goal"
                        >
                          <Target className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(g.id)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="Delete goal"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-3 mb-4 pb-4 border-b border-border">
                      <Progress value={pct} className="h-3" />
                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Current</p>
                          <p className="font-semibold text-foreground">
                            {sym}
                            {g.currentAmount.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Progress</p>
                          <p className="font-semibold text-primary">{pct.toFixed(0)}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Target</p>
                          <p className="font-semibold text-foreground">
                            {sym}
                            {g.targetAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Deadline */}
                    {daysLeft !== null && (
                      <div className={`text-xs mb-4 ${daysLeft === 0 ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                        {daysLeft === 0
                          ? '⚠️ Deadline is today'
                          : daysLeft > 0
                          ? `📅 ${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining`
                          : '⏰ Deadline passed'}
                      </div>
                    )}

                    {/* Add Funds Section */}
                    {!isCompleted && addingFundsGoalId === g.id ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Amount"
                            value={addingFundsAmount}
                            onChange={e => setAddingFundsAmount(e.target.value)}
                            className="flex-1"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={() => handleAddFunds(g.id)}
                            disabled={!addingFundsAmount || Number(addingFundsAmount) <= 0}
                          >
                            Add
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAddingFundsGoalId(null);
                            setAddingFundsAmount('');
                          }}
                          className="w-full"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant={isCompleted ? 'outline' : 'default'}
                        onClick={() => setAddingFundsGoalId(g.id)}
                        className="w-full"
                        disabled={isCompleted}
                      >
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-xs sm:text-sm font-semibold text-green-700 dark:text-green-400">
                            <Check className="h-4 w-4" /> Goal Completed
                          </span>
                        ) : (
                          'Add Funds'
                        )}
                      </Button>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Target className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No savings goals yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
            Set your first financial goal and start working towards it
          </p>
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Goal
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
              Set realistic, time-bound goals. Break down large goals into smaller milestones to stay motivated and track progress effectively.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
