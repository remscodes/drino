import { fork } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const testServerProcess = fork(
  join(__dirname, 'express-process.mjs'),
  [],
  {
    stdio: [
      'inherit', // Input channel
      'inherit', // Output channel
      'inherit', // Error channel
      'ipc' // IPC channel
    ]
  }
);

fork(
  join(__dirname, 'web-test-process.mjs'),
  [],
  {
    stdio: [
      'inherit', // Input channel
      'inherit', // Output channel
      'inherit', // Error channel
      'ipc' // IPC channel
    ]
  }
).once('close', (code, _signal) => {
  testServerProcess.kill('SIGTERM');
  console.info('Test server closed.');

  // If failed, terminate
  if (code === 1) process.exit(code);
});
