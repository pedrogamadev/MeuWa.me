import { X } from 'lucide-react';
import type { MouseEventHandler, ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '../lib/utils';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  size?: 'sm' | 'lg';
  closeLabel: string;
}

export function Dialog({
  open,
  onClose,
  theme,
  title,
  description,
  children,
  footer,
  icon,
  size = 'sm',
  closeLabel,
}: DialogProps) {
  if (!open) {
    return null;
  }

  const handleBackdropClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const titleId = useId();
  const descriptionId = useId();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur"
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          'relative w-full animate-fade-in rounded-3xl border p-6 shadow-2xl',
          size === 'lg' ? 'max-w-2xl' : 'max-w-sm',
          theme === 'dark'
            ? 'border-white/10 bg-zinc-950/90 text-white shadow-black/50'
            : 'border-slate-200 bg-white text-slate-900 shadow-slate-200/70',
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border transition',
            theme === 'dark'
              ? 'border-white/10 bg-white/5 text-white/70 hover:text-white'
              : 'border-slate-200 bg-slate-100 text-slate-500 hover:text-slate-900',
          )}
          aria-label={closeLabel}
        >
          <X size={16} />
        </button>

        <div className="flex flex-col gap-4 text-center sm:text-left">
          {icon ? <div className="mx-auto sm:mx-0">{icon}</div> : null}
          <div className="flex flex-col gap-2">
            <h2 id={titleId} className="text-xl font-semibold">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className={cn('text-sm', theme === 'dark' ? 'text-white/70' : 'text-slate-600')}>
                {description}
              </p>
            ) : null}
          </div>

          {children ? (
            <div className={cn('text-sm leading-relaxed sm:text-base', theme === 'dark' ? 'text-white/75' : 'text-slate-600')}>
              {children}
            </div>
          ) : null}
        </div>

        {footer ? <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">{footer}</div> : null}
      </div>
    </div>
  );
}
