import type { InputHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export function CheckboxField({ label, description, className, ...props }: CheckboxFieldProps) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-zinc-900/70 p-4 text-sm text-white/80 shadow-inner shadow-black/40 transition hover:border-accent/50">
      <input
        type="checkbox"
        className={cn(
          'mt-1 h-4 w-4 shrink-0 rounded-md border border-white/30 bg-zinc-800 text-whatsapp focus:ring-2 focus:ring-accent/60 focus:ring-offset-1 focus:ring-offset-zinc-900',
          className,
        )}
        {...props}
      />
      <span className="flex flex-col gap-1 text-left">
        <span className="font-medium text-white">{label}</span>
        {description ? <span className="text-xs text-white/50">{description}</span> : null}
      </span>
    </label>
  );
}
