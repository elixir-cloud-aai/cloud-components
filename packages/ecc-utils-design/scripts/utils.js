export const componentsPrefix = "ecc-utils-design-";
export const npmDir = "dist";

export const getAllComponents = (metadata) => {
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
