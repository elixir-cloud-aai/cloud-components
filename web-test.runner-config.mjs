import { esbuildPlugin } from '@web/dev-server-esbuild';
import { globbySync } from 'globby';
import fg from 'fast-glob';
import { fileURLToPath } from 'url';
import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  rootDir: '.',
  files: 'src/**/*.test.ts', // "default" group
  concurrentBrowsers: 3,
  nodeResolve: {
    exportConditions: ['production', 'default'],
  },
  testFramework: {
    config: {
      timeout: 3000,
      retries: 1,
    },
  },
  plugins: [
    esbuildPlugin({
      ts: true,
      target: 'es2020',
      // tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
    }),
  ],
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' }),
  ],
  testRunnerHtml: (testFramework) => `
    <html lang="en-US">
      <head></head>
      <body>
        <script>
          window.process = {env: { NODE_ENV: "production" }}
        </script>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,
  // Create a named group for every test file to enable running single tests. If a test file is `form.test.ts`
  // then you can run `npm run test -- --group form` to run only that component's tests.
  groups: fg.sync('src/**/*.test.ts').map((path) => {
    const groupName = path.match(/^.*\/(?<fileName>.*)\.test\.ts/).groups.fileName;
    return {
      name: groupName,
      files: path,
    };
  }),
};
