export const now = Date.now;

export function dateToMs(dateStr: string): number {
  return new Date(dateStr).getTime();
}
