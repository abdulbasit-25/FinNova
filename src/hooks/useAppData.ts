import { useState, useEffect, useCallback } from 'react';
import { AppData, Transaction, Category, Account, Budget, SavingsGoal, RecurringRule, AppSettings } from '@/types/expense-tracker';
import { defaultAppData } from '@/lib/default-data';

const STORAGE_KEY = 'expense-tracker-data';

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultAppData, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load data:', e);
  }
  return { ...defaultAppData };
}

function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useAppData() {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const update = useCallback((updater: (prev: AppData) => AppData) => {
    setData(prev => {
      const next = updater(prev);
      return next;
    });
  }, []);

  // Transaction helpers
  const addTransaction = useCallback((t: Transaction) => {
    update(d => ({ ...d, transactions: [t, ...d.transactions] }));
  }, [update]);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    update(d => ({
      ...d,
      transactions: d.transactions.map(t => t.id === id ? { ...t, ...updates } : t),
    }));
  }, [update]);

  const deleteTransaction = useCallback((id: string) => {
    update(d => ({ ...d, transactions: d.transactions.filter(t => t.id !== id) }));
  }, [update]);

  const deleteTransactions = useCallback((ids: string[]) => {
    update(d => ({ ...d, transactions: d.transactions.filter(t => !ids.includes(t.id)) }));
  }, [update]);

  // Category helpers
  const addCategory = useCallback((c: Category) => {
    update(d => ({ ...d, categories: [...d.categories, c] }));
  }, [update]);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    update(d => ({
      ...d,
      categories: d.categories.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  }, [update]);

  const deleteCategory = useCallback((id: string) => {
    update(d => ({ ...d, categories: d.categories.filter(c => c.id !== id) }));
  }, [update]);

  // Account helpers
  const addAccount = useCallback((a: Account) => {
    update(d => ({ ...d, accounts: [...d.accounts, a] }));
  }, [update]);

  const updateAccount = useCallback((id: string, updates: Partial<Account>) => {
    update(d => ({
      ...d,
      accounts: d.accounts.map(a => a.id === id ? { ...a, ...updates } : a),
    }));
  }, [update]);

  const deleteAccount = useCallback((id: string) => {
    update(d => ({ ...d, accounts: d.accounts.filter(a => a.id !== id) }));
  }, [update]);

  // Budget helpers
  const setBudget = useCallback((b: Budget) => {
    update(d => {
      const existing = d.budgets.findIndex(
        x => x.categoryId === b.categoryId && x.month === b.month
      );
      if (existing >= 0) {
        const budgets = [...d.budgets];
        budgets[existing] = b;
        return { ...d, budgets };
      }
      return { ...d, budgets: [...d.budgets, b] };
    });
  }, [update]);

  const deleteBudget = useCallback((id: string) => {
    update(d => ({ ...d, budgets: d.budgets.filter(b => b.id !== id) }));
  }, [update]);

  // Goal helpers
  const addGoal = useCallback((g: SavingsGoal) => {
    update(d => ({ ...d, goals: [...d.goals, g] }));
  }, [update]);

  const updateGoal = useCallback((id: string, updates: Partial<SavingsGoal>) => {
    update(d => ({
      ...d,
      goals: d.goals.map(g => g.id === id ? { ...g, ...updates } : g),
    }));
  }, [update]);

  const deleteGoal = useCallback((id: string) => {
    update(d => ({ ...d, goals: d.goals.filter(g => g.id !== id) }));
  }, [update]);

  // Settings
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    update(d => ({ ...d, settings: { ...d.settings, ...updates } }));
  }, [update]);

  // Recurring
  const addRecurringRule = useCallback((r: RecurringRule) => {
    update(d => ({ ...d, recurringRules: [...d.recurringRules, r] }));
  }, [update]);

  const updateRecurringRule = useCallback((id: string, updates: Partial<RecurringRule>) => {
    update(d => ({
      ...d,
      recurringRules: d.recurringRules.map(r => r.id === id ? { ...r, ...updates } : r),
    }));
  }, [update]);

  const deleteRecurringRule = useCallback((id: string) => {
    update(d => ({ ...d, recurringRules: d.recurringRules.filter(r => r.id !== id) }));
  }, [update]);

  // Backup/restore
  const exportData = useCallback(() => JSON.stringify(data, null, 2), [data]);
  const importData = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json);
      setData({ ...defaultAppData, ...parsed });
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetData = useCallback(() => {
    setData({ ...defaultAppData });
  }, []);

  return {
    data,
    addTransaction, updateTransaction, deleteTransaction, deleteTransactions,
    addCategory, updateCategory, deleteCategory,
    addAccount, updateAccount, deleteAccount,
    setBudget, deleteBudget,
    addGoal, updateGoal, deleteGoal,
    updateSettings,
    addRecurringRule, updateRecurringRule, deleteRecurringRule,
    exportData, importData, resetData,
  };
}
