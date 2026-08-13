import React from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
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
} from 'lucide-react';

const ICON_PALETTE = [
  { name: 'Shopping', icon: ShoppingCart },
  { name: 'Food', icon: UtensilsCrossed },
  { name: 'Electricity', icon: Zap },
  { name: 'Home', icon: Home },
  { name: 'Medicine', icon: Pill },
  { name: 'Fitness', icon: Dumbbell },
  { name: 'Gaming', icon: Gamepad2 },
  { name: 'Entertainment', icon: Smile },
  { name: 'Travel', icon: Plane },
  { name: 'Clothing', icon: Shirt },
  { name: 'Furniture', icon: Sofa },
  { name: 'Phone', icon: Smartphone },
  { name: 'Work', icon: Briefcase },
  { name: 'Income', icon: DollarSign },
  { name: 'Growth', icon: TrendingUp },
  { name: 'Wallet', icon: Wallet },
  { name: 'Card', icon: CreditCard },
  { name: 'Savings', icon: PiggyBank },
  { name: 'Goal', icon: Target },
  { name: 'Gift', icon: Gift },
  { name: 'Love', icon: Heart },
  { name: 'Music', icon: Music },
  { name: 'Learning', icon: BookOpen },
  { name: 'Other', icon: MoreHorizontal },
];

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  label?: string;
}

export function IconPicker({ value, onChange, label }: IconPickerProps) {
  const [search, setSearch] = React.useState('');

  const filtered = ICON_PALETTE.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Input
        placeholder="Search icons..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-2"
      />
      <ScrollArea className="h-48 border border-border rounded-lg p-3">
        <div className="grid grid-cols-4 gap-2">
          {filtered.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => onChange(item.name)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 p-3 rounded-lg transition-all duration-200 border-2',
                  value === item.name
                    ? 'border-primary bg-primary/10'
                    : 'border-transparent hover:bg-muted'
                )}
                title={item.name}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs text-center line-clamp-1">{item.name}</span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
      {value && (
        <div className="mt-3 p-3 rounded-lg bg-muted border border-border flex items-center gap-3">
          {ICON_PALETTE.find(i => i.name === value)?.icon && <Check className="h-6 w-6 text-success" />}
          <code className="text-sm text-muted-foreground font-mono flex-1">{value}</code>
        </div>
      )}
    </div>
  );
}
