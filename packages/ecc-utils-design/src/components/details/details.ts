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

export class EccUtilsDesignDetails extends LitElement {
  static styles = [
    primitiveStylesheet,
    sholelaceStyles,
    hostStyles,
    detailsStyles,
  ];

  render() {
    const getLeftActionButtons = () =>
      Array.from(this.querySelectorAll('[type="action"][position="left"]'));

    const getRightActionButtons = () =>
      Array.from(
        this.querySelectorAll('[type="action"]:not([position="left"])')
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

export default EccUtilsDesignDetails;
