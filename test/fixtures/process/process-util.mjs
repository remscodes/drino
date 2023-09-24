import { fork, spawn } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export function forkModule(relativeModulePath) {
  return fork(join(__dirname, relativeModulePath), [], {
    stdio: [
      'inherit', // Input channel
      'inherit', // Output channel
      'inherit', // Error channel
      'ipc' // IPC channel
    ]
  });
}

export function spawnCommand(command, args) {
  return spawn(command, args, {
    stdio: [
      'inherit', // Input channel
      'inherit', // Output channel
      'inherit' // Error channel
    ]
  });
}
