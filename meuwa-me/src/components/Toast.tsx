import { cn } from '../lib/utils';

type ToastTone = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastTone;
  visible: boolean;
}

const toneClasses: Record<ToastTone, string> = {
  success: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  error: 'bg-red-500/20 text-red-200 border-red-500/40',
  info: 'bg-white/10 text-white border-white/20',
};

export function Toast({ message, type = 'info', visible }: ToastProps) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 top-6 mx-auto flex w-fit items-center justify-center rounded-full border px-5 py-2 text-sm font-medium opacity-0 transition-all duration-300',
        visible && 'pointer-events-auto opacity-100 translate-y-2',
        toneClasses[type],
      )}
    >
      {message}
    </div>
  );
}
