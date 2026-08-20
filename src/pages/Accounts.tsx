import { useMemo, useState, useCallback } from "react";
import { useApp } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/helpers";
import { AccountsModal } from "@/components/modals/AccountsModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Search,
  Landmark,
  Wallet,
  CreditCard,
  PiggyBank,
  ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Account } from "@/types/expense-tracker";

// ---- Helpers -----------------------------------------------------------

/** Icon per account type, falls back to Wallet for unknown types. */
const ACCOUNT_ICONS: Record<string, React.ElementType> = {
  bank: Landmark,
  checking: Landmark,
  savings: PiggyBank,
  cash: Wallet,
  credit_card: CreditCard,
};

function getAccountIcon(type: string) {
  return ACCOUNT_ICONS[type] ?? Wallet;
}

type SortKey = "name" | "balance" | "activity";

/**
 * Pre-computes per-account transaction counts and income/expense totals in a
 * single pass over `transactions`, instead of re-filtering the full array
 * once per account per render (previously O(accounts × transactions)).
 */
function useAccountStats(
  transactions: {
    accountId?: string;
    toAccountId?: string;
    type: string;
    amount: number;
  }[],
) {
  return useMemo(() => {
    const stats = new Map<
      string,
      { count: number; income: number; expense: number }
    >();

    const ensure = (id: string) => {
      if (!stats.has(id)) stats.set(id, { count: 0, income: 0, expense: 0 });
      return stats.get(id)!;
    };

    for (const t of transactions) {
      if (t.accountId) {
        const s = ensure(t.accountId);
        s.count += 1;
        if (t.type === "income") s.income += t.amount;
        if (t.type === "expense") s.expense += t.amount;
      }
      // Transfers land in a different account too; count them there without
      // double-counting as income/expense.
      if (t.toAccountId && t.toAccountId !== t.accountId) {
        ensure(t.toAccountId).count += 1;
      }
    }

    return stats;
  }, [transactions]);
}

// ---- Sub-components ------------------------------------------------------

function AccountCard({
  account,
  stats,
  currencySymbol,
  onEdit,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  isConfirmingDelete,
}: {
  account: Account;
  stats: { count: number; income: number; expense: number };
  currencySymbol: string;
  onEdit: (a: Account) => void;
  onRequestDelete: (id: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (id: string) => void;
  isConfirmingDelete: boolean;
}) {
  const Icon = getAccountIcon(account.type);

  return (
    <Card className="p-6 hover:shadow-md transition-shadow relative group overflow-hidden">
      <AnimatePresence>
        {isConfirmingDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="alertdialog"
            aria-modal="true"
            aria-label={`Delete ${account.name}?`}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-lg z-10 flex flex-col items-center justify-center gap-4 p-4"
            onKeyDown={(e) => {
              if (e.key === "Escape") onCancelDelete();
            }}
          >
            <div className="text-center">
              <p className="text-sm font-semibold text-white">
                Delete "{account.name}"?
              </p>
              <p className="text-xs text-white/75 mt-1">
                This action cannot be undone
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onCancelDelete}
                autoFocus
                className="text-white border-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onConfirmDelete(account.id)}
              >
                Delete
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${account.color}1A`,
              color: account.color,
            }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {account.type.replace(/_/g, " ")}
            </p>
            <h3 className="text-lg font-semibold text-foreground leading-tight">
              {account.name}
            </h3>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(account)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label={`Edit ${account.name}`}
          >
            <Edit2 className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => onRequestDelete(account.id)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label={`Delete ${account.name}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      </div>

      {/* Balance */}
      <div className="mb-6 pb-6 border-b border-border">
        <p className="text-xs text-muted-foreground mb-2">Current Balance</p>
        <p
          className="text-3xl font-bold tabular-nums"
          style={{ color: account.color }}
        >
          {formatCurrency(account.balance, currencySymbol)}
        </p>
      </div>

      {/* Activity */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-xs text-muted-foreground">Income</p>
            </div>
            <p className="font-semibold text-green-600 dark:text-green-400 tabular-nums">
              {formatCurrency(stats.income, currencySymbol)}
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <p className="text-xs text-muted-foreground">Expenses</p>
            </div>
            <p className="font-semibold text-red-600 dark:text-red-400 tabular-nums">
              {formatCurrency(stats.expense, currencySymbol)}
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1">
            Total Transactions
          </p>
          <p className="text-lg font-bold text-foreground tabular-nums">
            {stats.count}
          </p>
        </div>
      </div>
    </Card>
  );
}

// ---- Main component -------------------------------------------------------

export default function Accounts() {
  const { data, addAccount, updateAccount, deleteAccount } = useApp();
  const { accounts, transactions, settings } = data;
  const sym = settings.currencySymbol;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");

  const stats = useAccountStats(transactions);

  const handleAddClick = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleEditClick = useCallback((account: Account) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  }, []);

  const handleSubmit = (account: Account) => {
    if (editingAccount) {
      updateAccount(editingAccount.id, account);
    } else {
      addAccount(account);
    }
  };

  const handleDelete = useCallback(
    (id: string) => {
      deleteAccount(id);
      setDeleteConfirm(null);
    },
    [deleteAccount],
  );

  const totalBalance = useMemo(
    () => accounts.reduce((sum, a) => sum + a.balance, 0),
    [accounts],
  );

  const totalTransactionCount = useMemo(() => {
    let count = 0;
    for (const a of accounts) count += stats.get(a.id)?.count ?? 0;
    return count;
  }, [accounts, stats]);

  const visibleAccounts = useMemo(() => {
    const filtered = query.trim()
      ? accounts.filter((a) =>
          a.name.toLowerCase().includes(query.trim().toLowerCase()),
        )
      : accounts;

    return [...filtered].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "balance") return b.balance - a.balance;
      // activity
      return (stats.get(b.id)?.count ?? 0) - (stats.get(a.id)?.count ?? 0);
    });
  }, [accounts, query, sortKey, stats]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
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
          <h1 className="text-lg sm:text-3xl font-bold text-foreground">
            Accounts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {accounts.length} account{accounts.length !== 1 ? "s" : ""} • Manage
            your financial accounts
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2" size="lg">
          <Plus className="h-5 w-5" />
          Add Account
        </Button>
      </div>

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
          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
            Total Balance
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mt-2 tabular-nums">
            {formatCurrency(totalBalance, sym)}
          </h2>
          <p className="text-sm text-muted-foreground mt-3">
            {totalTransactionCount} total transactions
          </p>
        </Card>
      )}

      {/* Search + Sort toolbar (only worth showing once there's something to manage) */}
      {accounts.length > 1 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search accounts…"
              className="pl-9"
              aria-label="Search accounts"
            />
          </div>
          <div className="flex gap-1 rounded-lg border border-border p-1 bg-muted/30 w-fit">
            {(["name", "balance", "activity"] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSortKey(key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors flex items-center gap-1 ${
                  sortKey === key
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={sortKey === key}
              >
                {key === sortKey && <ArrowUpDown className="h-3 w-3" />}
                {key}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Accounts Grid */}
      {visibleAccounts.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
        >
          {visibleAccounts.map((a) => (
            <motion.div key={a.id} variants={itemVariants}>
              <AccountCard
                account={a}
                stats={stats.get(a.id) ?? { count: 0, income: 0, expense: 0 }}
                currencySymbol={sym}
                onEdit={handleEditClick}
                onRequestDelete={setDeleteConfirm}
                onCancelDelete={() => setDeleteConfirm(null)}
                onConfirmDelete={handleDelete}
                isConfirmingDelete={deleteConfirm === a.id}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* No search results */}
      {accounts.length > 0 && visibleAccounts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <Search className="h-10 w-10 text-muted-foreground/20 mb-3" />
          <p className="text-sm text-muted-foreground">
            No accounts match "{query}"
          </p>
        </div>
      )}

      {/* Empty State */}
      {accounts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-border rounded-xl">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <AlertCircle className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No accounts yet
          </h3>
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
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              Pro Tip
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-0.5">
              Create separate accounts for different financial sources. You can
              track balances, income, and expenses for each account
              independently.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
