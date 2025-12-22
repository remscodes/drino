import type { Observer } from '../request/models/request-controller.model';

export const EMPTY_FN = () => {};

export function mergeVoidFns<Fn extends (...args: any[]) => void>(...fns: (Fn | undefined)[]): Fn {
  return ((...args: unknown[]) => fns.forEach(fn => fn?.(...args))) as Fn;
}

export function mergeCallback<K extends keyof Observer>(target: Partial<Observer>, source: Partial<Observer>, key: K): void {
  if (!source[key]) return;

  const existing = target[key];
  const newCallback = source[key];

  if (existing) {
    target[key] = ((...args: any[]) => {
      (existing as any)(...args);
      (newCallback as any)(...args);
    }) as any;
  }
  else {
    target[key] = newCallback;
  }
}
