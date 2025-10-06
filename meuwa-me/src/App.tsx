import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Copy,
  ExternalLink,
  Instagram,
  Link as LinkIcon,
  QrCode,
  SendHorizontal,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from './components/Button';
import { CheckboxField } from './components/CheckboxField';
import { InputField } from './components/InputField';
import { TextAreaField } from './components/TextAreaField';
import { ThemeToggle } from './components/ThemeToggle';
import { Toast } from './components/Toast';
import { InstagramModal } from './components/InstagramModal';
import {
  formatBrazilianNumber,
  isValidBrazilianMobile,
  normalizeBrazilianNumber,
  sanitizeBrazilianDigits,
} from './lib/phone';

const LINK_STORAGE_KEY = 'meuwa-link';
const THEME_STORAGE_KEY = 'meuwa-theme';
const INSTAGRAM_URL =
  'https://www.instagram.com/arabella.dev?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==';

interface StatusMessage {
  text: string;
  tone: 'success' | 'error' | 'info';
}

const buildWhatsAppLink = ({
  number,
  message,
  prettyFormat,
}: {
  number: string;
  message: string;
  prettyFormat: boolean;
}) => {
  let link = `https://wa.me/${number}`;
  if (message) {
    const encoded = encodeURIComponent(message);
    const formatted = prettyFormat ? encoded : encoded.replace(/%20/g, '+');
    link += `?text=${formatted}`;
  }
  return link;
};

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [prettyFormat, setPrettyFormat] = useState(true);
  const [generatedLink, setGeneratedLink] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [numberError, setNumberError] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' ? 'light' : 'dark';
  });
  type ToastState = { message: string; tone: StatusMessage['tone']; visible: boolean };
  const [toast, setToast] = useState<ToastState>({ message: '', tone: 'info', visible: false });
  const toastTimeoutRef = useRef<number | null>(null);
  const instagramTimerRef = useRef<number | null>(null);
  const [showInstagramModal, setShowInstagramModal] = useState(false);

  useEffect(() => {
    const storedLink = window.localStorage.getItem(LINK_STORAGE_KEY);
    if (storedLink) {
      setGeneratedLink(storedLink);
      setStatus({ text: 'Seu último link foi restaurado.', tone: 'info' });
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (generatedLink) {
      window.localStorage.setItem(LINK_STORAGE_KEY, generatedLink);
    } else {
      window.localStorage.removeItem(LINK_STORAGE_KEY);
    }
  }, [generatedLink]);

  const scheduleInstagramModal = useCallback(() => {
    if (instagramTimerRef.current) {
      window.clearTimeout(instagramTimerRef.current);
      instagramTimerRef.current = null;
    }
    const delay = 20000 + Math.random() * 20000;
    instagramTimerRef.current = window.setTimeout(() => {
      if (Math.random() < 0.6) {
        setShowInstagramModal(true);
      } else {
        scheduleInstagramModal();
      }
    }, delay);
  }, []);

  useEffect(() => {
    scheduleInstagramModal();
  }, [scheduleInstagramModal]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = null;
      }
      if (instagramTimerRef.current) {
        window.clearTimeout(instagramTimerRef.current);
        instagramTimerRef.current = null;
      }
    };
  }, []);

  const triggerToast = useCallback((messageText: string, tone: StatusMessage['tone']) => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    setToast({ message: messageText, tone, visible: true });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
      toastTimeoutRef.current = null;
    }, 2200);
  }, []);

  const handleGenerateLink = () => {
    const sanitized = sanitizeBrazilianDigits(phoneNumber);
    if (!sanitized) {
      const errorText = 'Informe um número com DDD para gerar o link.';
      setNumberError(errorText);
      setStatus({ text: errorText, tone: 'error' });
      triggerToast(errorText, 'error');
      setGeneratedLink('');
      setShowQr(false);
      return;
    }

    if (!isValidBrazilianMobile(sanitized)) {
      const errorText = 'Digite um número de celular brasileiro válido (DDD + 9 dígitos).';
      setNumberError(errorText);
      setStatus({ text: errorText, tone: 'error' });
      triggerToast(errorText, 'error');
      setGeneratedLink('');
      setShowQr(false);
      return;
    }

    setNumberError(null);

    const link = buildWhatsAppLink({
      number: normalizeBrazilianNumber(sanitized),
      message: message.trim(),
      prettyFormat,
    });

    setGeneratedLink(link);
    setShowQr(false);
    setStatus({ text: 'Link gerado com sucesso! ✨', tone: 'success' });
    triggerToast('Link prontinho para compartilhar!', 'success');
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setStatus({ text: 'Link copiado para a área de transferência! ✅', tone: 'success' });
      triggerToast('Link copiado!', 'success');
    } catch (error) {
      const errorText = 'Não foi possível copiar o link. Tente novamente.';
      setStatus({ text: errorText, tone: 'error' });
      triggerToast(errorText, 'error');
    }
  };

  const handleOpenLink = () => {
    if (!generatedLink) return;
    window.open(generatedLink, '_blank', 'noopener,noreferrer');
    setStatus({ text: 'Abrindo o WhatsApp…', tone: 'info' });
  };

  const handleGenerateQr = () => {
    if (!generatedLink) {
      const errorText = 'Gere um link primeiro para criar o QR Code.';
      setStatus({ text: errorText, tone: 'error' });
      triggerToast(errorText, 'error');
      return;
    }
    setShowQr(true);
    setStatus({ text: 'QR Code pronto para escanear!', tone: 'success' });
    triggerToast('QR Code gerado!', 'success');
  };

  const handleCloseInstagramModal = useCallback(() => {
    setShowInstagramModal(false);
    scheduleInstagramModal();
  }, [scheduleInstagramModal]);

  const handleOpenInstagram = useCallback(() => {
    window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer');
    triggerToast('Abrimos o Instagram da Arabella.dev em outra aba! ✨', 'info');
    handleCloseInstagramModal();
  }, [handleCloseInstagramModal, triggerToast]);

  const formattedLinkLabel = useMemo(() => {
    if (!generatedLink) return '';
    return generatedLink.replace('https://', '');
  }, [generatedLink]);

  const handleThemeToggle = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10 text-white">
      <Toast message={toast.message} type={toast.tone} visible={toast.visible} />
      <InstagramModal open={showInstagramModal} onClose={handleCloseInstagramModal} onVisit={handleOpenInstagram} />
      <div className="card relative w-full max-w-md overflow-hidden">
        <div className="absolute inset-x-24 -top-24 h-48 rounded-full bg-accent/40 blur-3xl" aria-hidden />
        <div className="relative z-10 flex flex-col gap-8 p-8">
          <header className="flex flex-col gap-3 text-center">
            <h1 className="text-4xl font-semibold text-white">MeuWa.me</h1>
            <p className="text-base text-white/70">Crie seu link do WhatsApp em segundos.</p>
            <p className="text-xs uppercase tracking-[0.3em] text-accent/80">Desenvolvido por Arabella.dev 💜</p>
          </header>

          <section className="flex flex-col gap-5">
            <InputField
              label="Número de WhatsApp"
              placeholder="Ex.: 11 911111111"
              value={formatBrazilianNumber(phoneNumber)}
              onChange={(event) => {
                const digits = sanitizeBrazilianDigits(event.target.value);
                setPhoneNumber(digits);
                setNumberError(null);
                setStatus(null);
              }}
              inputMode="tel"
              autoComplete="tel"
              error={numberError ?? undefined}
              helperText="Digite DDD + número (somente números). Nós adicionamos o +55 automaticamente."
            />

            <TextAreaField
              label="Mensagem (opcional)"
              placeholder="Oi! Criei esse link do WhatsApp para facilitar nosso contato."
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setStatus(null);
              }}
              helperText="Codificamos a mensagem para chegar perfeita no WhatsApp."
            />

            <CheckboxField
              label="Usar formato amigável"
              description="Substitui espaços por %20 e mantém os caracteres seguros na URL."
              checked={prettyFormat}
              onChange={(event) => {
                setPrettyFormat(event.target.checked);
                setStatus(null);
              }}
            />
          </section>

          <section className="flex flex-col gap-3">
            <Button
              type="button"
              onClick={handleGenerateLink}
              icon={<SendHorizontal size={18} />}
              className="w-full"
            >
              Gerar link
            </Button>

            {generatedLink ? (
              <Button
                type="button"
                onClick={handleCopyLink}
                icon={<Copy size={18} />}
                variant="secondary"
                className="w-full"
              >
                Copiar link
              </Button>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={handleOpenLink}
                icon={<ExternalLink size={18} />}
                variant="ghost"
                isFullWidth
                disabled={!generatedLink}
              >
                Abrir no WhatsApp
              </Button>
              <Button
                type="button"
                onClick={handleGenerateQr}
                icon={<QrCode size={18} />}
                variant="ghost"
                isFullWidth
              >
                Gerar QR Code
              </Button>
            </div>
          </section>

          {generatedLink ? (
            <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80 shadow-inner shadow-black/30 transition-all animate-fade-in">
              <div className="flex items-center gap-2 text-white">
                <LinkIcon size={18} className="text-accent" />
                <span className="text-xs uppercase tracking-wide text-white/60">Seu link</span>
              </div>
              <a
                href={generatedLink}
                target="_blank"
                rel="noreferrer"
                className="break-words text-lg font-semibold text-accent transition hover:text-white"
              >
                {formattedLinkLabel}
              </a>
              {status ? (
                <p
                  className={
                    status.tone === 'success'
                      ? 'text-emerald-300'
                      : status.tone === 'error'
                        ? 'text-red-300'
                        : 'text-white/70'
                  }
                >
                  {status.text}
                </p>
              ) : null}

              {showQr ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
                  <QRCodeCanvas
                    value={generatedLink}
                    bgColor="#121212"
                    fgColor="#ffffff"
                    size={192}
                    includeMargin
                  />
                  <span className="text-xs text-white/50">Escaneie para abrir no WhatsApp.</span>
                </div>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>

      <footer className="mt-10 flex w-full max-w-md flex-col items-center gap-4 text-xs text-white/50">
        <p>© 2025 MeuWa.me — por Arabella.dev</p>
        <ThemeToggle theme={theme} onClick={handleThemeToggle} />
      </footer>

      <span className="fixed bottom-4 right-4 text-xs text-gray-400 transition-colors hover:text-purple-400">
        Made with 💜 by Arabella.dev
      </span>
      <button
        type="button"
        onClick={handleOpenInstagram}
        className="fixed bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 shadow-lg shadow-black/30 transition hover:border-accent/60 hover:text-white"
      >
        <Instagram size={16} />
        Fale com a Arabella.dev
      </button>
    </div>
  );
}

export default App;
