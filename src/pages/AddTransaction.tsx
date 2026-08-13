import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { generateId, getIconComponent } from '@/lib/helpers';
import { TransactionType, PaymentMethod } from '@/types/expense-tracker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, TrendingDown, DollarSign, ArrowRightLeft, CreditCard, Building, Smartphone, Pin, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddTransaction() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { data, addTransaction, updateAccount } = useApp();
  const { toast } = useToast();
  const { categories, accounts, settings } = data;

  // Form state
  const [type, setType] = useState<TransactionType>((params.get('type') as TransactionType) || 'expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [toAccountId, setToAccountId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restore form state from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('addTransactionForm');
    if (saved) {
      try {
        const {
          type: savedType,
          amount: savedAmount,
          categoryId: savedCategoryId,
          accountId: savedAccountId,
          toAccountId: savedToAccountId,
          paymentMethod: savedPaymentMethod,
          notes: savedNotes,
          date: savedDate,
          time: savedTime,
        } = JSON.parse(saved);
        
        setType(savedType || type);
        setAmount(savedAmount || '');
        setCategoryId(savedCategoryId || '');
        setAccountId(savedAccountId || accounts[0]?.id || '');
        setToAccountId(savedToAccountId || '');
        setPaymentMethod(savedPaymentMethod || 'cash');
        setNotes(savedNotes || '');
        setDate(savedDate || new Date().toISOString().split('T')[0]);
        setTime(savedTime || new Date().toTimeString().slice(0, 5));

        sessionStorage.removeItem('addTransactionForm');
      } catch (e) {
        // Silently handle restore errors
      }
    }
  }, []);

  const filteredCategories = categories.filter(c => c.type === type || c.type === 'both');
  const currentCategory = categories.find(c => c.id === categoryId);
  const currentAccount = accounts.find(a => a.id === accountId);
  const transferAccount = accounts.find(a => a.id === toAccountId);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (type !== 'transfer' && !categoryId) {
      newErrors.category = 'Please select a category';
    }

    if (!accountId) {
      newErrors.account = 'Please select an account';
    }

    if (type === 'transfer' && !toAccountId) {
      newErrors.toAccount = 'Please select a destination account';
    }

    if (type === 'transfer' && accountId === toAccountId) {
      newErrors.toAccount = 'Transfer accounts cannot be the same';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));

      const currentAccount = accounts.find(a => a.id === accountId);
      const transAmount = Number(amount);
      let newBalance = currentAccount?.balance || 0;

      // Calculate new balance based on transaction type
      if (type === 'expense') {
        newBalance -= transAmount;
      } else if (type === 'income') {
        newBalance += transAmount;
      } else if (type === 'transfer') {
        newBalance -= transAmount;
        // Update destination account
        const destAccount = accounts.find(a => a.id === toAccountId);
        if (destAccount) {
          updateAccount(toAccountId, { balance: destAccount.balance + transAmount });
        }
      }

      // Update source account balance
      updateAccount(accountId, { balance: newBalance });

      addTransaction({
        id: generateId(),
        type,
        amount: transAmount,
        categoryId: categoryId || filteredCategories[0]?.id || 'cat-other',
        date,
        time,
        paymentMethod,
        accountId,
        toAccountId: type === 'transfer' ? toAccountId : undefined,
        notes,
        isRecurring: false,
        createdAt: new Date().toISOString(),
      });

      // Clear saved form state
      sessionStorage.removeItem('addTransactionForm');
      toast({
        title: 'Success',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add transaction. Please try again.',
        variant: 'destructive',
      });
      setErrors({ submit: 'Failed to add transaction. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = () => {
    // Save form state to sessionStorage as user types
    sessionStorage.setItem(
      'addTransactionForm',
      JSON.stringify({
        type,
        amount,
        categoryId,
        accountId,
        toAccountId,
        paymentMethod,
        notes,
        date,
        time,
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 sticky top-0 bg-background/95 backdrop-blur-sm p-3 sm:p-4 lg:p-6 -mx-2 sm:-mx-4 lg:-mx-6 z-10">
        <button
          onClick={() => {
            sessionStorage.setItem(
              'addTransactionForm',
              JSON.stringify({
                type,
                amount,
                categoryId,
                accountId,
                toAccountId,
                paymentMethod,
                notes,
                date,
                time,
              })
            );
            navigate(-1);
          }}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1"
          title="Go back (Esc)"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <h1 className="text-lg sm:text-2xl font-bold text-foreground">Add Transaction</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Form */}
        <Card className="md:col-span-1 lg:col-span-2 p-4 sm:p-5">
          <form onSubmit={handleSubmit} onChange={handleInputChange} className="space-y-6">
            {/* Submit Error */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex gap-3 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive"
              >
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </motion.div>
            )}

            {/* Transaction Type Selector */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Type</Label>
              <div className="flex gap-2 rounded-lg bg-muted p-1.5">
                {(['expense', 'income', 'transfer'] as TransactionType[]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setType(t);
                      setCategoryId('');
                      setToAccountId('');
                      setErrors({});
                    }}
                    className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-all duration-200 capitalize ${
                      type === t
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t === 'expense' && <TrendingDown className="h-4 w-4" />}
                    {t === 'income' && <DollarSign className="h-4 w-4" />}
                    {t === 'transfer' && <ArrowRightLeft className="h-4 w-4" />}
                    <span className="ml-2">{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-3">
              <Label htmlFor="amount" className="text-base font-semibold">Amount</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-muted-foreground">
                  {settings.currencySymbol}
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => {
                    setAmount(e.target.value);
                    if (errors.amount) setErrors({ ...errors, amount: '' });
                  }}
                  className={`text-3xl font-bold h-16 pl-16 ${
                    errors.amount ? 'border-destructive focus-visible:ring-destructive' : ''
                  }`}
                  autoFocus
                  disabled={isSubmitting}
                />
              </div>
              {errors.amount && (
                <p className="text-sm font-medium text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> {errors.amount}
                </p>
              )}
            </div>

            {/* Category (if not transfer) */}
            {type !== 'transfer' && (
              <div className="space-y-3">
                <Label htmlFor="category" className="text-base font-semibold">Category</Label>
                <Select value={categoryId} onValueChange={v => setCategoryId(v)} disabled={isSubmitting}>
                  <SelectTrigger
                    id="category"
                    className={errors.category ? 'border-destructive focus-visible:ring-destructive' : ''}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map(c => {
                      const IconComponent = getIconComponent(c.icon);
                      return (
                        <SelectItem key={c.id} value={c.id}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span>{c.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm font-medium text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> {errors.category}
                  </p>
                )}
              </div>
            )}

            {/* Account */}
            <div className="space-y-3">
              <Label htmlFor="account" className="text-base font-semibold">From Account</Label>
              <Select value={accountId} onValueChange={v => setAccountId(v)} disabled={isSubmitting}>
                <SelectTrigger
                  id="account"
                  className={errors.account ? 'border-destructive focus-visible:ring-destructive' : ''}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(a => {
                    const IconComponent = getIconComponent(a.icon);
                    return (
                      <SelectItem key={a.id} value={a.id}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <span>{a.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.account && (
                <p className="text-sm font-medium text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> {errors.account}
                </p>
              )}
            </div>

            {/* Transfer Target Account */}
            {type === 'transfer' && (
              <div className="space-y-3">
                <Label htmlFor="toAccount" className="text-base font-semibold">To Account</Label>
                <Select value={toAccountId} onValueChange={v => setToAccountId(v)} disabled={isSubmitting}>
                  <SelectTrigger
                    id="toAccount"
                    className={errors.toAccount ? 'border-destructive focus-visible:ring-destructive' : ''}
                  >
                    <SelectValue placeholder="Select destination account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts
                      .filter(a => a.id !== accountId)
                      .map(a => {
                        const IconComponent = getIconComponent(a.icon);
                        return (
                          <SelectItem key={a.id} value={a.id}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              <span>{a.name}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
                {errors.toAccount && (
                  <p className="text-sm font-medium text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> {errors.toAccount}
                  </p>
                )}
              </div>
            )}

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="date" className="font-semibold">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="time" className="font-semibold">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <Label htmlFor="paymentMethod" className="font-semibold">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={v => setPaymentMethod(v as PaymentMethod)} disabled={isSubmitting}>
                <SelectTrigger id="paymentMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash"><div className="flex items-center gap-2"><DollarSign className="h-4 w-4" /><span>Cash</span></div></SelectItem>
                  <SelectItem value="card"><div className="flex items-center gap-2"><CreditCard className="h-4 w-4" /><span>Card</span></div></SelectItem>
                  <SelectItem value="bank_transfer"><div className="flex items-center gap-2"><Building className="h-4 w-4" /><span>Bank Transfer</span></div></SelectItem>
                  <SelectItem value="OnlinePayments"><div className="flex items-center gap-2"><Smartphone className="h-4 w-4" /><span>Online Payment</span></div></SelectItem>
                  <SelectItem value="other"><div className="flex items-center gap-2"><Pin className="h-4 w-4" /><span>Other</span></div></SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <Label htmlFor="notes" className="font-semibold">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add any additional details..."
                rows={3}
                disabled={isSubmitting}
                className="resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !amount}
              className="w-full h-12 text-base font-semibold transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Adding...
                </>
              ) : (
                `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`
              )}
            </Button>
          </form>
        </Card>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Amount Summary */}
          {amount && (
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">Total Amount</p>
              <p className="text-4xl font-bold text-foreground">
                {settings.currencySymbol}
                {Number(amount).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                {type === 'expense' && <><TrendingDown className="h-3 w-3" /> Will be deducted from</> }
                {type === 'income' && <><DollarSign className="h-3 w-3" /> Will be added to</> }
                {type === 'transfer' && <><ArrowRightLeft className="h-3 w-3" /> Will transfer to</> }
              </p>
              {currentAccount && (
                <p className="text-sm font-semibold text-foreground mt-1 flex items-center gap-2">
                  {(() => {
                    const IconComponent = getIconComponent(currentAccount.icon);
                    return <IconComponent className="h-5 w-5" />;
                  })()}
                  {currentAccount.name}
                </p>
              )}
            </Card>
          )}

          {/* Category Info */}
          {currentCategory && type !== 'transfer' && (
            <Card className="p-6 border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Category</p>
              <div className="flex items-center gap-3">
                <div className="text-3xl flex items-center justify-center">
                  {(() => {
                    const IconComponent = getIconComponent(currentCategory.icon);
                    return <IconComponent className="h-7 w-7" />;
                  })()}
                </div>
                <div>
                  <p className="font-semibold">{currentCategory.name}</p>
                  <p className="text-xs text-muted-foreground uppercase">
                    {type === 'expense' ? 'Expense' : 'Income'}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Transfer Info */}
          {type === 'transfer' && transferAccount && (
            <Card className="p-6 border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Destination</p>
              <div className="flex items-center gap-3">
                <div className="text-3xl flex items-center justify-center">
                  {(() => {
                    const IconComponent = getIconComponent(transferAccount.icon);
                    return <IconComponent className="h-7 w-7" />;
                  })()}
                </div>
                <div>
                  <p className="font-semibold">{transferAccount.name}</p>
                  <p className="text-xs text-muted-foreground">Transfer Destination</p>
                </div>
              </div>
            </Card>
          )}

          {/* Quick Tips */}
          <Card className="p-4 bg-muted/30 border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Tips</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• Use clear descriptions in notes</li>
              <li>• Verify amount before submitting</li>
              <li>• Set correct transaction type</li>
              <li>• Your data saves automatically</li>
            </ul>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
