import { DesignSystem } from "@microsoft/fast-foundation";
import { Wrapper } from "./wrapper.js";
import { definition } from "./wrapper.definition.js";
import { designSystem } from "../config.js";

export const wrapperDefinition = Wrapper.compose(definition);

DesignSystem.getOrCreate()
  .withPrefix(designSystem.prefix)
  .register(wrapperDefinition());

export const wrapper = DesignSystem.tagFor(Wrapper);
