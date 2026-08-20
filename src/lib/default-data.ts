import {
  Category,
  Account,
  AppSettings,
  AppData,
} from "@/types/expense-tracker";

export const defaultCategories: Category[] = [
  {
    id: "cat-food",
    name: "Food",
    icon: "Food",
    color: "25 95% 53%",
    type: "expense",
    isDefault: true,
  },
  {
    id: "cat-bills",
    name: "Bills",
    icon: "Electricity",
    color: "0 84% 60%",
    type: "expense",
    isDefault: true,
  },
  {
    id: "cat-shopping",
    name: "Shopping",
    icon: "Shopping",
    color: "262 83% 58%",
    type: "expense",
    isDefault: true,
  },
  {
    id: "cat-transport",
    name: "Transport",
    icon: "Travel",
    color: "217 91% 60%",
    type: "expense",
    isDefault: true,
  },
  {
    id: "cat-entertainment",
    name: "Entertainment",
    icon: "Entertainment",
    color: "330 81% 60%",
    type: "expense",
    isDefault: true,
  },
  {
    id: "cat-health",
    name: "Health",
    icon: "Medicine",
    color: "142 71% 45%",
    type: "expense",
    isDefault: true,
  },
  {
    id: "cat-salary",
    name: "Salary",
    icon: "Work",
    color: "142 71% 45%",
    type: "income",
    isDefault: true,
  },
  {
    id: "cat-business",
    name: "Business",
    icon: "Income",
    color: "217 91% 60%",
    type: "income",
    isDefault: true,
  },
  {
    id: "cat-freelance",
    name: "Freelance",
    icon: "Work",
    color: "38 92% 50%",
    type: "income",
    isDefault: true,
  },
  {
    id: "cat-other",
    name: "Other",
    icon: "Other",
    color: "220 10% 46%",
    type: "both",
    isDefault: true,
  },
];

export const defaultAccounts: Account[] = [
  {
    id: "acc-cash",
    name: "Cash",
    type: "cash",
    balance: 0,
    icon: "Wallet",
    color: "142 71% 45%",
  },
  {
    id: "acc-bank",
    name: "Bank Account",
    type: "bank",
    balance: 0,
    icon: "Home",
    color: "217 91% 60%",
  },
  {
    id: "acc-credit",
    name: "Credit Card",
    type: "credit_card",
    balance: 0,
    icon: "Card",
    color: "262 83% 58%",
  },
  {
    id: "acc-wallet",
    name: "Digital Wallet",
    type: "wallet",
    balance: 0,
    icon: "Wallet",
    color: "38 92% 50%",
  },
];

export const defaultSettings: AppSettings = {
  currency: "PKR",
  currencySymbol: "₨",
  theme: "light",
  accentColor: "blue",
  language: "en",
  soundEnabled: false,
};

export const defaultAppData: AppData = {
  transactions: [],
  categories: defaultCategories,
  accounts: defaultAccounts,
  budgets: [],
  goals: [],
  recurringRules: [],
  settings: defaultSettings,
};
