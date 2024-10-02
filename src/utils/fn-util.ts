export const EMPTY_FN = () => {};

export function mergeVoidFns<Fn extends (...args: any[]) => void>(...fns: (Fn | undefined)[]): Fn {
  return ((...args: unknown[]) => fns.forEach(fn => fn?.(...args))) as Fn;
}
