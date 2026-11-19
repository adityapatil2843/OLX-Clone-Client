import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'subtle';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'elevated', ...props }, ref) => {
    const variantStyles = {
      elevated: 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow',
      outlined: 'bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800',
      subtle: 'bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/80',
    }[variant];

    return (
      <div
        ref={ref}
        className={cn('rounded-xl overflow-hidden', variantStyles, className)}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4 sm:p-5 pb-2 flex flex-col space-y-1.5', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-bold text-base sm:text-lg text-zinc-900 dark:text-zinc-50 leading-tight', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs sm:text-sm text-zinc-500 dark:text-zinc-400', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4 sm:p-5 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4 sm:p-5 pt-0 flex items-center border-t border-zinc-100 dark:border-zinc-800/60 mt-3', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';
