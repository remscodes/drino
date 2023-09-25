import { SERVER_READY } from '../fixtures.constants.mjs';
import { forkModule } from './process-util.mjs';

const testServerProcess = forkModule('process/express-process.mjs')
  .on('message', (message) => {
    if (message !== SERVER_READY) return;

    forkModule('process/web-test-process.mjs')
      .once('close', (code) => {
        testServerProcess.kill('SIGTERM');
        console.info('Test server closed.');

        // If failed, terminate
        if (code === 1) process.exit(code);
      });
  });
