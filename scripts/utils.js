const path = require("path");

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

module.exports = {
  componentsPrefix,
  npmDir,
  getAllComponents,
};
