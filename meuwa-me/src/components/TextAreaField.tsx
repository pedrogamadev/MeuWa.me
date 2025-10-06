import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
  theme?: 'light' | 'dark';
}

export function TextAreaField({ label, helperText, className, theme = 'dark', ...props }: TextAreaFieldProps) {
  const isDark = theme === 'dark';
  return (
    <label className={cn('flex flex-col gap-2 text-sm font-medium', isDark ? 'text-white/80' : 'text-slate-800')}>
      <span className={cn('text-xs uppercase tracking-wide', isDark ? 'text-white/60' : 'text-slate-500')}>{label}</span>
      <textarea
        className={cn(
          'min-h-[120px] w-full rounded-2xl border px-4 py-3 text-base shadow-inner transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/60',
          isDark
            ? 'border-white/10 bg-zinc-900/70 text-white placeholder:text-white/30 shadow-black/40'
            : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 shadow-slate-200',
          className,
        )}
        {...props}
      />
      <span className={cn('min-h-[1rem] text-xs', isDark ? 'text-white/40' : 'text-slate-500')}>{helperText}</span>
    </label>
  );
}
