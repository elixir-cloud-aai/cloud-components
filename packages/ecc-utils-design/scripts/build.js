/* eslint-disable import/no-extraneous-dependencies */

import { globby } from "globby";
import * as tsup from "tsup";
import { program } from "commander";

program.option("-w --watch");
program.parse();
const options = program.opts();

// to do:
// write cdn config
// write script for react builds

const config = {
  format: "esm",
  target: "es2017",
  entry: [...(await globby("./src/components/**/!(*.(style|test)).ts"))],
  splitting: true,
  treeshake: true,
  bundle: true,
  outDir: "dist",
  clean: "true",
  dts: true,
  watch: options.watch,
};

await tsup.build({
  ...config,
});
