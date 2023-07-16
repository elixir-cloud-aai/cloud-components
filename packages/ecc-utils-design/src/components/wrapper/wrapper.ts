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
  // config: handle passing the design system config
  @attr config = "";

  connectedCallback() {
    super.connectedCallback();
    registerDesignTokens(this);
    const configJSON = JSON.parse(this.config);
    if (configJSON.backgroundColor)
      setToken(this, configJSON.backgroundColor, backgroundColor);
    if (configJSON.textColor) setToken(this, configJSON.textColor, textColor);
  }
}
