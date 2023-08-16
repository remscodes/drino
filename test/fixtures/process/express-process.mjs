import { spawn } from 'node:child_process';

spawn(
  'npm',
  ['run', 'start-server'],
  {
    stdio: [
      'inherit', // Input channel
      'inherit', // Output channel
      'inherit' // Error channel
    ]
  }
);
