/* eslint-disable import/no-extraneous-dependencies */

//
// This script runs the Custom Elements Manifest analyzer to generate custom-elements.json
//

const { program } = require("commander");
const options = program.option("-d, --outdir <string>").parse().opts();

const { execFileSync } = require("child_process");

execFileSync(
  "custom-elements-manifest",
  ["analyze", "--litelement", "--outdir", options.outdir],
  {
    stdio: "inherit",
  }
);
