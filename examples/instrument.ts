import * as Sentry from '@sentry/node';

/**
 * Configure Sentry for tracing.
 * Ensure to call this before importing any other modules!
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN!,
  tracesSampleRate: 1.0,
  debug: true,
});
