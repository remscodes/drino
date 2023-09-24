import { spawnCommand } from './process-util.mjs';

spawnCommand('npm', ['run', 'start-web-runner'])
  .once('close', (code, _signal) => {
    process.exit(code);
  });
