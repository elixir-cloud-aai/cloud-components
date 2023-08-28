/**
 * Import DesingSystem and envoke/register all the components here
 */
import { DesignSystem } from "@microsoft/fast-foundation";
import components from "./components/ecc-trs-filer/index.js";

// Register all the components
components.forEach((component) => {
  DesignSystem.getOrCreate().withShadowRootMode("open").register(component);
});
