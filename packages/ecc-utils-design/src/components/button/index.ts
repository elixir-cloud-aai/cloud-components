import { DesignSystem } from "@microsoft/fast-foundation";
import { Button } from "./button.js";
import { definition } from "./button.definition.js";
import { componentConfig } from "../config.js";

export const buttonDefinition = Button.compose(definition);

DesignSystem.getOrCreate()
  .withPrefix(componentConfig.prefix)
  .register(buttonDefinition());

export const button = DesignSystem.tagFor(Button);
