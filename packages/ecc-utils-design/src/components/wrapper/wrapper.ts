import { attr } from "@microsoft/fast-element";
import { FoundationElement } from "@microsoft/fast-foundation";
import { registerDesignTokens, setColor } from "../../design-system/index.js";
import { color } from "../../design-system/tokens.js";

/**
 * A Custom HTML Element.
 *
 * @public
 */
export class Wrapper extends FoundationElement {
  @attr config = "";

  connectedCallback() {
    super.connectedCallback();
    registerDesignTokens(this);
    const configJSON = JSON.parse(this.config);
    setColor(this, configJSON.color, color);
  }
}
