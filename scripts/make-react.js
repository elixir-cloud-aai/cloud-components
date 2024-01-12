/* eslint-disable import/no-extraneous-dependencies */

const { cwd } = process;
const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const pascalCase = require("pascal-case");
const { componentsPrefix, npmDir, getAllComponents } = require("./utils.js");

const reactDir = path.join(cwd(), "./src/react");
// Clear build directory
fs.rmSync(reactDir, { recursive: true, force: true });
fs.mkdirSync(reactDir, { recursive: true });

// Fetch component metadata
const metadata = JSON.parse(
  fs.readFileSync(path.join(npmDir, "custom-elements.json"), "utf8")
);
const components = getAllComponents(metadata);
const index = [];
// add events for react components
// the add react to build

components.forEach((component) => {
  const tagWithoutPrefix = component.tagName.replace(componentsPrefix, "");
  const componentDir = path.join(reactDir, tagWithoutPrefix);
  const componentFile = path.join(componentDir, "index.ts");
  const eventImports = (component.events || [])
    .map(
      (event) =>
        `import type { ${event.eventName} } from '../../events/index.js';`
    )
    .join("\n");
  const eventExports = (component.events || [])
    .map(
      (event) =>
        `export type { ${event.eventName} } from '../../events/index.js';`
    )
    .join("\n");
  const eventNameImport =
    (component.events || []).length > 0
      ? `import { type EventName } from '@lit/react';`
      : ``;
  const events = (component.events || [])
    .map(
      (event) =>
        `${event.reactName}: '${event.name}'  as EventName<${event.eventName}>`
    )
    .join(",\n");

  fs.mkdirSync(componentDir, { recursive: true });

  const jsDoc = component.jsDoc || "";

  const source = prettier.format(
    `
      import * as React from 'react';
      import { createComponent } from '@lit/react';
      import Component from '../../${component.path}';

      ${eventNameImport}
      ${eventImports}
      ${eventExports}

      const tagName = '${component.tagName}'
      window.customElements.define('${component.tagName}', Component)

      ${jsDoc}
      const reactWrapper = createComponent({
        tagName,
        elementClass: Component,
        react: React,
        events: {
          ${events}
        },
        displayName: "${pascalCase(component.tagName)}"
      })

      export default reactWrapper
    `,
    {
      parser: "babel-ts",
    }
  );

  index.push(
    `export { default as ${component.name} } from './${tagWithoutPrefix}/index.js';`
  );

  fs.writeFileSync(componentFile, source, "utf8");
});

// Generate the index file
fs.writeFileSync(path.join(reactDir, "index.ts"), index.join("\n"), "utf8");
