import { Transaction } from "@/types/expense-tracker";
import {
  ShoppingCart,
  UtensilsCrossed,
  Zap,
  Home,
  Pill,
  Dumbbell,
  Gamepad2,
  Smile,
  Plane,
  Shirt,
  Sofa,
  Smartphone,
  Briefcase,
  DollarSign,
  TrendingUp,
  Wallet,
  CreditCard,
  PiggyBank,
  Target,
  Gift,
  Heart,
  Music,
  BookOpen,
  MoreHorizontal,
  Receipt,
  ShoppingBag,
  Car,
  Building2,
  Laptop,
  Banknote,
  Landmark,
  LucideIcon,
} from "lucide-react";

export const USD_TO_PKR = 280; // default exchange rate (1 USD -> 280 PKR)

// Icon mapping for Lucide React icons
export const ICON_MAP: Record<string, LucideIcon> = {
  Shopping: ShoppingCart,
  Food: UtensilsCrossed,
  Electricity: Zap,
  Home,
  Medicine: Pill,
  Fitness: Dumbbell,
  Gaming: Gamepad2,
  Entertainment: Smile,
  Travel: Plane,
  Clothing: Shirt,
  Furniture: Sofa,
  Phone: Smartphone,
  Work: Briefcase,
  Income: DollarSign,
  Growth: TrendingUp,
  Wallet,
  Card: CreditCard,
  Savings: PiggyBank,
  Goal: Target,
  Gift,
  Love: Heart,
  Music,
  Learning: BookOpen,
  Other: MoreHorizontal,
  // Legacy/Default category names
  UtensilsCrossed,
  Receipt,
  ShoppingBag,
  Car,
  Building2,
  Laptop,
  Banknote,
  Landmark,
};

// Helper to get icon component by name
export function getIconComponent(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || MoreHorizontal;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function formatCurrency(amount: number, symbol: string = "₨"): string {
  const formatted = Math.abs(amount).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${amount < 0 ? "-" : ""}${symbol}${formatted}`;
}

export function convertUsdToPkr(
  amountUsd: number,
  rate: number = USD_TO_PKR,
): number {
  return Math.round(amountUsd * rate * 100) / 100;
}

export function getMonthKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function getTransactionsForMonth(
  transactions: Transaction[],
  monthKey: string,
): Transaction[] {
  return transactions.filter((t) => t.date.startsWith(monthKey));
}

export function getTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getCategoryTotals(
  transactions: Transaction[],
): Record<string, number> {
  const totals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      totals[t.categoryId] = (totals[t.categoryId] || 0) + t.amount;
    });
  return totals;
}

export function getWeeklyTotals(
  transactions: Transaction[],
): { day: string; amount: number }[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  const result: { day: string; amount: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayTotal = transactions
      .filter((t) => t.type === "expense" && t.date === dateStr)
      .reduce((sum, t) => sum + t.amount, 0);
    result.push({ day: days[d.getDay()], amount: dayTotal });
  }
  return result;
}
