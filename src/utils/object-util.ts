export function keysOf<T extends {}>(obj: T): string[] {
  return Object.keys(obj);
}
