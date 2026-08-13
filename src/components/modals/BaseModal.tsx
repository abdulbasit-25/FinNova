import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnEsc?: boolean;
  closeButton?: boolean;
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnEsc = true,
  closeButton = true,
}: BaseModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className={`${sizeClasses[size]} p-0 overflow-hidden m-2 sm:m-0 max-h-[90vh] overflow-y-auto scrollbar-accent`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full"
            >
              {/* Header */}
              <div className="border-b border-border px-6 py-4 flex items-center justify-between bg-card">
                <div className="flex-1">
                  <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
                  {description && (
                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                      {description}
                    </DialogDescription>
                  )}
                </div>
                {closeButton && (
                  <button
                    onClick={onClose}
                    className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    title="Close (Esc)"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="p-6"
              >
                {children}
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
