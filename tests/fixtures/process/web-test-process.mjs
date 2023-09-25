import { spawnCommand } from './process-util.mjs';

spawnCommand('npm', ['run', 'start-web-runner'])
  .once('close', (code) => process.exit(code));
