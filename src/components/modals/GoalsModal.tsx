import React, { useState } from 'react';
import { BaseModal } from './BaseModal';
import { ColorPicker } from './ColorPicker';
import { IconPicker } from './IconPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { SavingsGoal } from '@/types/expense-tracker';
import { generateId } from '@/lib/helpers';

interface GoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: SavingsGoal) => void;
  editingGoal?: SavingsGoal | null;
}

export function GoalsModal({
  isOpen,
  onClose,
  onSubmit,
  editingGoal,
}: GoalsModalProps) {
  const [name, setName] = useState(editingGoal?.name || '');
  const [icon, setIcon] = useState(editingGoal?.icon || 'Goal');
  const [color, setColor] = useState(editingGoal?.color || 'hsl(142, 76%, 36%)');
  const [targetAmount, setTargetAmount] = useState(editingGoal?.targetAmount.toString() || '');
  const [currentAmount, setCurrentAmount] = useState(editingGoal?.currentAmount.toString() || '0');
  const [deadline, setDeadline] = useState(editingGoal?.deadline || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Goal name is required';
    }

    const targetNum = Number(targetAmount);
    if (!targetAmount || targetNum <= 0) {
      newErrors.targetAmount = 'Please enter a valid target amount';
    }

    const currentNum = Number(currentAmount);
    if (isNaN(currentNum) || currentNum < 0) {
      newErrors.currentAmount = 'Please enter a valid current amount';
    }

    if (!deadline) {
      newErrors.deadline = 'Please set a deadline';
    } else if (new Date(deadline) < new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }

    if (!icon) {
      newErrors.icon = 'Please select an icon';
    }

    if (!color) {
      newErrors.color = 'Please select a color';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const goal: SavingsGoal = {
        id: editingGoal?.id || generateId(),
        name: name.trim(),
        icon,
        color,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount),
        deadline,
      };

      onSubmit(goal);
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setIcon('Goal');
    setColor('hsl(142, 76%, 36%)');
    setTargetAmount('');
    setCurrentAmount('0');
    setDeadline('');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const progressPercent = Math.min(
    (Number(currentAmount) / Number(targetAmount)) * 100,
    100
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingGoal ? 'Edit Goal' : 'Add Savings Goal'}
      description="Create a new savings goal with a target amount and deadline"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Goal Name */}
        <div className="space-y-2">
          <Label htmlFor="goal-name" className="font-semibold">
            Goal Name
          </Label>
          <Input
            id="goal-name"
            placeholder="e.g., Vacation, New Car, Emergency Fund"
            value={name}
            onChange={e => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            disabled={isSubmitting}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-sm font-medium text-destructive flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {errors.name}
            </p>
          )}
        </div>

        {/* Target Amount & Current Amount */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="goal-target" className="font-semibold">
              Target Amount
            </Label>
            <Input
              id="goal-target"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={targetAmount}
              onChange={e => {
                setTargetAmount(e.target.value);
                if (errors.targetAmount) setErrors({ ...errors, targetAmount: '' });
              }}
              disabled={isSubmitting}
              className={errors.targetAmount ? 'border-destructive' : ''}
            />
            {errors.targetAmount && (
              <p className="text-sm font-medium text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-current" className="font-semibold">
              Current Amount
            </Label>
            <Input
              id="goal-current"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={currentAmount}
              onChange={e => {
                setCurrentAmount(e.target.value);
                if (errors.currentAmount) setErrors({ ...errors, currentAmount: '' });
              }}
              disabled={isSubmitting}
              className={errors.currentAmount ? 'border-destructive' : ''}
            />
            {errors.currentAmount && (
              <p className="text-sm font-medium text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
              </p>
            )}
          </div>
        </div>

        {/* Deadline */}
        <div className="space-y-2">
          <Label htmlFor="goal-deadline" className="font-semibold">
            Deadline
          </Label>
          <Input
            id="goal-deadline"
            type="date"
            value={deadline}
            onChange={e => {
              setDeadline(e.target.value);
              if (errors.deadline) setErrors({ ...errors, deadline: '' });
            }}
            disabled={isSubmitting}
            className={errors.deadline ? 'border-destructive' : ''}
          />
          {errors.deadline && (
            <p className="text-sm font-medium text-destructive flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {errors.deadline}
            </p>
          )}
        </div>

        {/* Icon Picker */}
        <div className={errors.icon ? 'border border-destructive/30 rounded-lg p-4' : ''}>
          <IconPicker value={icon} onChange={setIcon} label="Select Icon" />
          {errors.icon && (
            <p className="text-sm font-medium text-destructive flex items-center gap-1 mt-2">
              <AlertCircle className="h-4 w-4" /> {errors.icon}
            </p>
          )}
        </div>

        {/* Color Picker */}
        <div className={errors.color ? 'border border-destructive/30 rounded-lg p-4' : ''}>
          <ColorPicker value={color} onChange={setColor} label="Select Color" />
          {errors.color && (
            <p className="text-sm font-medium text-destructive flex items-center gap-1 mt-2">
              <AlertCircle className="h-4 w-4" /> {errors.color}
            </p>
          )}
        </div>

        {/* Progress Preview */}
        {targetAmount && currentAmount && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{name || 'Goal Name'}</p>
                <p className="text-sm text-muted-foreground">
                  ${Number(currentAmount).toFixed(2)} / ${Number(targetAmount).toFixed(2)}
                </p>
              </div>
              <span className="text-lg font-bold text-primary">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: color,
                }}
              />
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
            disabled={isSubmitting || !name || !targetAmount || !deadline}
            className="flex-1"
          >
            {isSubmitting ? 'Adding...' : editingGoal ? 'Update' : 'Add'} Goal
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
