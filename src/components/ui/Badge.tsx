import * as React from 'react';
import { cn } from '@/lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'verify' | 'warning' | 'danger' | 'success';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  const variants = {
    default: 'bg-primary/10 text-primary border-transparent',
    secondary: 'bg-secondary text-secondary-foreground border-transparent',
    outline: 'border-border text-muted-foreground',
    verify: 'bg-verify-soft text-verify border-transparent',
    warning: 'bg-warning-soft text-warning border-transparent',
    danger: 'bg-danger-soft text-danger border-transparent',
    success: 'bg-success-soft text-success border-transparent',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
