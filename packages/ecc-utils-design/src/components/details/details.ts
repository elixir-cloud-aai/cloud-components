/* eslint-disable class-methods-use-this */
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

export default class EccUtilsDesignDetails extends LitElement {
  static styles = [
    getShoelaceStyles(
      document.querySelector("html")?.classList.contains("dark")
    ),
    hostStyles,
    css``,
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
    return html`
      <div class="container">
        <div class="label">
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
        <div class="value">${data}</div>
      </div>
    `;
  }

  private _renderText(data: string): TemplateResult {
    return html` <div>${data}</div> `;
  }

  private _renderArray(
    data: Array<any>,
    label: string,
    copy = false
  ): TemplateResult {
    return html`
      <div class="container">
        <div class="label">
          <span>${label}</span>
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
        </div>
        <div class="value">
          ${data.map((value, index) => {
            if (value === null || value === undefined) {
              return null; // Skip rendering for null or undefined values
            }

            if (Array.isArray(value)) {
              return this._renderArray(value, `${label}-${index}`);
            }
            if (typeof value === "object") {
              return this._renderObject(value, `${label}-${index}`);
            }
            return this._renderText(value);
          })}
        </div>
      </div>
    `;
  }

  private _renderObject(
    data: any,
    label: string,
    copy = false
  ): TemplateResult {
    return html`
      <div class="container">
        <div class="label">
          <span>${label}</span>
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
        </div>
        <div class="value">
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
            return this._renderText(dataValue as string);
          })}
        </div>
      </div>
    `;
  }

  // private _renderObject(
  // 	data: any,
  // 	label: string,
  // 	copy = false
  // ): TemplateResult {
  // 	return html`
  // 		<div class="container">
  // 			<div class="label">
  // 				<span>${label}</span>
  // 				${copy
  // 					? html`
  // 							<sl-copy-button
  // 								value=${JSON.stringify(data)}
  // 								copy-label="Click to copy strigified JSON of ${label}"
  // 								success-label="${label} copied"
  // 								error-label="Error"
  // 							></sl-copy-button>
  // 					  `
  // 					: html``}
  // 			</div>
  // 			<div class="value">
  // 				${Object.entries(data).map(([label, value], index) => {
  // 					if (value === null || value === undefined) {
  // 						return null; // Skip rendering for null or undefined values
  // 					}

  // 					return Array.isArray(value)
  // 						? this._renderArray(value, label)
  // 						: typeof value === 'object'
  // 						? this._renderObject(value, label)
  // 						: this._renderText(value as string);
  // 				})}
  // 			</div>
  // 		</div>
  // 	`;
  // }

  // private _renderArray(
  // 	data: Array<any>,
  // 	label: string,
  // 	copy = false
  // ): TemplateResult {
  // 	return html`
  // 		<div class="container">
  // 			<div class="label">
  // 				<span>${label}</span>
  // 				${copy
  // 					? html`
  // 							<sl-copy-button
  // 								value=${JSON.stringify(data)}
  // 								copy-label="Click to copy strigified JSON of ${label}"
  // 								success-label="${label} copied"
  // 								error-label="Error"
  // 							></sl-copy-button>
  // 					  `
  // 					: html``}
  // 			</div>
  // 			<div class="value">
  // 				${data.map((data, index) => {
  // 					if (data === null || data === undefined) {
  // 						return null; // Skip rendering for null or undefined values
  // 					}

  // 					return Array.isArray(data)
  // 						? this._renderArray(data, `${label}-${index}`)
  // 						: typeof data === 'object'
  // 						? this._renderObject(data, `${label}-${index}`)
  // 						: this._renderText(data);
  // 				})}
  // 			</div>
  // 		</div>
  // 	`;
  // }

  private _renderField(
    tabName: string,
    children: Array<Children>
  ): TemplateResult {
    return html`
      <sl-tab slot="nav" panel="${toLower(tabName)}">${tabName}</sl-tab>
      <sl-tab-panel name="${toLower(tabName)}">
        <div class="panel-container">
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
            )
              return html``;

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

            console.log(childData, label, copy);

            if (Array.isArray(childData)) {
              return this._renderArray(childData, label, copy);
            }
            if (typeof childData === "object") {
              return this._renderObject(childData, label, copy);
            }
            return this._renderData(childData, label, copy);
          })}
        </div>
      </sl-tab-panel>
    `;
  }

  private _renderFields(fields: Array<Field>): TemplateResult {
    if (!fields.length) return html``;
    return html`
      <sl-tab-group class="details">
        ${fields.map((field) =>
          this._renderField(field.tabGroup, field.children)
        )}
      </sl-tab-group>
    `;
  }

  private _renderSvg(icon: FooterButton["icon"]): TemplateResult {
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
          originalEvent: event,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _renderFooter(): TemplateResult {
    return html`
      <div name="footer-container">
        <div class="footer-button">
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
        </div>
        <slot name="footer"></slot>
      </div>
    `;
  }

  render() {
    return html` ${this._renderFields(this.fields)} ${this._renderFooter()} `;
  }
}
