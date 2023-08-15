import { spawn } from 'node:child_process';

spawn(
  'npm',
  ['run', 'start-web-runner'],
  {
    stdio: [
      'inherit', // Input
      'inherit', // Output
      'inherit' // Error
    ]
  }
);
