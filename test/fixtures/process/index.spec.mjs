import { fork } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const expressProcess = fork(
  join(__dirname, 'express-process.mjs'),
  [],
  {
    stdio: [
      'inherit',
      'inherit',
      'inherit',
      'ipc'
    ]
  }
);

fork(
  join(__dirname, 'web-test-process.mjs'),
  [],
  {}
).once('close', (_code, _signal) => {
  expressProcess.kill('SIGTERM');
});

// expressProcess.on('message', (message, _sendHandle) => {
//   console.log('Message', message)
//   if (message === 'SERVER_UP') {
//     childProcess.fork(
//       path.join(__dirname, 'web-test-process.mjs'),
//       [],
//       {}
//     ).once('close', (_code, _signal) => {
//       expressProcess.kill('SIGTERM');
//     });
//   }
// });
