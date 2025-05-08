import { esbuildPlugin } from "@web/dev-server-esbuild";
import fg from "fast-glob";
import { playwrightLauncher } from "@web/test-runner-playwright";
import path from "path";

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
  plugins: [
    esbuildPlugin({
      ts: true,
      target: "es2020",
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
  // Create a named group for every test file to enable running single tests.
  // Group files by their base component name (before the first dot)
  groups: (() => {
    // Get all test files
    const testFiles = fg.sync("src/**/*.test.ts");

    // Create a map to group files by their base component name
    const groupsMap = {};

    testFiles.forEach((filePath) => {
      const filename = path.basename(filePath);

      const baseComponentName = filename.split(".")[0];

      if (!groupsMap[baseComponentName]) {
        groupsMap[baseComponentName] = [];
      }

      groupsMap[baseComponentName].push(filePath);
    });

    return Object.entries(groupsMap).map(([name, files]) => ({
      name,
      files,
    }));
  })(),
};
