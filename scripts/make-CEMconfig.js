const fs = require("fs");
const prettier = require("prettier");
const path = require("path");

const config = fs
  .readFileSync(
    path.join(__dirname, "templates", "custom-elements-manifest.config.js")
  )
  .toString();

const prodConfig = prettier.format(config, { parser: "babel" });

fs.writeFileSync("custom-elements-manifest.config.js", prodConfig, {
  flag: "w",
});
