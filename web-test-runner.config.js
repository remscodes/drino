import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from "@web/test-runner-playwright";

// https://modern-web.dev/docs/test-runner/cli-and-configuration/#configuration-file

/** @type {import('@web/test-runner').TestRunnerConfig} */
const config = {
  plugins: [
    esbuildPlugin({ ts: true })
  ],
  files: [
    'tests/**/*.spec.ts',
    '!tests/imports/**'
  ],
  nodeResolve: true,
  concurrency: 1,
  concurrentBrowsers: 3,
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' })
  ],
  coverage: true,
  coverageConfig: {
    include: [
      './src/**'
    ],
    exclude: [
      './src/**/index.ts'
    ],
    threshold: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  testFramework: {
    config: {
      timeout: '1500'
    }
  }
};

export default config
