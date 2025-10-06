import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Copy,
  Download,
  ExternalLink,
  Instagram,
  Languages,
  Link as LinkIcon,
  QrCode,
  RefreshCcw,
  Scissors,
  Search,
  SendHorizontal,
  Share2,
  Star,
  Trash2,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from './components/Button';
import { CheckboxField } from './components/CheckboxField';
import { InputField } from './components/InputField';
import { TextAreaField } from './components/TextAreaField';
import { ThemeToggle } from './components/ThemeToggle';
import { Toast } from './components/Toast';
import { InstagramModal } from './components/InstagramModal';
import { Dialog } from './components/Dialog';
import {
  formatBrazilianNumber,
  isValidBrazilianMobile,
  normalizeBrazilianNumber,
  sanitizeBrazilianDigits,
} from './lib/phone';
import {
  translations,
  supportedLanguages,
  type Language,
  type TemplateDefinition,
  type TemplateCategory,
} from './lib/i18n';
import { cn } from './lib/utils';

const LINK_STORAGE_KEY = 'meuwa-link';
const THEME_STORAGE_KEY = 'meuwa-theme';
const INSTAGRAM_URL =
  'https://www.instagram.com/arabella.dev?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==';
const TEMPLATE_STORAGE_KEY = 'meuwa-custom-templates';
const HISTORY_STORAGE_KEY = 'meuwa-history';
const LANGUAGE_STORAGE_KEY = 'meuwa-language';
const TUTORIAL_STORAGE_KEY = 'meuwa-tutorial-complete';
const MAX_HISTORY_ITEMS = 25;
const localeByLanguage: Record<Language, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

const NAME_PLACEHOLDER_REGEX = /\{\{\s*name\s*\}\}/gi;

const getUuid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

type StatusKey =
  | 'idle'
  | 'restored'
  | 'success'
  | 'copied'
  | 'open'
  | 'qr'
  | 'qrError'
  | 'copyError'
  | 'invalidNumber'
  | 'missingNumber';

type StatusTone = 'success' | 'error' | 'info';

interface StatusState {
  key: StatusKey;
  tone: StatusTone;
}

type ToastState = { message: string; tone: StatusTone; visible: boolean };

type UtmParams = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
};

type TemplateFilter = 'all' | TemplateCategory | 'custom';

type TemplateStorage = Partial<Record<Language, TemplateDefinition[]>>;

interface LinkHistoryEntry {
  id: string;
  signature: string;
  number: string;
  link: string;
  shortLink?: string;
  message: string;
  originalMessage: string;
  contactName?: string;
  utm: UtmParams;
  prettyFormat: boolean;
  createdAt: string;
  favorite: boolean;
}

const applyContactName = (message: string, name: string) => {
  if (!message) return '';
  const trimmedName = name.trim();
  if (!NAME_PLACEHOLDER_REGEX.test(message)) {
    return message;
  }
  const replaced = message.replace(NAME_PLACEHOLDER_REGEX, trimmedName || '');
  if (trimmedName) {
    return replaced;
  }
  return replaced.replace(/\s{2,}/g, ' ').replace(/\s+([,.!?])/g, '$1').trim();
};

const buildWhatsAppLink = ({
  number,
  message,
  prettyFormat,
  utmParams,
}: {
  number: string;
  message: string;
  prettyFormat: boolean;
  utmParams: UtmParams;
}) => {
  let link = `https://wa.me/${number}`;
  const trimmed = message.trim();
  if (trimmed) {
    const encoded = encodeURIComponent(trimmed);
    const formatted = prettyFormat ? encoded : encoded.replace(/%20/g, '+');
    link += `?text=${formatted}`;
  }

  const entries = Object.entries(utmParams).filter(([, value]) => value);
  if (entries.length > 0) {
    const prefix = link.includes('?') ? '&' : '?';
    const utmQuery = entries
      .map(([key, value]) => `${key}=${encodeURIComponent(value ?? '')}`)
      .join('&');
    link += `${prefix}${utmQuery}`;
  }

  return link;
};

const createHistorySignature = ({
  number,
  originalMessage,
  contactName,
  utm,
  prettyFormat,
}: {
  number: string;
  originalMessage: string;
  contactName: string;
  utm: UtmParams;
  prettyFormat: boolean;
}) =>
  [
    number,
    originalMessage.trim(),
    contactName.trim(),
    utm.utm_source.trim(),
    utm.utm_medium.trim(),
    utm.utm_campaign.trim(),
    prettyFormat ? '1' : '0',
  ].join('|');

const loadTemplateStorage = (): TemplateStorage => {
  if (typeof window === 'undefined') return {};
  const stored = window.localStorage.getItem(TEMPLATE_STORAGE_KEY);
  if (!stored) return {};
  try {
    const parsed = JSON.parse(stored) as TemplateStorage;
    return parsed ?? {};
  } catch (error) {
    console.warn('Failed to parse template storage', error);
    return {};
  }
};

const loadHistoryStorage = (): LinkHistoryEntry[] => {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as Array<Partial<LinkHistoryEntry>>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry) => typeof entry?.number === 'string' && typeof entry?.link === 'string')
      .map((entry) => {
        const utm: UtmParams = {
          utm_source: entry?.utm?.utm_source ?? '',
          utm_medium: entry?.utm?.utm_medium ?? '',
          utm_campaign: entry?.utm?.utm_campaign ?? '',
        };
        const prettyFormat = entry?.prettyFormat ?? true;
        const originalMessage = entry?.originalMessage ?? entry?.message ?? '';
        const signature =
          entry?.signature ??
          createHistorySignature({
            number: entry.number!,
            originalMessage,
            contactName: entry?.contactName ?? '',
            utm,
            prettyFormat,
          });
        return {
          id: entry?.id ?? getUuid(),
          signature,
          number: entry.number!,
          link: entry.link!,
          shortLink: entry?.shortLink ?? undefined,
          message: entry?.message ?? originalMessage,
          originalMessage,
          contactName: entry?.contactName ?? undefined,
          utm,
          prettyFormat,
          createdAt: entry?.createdAt ?? new Date().toISOString(),
          favorite: Boolean(entry?.favorite),
        } satisfies LinkHistoryEntry;
      });
  } catch (error) {
    console.warn('Failed to parse history storage', error);
    return [];
  }
};

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'pt';
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    return stored && ['pt', 'en', 'es'].includes(stored) ? stored : 'pt';
  });
  const text = translations[language];

  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [prettyFormat, setPrettyFormat] = useState(true);
  const [generatedLink, setGeneratedLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [contactName, setContactName] = useState('');
  const [utm, setUtm] = useState<UtmParams>({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
  });
  const [showQr, setShowQr] = useState(false);
  const [numberError, setNumberError] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusState>({ key: 'idle', tone: 'info' });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' ? 'light' : 'dark';
  });
  const [toast, setToast] = useState<ToastState>({ message: '', tone: 'info', visible: false });
  const toastTimeoutRef = useRef<number | null>(null);
  const instagramTimerRef = useRef<number | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const advancedSectionRef = useRef<HTMLDivElement | null>(null);
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [isShortening, setIsShortening] = useState(false);
  const [history, setHistory] = useState<LinkHistoryEntry[]>(() => loadHistoryStorage());
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [historySearch, setHistorySearch] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<TemplateStorage>(() => loadTemplateStorage());
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<TemplateFilter>('all');
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateMessage, setNewTemplateMessage] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showNameInfo, setShowNameInfo] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const isDark = theme === 'dark';
  const primaryTextClass = isDark ? 'text-white' : 'text-slate-900';
  const secondaryTextClass = isDark ? 'text-white/70' : 'text-slate-600';
  const mutedTextClass = isDark ? 'text-white/60' : 'text-slate-500';
  const subtleTextClass = isDark ? 'text-white/50' : 'text-slate-500';
  const faintTextClass = isDark ? 'text-white/40' : 'text-slate-400';
  const strongTextClass = isDark ? 'text-white/80' : 'text-slate-800';
  const surfaceBaseClass = isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white';
  const surfaceMutedClass = isDark ? 'border-white/10 bg-zinc-900/70' : 'border-slate-200 bg-slate-100';
  const surfaceSoftClass = isDark ? 'border-white/10 bg-zinc-900/60' : 'border-slate-200 bg-slate-50';
  const accentLinkClass = isDark ? 'text-accent hover:text-white' : 'text-indigo-600 hover:text-indigo-800';
  const pillClass = isDark
    ? 'border-white/10 bg-white/10 text-white/70 hover:border-accent hover:text-white'
    : 'border-slate-300 bg-slate-100 text-slate-600 hover:border-indigo-400 hover:text-slate-900';
  const qrColors = isDark
    ? { bg: '#121212', fg: '#ffffff' }
    : { bg: '#ffffff', fg: '#0f172a' };
  const tutorialSteps = text.tutorial.steps;
  const totalTutorialSteps = tutorialSteps.length;
  const hasTutorialSteps = totalTutorialSteps > 0;
  const safeTutorialIndex = hasTutorialSteps ? Math.min(tutorialStep, totalTutorialSteps - 1) : 0;
  const currentTutorialStep =
    hasTutorialSteps && tutorialSteps[safeTutorialIndex]
      ? tutorialSteps[safeTutorialIndex]
      : { title: '', description: '' };
  const tutorialProgress = useMemo(() => {
    if (!hasTutorialSteps) {
      return '';
    }
    return text.tutorial.progressLabel
      .replace('{{current}}', String(safeTutorialIndex + 1))
      .replace('{{total}}', String(totalTutorialSteps));
  }, [hasTutorialSteps, safeTutorialIndex, text.tutorial.progressLabel, totalTutorialSteps]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const tutorialSeen = window.localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (!tutorialSeen) {
      setTutorialStep(0);
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => {
    const storedLink = typeof window !== 'undefined' ? window.localStorage.getItem(LINK_STORAGE_KEY) : null;
    if (storedLink) {
      setGeneratedLink(storedLink);
      setStatus({ key: 'restored', tone: 'info' });
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      const [first] = history;
      setActiveHistoryId((current) => current ?? first.id);
    }
  }, [history.length]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(customTemplates));
    }
  }, [customTemplates]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      document.documentElement.classList.toggle('dark', isDark);
      document.documentElement.classList.toggle('light', !isDark);
    }
  }, [isDark, theme]);

  useEffect(() => {
    if (generatedLink) {
      window.localStorage.setItem(LINK_STORAGE_KEY, generatedLink);
    } else {
      window.localStorage.removeItem(LINK_STORAGE_KEY);
    }
    const relatedEntry = history.find((entry) => entry.link === generatedLink);
    setShortLink(relatedEntry?.shortLink ?? '');
    setActiveHistoryId(relatedEntry?.id ?? null);
  }, [generatedLink, history]);

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

  const triggerToast = useCallback((messageText: string, tone: StatusTone) => {
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
    const digits = sanitizeBrazilianDigits(phoneNumber);
    if (!digits) {
      setNumberError(text.statusMissingNumber);
      setStatus({ key: 'missingNumber', tone: 'error' });
      triggerToast(text.statusMissingNumber, 'error');
      setGeneratedLink('');
      setShowQr(false);
      return;
    }

    if (!isValidBrazilianMobile(digits)) {
      setNumberError(text.statusInvalidNumber);
      setStatus({ key: 'invalidNumber', tone: 'error' });
      triggerToast(text.statusInvalidNumber, 'error');
      setGeneratedLink('');
      setShowQr(false);
      return;
    }

    setNumberError(null);

    const normalized = normalizeBrazilianNumber(digits);
    const messageWithName = applyContactName(message, contactName);

    const link = buildWhatsAppLink({
      number: normalized,
      message: messageWithName,
      prettyFormat,
      utmParams: utm,
    });

    const signature = createHistorySignature({
      number: digits,
      originalMessage: message,
      contactName,
      utm,
      prettyFormat,
    });

    setGeneratedLink(link);
    setShowQr(false);
    setShortLink('');
    setStatus({ key: 'success', tone: 'success' });
    triggerToast(text.toastLinkReady, 'success');

    setHistory((current) => {
      const existing = current.find((item) => item.signature === signature);
      const createdAt = new Date().toISOString();
      if (existing) {
        const updated: LinkHistoryEntry = {
          ...existing,
          link,
          message: messageWithName,
          originalMessage: message,
          contactName: contactName.trim() || undefined,
          utm,
          prettyFormat,
          createdAt,
        };
        setActiveHistoryId(existing.id);
        return [updated, ...current.filter((item) => item.id !== existing.id)].slice(0, MAX_HISTORY_ITEMS);
      }

      const entry: LinkHistoryEntry = {
        id: getUuid(),
        signature,
        number: digits,
        link,
        shortLink: undefined,
        message: messageWithName,
        originalMessage: message,
        contactName: contactName.trim() || undefined,
        utm,
        prettyFormat,
        createdAt,
        favorite: false,
      };
      setActiveHistoryId(entry.id);
      return [entry, ...current].slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const handleCopyLink = async (linkToCopy?: string) => {
    const targetLink = linkToCopy ?? shortLink ?? generatedLink;
    if (!targetLink) return;
    if (!navigator.clipboard) {
      setStatus({ key: 'copyError', tone: 'error' });
      triggerToast(text.statusCopyError, 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(targetLink);
      setStatus({ key: 'copied', tone: 'success' });
      triggerToast(text.toastLinkCopied, 'success');
    } catch (error) {
      setStatus({ key: 'copyError', tone: 'error' });
      triggerToast(text.statusCopyError, 'error');
    }
  };

  const handleOpenLink = (linkToOpen?: string) => {
    const target = linkToOpen ?? shortLink ?? generatedLink;
    if (!target) return;
    window.open(target, '_blank', 'noopener,noreferrer');
    setStatus({ key: 'open', tone: 'info' });
  };

  const handleGenerateQr = () => {
    if (!generatedLink) {
      setStatus({ key: 'qrError', tone: 'error' });
      triggerToast(text.statusQrError, 'error');
      return;
    }
    setShowQr(true);
    setStatus({ key: 'qr', tone: 'success' });
    triggerToast(text.toastQrReady, 'success');
  };

  const handleDownloadQr = () => {
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'meuwa-qr.png';
    link.click();
  };

  const handleShareQr = async () => {
    if (!generatedLink) return;
    if (!navigator.share) {
      triggerToast(text.toastShareUnsupported, 'info');
      return;
    }

    try {
      const canvas = qrCanvasRef.current;
      if (canvas && navigator.canShare) {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (blob) {
          const file = new File([blob], 'meuwa-qr.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: text.qrShareTitle,
              text: text.qrShareText,
            });
            triggerToast(text.toastShareSuccess, 'success');
            return;
          }
        }
      }

      await navigator.share({
        title: text.qrShareTitle,
        text: text.qrShareText,
        url: shortLink || generatedLink,
      });
      triggerToast(text.toastShareSuccess, 'success');
    } catch (error) {
      triggerToast(text.toastShareError, 'error');
    }
  };

  const handleCloseInstagramModal = useCallback(() => {
    setShowInstagramModal(false);
    scheduleInstagramModal();
  }, [scheduleInstagramModal]);

  const handleOpenInstagram = useCallback(() => {
    window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer');
    triggerToast(text.instagramToast, 'info');
    handleCloseInstagramModal();
  }, [handleCloseInstagramModal, text.instagramToast, triggerToast]);

  const handleCompleteTutorial = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TUTORIAL_STORAGE_KEY, '1');
    }
    setShowTutorial(false);
    setTutorialStep(0);
  }, []);

  const handleSkipTutorial = useCallback(() => {
    handleCompleteTutorial();
  }, [handleCompleteTutorial]);

  const handleNextTutorial = useCallback(() => {
    setTutorialStep((current) => {
      if (!hasTutorialSteps) {
        handleCompleteTutorial();
        return current;
      }
      if (current >= totalTutorialSteps - 1) {
        handleCompleteTutorial();
        return current;
      }
      return current + 1;
    });
  }, [handleCompleteTutorial, hasTutorialSteps, totalTutorialSteps]);

  const handlePreviousTutorial = useCallback(() => {
    setTutorialStep((current) => (current > 0 ? current - 1 : 0));
  }, []);

  const handleOpenAdvancedFromHelp = useCallback(() => {
    setShowAdvanced(true);
    setShowNameInfo(false);
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        advancedSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }, []);

  const formattedLinkLabel = useMemo(() => {
    if (!generatedLink) return '';
    return (shortLink || generatedLink).replace('https://', '');
  }, [generatedLink, shortLink]);

  const handleThemeToggle = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const availableTemplates = useMemo(() => {
    const defaults = text.templateLibrary.defaultTemplates;
    const customs = customTemplates[language] ?? [];
    return [...defaults, ...customs];
  }, [customTemplates, language, text.templateLibrary.defaultTemplates]);

  const filteredTemplates = useMemo(() => {
    if (selectedTemplateCategory === 'all') return availableTemplates;
    return availableTemplates.filter((template) => template.category === selectedTemplateCategory);
  }, [availableTemplates, selectedTemplateCategory]);

  const getTemplateCategoryLabel = useCallback(
    (category: TemplateFilter) => {
      if (category === 'all') return text.templateLibrary.categories.all;
      if (category === 'custom') return text.templateLibrary.categories.custom;
      return text.templateLibrary.categories[category];
    },
    [text.templateLibrary.categories],
  );

  const handleApplyTemplate = (template: TemplateDefinition) => {
    setMessage(template.message);
    setStatus({ key: 'idle', tone: 'info' });
    triggerToast(text.toastTemplateApplied, 'success');
  };

  const handleAddTemplate = () => {
    if (!newTemplateTitle.trim() || !newTemplateMessage.trim()) return;
    const template: TemplateDefinition = {
      id: getUuid(),
      category: 'custom',
      title: newTemplateTitle.trim(),
      message: newTemplateMessage.trim(),
    };
    setCustomTemplates((current) => {
      const next = { ...current };
      const previous = next[language] ?? [];
      next[language] = [template, ...previous];
      return next;
    });
    setNewTemplateTitle('');
    setNewTemplateMessage('');
    setSelectedTemplateCategory('custom');
    triggerToast(text.toastTemplateAdded, 'success');
  };

  const handleRemoveTemplate = (templateId: string) => {
    setCustomTemplates((current) => {
      const next = { ...current };
      const currentTemplates = next[language] ?? [];
      next[language] = currentTemplates.filter((template) => template.id !== templateId);
      return next;
    });
    triggerToast(text.toastTemplateRemoved, 'info');
  };

  const filteredHistory = useMemo(() => {
    const query = historySearch.trim().toLowerCase();
    const items = history.filter((entry) => {
      if (showFavoritesOnly && !entry.favorite) return false;
      if (!query) return true;
      const formattedNumber = formatBrazilianNumber(entry.number);
      return [
        entry.message.toLowerCase(),
        entry.originalMessage.toLowerCase(),
        entry.contactName?.toLowerCase() ?? '',
        formattedNumber.toLowerCase(),
        entry.link.toLowerCase(),
        entry.shortLink?.toLowerCase() ?? '',
      ].some((value) => value.includes(query));
    });
    return items;
  }, [history, historySearch, showFavoritesOnly]);

  const handleToggleFavorite = (id: string) => {
    setHistory((current) =>
      current.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              favorite: !entry.favorite,
            }
          : entry,
      ),
    );
  };

  const handleRemoveHistoryEntry = (id: string) => {
    setHistory((current) => current.filter((entry) => entry.id !== id));
    if (activeHistoryId === id) {
      setActiveHistoryId(null);
      setGeneratedLink('');
      setShortLink('');
      setStatus({ key: 'idle', tone: 'info' });
    }
  };

  const handleReuseHistoryEntry = (entry: LinkHistoryEntry) => {
    setPhoneNumber(entry.number);
    setMessage(entry.originalMessage);
    setContactName(entry.contactName ?? '');
    setPrettyFormat(entry.prettyFormat);
    setUtm(entry.utm);
    setGeneratedLink(entry.link);
    setShortLink(entry.shortLink ?? '');
    setShowQr(false);
    setActiveHistoryId(entry.id);
    setStatus({ key: 'restored', tone: 'info' });
    triggerToast(text.toastHistoryRestored, 'info');
  };

  const handleClearHistory = () => {
    setHistory([]);
    setActiveHistoryId(null);
    setGeneratedLink('');
    setShortLink('');
    setStatus({ key: 'idle', tone: 'info' });
    triggerToast(text.toastHistoryCleared, 'info');
  };

  const handleShortenLink = async () => {
    if (!generatedLink) return;
    setIsShortening(true);
    try {
      const response = await fetch(
        `https://is.gd/create.php?format=json&url=${encodeURIComponent(generatedLink)}`,
      );
      if (!response.ok) {
        throw new Error('Shortener request failed');
      }
      const data = (await response.json()) as { shorturl?: string };
      if (!data.shorturl) {
        throw new Error('Missing short URL');
      }
      setShortLink(data.shorturl);
      if (activeHistoryId) {
        setHistory((current) =>
          current.map((entry) =>
            entry.id === activeHistoryId
              ? {
                  ...entry,
                  shortLink: data.shorturl,
                }
              : entry,
          ),
        );
      }
      triggerToast(text.toastShortSuccess, 'success');
    } catch (error) {
      console.error(error);
      triggerToast(text.toastShortError, 'error');
    } finally {
      setIsShortening(false);
    }
  };

  const resolveStatusText = useCallback(
    (key: StatusKey) => {
      switch (key) {
        case 'idle':
          return text.statusIdle;
        case 'restored':
          return text.statusRestored;
        case 'success':
          return text.statusSuccess;
        case 'copied':
          return text.statusCopied;
        case 'open':
          return text.statusOpen;
        case 'qr':
          return text.statusQr;
        case 'qrError':
          return text.statusQrError;
        case 'copyError':
          return text.statusCopyError;
        case 'invalidNumber':
          return text.statusInvalidNumber;
        case 'missingNumber':
          return text.statusMissingNumber;
        default:
          return text.statusIdle;
      }
    },
    [text],
  );

  const statusText = resolveStatusText(status.key);
  return (
    <div
      className={cn(
        'flex min-h-screen flex-col items-center justify-center px-4 py-10 transition-colors duration-300',
        isDark ? 'bg-background text-white' : 'bg-slate-100 text-slate-900',
      )}
    >
      <Toast message={toast.message} type={toast.tone} visible={toast.visible} theme={theme} />
      <InstagramModal
        open={showInstagramModal}
        onClose={handleCloseInstagramModal}
        onVisit={handleOpenInstagram}
        theme={theme}
      />
      <Dialog
        open={showNameInfo}
        onClose={() => setShowNameInfo(false)}
        theme={theme}
        title={text.help.nameInfoTitle}
        description={text.help.nameInfoDescription}
        closeLabel={text.common.close}
        footer={
          <>
            <Button
              theme={theme}
              type="button"
              variant="ghost"
              onClick={() => setShowNameInfo(false)}
            >
              {text.common.close}
            </Button>
            <Button theme={theme} type="button" onClick={handleOpenAdvancedFromHelp}>
              {text.help.nameInfoAction}
            </Button>
          </>
        }
      />
      <Dialog
        open={showTutorial}
        onClose={handleCompleteTutorial}
        theme={theme}
        title={text.tutorial.title}
        description={text.tutorial.description}
        size="lg"
        closeLabel={text.common.close}
        footer={
          hasTutorialSteps ? (
            <>
              <Button
                theme={theme}
                type="button"
                variant="ghost"
                onClick={handlePreviousTutorial}
                disabled={safeTutorialIndex === 0}
              >
                {text.tutorial.previous}
              </Button>
              <Button theme={theme} type="button" onClick={handleNextTutorial}>
                {safeTutorialIndex === totalTutorialSteps - 1
                  ? text.tutorial.finish
                  : text.tutorial.next}
              </Button>
            </>
          ) : (
            <Button theme={theme} type="button" onClick={handleCompleteTutorial}>
              {text.tutorial.finish}
            </Button>
          )
        }
      >
        {hasTutorialSteps ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  'text-xs font-semibold uppercase tracking-wide',
                  isDark ? 'text-white/60' : 'text-slate-500',
                )}
              >
                {tutorialProgress}
              </span>
              <button
                type="button"
                onClick={handleSkipTutorial}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                  isDark
                    ? 'text-accent hover:bg-white/10'
                    : 'text-indigo-600 hover:bg-indigo-50',
                )}
              >
                {text.tutorial.skip}
              </button>
            </div>
            <div
              className={cn(
                'rounded-2xl border p-5 transition-colors',
                isDark
                  ? 'border-white/10 bg-white/5 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-800',
              )}
            >
              <h3 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-slate-900')}>
                {currentTutorialStep.title}
              </h3>
              <p className={cn('mt-2 text-sm leading-relaxed', isDark ? 'text-white/70' : 'text-slate-600')}>
                {currentTutorialStep.description}
              </p>
            </div>
          </div>
        ) : null}
      </Dialog>
      <div className="card relative w-full max-w-4xl overflow-hidden">
        <div className="absolute inset-x-24 -top-24 h-48 rounded-full bg-accent/40 blur-3xl" aria-hidden />
        <div className="relative z-10 flex flex-col gap-8 p-8">
          <header className="flex flex-col gap-3 text-center">
            <div className="flex flex-col items-start gap-3 text-left sm:flex-row sm:items-center sm:justify-between">
              <div
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3 py-1 text-xs shadow-inner transition',
                  isDark
                    ? 'border-white/10 bg-white/5 text-white/70 shadow-black/40'
                    : 'border-slate-300 bg-white text-slate-600 shadow-slate-200',
                )}
              >
                <Languages size={14} />
                <label htmlFor="language-select" className="sr-only">
                  {text.languageSwitcher.label}
                </label>
                <select
                  id="language-select"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as Language)}
                  className={cn(
                    'bg-transparent text-xs font-semibold uppercase tracking-wide focus:outline-none',
                    isDark ? 'text-white' : 'text-slate-700',
                  )}
                >
                  {supportedLanguages.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className={cn(isDark ? 'bg-zinc-900 text-white' : 'bg-white text-slate-900')}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <ThemeToggle theme={theme} onClick={handleThemeToggle} />
            </div>
            <h1 className={cn('text-4xl font-semibold', primaryTextClass)}>{text.appTitle}</h1>
            <p className={cn('text-base', secondaryTextClass)}>{text.heroTagline}</p>
            <p className={cn('text-sm', mutedTextClass)}>{text.heroSubtitle}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-accent/80">{text.developerCredit}</p>
          </header>

          <section className="grid gap-6 lg:grid-cols-2" aria-label={text.heroTagline}>
            <div className="flex flex-col gap-5">
              <InputField
                theme={theme}
                label={text.numberLabel}
                placeholder={text.numberPlaceholder}
                value={formatBrazilianNumber(phoneNumber)}
                onChange={(event) => {
                  const digits = sanitizeBrazilianDigits(event.target.value);
                  setPhoneNumber(digits);
                  setNumberError(null);
                  setStatus({ key: 'idle', tone: 'info' });
                }}
                inputMode="tel"
                autoComplete="tel"
                error={numberError ?? undefined}
                helperText={text.numberHelper}
              />

              <TextAreaField
                theme={theme}
                label={text.messageLabel}
                labelAdornment={
                  <button
                    type="button"
                    onClick={() => setShowNameInfo(true)}
                    className={cn(
                      'inline-flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-bold leading-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                      isDark
                        ? 'border-sky-400/70 text-sky-100 hover:bg-sky-500/20 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900'
                        : 'border-sky-500 text-sky-600 hover:bg-sky-50 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                    )}
                    aria-label={text.help.nameInfoAria}
                  >
                    ?
                  </button>
                }
                placeholder={text.messagePlaceholder}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  setStatus({ key: 'idle', tone: 'info' });
                }}
                helperText={text.messageHelper}
              />

              <CheckboxField
                theme={theme}
                label={text.formatLabel}
                description={text.formatDescription}
                checked={prettyFormat}
                onChange={(event) => {
                  setPrettyFormat(event.target.checked);
                  setStatus({ key: 'idle', tone: 'info' });
                }}
              />

              <div
                ref={advancedSectionRef}
                className={cn(
                  'flex flex-col gap-4 rounded-2xl border p-5 transition-colors',
                  isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className={cn('flex items-center gap-2', primaryTextClass)}>
                    <RefreshCcw size={18} className="text-accent" />
                    <h2 className="text-sm font-semibold uppercase tracking-wide">{text.advanced.title}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced((current) => !current)}
                    className={cn(
                      'text-xs font-semibold uppercase tracking-wide transition',
                      isDark ? 'text-accent hover:text-white' : 'text-indigo-600 hover:text-indigo-800',
                    )}
                  >
                    {showAdvanced ? text.advanced.toggleHide : text.advanced.toggleShow}
                  </button>
                </div>
                <p className={cn('text-xs', mutedTextClass)}>{text.advanced.description}</p>
                {showAdvanced ? (
                  <div className="flex flex-col gap-4">
                    <InputField
                      theme={theme}
                      label={text.advanced.contactNameLabel}
                      value={contactName}
                      onChange={(event) => {
                        setContactName(event.target.value);
                        setStatus({ key: 'idle', tone: 'info' });
                      }}
                      helperText={text.advanced.contactNameHelper}
                    />
                    <div
                      className={cn(
                        'flex flex-col gap-2 rounded-2xl border p-4 transition-colors',
                        surfaceMutedClass,
                      )}
                    >
                      <p className={cn('text-xs font-semibold uppercase tracking-wide', secondaryTextClass)}>
                        {text.advanced.utmTitle}
                      </p>
                      <p className={cn('text-xs', faintTextClass)}>{text.advanced.utmHelper}</p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <InputField
                          theme={theme}
                          label={text.advanced.utmSource}
                          value={utm.utm_source}
                          onChange={(event) => {
                            setUtm((prev) => ({ ...prev, utm_source: event.target.value }));
                            setStatus({ key: 'idle', tone: 'info' });
                          }}
                        />
                        <InputField
                          theme={theme}
                          label={text.advanced.utmMedium}
                          value={utm.utm_medium}
                          onChange={(event) => {
                            setUtm((prev) => ({ ...prev, utm_medium: event.target.value }));
                            setStatus({ key: 'idle', tone: 'info' });
                          }}
                        />
                        <InputField
                          theme={theme}
                          label={text.advanced.utmCampaign}
                          value={utm.utm_campaign}
                          onChange={(event) => {
                            setUtm((prev) => ({ ...prev, utm_campaign: event.target.value }));
                            setStatus({ key: 'idle', tone: 'info' });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  theme={theme}
                  type="button"
                  onClick={handleGenerateLink}
                  icon={<SendHorizontal size={18} />}
                  className="w-full"
                >
                  {text.generateButton}
                </Button>

                {generatedLink ? (
                  <Button
                    theme={theme}
                    type="button"
                    onClick={() => handleCopyLink(generatedLink)}
                    icon={<Copy size={18} />}
                    variant="secondary"
                    className="w-full"
                  >
                    {text.copyButton}
                  </Button>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    theme={theme}
                    type="button"
                    onClick={() => handleOpenLink(generatedLink)}
                    icon={<ExternalLink size={18} />}
                    variant="ghost"
                    isFullWidth
                    disabled={!generatedLink}
                  >
                    {text.openButton}
                  </Button>
                  <Button
                    theme={theme}
                    type="button"
                    onClick={handleGenerateQr}
                    icon={<QrCode size={18} />}
                    variant="ghost"
                    isFullWidth
                  >
                    {text.qrButton}
                  </Button>
                </div>

                {generatedLink ? (
                  <Button
                    theme={theme}
                    type="button"
                    onClick={handleShortenLink}
                    icon={<Scissors size={18} />}
                    variant="ghost"
                    className="w-full"
                    disabled={isShortening}
                  >
                    {isShortening ? text.shortener.shortening : text.shortener.shorten}
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <section
                className={cn(
                  'flex flex-col gap-3 rounded-2xl border p-5 text-sm transition-all',
                  isDark
                    ? 'border-white/10 bg-white/5 text-white/80 shadow-inner shadow-black/30'
                    : 'border-slate-200 bg-white text-slate-700 shadow-lg shadow-slate-200/60',
                )}
                aria-live="polite"
                aria-atomic="true"
              >
                <div className={cn('flex items-center gap-2', primaryTextClass)}>
                  <LinkIcon size={18} className="text-accent" />
                  <span className={cn('text-xs uppercase tracking-wide', mutedTextClass)}>
                    {text.linkSectionLabel}
                  </span>
                </div>
                <p className={cn('text-xs', subtleTextClass)}>
                  <span className={cn('font-semibold', secondaryTextClass)}>{text.statusLiveLabel}</span> {statusText}
                </p>
                {generatedLink ? (
                  <>
                    <a
                      href={shortLink || generatedLink}
                      target="_blank"
                      rel="noreferrer"
                      className={cn('break-words text-lg font-semibold transition', accentLinkClass)}
                    >
                      {formattedLinkLabel}
                    </a>
                    <div className={cn('flex flex-wrap items-center gap-2 text-xs', mutedTextClass)}>
                      <button
                        type="button"
                        onClick={() => handleCopyLink(shortLink || generatedLink)}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition',
                          pillClass,
                        )}
                      >
                        <Copy size={12} />
                        {text.copyButton}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenLink(shortLink || generatedLink)}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition',
                          pillClass,
                        )}
                      >
                        <ExternalLink size={12} />
                        {text.openButton}
                      </button>
                    </div>
                    {shortLink ? (
                      <div
                        className={cn(
                          'rounded-2xl border p-3 text-xs',
                          isDark
                            ? 'border-accent/40 bg-accent/10 text-white'
                            : 'border-indigo-200 bg-indigo-50 text-indigo-700',
                        )}
                      >
                        <p className="font-semibold uppercase tracking-wide text-accent/80">{text.shortener.label}</p>
                        <p className={cn('break-words text-sm', strongTextClass)}>{shortLink}</p>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <p className={cn('text-sm', mutedTextClass)}>{text.statusIdle}</p>
                )}

                {showQr ? (
                  <div
                    className={cn(
                      'flex flex-col items-center gap-3 rounded-2xl border p-4 transition-colors',
                      surfaceSoftClass,
                    )}
                  >
                    <QRCodeCanvas
                      ref={qrCanvasRef}
                      value={shortLink || generatedLink}
                      bgColor={qrColors.bg}
                      fgColor={qrColors.fg}
                      size={192}
                      includeMargin
                    />
                    <span className={cn('text-xs', subtleTextClass)}>{text.qrHelper}</span>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button
                        theme={theme}
                        type="button"
                        onClick={handleDownloadQr}
                        icon={<Download size={16} />}
                        variant="secondary"
                      >
                        {text.qrDownload}
                      </Button>
                      <Button
                        theme={theme}
                        type="button"
                        onClick={handleShareQr}
                        icon={<Share2 size={16} />}
                        variant="ghost"
                      >
                        {text.qrShare}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </section>

              <section
                className={cn(
                  'flex flex-col gap-4 rounded-2xl border p-5 transition-colors',
                  surfaceBaseClass,
                )}
              >
                <header className="flex flex-col gap-1">
                  <h2 className={cn('text-sm font-semibold uppercase tracking-wide', strongTextClass)}>
                    {text.templateLibrary.title}
                  </h2>
                  <p className={cn('text-xs', subtleTextClass)}>{text.templateLibrary.description}</p>
                </header>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'sales', 'support', 'collections', 'followup', 'custom'] as TemplateFilter[]).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedTemplateCategory(category)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition',
                        selectedTemplateCategory === category
                          ? isDark
                            ? 'bg-accent text-white'
                            : 'bg-indigo-600 text-white'
                          : isDark
                            ? 'border border-white/10 bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                            : 'border border-slate-300 bg-white text-slate-600 hover:border-indigo-400 hover:text-slate-900',
                      )}
                    >
                      {getTemplateCategoryLabel(category)}
                    </button>
                  ))}
                </div>
                <div className="flex max-h-48 flex-col gap-3 overflow-y-auto pr-1">
                  {filteredTemplates.length === 0 ? (
                    <p className={cn('text-xs', subtleTextClass)}>{text.templateLibrary.emptyCustom}</p>
                  ) : (
                    filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={cn(
                          'flex flex-col gap-2 rounded-2xl border p-3 transition-colors',
                          surfaceMutedClass,
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn('text-sm font-semibold', strongTextClass)}>{template.title}</p>
                          {template.category === 'custom' ? (
                            <button
                              type="button"
                              onClick={() => handleRemoveTemplate(template.id)}
                              className={cn(
                                'text-xs uppercase tracking-wide transition',
                                isDark ? 'text-red-300 hover:text-red-200' : 'text-red-500 hover:text-red-600',
                              )}
                            >
                              {text.templateLibrary.removeButton}
                            </button>
                          ) : null}
                        </div>
                        <p className={cn('text-xs', mutedTextClass)}>{template.message}</p>
                        <Button
                          theme={theme}
                          type="button"
                          onClick={() => handleApplyTemplate(template)}
                          icon={<Copy size={16} />}
                          variant="ghost"
                        >
                          {text.templateLibrary.apply}
                        </Button>
                      </div>
                    ))
                  )}
                </div>
                <div
                  className={cn(
                    'flex flex-col gap-2 rounded-2xl border border-dashed p-4 transition-colors',
                    isDark ? 'border-white/20 bg-white/5' : 'border-slate-300 bg-slate-100',
                  )}
                >
                  <h3 className={cn('text-xs font-semibold uppercase tracking-wide', secondaryTextClass)}>
                    {text.templateLibrary.addCustomTitle}
                  </h3>
                  <p className={cn('text-xs', subtleTextClass)}>{text.templateLibrary.addCustomDescription}</p>
                  <InputField
                    theme={theme}
                    label={text.templateLibrary.customNamePlaceholder}
                    value={newTemplateTitle}
                    onChange={(event) => setNewTemplateTitle(event.target.value)}
                  />
                  <TextAreaField
                    theme={theme}
                    label={text.templateLibrary.customMessagePlaceholder}
                    value={newTemplateMessage}
                    onChange={(event) => setNewTemplateMessage(event.target.value)}
                  />
                  <Button
                    theme={theme}
                    type="button"
                    onClick={handleAddTemplate}
                    icon={<Copy size={16} />}
                    disabled={!newTemplateTitle.trim() || !newTemplateMessage.trim()}
                  >
                    {text.templateLibrary.addButton}
                  </Button>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>

      <section
        className={cn(
          'mt-8 flex w-full max-w-5xl flex-col gap-4 rounded-2xl border p-6 transition-colors',
          surfaceBaseClass,
          isDark ? 'text-white' : 'text-slate-900',
        )}
      >
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className={cn('text-lg font-semibold', primaryTextClass)}>{text.history.title}</h2>
            <p className={cn('text-xs', mutedTextClass)}>{text.history.subtitle}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div
              className={cn(
                'flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition',
                isDark
                  ? 'border-white/10 bg-zinc-900/70 text-white/60 shadow-inner shadow-black/30'
                  : 'border-slate-300 bg-white text-slate-600 shadow-sm shadow-slate-200',
              )}
            >
              <Search size={14} />
              <input
                type="search"
                value={historySearch}
                onChange={(event) => setHistorySearch(event.target.value)}
                placeholder={text.history.searchPlaceholder}
                className={cn(
                  'w-48 bg-transparent text-xs focus:outline-none',
                  isDark ? 'text-white placeholder:text-white/30' : 'text-slate-700 placeholder:text-slate-400',
                )}
              />
            </div>
            <label className={cn('flex items-center gap-2 text-xs', mutedTextClass)}>
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(event) => setShowFavoritesOnly(event.target.checked)}
                className={cn(
                  'h-4 w-4 rounded border',
                  isDark ? 'border-white/30 bg-transparent' : 'border-slate-400 bg-white',
                )}
              />
              {text.history.favoritesOnly}
            </label>
            <button
              type="button"
              onClick={handleClearHistory}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition',
                isDark
                  ? 'border-white/10 bg-white/10 text-white/70 hover:border-red-300 hover:text-red-200'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-red-400 hover:text-red-600',
              )}
            >
              <Trash2 size={14} />
              {text.history.clearAll}
            </button>
          </div>
        </header>

        {filteredHistory.length === 0 ? (
          <p className={cn('rounded-2xl border p-4 text-sm transition-colors', surfaceSoftClass, mutedTextClass)}>
            {text.history.empty}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {filteredHistory.map((entry) => {
              const isActive = entry.id === activeHistoryId;
              const displayNumber = `+55 ${formatBrazilianNumber(entry.number)}`;
              return (
                <li
                  key={entry.id}
                  className={cn(
                    'flex flex-col gap-3 rounded-2xl border p-4 transition',
                    surfaceMutedClass,
                    isActive && (isDark ? 'border-accent/60 bg-accent/10' : 'border-indigo-300 bg-indigo-50'),
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className={cn('text-xs uppercase tracking-wide', mutedTextClass)}>{displayNumber}</span>
                      {entry.contactName ? (
                        <span className={cn('text-sm font-semibold', primaryTextClass)}>{entry.contactName}</span>
                      ) : null}
                    </div>
                    <div className={cn('flex items-center gap-2 text-xs', mutedTextClass)}>
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(entry.id)}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full border px-3 py-1 uppercase tracking-wide transition',
                          entry.favorite
                            ? isDark
                              ? 'border-accent/60 bg-accent/20 text-white'
                              : 'border-indigo-300 bg-indigo-100 text-indigo-700'
                            : isDark
                              ? 'border-white/10 bg-white/10 text-white/70 hover:border-accent/60 hover:text-white'
                              : 'border-slate-300 bg-white text-slate-600 hover:border-indigo-400 hover:text-slate-900',
                        )}
                      >
                        <Star size={14} className={entry.favorite ? 'fill-current' : undefined} />
                        {entry.favorite ? text.history.unfavoriteLabel : text.history.favoriteLabel}
                      </button>
                      <span className={cn('text-[11px]', faintTextClass)}>
                        {text.history.savedAt} {new Date(entry.createdAt).toLocaleString(localeByLanguage[language])}
                      </span>
                    </div>
                  </div>
                  <p className={cn('text-sm', secondaryTextClass)}>{entry.message}</p>
                  <div className={cn('flex flex-wrap items-center gap-2 text-xs', mutedTextClass)}>
                    <span
                      className={cn(
                        'rounded-full border px-2 py-1 uppercase tracking-wide',
                        isDark ? 'border-white/10 text-white/50' : 'border-slate-300 text-slate-600',
                      )}
                    >
                      {text.history.longLabel}
                    </span>
                    <span className={cn('break-all', secondaryTextClass)}>{entry.link}</span>
                    {entry.shortLink ? (
                      <span
                        className={cn(
                          'ml-auto rounded-full border px-2 py-1',
                          isDark
                            ? 'border-accent/40 bg-accent/10 text-white'
                            : 'border-indigo-200 bg-indigo-50 text-indigo-700',
                        )}
                      >
                        {text.history.shortLabel}: {entry.shortLink}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      theme={theme}
                      type="button"
                      onClick={() => handleReuseHistoryEntry(entry)}
                      icon={<RefreshCcw size={16} />}
                      variant="secondary"
                    >
                      {text.history.reuse}
                    </Button>
                    <Button
                      theme={theme}
                      type="button"
                      onClick={() => handleCopyLink(entry.shortLink || entry.link)}
                      icon={<Copy size={16} />}
                      variant="ghost"
                    >
                      {text.history.copy}
                    </Button>
                    <Button
                      theme={theme}
                      type="button"
                      onClick={() => handleOpenLink(entry.shortLink || entry.link)}
                      icon={<ExternalLink size={16} />}
                      variant="ghost"
                    >
                      {text.history.open}
                    </Button>
                    <Button
                      theme={theme}
                      type="button"
                      onClick={() => handleRemoveHistoryEntry(entry.id)}
                      icon={<Trash2 size={16} />}
                      variant="ghost"
                    >
                      {text.history.remove}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <footer
        className={cn(
          'mt-10 flex w-full max-w-4xl flex-col items-center gap-4 text-xs transition-colors',
          isDark ? 'text-white/50' : 'text-slate-500',
        )}
      >
        <p>{text.footerCredit}</p>
      </footer>

      <span
        className={cn(
          'fixed bottom-4 right-4 text-xs transition-colors',
          isDark ? 'text-white/40 hover:text-accent' : 'text-slate-400 hover:text-indigo-500',
        )}
      >
        Made with 💜 by Arabella.dev
      </span>
      <button
        type="button"
        onClick={handleOpenInstagram}
        className={cn(
          'fixed bottom-4 left-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide shadow-lg transition',
          isDark
            ? 'border-white/10 bg-white/5 text-white/70 shadow-black/30 hover:border-accent/60 hover:text-white'
            : 'border-slate-300 bg-white text-slate-600 shadow-slate-300/60 hover:border-indigo-400 hover:text-slate-900',
        )}
      >
        <Instagram size={16} />
        {text.instagramCta}
      </button>
    </div>
  );
}

export default App;
