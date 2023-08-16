import { spawn } from 'node:child_process';

spawn(
  'npm',
  ['run', 'start-web-runner'],
  {
    stdio: [
      'inherit', // Input channel
      'inherit', // Output channel
      'inherit' // Error channel
    ]
  }
).once('close', (code, _signal) => {
  process.exit(code);
});
