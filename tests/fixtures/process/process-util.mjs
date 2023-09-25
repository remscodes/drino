import { fork, spawn } from 'node:child_process';
import { join } from 'node:path';
import { FIXTURES_ROOT_PATH } from '../fixtures.constants.mjs';

export function forkModule(relativeModulePath) {
  return fork(join(FIXTURES_ROOT_PATH, relativeModulePath), [], {
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

export function loadModule(relativeModulePath) {
  return import(join(FIXTURES_ROOT_PATH, relativeModulePath));
}
