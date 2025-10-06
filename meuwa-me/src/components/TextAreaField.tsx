import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
}

export function TextAreaField({ label, helperText, className, ...props }: TextAreaFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
      <span className="text-xs uppercase tracking-wide text-white/60">{label}</span>
      <textarea
        className={cn(
          'min-h-[120px] w-full rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-3 text-base text-white shadow-inner shadow-black/40 placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/60',
          className,
        )}
        {...props}
      />
      <span className="min-h-[1rem] text-xs text-white/40">{helperText}</span>
    </label>
  );
}
