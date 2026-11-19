import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAccessory?: React.ReactNode;
  rightAccessory?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftAccessory, rightAccessory, id, type = 'text', ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const hasError = Boolean(error);

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex items-center w-full rounded-xl bg-white dark:bg-zinc-900 border transition-colors px-3 py-2 text-sm',
            hasError
              ? 'border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20'
              : 'border-zinc-200 dark:border-zinc-800 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20'
          )}
        >
          {leftAccessory && <div className="mr-2 text-zinc-400 shrink-0">{leftAccessory}</div>}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={cn(
              'w-full bg-transparent outline-none placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-50 disabled:opacity-50',
              className
            )}
            {...props}
          />
          {rightAccessory && <div className="ml-2 text-zinc-400 shrink-0">{rightAccessory}</div>}
        </div>
        {hasError ? (
          <span className="text-[11px] text-rose-500 font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{helperText}</span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';
