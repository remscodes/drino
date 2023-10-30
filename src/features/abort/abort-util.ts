import { createError } from 'thror';

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
  if (signal.hasTimeout) abortCtrl.signal.abortedByTimeout = true;
  abortCtrl.abort(signal.reason);
}

export function fixFirefoxAbortError(err: any): any {
  return (err?.name !== 'AbortError')
    ? createError('AbortError', 'The user aborted a request.', { original: err })
    : err;
}

export function fixChromiumAndWebkitTimeoutError(err: any): any {
  return (err?.name !== 'TimeoutError')
    ? createError('TimeoutError', 'The operation timed out.', { original: err })
    : err;
}
