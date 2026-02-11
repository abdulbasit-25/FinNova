import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export function QuickAddButton() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <button
      onClick={() => navigate('/add')}
      className={`fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105 active:scale-95 ${
        isMobile ? 'bottom-20 right-4' : 'bottom-6 right-6'
      }`}
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}
