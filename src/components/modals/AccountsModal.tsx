import React, { useState } from "react";
import { BaseModal } from "./BaseModal";
import { ColorPicker } from "./ColorPicker";
import { IconPicker } from "./IconPicker";
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
import {
  AlertCircle,
  DollarSign,
  Building,
  CreditCard,
  Wallet,
  Pin,
  Check,
} from "lucide-react";
import { Account } from "@/types/expense-tracker";
import { generateId } from "@/lib/helpers";

interface AccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (account: Account) => void;
  editingAccount?: Account | null;
}

export function AccountsModal({
  isOpen,
  onClose,
  onSubmit,
  editingAccount,
}: AccountsModalProps) {
  const [name, setName] = useState(editingAccount?.name || "");
  const [icon, setIcon] = useState(editingAccount?.icon || "Wallet");
  const [color, setColor] = useState(
    editingAccount?.color || "hsl(199, 89%, 48%)",
  );
  const [type, setType] = useState<
    "cash" | "bank" | "credit_card" | "wallet" | "custom"
  >(editingAccount?.type || "wallet");
  const [balance, setBalance] = useState(
    editingAccount?.balance.toString() || "0",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Account name is required";
    }

    if (!icon) {
      newErrors.icon = "Please select an icon";
    }

    if (!color) {
      newErrors.color = "Please select a color";
    }

    const balanceNum = Number(balance);
    if (isNaN(balanceNum)) {
      newErrors.balance = "Please enter a valid number";
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

      const account: Account = {
        id: editingAccount?.id || generateId(),
        name: name.trim(),
        icon,
        color,
        type,
        balance: Number(balance),
      };

      onSubmit(account);
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setIcon("Wallet");
    setColor("hsl(199, 89%, 48%)");
    setType("wallet");
    setBalance("0");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingAccount ? "Edit Account" : "Add Account"}
      description="Create a new account (Cash, Bank, Wallet, etc.)"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Name */}
        <div className="space-y-2">
          <Label htmlFor="acc-name" className="font-semibold">
            Account Name
          </Label>
          <Input
            id="acc-name"
            placeholder="e.g., My Bank, Cash Wallet"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: "" });
            }}
            disabled={isSubmitting}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm font-medium text-destructive flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {errors.name}
            </p>
          )}
        </div>

        {/* Account Type */}
        <div className="space-y-2">
          <Label htmlFor="acc-type" className="font-semibold">
            Account Type
          </Label>
          <Select
            value={type}
            onValueChange={(v) => setType(v as any)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="acc-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Cash</span>
                </div>
              </SelectItem>
              <SelectItem value="bank">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>Bank Account</span>
                </div>
              </SelectItem>
              <SelectItem value="credit_card">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Credit Card</span>
                </div>
              </SelectItem>
              <SelectItem value="wallet">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span>Digital Wallet</span>
                </div>
              </SelectItem>
              <SelectItem value="custom">
                <div className="flex items-center gap-2">
                  <Pin className="h-4 w-4" />
                  <span>Custom</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Initial Balance */}
        <div className="space-y-2">
          <Label htmlFor="acc-balance" className="font-semibold">
            Initial Balance
          </Label>
          <Input
            id="acc-balance"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={balance}
            onChange={(e) => {
              setBalance(e.target.value);
              if (errors.balance) setErrors({ ...errors, balance: "" });
            }}
            disabled={isSubmitting}
            className={errors.balance ? "border-destructive" : ""}
          />
          {errors.balance && (
            <p className="text-sm font-medium text-destructive flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {errors.balance}
            </p>
          )}
        </div>

        {/* Icon Picker */}
        <div
          className={
            errors.icon ? "border border-destructive/30 rounded-lg p-4" : ""
          }
        >
          <IconPicker value={icon} onChange={setIcon} label="Select Icon" />
          {errors.icon && (
            <p className="text-sm font-medium text-destructive flex items-center gap-1 mt-2">
              <AlertCircle className="h-4 w-4" /> {errors.icon}
            </p>
          )}
        </div>

        {/* Color Picker */}
        <div
          className={
            errors.color ? "border border-destructive/30 rounded-lg p-4" : ""
          }
        >
          <ColorPicker value={color} onChange={setColor} label="Select Color" />
          {errors.color && (
            <p className="text-sm font-medium text-destructive flex items-center gap-1 mt-2">
              <AlertCircle className="h-4 w-4" /> {errors.color}
            </p>
          )}
        </div>

        {/* Preview */}
        {icon && color && (
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: color }}
            >
              <Check className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{name || "Account Name"}</p>
              <p className="text-sm text-muted-foreground">
                Balance: ${Number(balance).toFixed(2)}
              </p>
            </div>
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
            disabled={isSubmitting || !name || !icon || !color}
            className="flex-1"
          >
            {isSubmitting ? "Adding..." : editingAccount ? "Update" : "Add"}{" "}
            Account
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
