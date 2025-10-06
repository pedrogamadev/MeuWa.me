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
        'flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition',
        theme === 'dark'
          ? 'border-white/10 bg-zinc-900/70 text-white/70 shadow-lg shadow-black/30 hover:border-accent/60 hover:text-white'
          : 'border-slate-300 bg-white text-slate-600 shadow-md shadow-slate-200/80 hover:border-indigo-400 hover:text-slate-900',
        className,
      )}
      {...props}
    >
      {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
      <span>Modo escuro / claro</span>
      <span
        className={cn(
          'ml-auto flex h-5 w-10 items-center rounded-full p-1 transition-colors',
          theme === 'dark' ? 'bg-zinc-800' : 'bg-slate-200',
        )}
      >
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
