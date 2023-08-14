export function isAbortError(err: Error): err is DOMException {
  return (err.name === 'AbortError');
}
