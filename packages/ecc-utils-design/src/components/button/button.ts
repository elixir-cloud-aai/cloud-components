import { attr } from "@microsoft/fast-element";
import { FoundationElement } from "@microsoft/fast-foundation";
import { defaultComponentName } from "../../design-system/index.js";

export class Button extends FoundationElement {
  // name: used as the identifier for the wrapper styles
  @attr public name = defaultComponentName;
}
