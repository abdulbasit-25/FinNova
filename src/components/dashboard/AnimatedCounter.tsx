import { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/helpers';

interface AnimatedCounterProps {
  value: number;
  symbol?: string;
  duration?: number;
}

export function AnimatedCounter({ value, symbol = '$', duration = 800 }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    const startTime = performance.now();

    function animate(time: number) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(start + diff * eased);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{formatCurrency(display, symbol)}</span>;
}
