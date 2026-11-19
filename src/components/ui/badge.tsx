import * as React from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant = 'default' | 'brand' | 'success' | 'warning' | 'info' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  label?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  label,
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
    brand: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    outline: 'bg-transparent text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700',
  }[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase border select-none',
        variantStyles,
        className
      )}
      {...props}
    >
      {label || children}
    </span>
  );
};
