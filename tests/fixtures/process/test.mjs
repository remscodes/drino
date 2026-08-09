import { SERVER_READY } from '../fixtures.constants.mjs';
import { forkModule } from './process-util.mjs';

let serverReady = false;

const testServerProcess = forkModule('process/express-process.mjs')
  .on('message', (message) => {
    if (message !== SERVER_READY) return;

    serverReady = true;

    forkModule('process/web-test-process.mjs')
      .once('close', (code) => {
        testServerProcess.kill('SIGTERM');
        console.info('Test server closed.');

        // If failed, terminate
        if (code === 1) process.exit(code);
      });
  })
  // Without this, a server that dies before being ready leaves no test running and exits 0.
  .once('exit', (code) => {
    if (serverReady) return;

    console.error('Test server exited before being ready. No test has been run.');
    process.exit(code || 1);
  });
