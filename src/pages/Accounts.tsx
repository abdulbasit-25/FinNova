import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { formatCurrency } from '@/lib/helpers';
import { AccountsModal } from '@/components/modals/AccountsModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Edit2, Trash2, AlertCircle, TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { Account } from '@/types/expense-tracker';

export default function Accounts() {
  const { data, addAccount, updateAccount, deleteAccount } = useApp();
  const { accounts, transactions, settings } = data;
  const sym = settings.currencySymbol;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAddClick = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (account: Account) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleSubmit = (account: Account) => {
    if (editingAccount) {
      updateAccount(editingAccount.id, account);
    } else {
      addAccount(account);
    }
  };

  const handleDelete = (id: string) => {
    deleteAccount(id);
    setDeleteConfirm(null);
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, a) => sum + a.balance, 0);
  };

  const getAccountTransactions = (accountId: string) => {
    return transactions.filter(t => t.accountId === accountId || t.toAccountId === accountId).length;
  };

  const getAccountActivity = (accountId: string) => {
    const txns = transactions.filter(t => t.accountId === accountId);
    const income = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense };
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
          <h1 className="text-lg sm:text-3xl font-bold text-foreground">Accounts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {accounts.length} account{accounts.length !== 1 ? 's' : ''} • Manage your financial accounts
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2" size="lg">
          <Plus className="h-5 w-5" />
          Add Account
        </Button>
      </div>

      {/* Modal */}
      <AccountsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAccount(null);
        }}
        onSubmit={handleSubmit}
        editingAccount={editingAccount}
      />

      {/* Total Balance Card */}
      {accounts.length > 0 && (
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 p-4 sm:p-6">
          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Total Balance</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mt-2">
            {sym}
            {getTotalBalance().toFixed(2)}
          </h2>
          <p className="text-sm text-muted-foreground mt-3">
            {accounts.reduce((count, a) => count + getAccountTransactions(a.id), 0)} total transactions
          </p>
        </Card>
      )}

      {/* Accounts Grid */}
      {accounts.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
        >
          {accounts.map(a => {
            const { income, expense } = getAccountActivity(a.id);
            const txnCount = getAccountTransactions(a.id);

            return (
              <motion.div key={a.id} variants={itemVariants}>
                <Card className="p-6 hover:shadow-md transition-shadow relative group">
                  {/* Delete Confirm Modal */}
                  {deleteConfirm === a.id && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg z-10 flex flex-col items-center justify-center gap-4 p-4">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-white">Delete account?</p>
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
                          onClick={() => handleDelete(a.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {a.type.replace(/_/g, ' ')}
                      </p>
                      <h3 className="text-lg font-semibold text-foreground">{a.name}</h3>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClick(a)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Edit account"
                      >
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(a.id)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Delete account"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="mb-6 pb-6 border-b border-border">
                    <p className="text-xs text-muted-foreground mb-2">Current Balance</p>
                    <p
                      className="text-3xl font-bold"
                      style={{
                        color: a.color,
                      }}
                    >
                      {sym}
                      {a.balance.toFixed(2)}
                    </p>
                  </div>

                  {/* Activity */}
                  <div className="space-y-3">
                    {/* Income/Expense Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <p className="text-xs text-muted-foreground">Income</p>
                        </div>
                        <p className="font-semibold text-green-600 dark:text-green-400">
                          {sym}
                          {income.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          <p className="text-xs text-muted-foreground">Expenses</p>
                        </div>
                        <p className="font-semibold text-red-600 dark:text-red-400">
                          {sym}
                          {expense.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Transaction Count */}
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Total Transactions</p>
                      <p className="text-lg font-bold text-foreground">{txnCount}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Empty State */}
      {accounts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No accounts yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
            Create your first account to start tracking your finances
          </p>
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Account
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
              Create separate accounts for different financial sources. You can track balances, income, and expenses for each account independently.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
