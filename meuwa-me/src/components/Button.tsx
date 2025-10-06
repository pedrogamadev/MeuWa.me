import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  variant?: ButtonVariant;
  isFullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-whatsapp text-white hover:bg-emerald-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-whatsapp focus-visible:ring-offset-zinc-900',
  secondary:
    'bg-zinc-800 text-white hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-zinc-900',
  ghost:
    'bg-transparent text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/20 focus-visible:ring-offset-zinc-900',
};

export function Button({
  icon,
  children,
  className,
  variant = 'primary',
  isFullWidth = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 shadow-md shadow-black/30 focus:outline-none focus-visible:outline-none',
        variantClasses[variant],
        isFullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
