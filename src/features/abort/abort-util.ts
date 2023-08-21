export function defaultSignal(): AbortSignal {
  return new AbortController().signal;
}
