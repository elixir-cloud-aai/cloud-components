import { esbuildPlugin } from "@web/dev-server-esbuild";
import fg from "fast-glob";
import { playwrightLauncher } from "@web/test-runner-playwright";

// Packages run tests in parallel (turbo --parallel), so each package's test
// scripts pass a unique --port: design 8000, wes 8001, tes 8003.
export default {
  rootDir: ".",
  files: "src/**/*.test.ts", // "default" group
  concurrentBrowsers: 3,
  nodeResolve: {
    exportConditions: ["production", "default"],
  },
  testFramework: {
    config: {
      timeout: 3000,
      retries: 1,
    },
  },
  // With `--coverage` (as in CI): the coverage of the package's sources in
  // Chromium (the only browser that reports it), written to
  // `coverage/lcov.info` in the package, which CI uploads to Codecov
  coverageConfig: {
    include: ["src/**"],
    exclude: ["**/*.test.ts", "**/node_modules/**"],
    reportDir: "coverage",
    reporters: ["lcov"],
  },
  plugins: [
    esbuildPlugin({
      ts: true,
      target: "es2020",
      // Lit decorators need the package's experimentalDecorators setting
      // (relative to the working directory: run tests from the package)
      tsconfig: "./tsconfig.json",
    }),
  ],
  browsers: [
    playwrightLauncher({ product: "chromium" }),
    playwrightLauncher({ product: "firefox" }),
    playwrightLauncher({ product: "webkit" }),
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
  groups: fg.sync("src/**/*.test.ts").map((path) => {
    const groupName = path.match(/^.*\/(?<fileName>.*)\.test\.ts/).groups
      .fileName;
    return {
      name: groupName,
      files: path,
    };
  }),
};
