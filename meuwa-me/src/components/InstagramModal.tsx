import { Instagram, Sparkles, X } from 'lucide-react';
import type { MouseEventHandler } from 'react';
import { Button } from './Button';

interface InstagramModalProps {
  open: boolean;
  onClose: () => void;
  onVisit: () => void;
}

export function InstagramModal({ open, onClose, onVisit }: InstagramModalProps) {
  if (!open) {
    return null;
  }

  const handleBackdropClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 backdrop-blur"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-950/90 p-6 text-white shadow-2xl shadow-black/50 animate-fade-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:text-white"
          aria-label="Fechar sugestão do Instagram"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent">
            <Sparkles size={20} />
          </span>
          <h2 className="text-xl font-semibold">Conheça a Arabella.dev no Instagram</h2>
          <p className="text-sm text-white/70">
            Conteúdos semanais sobre criação digital, design e inovação para o seu negócio brasileiro.
          </p>
          <div className="flex w-full flex-col gap-3">
            <Button
              type="button"
              onClick={onVisit}
              icon={<Instagram size={18} />}
              className="w-full"
            >
              Seguir Arabella.dev
            </Button>
            <Button type="button" onClick={onClose} variant="ghost" className="w-full">
              Talvez depois
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
