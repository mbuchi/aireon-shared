import { createPortal } from 'react-dom';
import { Lock, type LucideIcon } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

export interface LoginModalFeature {
  /** Optional leading icon. */
  icon?: LucideIcon;
  label: string;
  /** Dim the row and show a "Pro" badge. */
  locked?: boolean;
}

export interface LoginModalProps {
  open: boolean;
  /** Called by any dismiss path (backdrop / Esc / link). Ignored when blocking. */
  onClose: () => void;
  /** App name shown in the headline; any `oo` substring renders in brand red. */
  appName: string;
  description?: string;
  features?: LoginModalFeature[];
  /** When true, no dismiss path is rendered. */
  blocking?: boolean;
  login: () => void;
  register: () => void;
}

/** Renders an app name with any `oo` substrings in brand red. */
function StyledAppName({ name }: { name: string }) {
  return (
    <>
      {name.split(/(oo)/gi).map((part, i) =>
        part.toLowerCase() === 'oo' ? (
          <span key={i} className="text-red-600">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/**
 * Suite-standard login popup. Branded with the SWISSNOVO wordmark, it offers
 * "Create free account" and "Sign in". Presentational only — it reads no
 * context, so it can be driven by {@link AuthProvider} or used standalone.
 */
export default function LoginModal({
  open,
  onClose,
  appName,
  description,
  features,
  blocking = false,
  login,
  register,
}: LoginModalProps) {
  const modalRef = useFocusTrap<HTMLDivElement>({
    active: open,
    onEscape: blocking ? undefined : onClose,
  });

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={blocking ? undefined : onClose}
      />

      <div ref={modalRef} className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-rose-700" />

        <div className="px-8 pt-7 pb-6">
          <div className="flex flex-col items-center text-center">
            <p
              className="text-2xl sm:text-3xl font-normal leading-none select-none"
              style={{ fontFamily: "'Varela Round', sans-serif" }}
              aria-label="SWISSNOVO"
            >
              <span className="text-gray-900 dark:text-white">SWISSN</span>
              <span className="text-red-600">O</span>
              <span className="text-gray-900 dark:text-white">V</span>
              <span className="text-red-600">O</span>
            </p>
            <h2
              className="mt-1 text-xl sm:text-2xl font-normal leading-none text-gray-900 dark:text-gray-100"
              style={{ fontFamily: "'Varela Round', sans-serif" }}
            >
              <StyledAppName name={appName} />
            </h2>
            {description && (
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {features && features.length > 0 && (
            <div className="mt-6 space-y-2">
              {features.map((f, i) => (
                <FeatureRow key={i} feature={f} />
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={register}
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Create free account
            </button>
            <button
              onClick={login}
              className="w-full py-2.5 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Sign in
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
            <Lock size={11} />
            <span>Secured with single sign-on via Zitadel</span>
          </div>

          {!blocking && (
            <div className="mt-3 text-center">
              <button
                onClick={onClose}
                className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors underline-offset-2 hover:underline"
              >
                Continue without signing in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function FeatureRow({ feature }: { feature: LoginModalFeature }) {
  const { icon: Icon, label, locked } = feature;
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
        locked
          ? 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50'
          : 'text-gray-700 dark:text-gray-300 bg-red-50/60 dark:bg-red-900/10'
      }`}
    >
      {Icon && (
        <span
          className={
            locked
              ? 'text-gray-400 dark:text-gray-500'
              : 'text-red-500 dark:text-red-400'
          }
        >
          <Icon size={15} />
        </span>
      )}
      <span className="flex-1">{label}</span>
      {locked && (
        <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded">
          Pro
        </span>
      )}
    </div>
  );
}
