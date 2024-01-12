const fs = require("fs");
const prettier = require("prettier");

const writeConfig = () => {
  const config = fs.readFileSync(`./tsconfig.json`).toString();
  const prodConfig = prettier.format(
    `
{
  "extends": "../../scripts/templates/tsconfig.json",
  ${removeFirstAndLastBraces(config)},
   "compilerOptions": {
    "rootDir": "./src"
  },
  "exclude": ["node_modules", "dist", "src/**/*.test.ts"]
}
`,
    { parser: "json" }
  );

  fs.writeFileSync("tsconfig.prod.json", prodConfig, {
    flag: "w",
  });
};

const removeFirstAndLastBraces = (inputString) => {
  const firstBraceIndex = inputString.indexOf("{");

  const lastBraceIndex = inputString.lastIndexOf("}");

  if (firstBraceIndex !== -1 && lastBraceIndex !== -1) {
    return inputString.substring(firstBraceIndex + 1, lastBraceIndex);
  } else {
    return inputString;
  }
};

writeConfig();
