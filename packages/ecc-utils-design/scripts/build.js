/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

import { globby } from "globby";
import * as tsup from "tsup";
import { program } from "commander";
import { execSync } from "child_process";
import fs from "fs";
import ora from "ora";
import { npmDir } from "./utils.js";

const commanderOpts = program.option("-w --watch").parse().opts();

// to do:
// write cdn config

const bundleDirectories = [npmDir];

async function nextTask(label, action) {
  try {
    const spinner = ora(label).start();
    await action();
    spinner.succeed();
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

nextTask("Generating component metadata", () =>
  bundleDirectories.map((dir) =>
    execSync(`node scripts/make-metadata.js --outdir "${dir}"`, {
      stdio: "inherit",
    })
  )
);

nextTask("Wrapping components for React", () =>
  execSync("node scripts/make-react.js", {
    stdio: "inherit",
  })
);

nextTask("Building source", async () => {
  const config = {
    format: "esm",
    target: "es2017",
    entry: [
      "./src/index.ts",
      ...(await globby("./src/components/**/!(*.(styles|test)).ts")),
      ...(await globby("./src/react/**/*.ts")),
      ...(await globby("./src/utilities/**/*.ts")),
    ],
    splitting: true,
    treeshake: true,
    bundle: true,
    outDir: npmDir,
    dts: true,
    watch: commanderOpts.watch,
  };

  await tsup.build({
    ...config,
    esbuildOptions(buildOptions) {
      buildOptions.chunkNames = "chunks/[name].[hash]";
    },
  });
});
