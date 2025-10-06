import type { InputHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  theme?: 'light' | 'dark';
}

export function CheckboxField({ label, description, className, theme = 'dark', ...props }: CheckboxFieldProps) {
  const isDark = theme === 'dark';
  return (
    <label
      className={cn(
        'flex items-start gap-3 rounded-2xl border p-4 text-sm transition',
        isDark
          ? 'border-white/10 bg-zinc-900/70 text-white/80 shadow-inner shadow-black/40 hover:border-accent/50'
          : 'border-slate-300 bg-white text-slate-800 shadow-sm shadow-slate-200 hover:border-indigo-300',
      )}
    >
      <input
        type="checkbox"
        className={cn(
          'mt-1 h-4 w-4 shrink-0 rounded-md border text-whatsapp focus:ring-2 focus:ring-accent/60 focus:ring-offset-1',
          isDark
            ? 'border-white/30 bg-zinc-800 focus:ring-offset-zinc-900'
            : 'border-slate-300 bg-white focus:ring-offset-white',
          className,
        )}
        {...props}
      />
      <span className="flex flex-col gap-1 text-left">
        <span className={cn('font-medium', isDark ? 'text-white' : 'text-slate-900')}>{label}</span>
        {description ? (
          <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-slate-500')}>{description}</span>
        ) : null}
      </span>
    </label>
  );
}
