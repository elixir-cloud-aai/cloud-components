const path = require("path");
const { cwd } = require("process");

const componentsPrefix = "ecc-utils-design-";
const npmDir = path.join(cwd(), "dist");

const getAllComponents = (metadata) => {
  const allComponents = [];

  metadata.modules.forEach((module) => {
    module.declarations?.forEach((declaration) => {
      if (declaration.customElement) {
        const component = declaration;
        const { path } = module;

        if (component) {
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
