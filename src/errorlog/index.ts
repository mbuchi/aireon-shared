// Public surface of the suite-wide error-logging / bug-reporting module.
// The edge handler is a separate subpath entry (`@swissnovo/shared/errorlog-collect`).

export { createErrorLogger, installErrorLogging } from './client';
export type {
  ErrorLogger,
  ErrorLoggerOptions,
  ErrorLogContext,
  ErrorSeverity,
  ErrorKind,
} from './client';

export { ErrorLogBoundary, default as ErrorLogBoundaryDefault } from './ErrorBoundary';
export type { ErrorLogBoundaryProps } from './ErrorBoundary';

export { BugReportButton, default as BugReportButtonDefault } from './BugReportButton';
export type { BugReportButtonProps } from './BugReportButton';

export {
  BUG_REPORT_STRINGS,
  getBugReportStrings,
} from './i18n';
export type { BugReportStrings } from './i18n';
