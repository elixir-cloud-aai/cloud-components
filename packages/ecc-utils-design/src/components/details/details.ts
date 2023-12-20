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
  // collapsible?: boolean;
}

export interface Field {
  tabGroup: string;
  children: Array<Children>;
}

interface FooterButton {
  key: string;
  name: string;
}

export default class EccUtilsDesignDetails extends LitElement {
  static styles = [
    getShoelaceStyles(
      document.querySelector("html")?.classList.contains("dark")
    ),
    hostStyles,
    css`
      :host {
        display: block;
        color: var(--sl-color-gray-900);
      }

      .container {
        border-radius: var(--sl-border-radius-small);
      }

      .data-container {
        display: flex;
        justify-content: space-between;
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

      .label-copy {
        display: flex;
        justify-content: space-between;
        align-items: center;
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

      .footer-slot {
        display: block;
      }

      .button {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--sl-spacing-2x-small);
      }

      /* CSS related to collapsable fields */
      .panel {
        min-height: 40vh;
      }

      .panel-container {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-large);
      }

      .summary {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      sl-copy-button::part(button) {
        padding: 0;
        margin-left: var(--sl-font-size-2x-small);
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

  private _renderLabel(
    label: string,
    copy: boolean,
    data: any,
    copyLabel: string,
    successLabel: string,
    errorLabel: string
  ) {
    this.requestUpdate();
    return html` <span class="label-copy">
      <span>${label}</span>
      ${copy
        ? html`
            <sl-copy-button
              value=${data}
              copy-label=${copyLabel}
              success-label=${successLabel}
              error-label=${errorLabel}
            ></sl-copy-button>
          `
        : html``}
    </span>`;
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
          ${this._renderLabel(
            label,
            copy,
            data,
            `Copy`,
            `${label} copied!`,
            "Error"
          )}
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
          ${this._renderLabel(
            label,
            copy,
            JSON.stringify(data),
            `Copy JSON`,
            `${label} copied!`,
            "Error"
          )}
						</span>
					</div>
          <div class="panel-container">
            ${data.map((value, index) => {
              const newLabel = `${label} ${index + 1}`;
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
          </div>
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
            ${this._renderLabel(
              label,
              copy,
              JSON.stringify(data),
              `Copy JSON`,
              `${label} copied!`,
              "Error"
            )}
          </div>
          <div class="panel-container">
            ${Object.entries(data).map(([dataLabel, dataValue], index) => {
              const newLabel = `${dataLabel} ${index}`;
              if (dataValue === null || dataValue === undefined) {
                return null; // Skip rendering for null or undefined values
              }
              if (Array.isArray(dataValue)) {
                return this._renderArray(dataValue, newLabel);
              }
              if (typeof dataValue === "object") {
                return this._renderObject(dataValue, newLabel);
              }
              return this._renderData(dataValue.toString(), dataLabel);
            })}
          </div>
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
        <div part="panel-container" class="panel-container panel">
          ${children.map((childFieldInfo: Children) => {
            const childData = _.get(this.data, childFieldInfo.path);

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

  private _handleClick(key: string, index: number) {
    this.dispatchEvent(
      new CustomEvent(`ecc-utils-button-${key}-click`, {
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
            const { name, key } = button;
            return html`
              <sl-button
                ?loading="${this.loading[index]}"
                @click=${() => this._handleClick(key, index)}
              >
                <span part="button" class="button">
                  <slot name="icon-${key}"></slot>
                  <span> ${name} </span>
                </span>
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
