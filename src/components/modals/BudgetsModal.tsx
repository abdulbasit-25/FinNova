import React, { useState } from "react";
import { BaseModal } from "./BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Budget, Category } from "@/types/expense-tracker";
import { generateId } from "@/lib/helpers";

interface BudgetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (budget: Budget) => void;
  categories: Category[];
  editingBudget?: Budget | null;
  currencySymbol?: string;
}

export function BudgetsModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  editingBudget,
  currencySymbol = "$",
}: BudgetsModalProps) {
  const [categoryId, setCategoryId] = useState(editingBudget?.categoryId || "");
  const [amount, setAmount] = useState(editingBudget?.amount.toString() || "");
  const [month, setMonth] = useState(
    editingBudget?.month || new Date().toISOString().slice(0, 7),
  );
  const [isBudgetType, setIsBudgetType] = useState<"category" | "overall">(
    editingBudget?.categoryId ? "category" : "overall",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const amountNum = Number(amount);
    if (!amount || amountNum <= 0) {
      newErrors.amount = "Please enter a valid budget amount";
    }

    if (isBudgetType === "category" && !categoryId) {
      newErrors.category = "Please select a category";
    }

    if (!month) {
      newErrors.month = "Please select a month";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const budget: Budget = {
        id: editingBudget?.id || generateId(),
        categoryId: isBudgetType === "category" ? categoryId : null,
        amount: Number(amount),
        month,
      };

      onSubmit(budget);
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCategoryId("");
    setAmount("");
    setMonth(new Date().toISOString().slice(0, 7));
    setIsBudgetType("category");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingBudget ? "Edit Budget" : "Add Budget"}
      description="Set spending limits for categories or overall budget"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Budget Type Toggle */}
        <div className="space-y-2">
          <Label className="font-semibold">Budget Type</Label>
          <div className="flex gap-2 rounded-lg bg-muted p-1.5">
            <button
              type="button"
              onClick={() => {
                setIsBudgetType("category");
                setCategoryId("");
              }}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-all ${
                isBudgetType === "category"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Category
            </button>
            <button
              type="button"
              onClick={() => {
                setIsBudgetType("overall");
                setCategoryId("");
              }}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-all ${
                isBudgetType === "overall"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Overall
            </button>
          </div>
        </div>

        {/* Category Selector (if category budget) */}
        {isBudgetType === "category" && (
          <div className="space-y-2">
            <Label htmlFor="budget-category" className="font-semibold">
              Select Category
            </Label>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
              disabled={isSubmitting}
            >
              <SelectTrigger
                id="budget-category"
                className={errors.category ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <div className="flex items-center gap-2">
                      <span>{c.icon}</span>
                      <span>{c.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm font-medium text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> {errors.category}
              </p>
            )}
          </div>
        )}

        {/* Month Selector */}
        <div className="space-y-2">
          <Label htmlFor="budget-month" className="font-semibold">
            Month
          </Label>
          <Input
            id="budget-month"
            type="month"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              if (errors.month) setErrors({ ...errors, month: "" });
            }}
            disabled={isSubmitting}
            className={errors.month ? "border-destructive" : ""}
          />
          {errors.month && (
            <p className="text-sm font-medium text-destructive flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {errors.month}
            </p>
          )}
        </div>

        {/* Budget Amount */}
        <div className="space-y-2">
          <Label htmlFor="budget-amount" className="font-semibold">
            Budget Amount
          </Label>
          <Input
            id="budget-amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (errors.amount) setErrors({ ...errors, amount: "" });
            }}
            disabled={isSubmitting}
            className={errors.amount ? "border-destructive" : ""}
          />
          {errors.amount && (
            <p className="text-sm font-medium text-destructive flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {errors.amount}
            </p>
          )}
        </div>

        {/* Preview */}
        {amount && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Budget Preview
            </p>
            {isBudgetType === "category" && selectedCategory ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedCategory.icon}</span>
                  <p className="font-semibold">{selectedCategory.name}</p>
                </div>
                <p className="text-lg font-bold text-primary">
                  {currencySymbol}
                  {Number(amount).toFixed(2)}
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="font-semibold">Overall Monthly Budget</p>
                <p className="text-lg font-bold text-primary">
                  {currencySymbol}
                  {Number(amount).toFixed(2)}
                </p>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              For{" "}
              {new Date(`${month}-01`).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              !amount ||
              (isBudgetType === "category" && !categoryId)
            }
            className="flex-1"
          >
            {isSubmitting ? "Adding..." : editingBudget ? "Update" : "Add"}{" "}
            Budget
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
