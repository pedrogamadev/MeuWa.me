import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonTheme = 'light' | 'dark';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  variant?: ButtonVariant;
  isFullWidth?: boolean;
  theme?: ButtonTheme;
}

const variantStyles: Record<ButtonVariant, Record<ButtonTheme, string>> = {
  primary: {
    dark: 'bg-whatsapp text-white hover:bg-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900',
    light: 'bg-whatsapp text-white hover:bg-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
  },
  secondary: {
    dark: 'bg-zinc-800 text-white hover:bg-zinc-700 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900',
    light: 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
  },
  ghost: {
    dark: 'bg-transparent text-white hover:bg-white/10 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900',
    light: 'bg-transparent text-slate-900 hover:bg-slate-200/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
  },
};

export function Button({
  icon,
  children,
  className,
  variant = 'primary',
  isFullWidth = false,
  theme = 'dark',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-60',
        variantStyles[variant][theme],
        isFullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {icon ? <span className="inline-flex items-center justify-center">{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}
