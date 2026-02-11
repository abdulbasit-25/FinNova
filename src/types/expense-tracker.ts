export type TransactionType = 'income' | 'expense' | 'transfer';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'upi' | 'other';
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';
export type AccentColor = 'blue' | 'green' | 'purple';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string; // ISO date
  time: string;
  paymentMethod: PaymentMethod;
  accountId: string;
  toAccountId?: string; // for transfers
  notes: string;
  isRecurring: boolean;
  recurringId?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // lucide icon name
  color: string; // HSL string
  type: 'income' | 'expense' | 'both';
  isDefault: boolean;
}

export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'credit_card' | 'wallet' | 'custom';
  balance: number;
  icon: string;
  color: string;
}

export interface Budget {
  id: string;
  categoryId: string | null; // null = overall budget
  amount: number;
  month: string; // YYYY-MM
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
}

export interface RecurringRule {
  id: string;
  transactionTemplate: Omit<Transaction, 'id' | 'createdAt'>;
  frequency: RecurringFrequency;
  customDays?: number;
  nextDate: string;
  isPaused: boolean;
}

export interface AppSettings {
  currency: string;
  currencySymbol: string;
  theme: 'light' | 'dark' | 'system';
  accentColor: AccentColor;
  language: string;
  soundEnabled: boolean;
}

export interface AppData {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  budgets: Budget[];
  goals: SavingsGoal[];
  recurringRules: RecurringRule[];
  settings: AppSettings;
}
