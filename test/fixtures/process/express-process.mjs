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
)
//   .once('spawn', () => {
//   connect({
//     keepAlive: true,
//     keepAliveInitialDelay: 2000,
//     port: 8080,
//     host: '127.0.0.1',
//     family: 4
//   }, () => {
//     console.log('TEST')
//     process.send('TEST');
//   })
// });
