/**
 * Import DesingSystem and envoke/register all the components here
 */
import { DesignSystem } from "@microsoft/fast-foundation";
import components from "./components/trs-list/index.js";

// Register all the components

const prefix = "ecc-trs-";

components.forEach((component) => {
  const componentNameWithPrefix = `${prefix}${component.name}`;
  DesignSystem.getOrCreate()
    .withShadowRootMode("open")
    .register({
      ...component,
      name: componentNameWithPrefix,
    });
});
