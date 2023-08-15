import { spawn } from 'node:child_process';

spawn(
  'npm',
  ['run', 'start-server'],
  {
    stdio: [
      'inherit', // Input
      'inherit', // Output
      'inherit' // Error,
    ]
  }
);
