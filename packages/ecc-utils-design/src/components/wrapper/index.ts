import { DesignSystem } from "@microsoft/fast-foundation";
import { Wrapper } from "./wrapper.js";
import { definition } from "./wrapper.definition.js";
import { componentConfig } from "../config.js";

export const wrapperDefinition = Wrapper.compose(definition);

DesignSystem.getOrCreate()
  .withPrefix(componentConfig.prefix)
  .withShadowRootMode(componentConfig.shadowRootMode)
  .register(wrapperDefinition());

export const wrapper = DesignSystem.tagFor(Wrapper);
