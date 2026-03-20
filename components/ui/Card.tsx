import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
}

export function Card({ children, className, glass }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-5 shadow-sm',
        glass ? 'glass-card' : 'bg-white border border-brown-100',
        className
      )}
    >
      {children}
    </div>
  );
}
