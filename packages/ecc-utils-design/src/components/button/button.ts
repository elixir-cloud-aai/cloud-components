import { attr } from "@microsoft/fast-element";
import { FoundationElement } from "@microsoft/fast-foundation";

export class Button extends FoundationElement {
  // name: used as the identifier for the wrapper styles
  @attr public name = "";
}
