import { forkModule } from './process-util.mjs';

const testServerProcess = forkModule('express-process.mjs')

forkModule('web-test-process.mjs')
  .once('close', (code, _signal) => {
    testServerProcess.kill('SIGTERM');
    console.info('Test server closed.');

    // If failed, terminate
    if (code === 1) process.exit(code);
  });
