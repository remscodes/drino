import type { RequestMethodType } from '../../models/http.model';
import type { OnStatusCodes } from './models/retry.model';

export const defaultRetryMax: number = 0;
export const defaultRetryOnStatusCodes: OnStatusCodes = { min: 400, max: 599 };
export const defaultRetryOnMethods: (RequestMethodType | '*')[] = ['*'];
