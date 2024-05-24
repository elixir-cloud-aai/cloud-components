/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

// TODO
// Add cleanup function for when an errror is encountered or user terminates process
const { cwd } = require("process");
const fg = require("fast-glob");
const tsup = require("tsup");
const { program } = require("commander");
const { execSync } = require("child_process");
const fs = require("fs");
const { npmDir } = require("./utils.js");
const path = require("path");
const { reactDir } = require("./utils.js");

const packageJsonDir = `${process.cwd()}/package.json`;
const commanderOpts = program
  .option("-w --watch")
  .option("-p, --prefix <string>")
  .parse()
  .opts();

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

// TODO:
// force installing dependencies is not ideal
// rewrite to ask for permission for each dependency that isnr present or just throw error
// add option for user to add prettier config
// reading from package json for some reason does not block other processes
nextTask("verifying dependencies", async () => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonDir, "utf-8"));

  const dependencies = [
    "@lit/react",
    "react",
    "commander",
    "custom-element-jet-brains-integration",
    "custom-element-vs-code-integration",
  ];

  dependencies.forEach((dep) => {
    if (!packageJson.devDependencies[dep] && !packageJson.dependencies[dep]) {
      console.error(`${dep} is not installed, please install and try again`);
      console.log(
        `You should be able to do this by adding "${dep}":"*" to your devDependencies`
      );

      bundleDirectories.map((dir) =>
        fs.rmSync(dir, { force: true, recursive: true })
      );
      process.exit(1);
    }
  });
});

nextTask("Generating CEM config", () => {
  execSync(`node ${path.join(__dirname, "make-CEMconfig.js")}`, {
    stdio: "inherit",
  });
});

nextTask("Generating component metadata", () => {
  bundleDirectories.map((dir) =>
    execSync(
      `node  ${path.join(__dirname, "make-metadata.js")} --outdir "${dir}"`,
      {
        stdio: "inherit",
      }
    )
  );
});

nextTask("Wrapping components for React", async () => {
  execSync(
    `node  ${path.join(__dirname, "make-react.js")} -p "${
      commanderOpts.prefix
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

// TODO
// allow for custom tsup config (might not be necessary)
nextTask("Building source", async () => {
  const sourceDir = path.join(cwd(), "src");
  const config = {
    format: "esm",
    target: "es2017",
    entry: [
      `${sourceDir}/index.ts`,
      ...(await fg(`${sourceDir}/components/**/!(*.(test)).ts`)),
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

  tsup
    .build({
      ...config,
      esbuildOptions(buildOptions) {
        buildOptions.chunkNames = "chunks/[name].[hash]";
      },
    })
    .catch((err) => {
      console.error(err);
      nextTask("Cleaning up failed build", () => {
        bundleDirectories.map((dir) =>
          fs.rmSync(dir, { force: true, recursive: true })
        );
      });
    })
    .finally(() =>
      nextTask("Cleaning up react source", () => {
        if (!commanderOpts.watch) {
if (!commanderOpts.watch) {
  fs.rmSync(reactDir, {
    force: true,
    recursive: true,
  });
}
            fs.rmSync(reactDir, {
              force: true,
              recursive: true,
            });
          });
        }
      })
    );
});

module.exports = {};
