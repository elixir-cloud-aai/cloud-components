/* eslint-disable import/no-extraneous-dependencies */

//
// This script runs the Custom Elements Manifest analyzer to generate custom-elements.json
//

import { execSync } from "child_process";
import { program } from "commander";

program.option("-o, --outdir <string>").parse();

execSync(`custom-elements-manifest analyze --litelement --outdir "./dist"`, {
  stdio: "inherit",
});
