import { fork } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const testServerProcess = fork(
  join(__dirname, 'express-process.mjs'),
  [],
  {}
);

fork(
  join(__dirname, 'web-test-process.mjs'),
  [],
  {}
).once('close', (_code, _signal) => {
  testServerProcess.kill('SIGTERM');
});
