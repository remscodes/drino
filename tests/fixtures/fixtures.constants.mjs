import { fileURLToPath } from 'node:url';

export const FIXTURES_ROOT_PATH = fileURLToPath(new URL('.', import.meta.url));

export const SERVER_READY = 'SERVER_READY';
