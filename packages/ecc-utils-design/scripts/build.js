/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

import { globby } from "globby";
import * as tsup from "tsup";
import { program } from "commander";
import util from "util";
import { exec } from "child_process";
import fs from "fs";
import { npmDir } from "./utils.js";

const commanderOpts = program.option("-w --watch").parse().opts();

// to do:
// write cdn config

const execPromise = util.promisify(exec);

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

const bundleDirectories = [npmDir];

async function nextTask(label, action) {
  try {
    console.log(`${label}...`);
    await action();
  } catch (err) {
    console.error(err);
    if (err.stdout) console.error(err.stdout);
    if (err.stderr) console.error(err.stderr);
    process.exit(1);
  }
}

await nextTask("Cleaning up previous build", () => {
  Promise.all(
    bundleDirectories.map((dir) =>
      fs.rmSync(dir, { force: true, recursive: true })
    )
  );

  Promise.all(
    bundleDirectories.map((dir) =>
      fs.mkdirSync(dir, {
        recursive: true,
      })
    )
  );
});

await nextTask("Generating component metadata", () =>
  Promise.all(
    bundleDirectories.map((dir) =>
      execPromise(`node scripts/make-metadata.js --outdir "${dir}"`, {
        stdio: "inherit",
      })
    )
  )
);

await nextTask("Wrapping components for React", () =>
  execPromise("node scripts/make-react.js", {
    stdio: "inherit",
  })
);

await nextTask("Building source", () =>
  tsup.build({
    ...config,
    esbuildOptions(buildOptions) {
      buildOptions.chunkNames = "chunks/[name].[hash]";
    },
  })
);
