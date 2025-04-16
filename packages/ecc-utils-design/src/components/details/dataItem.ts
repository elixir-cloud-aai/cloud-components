import { html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/copy-button/copy-button.js";
import "@shoelace-style/shoelace/dist/components/tab/tab.js";
import "@shoelace-style/shoelace/dist/components/tab-group/tab-group.js";
import "@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/tag/tag.js";
import { hostStyles } from "../../styles/host.styles.js";
import { primitiveStylesheet } from "../../styles/primitive.styles.js";
import sholelaceStyles from "../../styles/shoelace.styles.js";
import { getNestedCopyValue, getListData, renderLabel } from "./utils.js";
import { dataItemStyles } from "./details.styles.js";

export class EccUtilsDesignDataItem extends LitElement {
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

  render() {
    const tabs = () => html`
      <sl-tab-group class="tab-container">
        ${this.tabs.map(
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

export default EccUtilsDesignDataItem;
