import type { Optional } from '../models/shared.model';

export const EMPTY_FN = () => {};

export function mergeVoidFns<Fn extends (...args: any[]) => void>(...fns: Optional<Fn>[]): Fn {
  return ((...args: unknown[]) => fns.forEach(fn => fn?.(...args))) as Fn;
}
