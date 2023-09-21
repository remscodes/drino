import type { OnStatusCodes } from './models/retry.model';

export const defaultRetryCount: number = 0;

export const defaultRetryOnStatus: OnStatusCodes = { min: 400, max: 599 };
