// Floating "Report a problem" widget — the user-facing side of the suite's
// central error-logging system. Drops into any app; on submit it calls
// `logger.report()` which posts to the app's `/api/errorlog-collect` proxy.
//
// Self-contained: Tailwind classes + a portal to document.body (escapes any
// transformed/clipped map container, like ClaireAssistant). Dark-mode aware.

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Loader2, MessageSquareText, Send, ShieldAlert, X } from 'lucide-react';
import type { ErrorLogger } from './client';
import { getBugReportStrings, type Locale } from './i18n';

export interface BugReportButtonProps {
  /** The app's error logger (from `createErrorLogger` / `installErrorLogging`). */
  logger: Pick<ErrorLogger, 'report'>;
  /** UI language. Default `de`. */
  locale?: Locale | string;
  /** Pre-fill the email field (e.g. the signed-in user's address). */
  email?: string;
  /** Corner to dock the button. Default `bottom-left` (keeps clear of Claire). */
  position?: 'bottom-left' | 'bottom-right';
  /** Force dark styling. Defaults to auto-detect (`<html class="dark">`). */
  darkMode?: boolean;
  /** Render into a custom container instead of `document.body`. */
  container?: Element | null;
  /** Extra metadata attached to every report (e.g. app version). */
  metaData?: Record<string, unknown>;
  /** Show the text label beside the icon. Defaults to false for map apps. */
  showLabel?: boolean;
}

type Phase = 'idle' | 'sending' | 'success' | 'error';
type ReportType = 'bug' | 'feedback';

function useDarkMode(forced?: boolean): boolean {
  const [dark, setDark] = useState(() => {
    if (typeof forced === 'boolean') return forced;
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });
  useEffect(() => {
    if (typeof forced === 'boolean') {
      setDark(forced);
      return;
    }
    if (typeof document === 'undefined') return;
    const el = document.documentElement;
    const update = () => setDark(el.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [forced]);
  return dark;
}

export function BugReportButton({
  logger,
  locale = 'de',
  email = '',
  position = 'bottom-left',
  darkMode,
  container,
  metaData,
  showLabel = false,
}: BugReportButtonProps) {
  const t = getBugReportStrings(locale);
  const dark = useDarkMode(darkMode);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [reportType, setReportType] = useState<ReportType>('bug');
  const [message, setMessage] = useState('');
  const [emailValue, setEmailValue] = useState(email);
  const dialogRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleId = useId();
  const subtitleId = useId();

  useEffect(() => setEmailValue(email), [email]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    const id = window.setTimeout(() => textareaRef.current?.focus(), 60);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(id);
    };
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    // Reset shortly after the dialog is gone so the closing frame looks clean.
    window.setTimeout(() => {
      setPhase('idle');
      setReportType('bug');
      setMessage('');
    }, 200);
  }, []);

  const submit = useCallback(async () => {
    const text = message.trim();
    if (!text || phase === 'sending') return;
    setPhase('sending');
    const ok = await logger.report({
      message: text,
      email: emailValue.trim() || undefined,
      metaData: {
        ...(metaData ?? {}),
        report_type: reportType,
        source: 'bug_report_widget',
      },
    });
    setPhase(ok ? 'success' : 'error');
    if (ok) window.setTimeout(close, 1800);
  }, [message, emailValue, phase, logger, metaData, reportType, close]);

  if (typeof document === 'undefined') return null;
  const target = container ?? document.body;

  const corner =
    position === 'bottom-right' ? 'right-4 sm:right-5' : 'left-4 sm:left-5';

  // Tailwind tokens, dark-aware. No hardcoded hex.
  const panelBg = dark
    ? 'bg-slate-900 text-slate-100 ring-1 ring-white/10'
    : 'bg-white text-slate-900 ring-1 ring-slate-200';
  const inputCls = dark
    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500'
    : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400';

  const launcher = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={t.button}
      aria-haspopup="dialog"
      title={t.button}
      className={
        `fixed bottom-4 sm:bottom-5 ${corner} z-[2147483000] inline-flex h-11 items-center justify-center gap-2 ` +
        `${showLabel ? 'w-auto px-3.5' : 'w-11 px-0'} ` +
        'rounded-full text-sm font-semibold shadow-lg ring-1 ring-inset transition ' +
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ' +
        (dark
          ? 'bg-slate-800 text-rose-300 ring-white/10 hover:bg-slate-700 focus-visible:ring-offset-slate-900'
          : 'bg-white text-rose-600 ring-rose-200 hover:bg-rose-50 focus-visible:ring-offset-white')
      }
    >
      <ShieldAlert className="h-4 w-4" aria-hidden="true" />
      <span className={showLabel ? 'hidden sm:inline' : 'sr-only'}>{t.button}</span>
    </button>
  );

  const dialog = (
    <div
      className="fixed inset-0 z-[2147483600] flex items-end justify-center p-4 sm:items-center"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={phase === 'success' ? undefined : subtitleId}
        className={`relative w-full max-w-md rounded-lg p-5 shadow-2xl ${panelBg}`}
      >
        <button
          type="button"
          onClick={close}
          aria-label={t.close}
          className={
            'absolute right-3 top-3 rounded-lg p-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ' +
            (dark ? 'text-slate-400 hover:bg-white/10' : 'text-slate-400 hover:bg-slate-100')
          }
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {phase === 'success' ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 id={titleId} className="text-base font-semibold">
              {t.successTitle}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t.successBody}</p>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2 pr-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
                <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              </span>
              <h2 id={titleId} className="text-base font-semibold">
                {t.title}
              </h2>
            </div>
            <p id={subtitleId} className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              {t.subtitle}
            </p>

            <div className="mb-3 grid grid-cols-2 gap-2" role="group" aria-label={t.dialogLabel}>
              {(['bug', 'feedback'] as ReportType[]).map((type) => {
                const active = reportType === type;
                const Icon = type === 'bug' ? ShieldAlert : MessageSquareText;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setReportType(type)}
                    className={
                      'inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition ' +
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ' +
                      (active
                        ? 'border-rose-500 bg-rose-50 text-rose-700 dark:border-rose-400 dark:bg-rose-500/15 dark:text-rose-200'
                        : dark
                          ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50')
                    }
                    aria-pressed={active}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {type === 'bug' ? t.bug : t.feedback}
                  </button>
                );
              })}
            </div>

            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              maxLength={2000}
              placeholder={t.messagePlaceholder}
              className={`w-full resize-none rounded-lg border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${inputCls}`}
            />

            <label className="mt-3 block text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.emailLabel}
            </label>
            <input
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder={t.emailPlaceholder}
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${inputCls}`}
            />

            {phase === 'error' && (
              <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">{t.error}</p>
            )}

            <button
              type="button"
              onClick={() => void submit()}
              disabled={!message.trim() || phase === 'sending'}
              className={
                'mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition ' +
                'bg-rose-600 hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50 ' +
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ' +
                (dark ? 'focus-visible:ring-offset-slate-900' : 'focus-visible:ring-offset-white')
              }
            >
              {phase === 'sending' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {t.sending}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {t.send}
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(
    <>
      {launcher}
      {open && dialog}
    </>,
    target,
  );
}

export default BugReportButton;
