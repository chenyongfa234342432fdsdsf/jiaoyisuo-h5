import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { newbitEnv, envIsBuild } from '../../env'

export function initSentry() {
  if (envIsBuild && ['dev', 'test', 'production'].includes(newbitEnv)) {
    Sentry.init({
      ignoreErrors: [
        'Non-Error exception captured',
        'Non-Error promise rejection captured',
        'ResizeObserver loop limit exceeded',
        'form validate error, get errors by error.errors',
      ],
      dsn: 'https://5fa9a9b976cd498bb1dd9bc1badd32e4@o4504779517198336.ingest.sentry.io/4504892828418048',
      integrations: [new BrowserTracing()],
      environment: newbitEnv,

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    })
  }
}
