import { useMemo, useState, useCallback } from "react";
import { useApp } from "@/contexts/AppContext";
import {
  formatCurrency,
  getMonthKey,
  getTransactionsForMonth,
  getIconComponent,
} from "@/lib/helpers";
import { CategoriesModal } from "@/components/modals/CategoriesModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  DollarSign,
  TrendingDown,
  Lightbulb,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Category, Transaction } from "@/types/expense-tracker";

// ---- Monthly totals ----------------------------------------------------
// One pass over this month's transactions instead of re-filtering the full
// list once per category (previously O(categories × transactions), doubled
// since the same shape of work was duplicated for expense and income).

function useMonthlyTotals(monthTxns: Transaction[]) {
  return useMemo(() => {
    const totals = new Map<string, { expense: number; income: number }>();
    const ensure = (id: string) => {
      if (!totals.has(id)) totals.set(id, { expense: 0, income: 0 });
      return totals.get(id)!;
    };
    for (const t of monthTxns) {
      if (t.type === "expense") ensure(t.categoryId).expense += t.amount;
      if (t.type === "income") ensure(t.categoryId).income += t.amount;
    }
    return totals;
  }, [monthTxns]);
}

// ---- Category card -------------------------------------------------------

interface CategoryCardProps {
  category: Category;
  amount: number;
  amountClass: string;
  amountPrefix: string;
  currencySymbol: string;
  onEdit: (c: Category) => void;
  onRequestDelete: (id: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (id: string) => void;
  isConfirmingDelete: boolean;
}

function CategoryCard({
  category: c,
  amount,
  amountClass,
  amountPrefix,
  currencySymbol,
  onEdit,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  isConfirmingDelete,
}: CategoryCardProps) {
  const IconComponent = getIconComponent(c.icon);

  return (
    <Card className="p-5 hover:shadow-md transition-shadow relative group overflow-hidden">
      <AnimatePresence>
        {isConfirmingDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="alertdialog"
            aria-modal="true"
            aria-label={`Delete ${c.name}?`}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-lg z-10 flex flex-col items-center justify-center gap-4 p-4"
            onKeyDown={(e) => {
              if (e.key === "Escape") onCancelDelete();
            }}
          >
            <div className="text-center">
              <p className="text-sm font-semibold text-white">
                Delete "{c.name}"?
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
                onClick={() => onConfirmDelete(c.id)}
              >
                Delete
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon & Header */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md shrink-0"
          style={{ backgroundColor: c.color }}
        >
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(c)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label={`Edit ${c.name}`}
          >
            <Edit2 className="h-4 w-4 text-muted-foreground" />
          </button>
          {!c.isDefault && (
            <button
              onClick={() => onRequestDelete(c.id)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label={`Delete ${c.name}`}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-foreground">{c.name}</h3>
          <p className="text-xs text-muted-foreground capitalize">
            {c.type === "both" ? "Both" : c.type}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">This month</p>
          <p className={`text-lg font-bold tabular-nums ${amountClass}`}>
            {amountPrefix}
            {formatCurrency(amount, currencySymbol)}
          </p>
        </div>
      </div>
    </Card>
  );
}

// ---- Category section (expense or income grid) ---------------------------

interface CategorySectionProps {
  title: string;
  icon: React.ElementType;
  categories: Category[];
  amountFor: (categoryId: string) => number;
  amountClass: string;
  amountPrefix: string;
  currencySymbol: string;
  onEdit: (c: Category) => void;
  deleteConfirm: string | null;
  onRequestDelete: (id: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (id: string) => void;
}

function CategorySection({
  title,
  icon: Icon,
  categories,
  amountFor,
  amountClass,
  amountPrefix,
  currencySymbol,
  onEdit,
  deleteConfirm,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: CategorySectionProps) {
  if (categories.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
        <Icon className="h-5 w-5" />
        <span>{title}</span>
        <span className="text-xs sm:text-sm font-normal text-muted-foreground">
          ({categories.length})
        </span>
      </h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
      >
        {categories.map((c) => (
          <motion.div key={c.id} variants={itemVariants}>
            <CategoryCard
              category={c}
              amount={amountFor(c.id)}
              amountClass={amountClass}
              amountPrefix={amountPrefix}
              currencySymbol={currencySymbol}
              onEdit={onEdit}
              onRequestDelete={onRequestDelete}
              onCancelDelete={onCancelDelete}
              onConfirmDelete={onConfirmDelete}
              isConfirmingDelete={deleteConfirm === c.id}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ---- Page -------------------------------------------------------------

export default function Categories() {
  const { data, addCategory, updateCategory, deleteCategory } = useApp();
  const { categories, transactions, settings } = data;
  const sym = settings.currencySymbol;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const monthTxns = useMemo(
    () => getTransactionsForMonth(transactions, getMonthKey()),
    [transactions],
  );
  const totals = useMonthlyTotals(monthTxns);

  const handleAddClick = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditClick = useCallback((category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  }, []);

  const handleSubmit = (category: Category) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, category);
    } else {
      addCategory(category);
    }
  };

  const handleDelete = useCallback(
    (id: string) => {
      deleteCategory(id);
      setDeleteConfirm(null);
    },
    [deleteCategory],
  );

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === "expense" || c.type === "both"),
    [categories],
  );
  const incomeCategories = useMemo(
    () => categories.filter((c) => c.type === "income" || c.type === "both"),
    [categories],
  );

  const expenseFor = useCallback(
    (id: string) => totals.get(id)?.expense ?? 0,
    [totals],
  );
  const incomeFor = useCallback(
    (id: string) => totals.get(id)?.income ?? 0,
    [totals],
  );

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
            Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {categories.length} total • Manage your spending categories
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2" size="lg">
          <Plus className="h-5 w-5" />
          Add Category
        </Button>
      </div>

      <CategoriesModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmit}
        editingCategory={editingCategory}
      />

      <CategorySection
        title="Expense Categories"
        icon={TrendingDown}
        categories={expenseCategories}
        amountFor={expenseFor}
        amountClass="text-foreground"
        amountPrefix=""
        currencySymbol={sym}
        onEdit={handleEditClick}
        deleteConfirm={deleteConfirm}
        onRequestDelete={setDeleteConfirm}
        onCancelDelete={() => setDeleteConfirm(null)}
        onConfirmDelete={handleDelete}
      />

      <CategorySection
        title="Income Categories"
        icon={DollarSign}
        categories={incomeCategories}
        amountFor={incomeFor}
        amountClass="text-primary"
        amountPrefix="+"
        currencySymbol={sym}
        onEdit={handleEditClick}
        deleteConfirm={deleteConfirm}
        onRequestDelete={setDeleteConfirm}
        onCancelDelete={() => setDeleteConfirm(null)}
        onConfirmDelete={handleDelete}
      />

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-border rounded-xl">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <AlertCircle className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No categories yet
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
            Create your first category to start organizing your finances
          </p>
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Category
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
              Create categories that match your spending habits. You can set
              icons, colors, and apply them as expense or income categories.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
