const path = require("path");
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

module.exports = {
  componentsPrefix,
  npmDir,
  getAllComponents,
  pascalCase,
  reactDir: path.join(cwd(), ".", "src", "react"),
  normalizePath,
  escapeTemplateLiteral,
};
