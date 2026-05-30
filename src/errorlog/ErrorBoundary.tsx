// React error boundary that reports render-time crashes to the suite error log
// and shows a graceful fallback instead of a blank white screen.
//
//   <ErrorLogBoundary logger={logger}>
//     <App />
//   </ErrorLogBoundary>

import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { ErrorLogger } from './client';

export interface ErrorLogBoundaryProps {
  children: ReactNode;
  /** Logger used to report caught errors (from `createErrorLogger`). */
  logger?: Pick<ErrorLogger, 'capture'>;
  /**
   * Custom fallback. Either a node, or a render function receiving the error
   * and a `reset` callback that clears the boundary and re-renders children.
   */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Extra callback after an error is caught (e.g. local logging). */
  onError?: (error: Error, info: ErrorInfo) => void;
  /** Force dark styling on the default fallback. Default auto-detect. */
  darkMode?: boolean;
}

interface State {
  error: Error | null;
}

export class ErrorLogBoundary extends Component<ErrorLogBoundaryProps, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    try {
      this.props.logger?.capture(error, {
        kind: 'react',
        severity: 'error',
        source: info.componentStack ?? undefined,
      });
      this.props.onError?.(error, info);
    } catch {
      // Never let the boundary itself throw.
    }
  }

  reset = (): void => this.setState({ error: null });

  render(): ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    const { fallback } = this.props;
    if (typeof fallback === 'function') return fallback(error, this.reset);
    if (fallback !== undefined) return fallback;

    const dark =
      this.props.darkMode ??
      (typeof document !== 'undefined' &&
        document.documentElement.classList.contains('dark'));

    return (
      <div
        role="alert"
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily:
            'var(--hood-font, Inter, system-ui, sans-serif)',
          color: dark ? '#e2e8f0' : '#0f172a',
        }}
      >
        <div
          style={{
            maxWidth: '24rem',
            textAlign: 'center',
            borderRadius: '1rem',
            padding: '2rem',
            background: dark ? '#1e293b' : '#ffffff',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
          }}
        >
          <h1 style={{ fontSize: '1.125rem', fontWeight: 600, margin: '0 0 0.5rem' }}>
            Etwas ist schiefgelaufen
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: dark ? '#94a3b8' : '#64748b',
              margin: '0 0 1.25rem',
            }}
          >
            Ein unerwarteter Fehler ist aufgetreten. Wir wurden benachrichtigt.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              minHeight: '44px',
              padding: '0 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#ffffff',
              background: '#e11d48',
            }}
          >
            Seite neu laden
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorLogBoundary;
