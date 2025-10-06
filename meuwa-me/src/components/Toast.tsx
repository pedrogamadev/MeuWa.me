import { cn } from '../lib/utils';

type ToastTone = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastTone;
  visible: boolean;
  theme?: 'light' | 'dark';
}

const toneClasses: Record<ToastTone, Record<'light' | 'dark', string>> = {
  success: {
    dark: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
    light: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
  },
  error: {
    dark: 'bg-red-500/20 text-red-200 border-red-500/40',
    light: 'bg-red-500/10 text-red-600 border-red-500/30',
  },
  info: {
    dark: 'bg-white/10 text-white border-white/20',
    light: 'bg-slate-900/5 text-slate-800 border-slate-200',
  },
};

export function Toast({ message, type = 'info', visible, theme = 'dark' }: ToastProps) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 top-6 mx-auto flex w-fit items-center justify-center rounded-full border px-5 py-2 text-sm font-medium opacity-0 transition-all duration-300 backdrop-blur',
        visible && 'pointer-events-auto opacity-100 translate-y-2',
        toneClasses[type][theme],
        theme === 'dark' ? 'shadow-lg shadow-black/30' : 'shadow-md shadow-slate-200/70',
      )}
    >
      {message}
    </div>
  );
}
