import { Moon, Sun } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface ThemeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme: 'light' | 'dark';
}

export function ThemeToggle({ theme, className, ...props }: ThemeToggleProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 shadow-lg shadow-black/30 transition hover:border-accent/60 hover:text-white',
        className,
      )}
      {...props}
    >
      {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
      <span>Modo escuro / claro</span>
      <span className="ml-auto flex h-5 w-10 items-center rounded-full bg-zinc-800 p-1">
        <span
          className={cn(
            'h-3 w-3 rounded-full bg-accent transition-transform duration-200',
            theme === 'dark' ? 'translate-x-0' : 'translate-x-4',
          )}
        />
      </span>
    </button>
  );
}
