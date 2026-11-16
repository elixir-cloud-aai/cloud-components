const path = require("path");
const fg = require("fast-glob");
const cwd = require("process").cwd;

const componentsPrefix = "ecc-utils-design-";
const npmDir = path.join("./dist");

const getAllComponents = (metadata) => {
  const allComponents = [];

  metadata.modules.forEach((module) => {
    module.declarations?.forEach((declaration) => {
      if (declaration.customElement) {
        const component = declaration;
        const { path } = module;

        if (component && component.tagName) {
          allComponents.push(Object.assign(component, { path }));
        }
      }
    });
  });

  return allComponents;
};

// do not convert to arrow function
// because this is taking advantage of function hoisting when it is added to the CEM config file
function pascalCase(str) {
  if (!str || typeof str !== "string") return "";

  return str
    .match(/[a-z]+/gi)
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

function normalizePath(filename) {
  return filename.split(path.win32.sep).join(path.posix.sep);
}

// Escapes text for a template literal, so that it evaluates to the same text.
// Backslashes go first: escaping them last would also escape the backslashes
// that the other replacements add
function escapeTemplateLiteral(text) {
  return text
    .replaceAll("\\", "\\\\")
    .replaceAll("`", "\\`")
    .replaceAll("${", "\\${");
}

// The entry points that tsup builds from a package's source directory: the
// root, every component, provider and React wrapper, and the utilities
// (`utils/index.ts`, if any), which a package exports as a subpath of its
// own, so that apps can import them without registering the components
function getBuildEntries(sourceDir) {
  // fast-glob takes forward slashes only
  const dir = normalizePath(sourceDir);
  return [
    `${dir}/index.ts`,
    ...fg.sync(`${dir}/components/**/!(*.(test)).ts`, {
      ignore: ["**/tests/**"],
    }),
    ...fg.sync(`${dir}/providers/**/*.ts`, { ignore: ["**/tests/**"] }),
    ...fg.sync(`${dir}/react/**/*.ts`),
    ...fg.sync(`${dir}/utils/index.ts`),
  ];
}

module.exports = {
  componentsPrefix,
  getBuildEntries,
  npmDir,
  getAllComponents,
  pascalCase,
  reactDir: path.join(cwd(), ".", "src", "react"),
  normalizePath,
  escapeTemplateLiteral,
};
