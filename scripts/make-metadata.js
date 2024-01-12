/* eslint-disable import/no-extraneous-dependencies */

//
// This script runs the Custom Elements Manifest analyzer to generate custom-elements.json
//

const { execSync } = require("child_process");

execSync(`custom-elements-manifest analyze --litelement --outdir "./dist"`, {
  stdio: "inherit",
});
