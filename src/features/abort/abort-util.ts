import { createError } from 'thror';
import { ABORT_ERROR_NAME, TIMEOUT_ERROR_NAME } from './abort.constants';

export function defaultSignal(): AbortSignal {
  return new AbortController().signal;
}

export function timedSignal(timeoutMs: number): AbortSignal {
  const signal: AbortSignal = AbortSignal.timeout(timeoutMs);
  signal.hasTimeout = true;
  return signal;
}

export function mergeSignals(...signals: AbortSignal[]): AbortController {
  const abortCtrl: AbortController = new AbortController();

  for (const signal of signals) {
    if (signal.aborted) {
      checkSignalAndAbort(signal, abortCtrl);
      return abortCtrl;
    }
    signal.addEventListener('abort', function () {
      checkSignalAndAbort(this, abortCtrl);
    }, { once: true, signal: abortCtrl.signal });
  }

  return abortCtrl;
}

function checkSignalAndAbort(signal: AbortSignal, abortCtrl: AbortController): void {
  if (signal.hasTimeout) abortCtrl.signal.isTimeout = true;
  abortCtrl.abort(signal.reason);
}

export function fixFirefoxAbortError(err: any): any {
  return (err?.name !== ABORT_ERROR_NAME)
    ? createError(ABORT_ERROR_NAME, 'The user aborted a request.', { original: err })
    : err;
}

export function fixChromiumAndWebkitTimeoutError(err: any): any {
  return (err?.name !== TIMEOUT_ERROR_NAME)
    ? createError(TIMEOUT_ERROR_NAME, 'The operation timed out.', { original: err })
    : err;
}
