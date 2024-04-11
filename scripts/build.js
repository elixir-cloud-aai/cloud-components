/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

const { cwd } = require("process");
const fg = require("fast-glob");
const tsup = require("tsup");
const { program } = require("commander");
const { execSync } = require("child_process");
const fs = require("fs");
const { npmDir } = require("./utils.js");
const path = require("path");
const prettier = require("prettier");
// const packageJson = require('../package.json');

const packageJsonDir = `${process.cwd()}/package.json`;
const commanderOpts = program.option("-w --watch").parse().opts();

const bundleDirectories = [npmDir];

async function nextTask(label, action) {
  try {
    console.log(label, "...");
    await action();
  } catch (err) {
    console.error(err);
    if (err.stdout) console.error(err.stdout);
    if (err.stderr) console.error(err.stderr);
    process.exit(1);
  }
}

nextTask("Cleaning up previous build", () => {
  bundleDirectories.map((dir) =>
    fs.rmSync(dir, { force: true, recursive: true })
  );

  bundleDirectories.map((dir) =>
    fs.mkdirSync(dir, {
      recursive: true,
    })
  );
});

nextTask("installing dependencies", async () => {
  const packageJson = await import(packageJsonDir, {
    assert: { type: "json" },
  });
  const devDependencies = {
    ...packageJson.default.devDependencies,
    "@lit/react": "*",
    react: "*",
    commander: "*",
    "custom-element-jet-brains-integration": "*",
    "custom-element-vs-code-integration": "*",
    "pascal-case": "*",
  };

  const updatedPackageJson = JSON.stringify({
    ...packageJson.default,
    devDependencies,
  });
  fs.writeFileSync(
    packageJsonDir,
    prettier.format(updatedPackageJson, {
      parser: "json",
    }),
    { flag: "w" }
  );
});

nextTask("Generating CEM config", () => {
  execSync(`node ${path.join(__dirname, "make-CEMconfig.js")}`, {
    stdio: "inherit",
  });
});

nextTask("Generating component metadata", () =>
  bundleDirectories.map((dir) =>
    execSync(
      `node  ${path.join(__dirname, "make-metadata.js")} --outdir "${dir}"`,
      {
        stdio: "inherit",
      }
    )
  )
);

nextTask("Wrapping components for React", async () => {
  const packageJson = await import(packageJsonDir, {
    assert: { type: "json" },
  });

  execSync(
    `node  ${path.join(__dirname, "make-react.js")} -p "${
      packageJson.default.componentsPrefix
    }"`,
    {
      stdio: "inherit",
    }
  );
});

nextTask("Running the TypeScript compiler", () => {
  execSync(`tsc --project ./tsconfig.prod.json --outdir "${npmDir}"`, {
    stdio: "inherit",
  });
});

// allow for custom tsup config
nextTask("Building source", async () => {
  const sourceDir = path.join(cwd(), "src");
  const config = {
    format: "esm",
    target: "es2017",
    entry: [
      `${sourceDir}/index.ts`,
      ...(await fg(`${sourceDir}/components/**/!(*.(test|component)).ts`)),
      ...(await fg(`${sourceDir}/react/**/*.ts`)),
      ...(await fg(`${sourceDir}/utilities/**/*.ts`)),
    ],
    splitting: true,
    treeshake: true,
    bundle: true,
    outDir: npmDir,
    external: ["@lit/react", "react"],
    watch: commanderOpts.watch,
  };

  tsup.build({
    ...config,
    esbuildOptions(buildOptions) {
      buildOptions.chunkNames = "chunks/[name].[hash]";
    },
  });
});
