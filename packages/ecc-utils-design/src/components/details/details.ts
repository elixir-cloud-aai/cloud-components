import { html, css, LitElement, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import _, { toLower } from "lodash-es";
import getShoelaceStyles from "../../styles/shoelace.styles.js";
import "@shoelace-style/shoelace/dist/components/tab-group/tab-group.js";
import "@shoelace-style/shoelace/dist/components/tab/tab.js";
import "@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js";
import "@shoelace-style/shoelace/dist/components/copy-button/copy-button.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/tag/tag.js";
import "@shoelace-style/shoelace/dist/components/icon/icon.js";
import "@shoelace-style/shoelace/dist/components/details/details.js";
import { hostStyles } from "../../styles/host.styles.js";

export interface Children {
  label?: string;
  path: string;
  copy?: boolean;
  defaultValue?: any;
}

export interface Field {
  tabGroup: string;
  children: Array<Children>;
}

interface FooterButton {
  key: string;
  name: string;
  size: "small" | "medium" | "large";
  variant: "primary" | "success" | "neutral" | "warning" | "danger";
  outline: boolean;
  pill: boolean;
  icon?: {
    name: string;
    viewBox: string;
    path: string;
  };
}

export default class Details extends LitElement {
  static styles = [
    getShoelaceStyles(
      document.querySelector("html")?.classList.contains("dark")
    ),
    hostStyles,
    css`
      :host {
        display: block;
      }

      .container {
        padding: var(--sl-spacing-2x-small);
        margin-bottom: var(--sl-spacing-medium);
        border-radius: var(--sl-border-radius-small);
      }

      .data-container {
        display: flex;
        justify-content: space-between;
        padding: var(--sl-spacing-small);
      }

      .label {
        display: flex;
        align-items: flex-start;
        width: 100%;
        height: 100%;
        font-weight: var(--sl-font-weight-semibold);
      }

      .value {
        width: 100%;
        max-height: var(--sl-spacing-4x-large);
        overflow-y: scroll;
        -ms-overflow-style: none; /* Internet Explorer 10+ */
        scrollbar-width: none; /* Firefox */
      }

      .value::-webkit-scrollbar {
        display: none; /* Safari and Chrome */
      }

      /* CSS related to footer */

      .footer-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .footer-buttons {
        display: flex;
        gap: var(--sl-spacing-small);
      }

      /* CSS related to collapsable fields */

      .panel-container {
        height: calc(5 * var(--sl-spacing-4x-large));
        overflow-y: scroll;
        -ms-overflow-style: none; /* Internet Explorer 10+ */
        scrollbar-width: none; /* Firefox */
      }

      .panel-container::-webkit-scrollbar {
        display: none; /* Safari and Chrome */
      }

      .summary {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      sl-details::part(base) {
        padding: var(--sl-spacing-3x-small);
        border: none;
        background-color: transparent;
      }

      sl-details::part(base):hover {
        cursor: pointer;
      }

      sl-details::part(header) {
        padding: var(--sl-spacing-small);
      }

      sl-details::part(header):hover {
        box-shadow: var(--sl-shadow-medium);
      }

      sl-details::part(content) {
        padding: var(--sl-spacing-3x-small);
      }
    `,
  ];

  @property({ type: Object, reflect: true }) data = {};
  @property({ type: Array, reflect: true }) fields: Array<Field> = [];
  @property({ type: Array, reflect: true }) buttons: Array<FooterButton> = [];

  @state() private loading: Array<boolean> = [];

  constructor() {
    super();
    this.loading = new Array(this.buttons.length).fill(false);
  }

  /**
   * Use to set the loading state of a button
   * @param index index of the button to set loading state
   * @param loading loading state, `true` set the button to loading state
   */
  public setButtonLoading(index: number, loading: boolean) {
    this.loading[index] = loading;
    this.requestUpdate();
  }

  private _renderData(
    data: string,
    label: string,
    copy = false
  ): TemplateResult {
    if (data === null || data === undefined) return html``;
    this.requestUpdate();
    return html`
      <div part="data-container" class="container data-container">
        <div part="label" class="label">
          <span>${label}</span>
          ${copy
            ? html`
                <sl-copy-button
                  value=${data}
                  copy-label="Click to copy ${label}"
                  success-label="${label} copied"
                  error-label="Error"
                ></sl-copy-button>
              `
            : html``}
        </div>
        <div part="value" class="value">${data}</div>
      </div>
    `;
  }

  private _renderArray(
    data: Array<any>,
    label: string,
    copy = false
  ): TemplateResult {
    if (data === null || data === undefined || data.length === 0) return html``;
    return html`
      <div part="container" class="container">
        <sl-details>
          <div part="summary-container" slot="summary" class="summary">
            <span part="label" class="label">${label}</span>
            <span>
              ${copy
                ? html`
                    <sl-copy-button
                      value=${JSON.stringify(data)}
                      copy-label="Click to copy strigified JSON of ${label}"
                      success-label="${label} copied"
                      error-label="Error"
                    ></sl-copy-button>
                  `
                : html``}
            </span>
          </div>
          ${data.map((value, index) => {
            const newLabel = `${label}[${index}]`;
            if (value === null || value === undefined) {
              return null; // Skip rendering for null or undefined values
            }
            if (Array.isArray(value)) {
              return this._renderArray(value, newLabel);
            }
            if (typeof value === "object") {
              return this._renderObject(value, newLabel);
            }
            return html` <div class="data-container value">${value}</div> `;
          })}
        </sl-details>
      </div>
    `;
  }

  private _renderObject(
    data: any,
    label: string,
    copy = false
  ): TemplateResult {
    if (
      data === null ||
      data === undefined ||
      Object.entries(data).length === 0
    )
      return html``;
    return html`
      <div part="container" class="container">
        <sl-details>
          <div part="summary-container" slot="summary" class="summary">
            <span part="label" class="label">${label}</span>
            <span class="copy-button">
              ${copy
                ? html`
                    <sl-copy-button
                      value=${JSON.stringify(data)}
                      copy-label="Click to copy strigified JSON of ${label}"
                      success-label="${label} copied"
                      error-label="Error"
                    ></sl-copy-button>
                  `
                : html``}
            </span>
          </div>
          ${Object.entries(data).map(([dataLabel, dataValue], index) => {
            if (dataValue === null || dataValue === undefined) {
              return null; // Skip rendering for null or undefined values
            }
            if (Array.isArray(dataValue)) {
              return this._renderArray(dataValue, `${dataLabel}-${index}`);
            }
            if (typeof dataValue === "object") {
              return this._renderObject(dataValue, `${dataLabel}-${index}`);
            }
            return this._renderData(dataValue.toString(), dataLabel);
          })}
        </sl-details>
      </div>
    `;
  }

  private _renderField(
    tabName: string,
    children: Array<Children>
  ): TemplateResult {
    return html`
      <sl-tab slot="nav" panel="${toLower(tabName)}">${tabName}</sl-tab>
      <sl-tab-panel name="${toLower(tabName)}">
        <div part="panel-container" class="panel-container">
          ${children.map((childFieldInfo: Children) => {
            const childData = _.get(
              this.data,
              childFieldInfo.path,
              childFieldInfo.defaultValue
            );

            if (
              childData == null ||
              (Array.isArray(childData) && childData.length === 0) ||
              Object.entries(childData).length === 0
            ) {
              if (typeof childData !== "number") return html``;
            }

            const label =
              (
                childFieldInfo.label ||
                childFieldInfo.path.split(".").pop() ||
                "Undefined"
              )
                .replace(/_/g, " ") // Replace underscores with spaces globally
                .charAt(0)
                .toUpperCase() +
              (
                childFieldInfo.label ||
                childFieldInfo.path.split(".").pop() ||
                "Undefined"
              ).slice(1);

            const copy =
              childFieldInfo.copy !== undefined ? childFieldInfo.copy : false;
            if (Array.isArray(childData)) {
              return this._renderArray(childData, label, copy);
            }
            if (typeof childData === "object") {
              return this._renderObject(childData, label, copy);
            }
            return this._renderData(childData.toString(), label, copy);
          })}
        </div>
      </sl-tab-panel>
    `;
  }

  private _renderFields(fields: Array<Field>): TemplateResult {
    if (fields === null || fields === undefined || fields.length === 0)
      return html``;
    return html`
      <sl-tab-group class="details">
        ${fields.map((field) =>
          this._renderField(field.tabGroup, field.children)
        )}
      </sl-tab-group>
    `;
  }

  private _renderSvg(icon: FooterButton["icon"]): TemplateResult {
    this.requestUpdate();
    return html`
      <svg
        slot="prefix"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="${icon?.viewBox}"
      >
        <path d="${icon?.path}" />
      </svg>
    `;
  }

  private _handleClick(event: Event, key: string, index: number) {
    this.dispatchEvent(
      new CustomEvent(`ecc-utils-button-click`, {
        detail: {
          index,
          Key: key,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _renderFooter(): TemplateResult {
    return html`
      <div part="footer-container" class="footer-container">
        <span part="footer-buttons" class="footer-buttons">
          ${this.buttons.map((button, index) => {
            const { size, variant, outline, pill, name, icon, key } = button;
            return html`
              <sl-button
                ?loading="${this.loading[index]}"
                ?pill="${pill}"
                variant="${variant}"
                ?outline="${outline}"
                size="${size}"
                @click="${(event: Event) =>
                  this._handleClick(event, key, index)}"
              >
                ${icon ? this._renderSvg(icon) : ""} ${name}
              </sl-button>
            `;
          })}
        </span>
        <span part="footer-slot" class="footer-slot">
          <slot name="footer"></slot>
        </span>
      </div>
    `;
  }

  render() {
    return html` ${this._renderFields(this.fields)} ${this._renderFooter()} `;
  }
}
