/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */
import fs from "fs";
import { program } from "commander";
import { customElementVsCodePlugin } from "custom-element-vs-code-integration";
import { customElementJetBrainsPlugin } from "custom-element-jet-brains-integration";
import packageJson from "./package.json" assert { type: "json" };

const options = program
  .option("-o, --outdir <string>")
  .option("--litelement")
  .option("--analyze", "", true)
  .parse()
  .opts();

function pascalCase(text) {
  const a = text
    .toLowerCase()
    .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
  return a.substring(0, 1).toLowerCase() + a.substring(1);
}

const componentsPrefix = packageJson.componentsPrefix;
const packageData = JSON.parse(fs.readFileSync("package.json", "utf8"));
const { name, description, version, author, homepage, license } = packageData;

const getComponentDocumentation = (tag) =>
  `https://elixir-cloud-components.vercel.app/design/components/${tag.replace(
    componentsPrefix,
    ""
  )}.html`;

function replace(string, terms) {
  terms.forEach(({ from, to }) => {
    string = string?.replace(from, to);
  });

  return string;
}

export default {
  globs: ["src/components/**/*.ts"],
  exclude: ["**/*.styles.ts", "**/*.test.ts", "index.ts"],
  plugins: [
    // Append package data
    {
      name: "elixir-cloud-package-data",
      packageLinkPhase({ customElementsManifest }) {
        customElementsManifest.package = {
          name,
          description,
          version,
          author,
          homepage,
          license,
        };
      },
    },
    {
      name: "shoelace-react-event-names",
      analyzePhase({ ts, node, moduleDoc }) {
        switch (node.kind) {
          case ts.SyntaxKind.ClassDeclaration: {
            const className = node.name.getText();
            const classDoc = moduleDoc?.declarations?.find(
              (declaration) => declaration.name === className
            );

            classDoc.jsDoc = node.jsDoc
              ?.map((jsDoc) => jsDoc.getFullText())
              .join("\n");

            if (classDoc?.events) {
              classDoc.events.forEach((event) => {
                event.reactName = `on${pascalCase(event.name)}`;
                event.eventName = `${pascalCase(event.name)}Event`;
              });
            }
            break;
          }
          default:
            break;
        }
      },
    },
    {
      name: "shoelace-translate-module-paths",
      packageLinkPhase({ customElementsManifest }) {
        customElementsManifest?.modules?.forEach((mod) => {
          //
          // CEM paths look like this:
          //
          //  src/components/form/index.ts
          //
          // But we want them to look like this:
          //
          //  components/form/index.js
          //
          const terms = [
            { from: /^src\//, to: "" }, // Strip the src/ prefix
            { from: /\.(t|j)sx?$/, to: ".js" }, // Convert .ts to .js
          ];

          mod.path = replace(mod.path, terms);

          for (const ex of mod.exports ?? []) {
            ex.declaration.module = replace(ex.declaration.module, terms);
          }

          for (const dec of mod.declarations ?? []) {
            if (dec.kind === "class") {
              for (const member of dec.members ?? []) {
                if (member.inheritedFrom) {
                  member.inheritedFrom.module = replace(
                    member.inheritedFrom.module,
                    terms
                  );
                }
              }
            }
          }
        });
      },
    },
    // Generate custom VS Code data
    customElementVsCodePlugin({
      outdir: options.outdir,
      cssFileName: null,
      referencesTemplate: (_, tag) => [
        {
          name: "Documentation",
          url: getComponentDocumentation(tag),
        },
      ],
    }),
    customElementJetBrainsPlugin({
      outdir: "./dist",
      excludeCss: true,
      packageJson: false,
      referencesTemplate: (_, tag) => ({
        name: "Documentation",
        url: getComponentDocumentation(tag),
      }),
    }),
  ],
};
