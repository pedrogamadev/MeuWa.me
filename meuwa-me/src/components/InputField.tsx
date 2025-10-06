import type { InputHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export function InputField({
  label,
  error,
  helperText,
  className,
  ...props
}: InputFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-white/80">
      <span className="text-xs uppercase tracking-wide text-white/60">{label}</span>
      <input
        className={cn(
          'w-full rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-3 text-base text-white shadow-inner shadow-black/40 placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/60',
          error && 'border-red-400/50 focus:border-red-400 focus:ring-red-400/50',
          className,
        )}
        {...props}
      />
      <span className="min-h-[1rem] text-xs text-white/40">
        {error ? <span className="text-red-300">{error}</span> : helperText}
      </span>
    </label>
  );
}
