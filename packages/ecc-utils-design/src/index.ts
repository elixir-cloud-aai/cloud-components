import { DesignSystem } from "@microsoft/fast-foundation";
import components from "./components/index.js";

export const designSystem = {
  prefix: "ecc-utils-design",
  shadowRootMode: "open",
};

DesignSystem.getOrCreate()
  .withPrefix(designSystem.prefix)
  .register(...components);
