import type { StreamProgressEvent } from '../../../src';

export function logDownloadStats({ loaded, percent, speed, remainingMs, total }: StreamProgressEvent): void {
  // console.log(`Received ${loaded} bytes of ${total} bytes (${percent} %)`);
  console.log(`${Math.floor(percent * 100)} % | ${speed.toFixed()} B/ms | ${(speed / 1024 * 1000).toFixed()} KB/s | ${(speed / 1024 / 1024 * 1000).toFixed(2)} MB/s | ${remainingMs.toFixed()} ms remaining.`);
}
