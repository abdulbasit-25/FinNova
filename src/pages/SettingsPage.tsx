import { useApp } from '@/contexts/AppContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AccentColor } from '@/types/expense-tracker';
import { Download, Upload, RotateCcw } from 'lucide-react';
import { useRef } from 'react';

export default function SettingsPage() {
  const { data, updateSettings, exportData, importData, resetData } = useApp();
  const { settings } = data;
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'expense-tracker-backup.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const success = importData(reader.result as string);
      alert(success ? 'Data imported successfully!' : 'Invalid backup file.');
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you sure? This will delete ALL your data.')) resetData();
  };

  const accentColors: { value: AccentColor; label: string; hsl: string }[] = [
    { value: 'blue', label: 'Blue', hsl: '217 91% 60%' },
    { value: 'green', label: 'Green', hsl: '142 71% 45%' },
    { value: 'purple', label: 'Purple', hsl: '262 83% 58%' },
  ];

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your experience</p>
      </div>

      <div className="glass-card p-6 space-y-5">
        <div>
          <Label>Currency Symbol</Label>
          <Input
            value={settings.currencySymbol}
            onChange={e => updateSettings({ currencySymbol: e.target.value })}
            className="mt-1 w-24"
          />
        </div>

        <div>
          <Label>Theme</Label>
          <Select value={settings.theme} onValueChange={v => updateSettings({ theme: v as typeof settings.theme })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Accent Color</Label>
          <div className="flex gap-3 mt-2">
            {accentColors.map(c => (
              <button
                key={c.value}
                onClick={() => updateSettings({ accentColor: c.value })}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm border transition-colors ${
                  settings.accentColor === c.value ? 'border-foreground bg-muted' : 'border-border'
                }`}
              >
                <span className="h-4 w-4 rounded-full" style={{ backgroundColor: `hsl(${c.hsl})` }} />
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Data Management</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="h-4 w-4" /> Export Backup
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-1.5">
            <Upload className="h-4 w-4" /> Import Backup
          </Button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          <Button variant="destructive" size="sm" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="h-4 w-4" /> Reset All Data
          </Button>
        </div>
      </div>
    </div>
  );
}
