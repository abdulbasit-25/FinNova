import React from 'react';
import { cn } from '@/lib/utils';

const COLOR_PALETTE = [
  'hsl(0, 84%, 60%)',      // Red
  'hsl(25, 95%, 53%)',     // Orange
  'hsl(38, 92%, 50%)',     // Yellow
  'hsl(142, 76%, 36%)',    // Green
  'hsl(199, 89%, 48%)',    // Blue
  'hsl(280, 85%, 50%)',    // Purple
  'hsl(330, 81%, 60%)',    // Pink
  'hsl(194, 96%, 50%)',    // Cyan
  'hsl(0, 0%, 45%)',       // Gray
  'hsl(0, 0%, 25%)',       // Dark Gray
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex gap-2 flex-wrap">
        {COLOR_PALETTE.map(color => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              'w-10 h-10 rounded-lg transition-transform duration-200 border-2',
              value === color ? 'border-foreground scale-110 shadow-md' : 'border-transparent hover:scale-105'
            )}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
      {value && (
        <div className="mt-3 p-3 rounded-lg bg-muted border border-border flex items-center gap-3">
          <div
            className="w-6 h-6 rounded-md border border-border"
            style={{ backgroundColor: value }}
          />
          <code className="text-xs text-muted-foreground font-mono flex-1">{value}</code>
        </div>
      )}
    </div>
  );
}
