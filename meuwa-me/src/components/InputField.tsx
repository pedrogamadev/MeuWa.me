import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/utils';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  theme?: 'light' | 'dark';
  labelAdornment?: ReactNode;
}

export function InputField({
  label,
  error,
  helperText,
  className,
  theme = 'dark',
  labelAdornment,
  ...props
}: InputFieldProps) {
  const isDark = theme === 'dark';
  return (
    <label className={cn('flex flex-col gap-2 text-sm font-medium', isDark ? 'text-white/80' : 'text-slate-800')}>
      <span
        className={cn('text-xs uppercase tracking-wide', isDark ? 'text-white/60' : 'text-slate-500')}
      >
        <span className="inline-flex items-center gap-2">
          {label}
          {labelAdornment}
        </span>
      </span>
      <input
        className={cn(
          'w-full rounded-2xl border px-4 py-3 text-base shadow-inner transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/60',
          isDark
            ? 'border-white/10 bg-zinc-900/70 text-white placeholder:text-white/30 shadow-black/40'
            : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 shadow-slate-200',
          error &&
            (isDark
              ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/50'
              : 'border-red-400 focus:border-red-500 focus:ring-red-400/40'),
          className,
        )}
        {...props}
      />
      <span className={cn('min-h-[1rem] text-xs', isDark ? 'text-white/40' : 'text-slate-500')}>
        {error ? <span className={isDark ? 'text-red-300' : 'text-red-500'}>{error}</span> : helperText}
      </span>
    </label>
  );
}
