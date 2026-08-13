import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { formatCurrency, getMonthKey, getTransactionsForMonth, getIconComponent } from '@/lib/helpers';
import { CategoriesModal } from '@/components/modals/CategoriesModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Edit2, Trash2, AlertCircle, DollarSign, TrendingDown, Check, Pin, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { Category } from '@/types/expense-tracker';

export default function Categories() {
  const { data, addCategory, updateCategory, deleteCategory } = useApp();
  const { categories, transactions, settings } = data;
  const sym = settings.currencySymbol;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const monthTxns = getTransactionsForMonth(transactions, getMonthKey());

  const handleAddClick = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSubmit = (category: Category) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, category);
    } else {
      addCategory(category);
    }
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
    setDeleteConfirm(null);
  };

  const expenseCategories = categories.filter(c => c.type === 'expense' || c.type === 'both');
  const incomeCategories = categories.filter(c => c.type === 'income' || c.type === 'both');

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
          <h1 className="text-lg sm:text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {categories.length} total • Manage your spending categories
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2" size="lg">
          <Plus className="h-5 w-5" />
          Add Category
        </Button>
      </div>

      {/* Modal */}
      <CategoriesModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmit}
        editingCategory={editingCategory}
      />

      {/* Expense Categories */}
      {expenseCategories.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            <span>Expense Categories</span>
            <span className="text-xs sm:text-sm font-normal text-muted-foreground">({expenseCategories.length})</span>
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          >
            {expenseCategories.map(c => {
              const spent = monthTxns
                .filter(t => t.categoryId === c.id && t.type === 'expense')
                .reduce((s, t) => s + t.amount, 0);

              return (
                <motion.div key={c.id} variants={itemVariants}>
                  <Card className="p-5 hover:shadow-md transition-shadow relative group">
                    {/* Delete Confirm Modal */}
                    {deleteConfirm === c.id && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg z-10 flex flex-col items-center justify-center gap-4 p-4">
                        <div className="text-center">
                          <p className="text-sm font-semibold text-white">Delete category?</p>
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
                            onClick={() => handleDelete(c.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Category Icon & Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md"
                        style={{ backgroundColor: c.color }}
                      >
                        {(() => {
                          const IconComponent = getIconComponent(c.icon);
                          return <IconComponent className="h-6 w-6 text-white" />;
                        })()}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(c)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="Edit category"
                        >
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </button>
                        {!c.isDefault && (
                          <button
                            onClick={() => setDeleteConfirm(c.id)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            title="Delete category"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Category Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{c.name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">
                          {c.type === 'both' ? 'Both' : c.type}
                        </p>
                      </div>

                      {/* Monthly Spending */}
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">This month</p>
                        <p className="text-lg font-bold text-foreground">
                          {sym}
                          {spent.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}

      {/* Income Categories */}
      {incomeCategories.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            <span>Income Categories</span>
            <span className="text-xs sm:text-sm font-normal text-muted-foreground">({incomeCategories.length})</span>
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          >
            {incomeCategories.map(c => {
              const earned = monthTxns
                .filter(t => t.categoryId === c.id && t.type === 'income')
                .reduce((s, t) => s + t.amount, 0);

              return (
                <motion.div key={c.id} variants={itemVariants}>
                  <Card className="p-5 hover:shadow-md transition-shadow relative group">
                    {/* Delete Confirm Modal */}
                    {deleteConfirm === c.id && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg z-10 flex flex-col items-center justify-center gap-4 p-4">
                        <div className="text-center">
                          <p className="text-sm font-semibold text-white">Delete category?</p>
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
                            onClick={() => handleDelete(c.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Category Icon & Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md"
                        style={{ backgroundColor: c.color }}
                      >
                        {(() => {
                          const IconComponent = getIconComponent(c.icon);
                          return <IconComponent className="h-6 w-6 text-white" />;
                        })()}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(c)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="Edit category"
                        >
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </button>
                        {!c.isDefault && (
                          <button
                            onClick={() => setDeleteConfirm(c.id)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            title="Delete category"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Category Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{c.name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">
                          {c.type === 'both' ? 'Both' : c.type}
                        </p>
                      </div>

                      {/* Monthly Income */}
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">This month</p>
                        <p className="text-lg font-bold text-primary">
                          +{sym}
                          {earned.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No categories yet</h3>
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
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Pro Tip</p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-0.5">
              Create categories that match your spending habits. You can set icons, colors, and apply them as expense or income categories.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
