#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync, spawn } = require("child_process");
const glob = require("fast-glob");
const yargs = require("yargs");

try {
  const argv = yargs(process.argv.slice(2)).argv;

  const inputSource = argv.source ?? "./src/tailwind.css";
  const watch = argv.watch ?? false;
  // Declare watchProcesses at the global scope
  const watchProcesses = [];

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

  // Function to process component-specific styles
  async function processComponentStyles() {
    try {
      console.log("Generating component-specific styles...");

      // Create temp directory for processing
      const tempDir = path.join(process.cwd(), "temp-tailwind");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Find all component directories
      const componentDirs = glob.sync("src/components/*/", {
        cwd: process.cwd(),
        onlyDirectories: true,
      });

      console.log(
        `Found ${componentDirs.length} component directories to process`
      );

      // Process each component directory
      for (const dir of componentDirs) {
        // Get the directory name correctly
        const dirName = path.basename(dir.replace(/\/$/, ""));

        const componentFiles = glob.sync(path.join(dir, "*.ts"), {
          cwd: process.cwd(),
          ignore: ["**/index.ts", "**/*styles.ts"],
        });

        // Skip empty directories
        if (componentFiles.length === 0) continue;

        // Create component config
        const configPath = path.join(tempDir, `tailwind.${dirName}.css`);
        fs.copyFileSync(inputSource, configPath);

        const fileContent = fs.readFileSync(configPath, "utf-8");
        const lines = fileContent.split("\n");

        const newContent = [
          lines[0],
          ...componentFiles.map((file) => `@source "../${file}";`),
          ...lines.slice(1),
        ].join("\n");

        fs.writeFileSync(configPath, newContent);

        // Output paths
        const componentCssPath = path.join(tempDir, `${dirName}.css`);

        console.log(`Processing ${dirName}...`);

        if (watch) {
          // In watch mode, start the process and continue
          const child = spawn(
            "npx",
            [
              "@tailwindcss/cli",
              "-i",
              configPath,
              "-o",
              componentCssPath,
              "--watch",
            ],
            {
              stdio: "inherit",
            }
          );
          watchProcesses.push(child);

          // Wait for output file to be created before setting up watcher
          const setupWatcher = () => {
            if (fs.existsSync(componentCssPath)) {
              // Set up a watcher for the output CSS file
              fs.watchFile(componentCssPath, { interval: 1000 }, () => {
                try {
                  // When CSS file changes, update the Lit template
                  let cssContent = fs.readFileSync(componentCssPath, "utf8");
                  cssContent = cssContent.replaceAll("`", "\\`");
                  cssContent = cssContent.replaceAll("\\", "\\\\");

                  const litTemplate = `
import { css } from "lit";
export const ComponentStyles = css\` ${cssContent} \`
                  `;

                  const stylesPath = path.join(
                    process.cwd(),
                    dir,
                    `tw-styles.ts`
                  );
                  fs.writeFileSync(stylesPath, litTemplate);

                  console.log(`✓ Updated styles for ${dirName}`);
                } catch (err) {
                  console.error(`Error updating styles for ${dirName}:`, err);
                }
              });

              // Initial file read once it exists
              try {
                let cssContent = fs.readFileSync(componentCssPath, "utf8");
                cssContent = cssContent.replaceAll("`", "\\`");
                cssContent = cssContent.replaceAll("\\", "\\\\");

                const litTemplate = `
import { css } from "lit";
export const ComponentStyles = css\` ${cssContent} \`
                `;

                const stylesPath = path.join(
                  process.cwd(),
                  dir,
                  `tw-styles.ts`
                );
                fs.writeFileSync(stylesPath, litTemplate);

                console.log(`✓ Initial styles generated for ${dirName}`);
              } catch (err) {
                console.error(
                  `Error generating initial styles for ${dirName}:`,
                  err
                );
              }
            } else {
              // Retry after a delay if file doesn't exist yet
              console.log(`Waiting for ${componentCssPath} to be created...`);
              setTimeout(setupWatcher, 1000);
            }
          };

          // Start checking for file after a short delay
          setTimeout(setupWatcher, 2000);
        } else {
          // In non-watch mode, process synchronously
          execSync(
            `npx @tailwindcss/cli -i ${configPath} -o ${componentCssPath}`,
            {
              stdio: "inherit",
            }
          );

          // Convert to Lit template
          let cssContent = fs.readFileSync(componentCssPath, "utf8");
          cssContent = cssContent.replaceAll("`", "\\`");
          cssContent = cssContent.replaceAll("\\", "\\\\");

          const litTemplate = `
import { css } from "lit";
export const ComponentStyles = css\` ${cssContent} \`
          `;

          // Write component styles
          const stylesPath = path.join(process.cwd(), dir, `tw-styles.ts`);
          fs.writeFileSync(stylesPath, litTemplate);

          console.log(`✓ Generated styles for ${dirName}`);

          // Clean up temp files only in non-watch mode
          fs.unlinkSync(configPath);
          fs.unlinkSync(componentCssPath);
        }
      }

      // Clean up temp directory only in non-watch mode
      if (!watch) {
        fs.rmdirSync(tempDir, { recursive: true });
        console.log("Component style generation complete!");
      } else {
        console.log("Watch mode active. Waiting for changes...");
      }
    } catch (error) {
      console.error("Error generating component styles:", error);
    }
  }

  // Main function to process Tailwind
  function processTailwind() {
    try {
      console.log(`Processing Tailwind CSS: ${inputSource}`);

      if (watch) {
        // Set up a watcher for the processed file to convert to Lit format
        fs.watch(inputSource, (eventType) => {
          if (eventType === "change") {
            processComponentStyles();
          }
        });
        processComponentStyles();

        // Handle process exit
        process.on("SIGINT", () => {
          console.log("Terminating Tailwind watchers...");
          watchProcesses.forEach((child) => child.kill());
          process.exit(0);
        });
      } else {
        // Also generate component styles
        processComponentStyles();
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
