#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const yargs = require("yargs");

try {
  const argv = yargs(process.argv.slice(2)).argv;

  const inputSource = argv.source ?? "./src/tailwind.css";
  const inputProcessed = argv.input ?? "./src/output.css";
  const output = argv.output ?? "./src/tailwind.ts";
  const watch = argv.watch ?? false;

  // Ensure source directory exists
  const sourceDir = path.dirname(inputSource);
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
    console.log(`Created directory: ${sourceDir}`);
  }

  // Check if source file exists
  if (!fs.existsSync(inputSource)) {
    console.error(`Source file ${inputSource} does not exist!`);
    process.exit(1);
  }

  // Ensure output directory exists
  const outputDir = path.dirname(inputProcessed);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created directory: ${outputDir}`);
  }

  // Create empty output file if it doesn't exist
  if (!fs.existsSync(inputProcessed)) {
    fs.writeFileSync(inputProcessed, "/* Empty file for initial setup */");
    console.log(`Created empty file: ${inputProcessed}`);
  }

  // Ensure tailwind.ts directory exists
  const tailwindTsDir = path.dirname(output);
  if (!fs.existsSync(tailwindTsDir)) {
    fs.mkdirSync(tailwindTsDir, { recursive: true });
    console.log(`Created directory: ${tailwindTsDir}`);
  }

  // Create empty tailwind.ts file if it doesn't exist
  if (!fs.existsSync(output)) {
    fs.writeFileSync(
      output,
      'import { css } from "lit";\nexport const TWStyles = css``;\n'
    );
    console.log(`Created empty file: ${output}`);
  }

  // Process function to convert CSS to Lit-compatible format
  function processForLit() {
    try {
      let contents;
      try {
        contents = fs.readFileSync(inputProcessed, "utf8");
      } catch (e) {
        console.log(
          `Tailwind Watcher: Failed to read file ${inputProcessed}. Might just not be created yet? retrying..`
        );
        return;
      }

      let cleanContents = contents.replaceAll("`", "");
      cleanContents = cleanContents.replaceAll("\\", "\\\\");

      const litContents = `
import { css } from "lit";
export const TWStyles = css\` ${cleanContents} \`
      `;

      fs.writeFileSync(output, litContents);
      console.log(`Tailwind Watcher: Wrote to file ${output}`);
    } catch (err) {
      console.error(err);
    }
  }

  // Main function to process Tailwind
  function processTailwind() {
    try {
      console.log(
        `Processing Tailwind CSS: ${inputSource} -> ${inputProcessed}`
      );

      // Run Tailwind CLI to process the source file
      const tailwindCmd = `npx @tailwindcss/cli -i ${inputSource} -o ${inputProcessed}${
        watch ? " --watch" : ""
      }`;

      if (watch) {
        // In watch mode, run the CLI in the background and set up a file watcher
        const child = require("child_process").spawn(
          "npx",
          [
            "@tailwindcss/cli",
            "-i",
            inputSource,
            "-o",
            inputProcessed,
            "--watch",
          ],
          {
            stdio: "inherit",
            shell: true,
          }
        );

        console.log("Tailwind watcher started in watch mode");

        // Set up a watcher for the processed file to convert to Lit format
        fs.watch(inputProcessed, (eventType) => {
          if (eventType === "change") {
            processForLit();
          }
        });

        // Initial processing
        processForLit();

        // Handle process exit
        process.on("SIGINT", () => {
          console.log("Terminating Tailwind watcher...");
          child.kill();
          process.exit(0);
        });
      } else {
        // In one-time mode, just run the CLI and process the output
        execSync(tailwindCmd, { stdio: "inherit" });
        processForLit();
      }
    } catch (error) {
      console.error("Error processing Tailwind CSS:", error);
      process.exit(1);
    }
  }

  // Run the main function
  processTailwind();
} catch (e) {
  console.error(`Error in Tailwind processing: ${e}`);
  process.exit(1);
}
