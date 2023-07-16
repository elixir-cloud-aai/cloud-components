import { attr } from "@microsoft/fast-element";
import { FoundationElement } from "@microsoft/fast-foundation";

/**
 * A Custom HTML Element.
 *
 * @public
 */
export class Button extends FoundationElement {
  @attr type = "primary";

  connectedCallback() {
    super.connectedCallback();
  }
}
