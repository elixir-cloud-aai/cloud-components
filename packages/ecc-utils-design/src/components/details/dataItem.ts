import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js"; // For tooltips if needed
import "@shoelace-style/shoelace/dist/components/copy-button/copy-button.js";
import "@shoelace-style/shoelace/dist/components/tab/tab.js";
import "@shoelace-style/shoelace/dist/components/tab-group/tab-group.js";
import "@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/tag/tag.js";
import { hostStyles } from "../../styles/host.styles.js";
import { primitiveStylesheet } from "../../styles/primitive.styles.js";
import sholelaceStyles from "../../styles/shoelace.styles.js";
import { getNestedCopyValue, getListData, formatLabel } from "./utils.js";
import { dataItemStyles } from "./details.styles.js";

export class EccUtilsDesignDataItem extends LitElement {
  static styles = [
    primitiveStylesheet,
    sholelaceStyles,
    hostStyles,
    dataItemStyles,
  ];

  @property({ type: Array, reflect: true }) tabs = [];
  @property({ type: Boolean }) copy = false;
  @property({ type: String }) type = "";
  @property() tooltip = "";
  @property() label = "";
  @property({ type: String }) value = "";

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
          ${formatLabel(this.label)}
          ${this.copy
            ? html`<sl-copy-button
                value=${JSON.stringify(getNestedCopyValue(this))}
              ></sl-copy-button>`
            : ""}
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
          <div class="key">
            <sl-tooltip hoist trigger=${this.tooltip ? "hover" : "manual"}>
              <div slot="content">${this.tooltip}</div>
              ${formatLabel(this.label)}
            </sl-tooltip>
            ${this.copy
              ? html`<sl-copy-button
                  .value=${JSON.stringify(data)}
                ></sl-copy-button>`
              : ""}
          </div>
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
        <span class="key">
          <sl-tooltip content=${this.tooltip} hoist>
            ${formatLabel(this.label)}
          </sl-tooltip>
          ${this.copy
            ? html`<sl-copy-button value=${this.textContent}></sl-copy-button>`
            : ""}
        </span>
        <span class="value">${this.value || "_"} </span>
      </div>
    `;
  }
}

export default EccUtilsDesignDataItem;
