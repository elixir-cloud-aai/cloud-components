import { html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/copy-button/copy-button.js";
import "@shoelace-style/shoelace/dist/components/tab/tab.js";
import "@shoelace-style/shoelace/dist/components/tab-group/tab-group.js";
import "@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/tag/tag.js";
import { repeat } from "lit/directives/repeat.js";
import { hostStyles } from "../../styles/host.styles.js";
import { primitiveStylesheet } from "../../styles/primitive.styles.js";
import sholelaceStyles from "../../styles/shoelace.styles.js";
import {
  getNestedCopyValue,
  getListData,
  renderLabel,
  cleanupString,
} from "./utils.js";
import { dataItemStyles } from "./details.styles.js";

/**
 * @element ecc-d-details-item
 * @summary A versatile component for displaying different types of detail items.
 * @description
 * The `ecc-d-details-item` component provides multiple display formats for data:
 * - Standard field with label and value
 * - Tabbed interface for organizing content
 * - Collapsible detail sections
 * - List display with tags
 *
 * It supports copy functionality and tooltips for enhanced usability.
 *
 * @property {Array<String>} tabs - Array of tab names for tabbed interface
 * @property {Boolean} copy - Whether to show a copy button for the value
 * @property {String} type - The type of detail item: "", "tab", "detail", or "list"
 * @property {String} value - The value to display
 * @property {String} label - The label for the detail item
 * @property {String} tooltip - Tooltip text to display additional information
 * @property {Boolean} normalizeLabel - Whether to normalize (clean up) the label text
 *
 * @state {Number} forceStateUpdate - Internal state to force updates when children change
 *
 * @method connectedCallback - Public lifecycle method called when element is connected to DOM
 * @method firstUpdated - Protected lifecycle method called after first update
 *
 * @private {method} tabs - Renders the tabbed interface
 * @private {method} detail - Renders the collapsible detail section
 * @private {method} list - Renders the list display with tags
 *
 * @slot - Default slot for content
 * @slot {tabName} - Named slots for each tab's content
 *
 * @dependency @shoelace-style/shoelace - Uses Shoelace components for UI elements
 */
export class EccDDetailsItem extends LitElement {
  static styles = [
    primitiveStylesheet,
    sholelaceStyles,
    hostStyles,
    dataItemStyles,
  ];

  @property({ type: Array, reflect: true }) tabs: string[] = [];
  @property({ type: Boolean, reflect: true }) copy = false;
  @property({ type: String, reflect: true }) type = "";
  @property({ type: String, reflect: true }) value = "";
  @property({ type: String, reflect: true }) label = "";
  @property({ type: String, reflect: true }) tooltip = "";
  @property({ type: Boolean, attribute: "normalize-label" }) normalizeLabel =
    false;

  @state() forceStateUpdate = 0;

  connectedCallback() {
    super.connectedCallback();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          // React does not handle custom elements very well
          // So we have to force a state update whenever the childList changes
          // so we can have access to its updated attributes
          this.forceStateUpdate += 1;
        }
      });
    });

    observer.observe(this.shadowRoot!, {
      childList: true,
    });
  }

  protected firstUpdated(): void {
    if (this.normalizeLabel) {
      this.label = cleanupString(this.label);
    }
  }

  render() {
    const tabs = () => html`
      <sl-tab-group class="tab-container">
        ${repeat(
          this.tabs,
          (label) => html`
            <sl-tab class="tab-header" slot="nav" panel="${label}"
              >${label}</sl-tab
            >
            <sl-tab-panel name="${label}" class="tab-body">
              <slot name="${label}"></slot>
            </sl-tab-panel>
          `
        )}
      </sl-tab-group>
    `;

    const detail = () => html`
      <sl-details>
        <div slot="summary">
          ${renderLabel(
            this.label,
            getNestedCopyValue(this),
            this.copy,
            this.tooltip
          )}
        </div>
        <div>
          <slot></slot>
        </div>
      </sl-details>
    `;

    const list = () => {
      const data = getListData(this.value);

      return html`
        <div class="field">
          ${renderLabel(this.label, data, this.copy, this.tooltip)}
          <div class="value tags">
            ${data.map(
              (item: string) => html`<sl-tag type="primary">${item}</sl-tag>`
            )}
          </div>
        </div>
      `;
    };

    if (this.type === "tab") {
      return tabs();
    }
    if (this.type === "detail") {
      return detail();
    }
    if (this.type === "list") {
      return list();
    }

    return html`
      <div class="field">
        ${renderLabel(this.label, this.value, this.copy, this.tooltip)}
        <span class="value">${this.value || "_"} </span>
      </div>
    `;
  }
}

window.customElements.define("ecc-d-details-item", EccDDetailsItem);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-d-details-item": EccDDetailsItem;
  }
}

export default EccDDetailsItem;
