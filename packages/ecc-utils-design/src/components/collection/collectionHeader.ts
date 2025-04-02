import { LitElement, TemplateResult, html } from "lit";
import { hostStyles } from "../../styles/host.styles.js";
import collectionStyles from "./collection.styles.js";
import { primitiveStylesheet } from "../../styles/primitive.styles.js";
import sholelaceStyles from "../../styles/shoelace.styles.js";
import { errorAlert } from "./utils.js";

/**
 * @element ecc-d-collection-header
 * @summary A header component for collections that provides a container for header content.
 * @description
 * The `ecc-d-collection-header` component serves as a container for collection headers.
 * It provides a consistent layout and styling for header content in collection components.
 *
 * @method error - Public method that displays an error message
 *
 * @slot - Default slot for header content
 *
 * @dependency @shoelace-style/shoelace - Uses Shoelace components for UI elements
 */
export default class EccDCollectionHeader extends LitElement {
  static styles = [
    primitiveStylesheet,
    sholelaceStyles,
    hostStyles,
    collectionStyles,
  ];

  public error = (message: string) => errorAlert(this, message);

  protected render(): TemplateResult {
    return html` <div class="header">
      <slot></slot>
    </div>`;
  }
}

window.customElements.define("ecc-d-collection-header", EccDCollectionHeader);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-d-collection-header": EccDCollectionHeader;
  }
}
