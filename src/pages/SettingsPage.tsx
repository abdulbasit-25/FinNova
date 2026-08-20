import { useRef, useState, useCallback } from "react";
import { useApp } from "@/contexts/AppContext";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AccentColor } from "@/types/expense-tracker";
import { Download, Upload, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  // Some browsers (notably Firefox) require the anchor to be attached to
  // the DOM for the click-triggered download to fire reliably.
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const ACCENT_COLORS: { value: AccentColor; label: string; hsl: string }[] = [
  { value: "blue", label: "Blue", hsl: "217 91% 60%" },
  { value: "green", label: "Green", hsl: "142 71% 45%" },
  { value: "purple", label: "Purple", hsl: "262 83% 58%" },
];

// Note: the previous SAR entry used '⃁' (U+20C1), a *combining* mark that
// needs a base character to attach to — on its own it typically renders as
// nothing, a stray diacritic, or a tofu box depending on the font/platform.
// 'SR' is used here as a universally-renderable fallback.
const CURRENCIES: { symbol: string; label: string }[] = [
  { symbol: "₨", label: "PKR - Pakistani Rupee" },
  { symbol: "$", label: "USD - US Dollar" },
  { symbol: "€", label: "EUR - Euro" },
  { symbol: "£", label: "GBP - British Pound" },
  { symbol: "¥", label: "CNY - Chinese Yuan" },
  { symbol: "₹", label: "INR - Indian Rupee" },
  { symbol: "A$", label: "AUD - Australian Dollar" },
  { symbol: "C$", label: "CAD - Canadian Dollar" },
  { symbol: "SR", label: "SAR - Saudi Riyal" },
  { symbol: "฿", label: "THB - Thai Baht" },
];

export default function SettingsPage() {
  const { data, updateSettings, exportData, importData, resetData } = useApp();
  const { settings } = data;
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleExport = useCallback(() => {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadFile(
      `expense-tracker-backup-${stamp}.json`,
      exportData(),
      "application/json",
    );
    toast({
      title: "Success",
      description: "Backup data downloaded successfully!",
    });
  }, [exportData, toast]);

  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Reset the input's value now (not after the read completes) so that
      // selecting the *same* file again later still fires a change event —
      // browsers only fire `onChange` when the value actually changes, so
      // without this a failed or repeat import of the same filename would
      // silently do nothing on the second attempt.
      e.target.value = "";

      const reader = new FileReader();

      reader.onload = () => {
        let success = false;
        try {
          success = importData(reader.result as string);
        } catch {
          success = false;
        }
        toast({
          title: success ? "Success" : "Error",
          description: success
            ? "Data imported successfully!"
            : "Invalid backup file. Please check and try again.",
          variant: success ? "default" : "destructive",
        });
      };

      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Could not read the selected file. Please try again.",
          variant: "destructive",
        });
      };

      reader.readAsText(file);
    },
    [importData, toast],
  );

  const handleReset = useCallback(() => {
    resetData();
    setResetDialogOpen(false);
    toast({
      title: "Success",
      description: "All data has been reset to defaults.",
    });
  }, [resetData, toast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-lg"
    >
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Customize your experience
        </p>
      </div>

      <div className="glass-card p-6 space-y-5">
        <div>
          <Label htmlFor="currency-select">Currency Symbol</Label>
          <Select
            value={settings.currencySymbol}
            onValueChange={(v) => updateSettings({ currencySymbol: v })}
          >
            <SelectTrigger id="currency-select" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.symbol} value={c.symbol}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="theme-select">Theme</Label>
          <Select
            value={settings.theme}
            onValueChange={(v) =>
              updateSettings({ theme: v as typeof settings.theme })
            }
          >
            <SelectTrigger id="theme-select" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label id="accent-color-label">Accent Color</Label>
          <div
            className="flex gap-3 mt-2"
            role="group"
            aria-labelledby="accent-color-label"
          >
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => updateSettings({ accentColor: c.value })}
                aria-pressed={settings.accentColor === c.value}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm border transition-colors ${
                  settings.accentColor === c.value
                    ? "border-foreground bg-muted"
                    : "border-border"
                }`}
              >
                <span
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: `hsl(${c.hsl})` }}
                  aria-hidden="true"
                />
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Data Management
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-1.5"
          >
            <Download className="h-4 w-4" /> Export Backup
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
            className="gap-1.5"
          >
            <Upload className="h-4 w-4" /> Import Backup
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
            aria-label="Import backup file"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setResetDialogOpen(true)}
            className="gap-1.5"
          >
            <RotateCcw className="h-4 w-4" /> Reset All Data
          </Button>
        </div>
      </div>

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Reset All Data</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all your
            expenses, categories, budgets, goals, and accounts. Please make sure
            you have a backup before proceeding.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete All Data
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
