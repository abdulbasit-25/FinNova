import React, { useState, useEffect } from 'react';
import { BaseModal } from './BaseModal';
import { ColorPicker } from './ColorPicker';
import { IconPicker } from './IconPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { Category } from '@/types/expense-tracker';
import { generateId, getIconComponent } from '@/lib/helpers';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: Category) => void;
  editingCategory?: Category | null;
}

export function CategoriesModal({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
}: CategoriesModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Shopping');
  const [color, setColor] = useState('25 95% 53%');
  const [type, setType] = useState<'income' | 'expense' | 'both'>('expense');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when editing a category or resetting for new category
  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setName(editingCategory.name);
        setIcon(editingCategory.icon);
        setColor(editingCategory.color);
        setType(editingCategory.type);
      } else {
        // Reset for new category
        setName('');
        setIcon('Shopping');
        setColor('25 95% 53%');
        setType('expense');
      }
      setErrors({});
    }
  }, [editingCategory, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Category name is required';
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

      const category: Category = {
        id: editingCategory?.id || generateId(),
        name: name.trim(),
        icon,
        color,
        type,
        isDefault: false,
      };

      onSubmit(category);
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setIcon('Shopping');
    setColor('25 95% 53%');
    setType('expense');
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
      title={editingCategory ? 'Edit Category' : 'Add Category'}
      description="Create a new spending category with custom icon and color"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Name */}
        <div className="space-y-2">
          <Label htmlFor="cat-name" className="font-semibold">
            Category Name
          </Label>
          <Input
            id="cat-name"
            placeholder="e.g., Coffee, Rent, Salary"
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

        {/* Type Selector */}
        <div className="space-y-2">
          <Label htmlFor="cat-type" className="font-semibold">
            Category Type
          </Label>
          <Select value={type} onValueChange={v => setType(v as any)} disabled={isSubmitting}>
            <SelectTrigger id="cat-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="both">Both (Income & Expense)</SelectItem>
            </SelectContent>
          </Select>
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

        {/* Preview */}
        {icon && color && (
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: color }}
            >
              {(() => {
                const IconComponent = getIconComponent(icon);
                return <IconComponent className="h-6 w-6 text-white" />;
              })()}
            </div>
            <div>
              <p className="font-semibold">{name || 'Category Name'}</p>
              <p className="text-xs text-muted-foreground capitalize">{type}</p>
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
            {isSubmitting ? 'Adding...' : editingCategory ? 'Update' : 'Add'} Category
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
