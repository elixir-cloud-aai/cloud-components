import { html, LitElement } from "lit";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/copy-button/copy-button.js";
import "@shoelace-style/shoelace/dist/components/tab/tab.js";
import "@shoelace-style/shoelace/dist/components/tab-group/tab-group.js";
import "@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js";
import "@shoelace-style/shoelace/dist/components/details/details.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/tag/tag.js";
import { hostStyles } from "../../styles/host.styles.js";
import { detailsStyles } from "./details.styles.js";
import { primitiveStylesheet } from "../../styles/primitive.styles.js";
import sholelaceStyles from "../../styles/shoelace.styles.js";
import { formatBtn } from "./utils.js";

/**
 * @element ecc-d-details
 * @summary A details component that provides a container with action buttons.
 * @description
 * The `ecc-d-details` component serves as a container that can display content along with
 * action buttons positioned on the left and right sides. It's designed to provide a consistent
 * layout for detail views with associated actions.
 *
 * @property {Array<Element>} leftActionButtons - Action buttons positioned on the left side
 * @property {Array<Element>} rightActionButtons - Action buttons positioned on the right side
 *
 * @method getLeftActionButtons - Returns an array of action buttons positioned on the left
 * @method getRightActionButtons - Returns an array of action buttons positioned on the right
 *
 * @slot - Default slot for content
 *
 * @dependency @shoelace-style/shoelace - Uses Shoelace components for UI elements
 */
class EccDDetails extends LitElement {
  static styles = [
    primitiveStylesheet,
    sholelaceStyles,
    hostStyles,
    detailsStyles,
  ];

  render() {
    const getLeftActionButtons = () =>
      Array.from(
        this.querySelectorAll('[ecc-type="action"][ecc-position="left"]')
      );

    const getRightActionButtons = () =>
      Array.from(
        this.querySelectorAll('[ecc-type="action"]:not([ecc-position="left"])')
      );

    return html`
      <slot></slot>
      <div class="actions">
        <div class="left">
          ${getLeftActionButtons().map((btn) => formatBtn(btn))}
        </div>
        <div class="right">
          ${getRightActionButtons().map((btn) => formatBtn(btn))}
        </div>
      </div>
    `;
  }
}

window.customElements.define("ecc-d-details", EccDDetails);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-d-details": EccDDetails;
  }
}

export default EccDDetails;
