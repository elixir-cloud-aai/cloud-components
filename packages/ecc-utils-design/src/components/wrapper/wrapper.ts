import { attr } from "@microsoft/fast-element";
import { FoundationElement } from "@microsoft/fast-foundation";
import { registerDesignTokens, setToken } from "../../design-system/index.js";
import { backgroundColor, textColor } from "../../design-system/tokens.js";

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
    setToken(this, configJSON.backgroundColor, backgroundColor);
    setToken(this, configJSON.textColor, textColor);
  }
}
