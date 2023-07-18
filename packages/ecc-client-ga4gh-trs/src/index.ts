/**
 * Import DesingSystem and envoke/register all the components here
 */
import { DesignSystem } from "@microsoft/fast-foundation";
import components from "./components/trs-list/index.js";
import { componentConfig } from "./components/config.js";

// Register all the components

components.forEach((component) => {
  DesignSystem.getOrCreate()
    .withShadowRootMode("open")
    .withPrefix(componentConfig.prefix)
    .register({
      ...component,
    });
});
