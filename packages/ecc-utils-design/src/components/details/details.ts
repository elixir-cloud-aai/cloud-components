import { html, css, LitElement, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { property, state } from "lit/decorators.js";
import _, { toLower } from "lodash-es";
import getShoelaceStyles from "../../styles/shoelace.styles.js";
import "@shoelace-style/shoelace/dist/components/tab-group/tab-group.js";
import "@shoelace-style/shoelace/dist/components/tab/tab.js";
import "@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js";
import "@shoelace-style/shoelace/dist/components/copy-button/copy-button.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
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

export interface FooterButton {
  key: string;
  name: string;
  variant?: "primary" | "success" | "neutral" | "warning" | "danger";
  icon?: string;
}

/**
 * @summary This component is used to render a detailed view of items.
 * @since 1.0.0
 *
 * @property {object} data - Data to be rendered
 * @property {array} fields - An array of fields to render
 * @property {array} buttons - An array of buttons and its configuration
 *
 * @method setButtonLoading - Sets the state of button with given index to given loading state
 *
 * @event ecc-utils-button-click - This event is fired when a button in the details component is clicked.
 */

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

      .button-icon {
        height: 1rem;
      }
    `,
  ];

  @property({ type: Object, reflect: true }) data = {};
  @property({ type: Array, reflect: true }) fields: Array<Field> = [];
  @property({ type: Array, reflect: true }) buttons: Array<FooterButton> = [];

  @state() private loading: Array<boolean> = [];

  private cssParts = {
    // Parts
    dataContainer: "data-container",
    label: "label",
    value: "value",
    container: "container",
    summaryContainer: "summary-container",
    panelContainer: "panel-container",
    footerContainer: "footer-container",
    button: "button",
    footerButtons: "footer-buttons",
    footerSlot: "footer-slot",

    // ExportParts
    // https://shoelace.style/components/tab-group/#parts
    tabGroupBase: "tab-group-base", // base
    tabGroupNav: "tab-group-nav", // nav
    tabGroupTabs: "tab-group-tabs", // tabs
    tabGroupActiveTabIndicator: "tab-group-active-tab-indicator", // active-tab-indicator
    tabGroupBody: "tab-group-body", // body
    tabGroupScrollButton: "tab-group-scroll-button", // scroll-button
    tabGroupScrollButtonStart: "tab-group-scroll-button--start", // scroll-button--start
    tabGroupScrollButtonEnd: "tab-group-scroll-button--end", // scroll-button--end
    tabGroupScrollButtonBase: "tab-group-scroll-button__base", // scroll-button__base

    // https://shoelace.style/components/tab/#parts
    tabBase: "tab-base", // base
    tabCloseButton: "tab-close-button", // close-button
    tabCloseButtonBase: "tab-close-button__base", // close-button__base

    // https://shoelace.style/components/tab-panel/#parts
    tabPanelBase: "tab-panel-base", // base

    // https://shoelace.style/components/copy-button/#parts
    copyButtonButton: "copy-button-button", // button
    copyButtonCopyIcon: "copy-button-copy-icon", // copy-icon
    copyButtonSuccessIcon: "copy-button-success-icon", // success-icon
    copyButtonErrorIcon: "copy-button-error-icon", // error-icon
    copyButtonTooltipBase: "copy-button-tooltip__base", // tooltip__base
    copyButtonTooltipBasePopup: "copy-button-tooltip__base__popup", // tooltip__base__popup
    copyButtonTooltipBaseArrow: "copy-button-tooltip__base__arrow", // tooltip__base__arrow
    copyButtonTooltipBody: "copy-button-tooltip__body", // tooltip__body

    // https://shoelace.style/components/button/#parts
    buttonBase: "button-base", // base,
    // buttonPrefix: "button-prefix", // prefix,
    buttonLabel: "button-label", // label,
    // buttonSuffix: "button-suffix", // suffix,
    buttonCaret: "button-caret", // caret,
    buttonSpinner: "button-spinner", // spinner,

    // https://shoelace.style/components/details/#parts
    detailsBase: "details-base", // base
    detailsHeader: "details-header", // header
    detailsSummary: "details-summary", // summary
    detailsSummaryIcon: "details-summary-icon", // summary-icon
    detailsContent: "details-content", // content
  };

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
    const {
      copyButtonButton,
      copyButtonCopyIcon,
      copyButtonSuccessIcon,
      copyButtonErrorIcon,
      copyButtonTooltipBase,
      copyButtonTooltipBasePopup,
      copyButtonTooltipBaseArrow,
      copyButtonTooltipBody,
    } = this.cssParts;
    return html` <span class="label-copy">
      <span>${label}</span>
      ${copy
        ? html`
            <sl-copy-button
              exportparts="button: ${copyButtonButton}, copy-icon: ${copyButtonCopyIcon}, success-icon: ${copyButtonSuccessIcon}, error-icon: ${copyButtonErrorIcon}, tooltip__base: ${copyButtonTooltipBase}, tooltip__base__popup: ${copyButtonTooltipBasePopup}, tooltip__base__arrow: ${copyButtonTooltipBaseArrow}, tooltip__body: ${copyButtonTooltipBody}"
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

    const { label: cssLabel, dataContainer, value } = this.cssParts;
    return html`
      <div part="${dataContainer}" class="container data-container">
        <div part="${cssLabel}" class="label">
          ${this._renderLabel(
            label,
            copy,
            data,
            `Copy`,
            `${label} copied!`,
            "Error"
          )}
        </div>
        <div part="${value}" class="value">${data}</div>
      </div>
    `;
  }

  private _renderArray(
    data: Array<any>,
    label: string,
    copy = false
  ): TemplateResult {
    if (data === null || data === undefined || data.length === 0) return html``;

    const {
      container,
      summaryContainer,
      panelContainer,
      dataContainer,
      value: cssValue,
      detailsBase,
      detailsHeader,
      detailsSummary,
      detailsSummaryIcon,
      detailsContent,
    } = this.cssParts;
    return html`
			<div part="${container}" class="container">
				<sl-details
        exportparts="base: ${detailsBase}, header: ${detailsHeader}, summary: ${detailsSummary}, summary-icon: ${detailsSummaryIcon}, content: ${detailsContent}"
        >
					<div part="${summaryContainer}" slot="summary" class="summary">
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
          <div class="${panelContainer}">
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
              return html`
                <div class="${dataContainer} ${cssValue}">${value}</div>
              `;
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

    const {
      container,
      summaryContainer,
      panelContainer,
      detailsBase,
      detailsHeader,
      detailsSummary,
      detailsSummaryIcon,
      detailsContent,
    } = this.cssParts;
    return html`
      <div part="${container}" class="container">
        <sl-details
          exportparts="base: ${detailsBase}, header: ${detailsHeader}, summary: ${detailsSummary}, summary-icon: ${detailsSummaryIcon}, content: ${detailsContent}"
        >
          <div part="${summaryContainer}" slot="summary" class="summary">
            ${this._renderLabel(
              label,
              copy,
              JSON.stringify(data),
              `Copy JSON`,
              `${label} copied!`,
              "Error"
            )}
          </div>
          <div class="${panelContainer}">
            ${Object.entries(data).map(([dataLabel, dataValue], index) => {
              const newLabel = `${dataLabel} ${index + 1}`;
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
    const {
      panelContainer,
      tabBase,
      tabCloseButton,
      tabCloseButtonBase,
      tabPanelBase,
    } = this.cssParts;
    return html`
      <sl-tab
        exportparts="base: ${tabBase}, close-button: ${tabCloseButton}, close-button__base: ${tabCloseButtonBase}"
        slot="nav"
        panel="${toLower(tabName)}"
        >${tabName}</sl-tab
      >
      <sl-tab-panel
        exportparts="base: ${tabPanelBase}"
        name="${toLower(tabName)}"
      >
        <div part="${panelContainer}" class="panel-container panel">
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
    const {
      tabGroupBase,
      tabGroupNav,
      tabGroupActiveTabIndicator,
      tabGroupBody,
      tabGroupScrollButton,
      tabGroupScrollButtonStart,
      tabGroupScrollButtonEnd,
      tabGroupScrollButtonBase,
    } = this.cssParts;
    return html`
      <sl-tab-group
        exportparts="base: ${tabGroupBase}, nav: ${tabGroupNav}, tabs: ${tabGroupNav}, active-tab-indicator: ${tabGroupActiveTabIndicator}, body: ${tabGroupBody}, scroll-button: ${tabGroupScrollButton}, scroll-button--start: ${tabGroupScrollButtonStart}, scroll-button--end: ${tabGroupScrollButtonEnd}, scroll-button__base: ${tabGroupScrollButtonBase}"
        class="details"
      >
        ${fields.map((field) =>
          this._renderField(field.tabGroup, field.children)
        )}
      </sl-tab-group>
    `;
  }

  private _handleClick(key: string, index: number) {
    this.dispatchEvent(
      new CustomEvent(`ecc-utils-button-click`, {
        detail: {
          index,
          key,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _renderFooter(): TemplateResult {
    const {
      footerContainer,
      footerSlot,
      footerButtons,
      button: cssButton,
      buttonBase,
      buttonLabel,
      buttonCaret,
      buttonSpinner,
    } = this.cssParts;
    return html`
      <div part="${footerContainer}" class="footer-container">
        <span part="${footerButtons}" class="footer-buttons">
          ${this.buttons.map((button, index) => {
            const { name, key, variant, icon } = button;
            return html`
              <sl-button
                exportparts="base: ${buttonBase}, label: ${buttonLabel}, caret: ${buttonCaret}, spinner: ${buttonSpinner}"
                ?loading="${this.loading[index]}"
                @click=${() => this._handleClick(key, index)}
                variant=${ifDefined(variant)}
              >
                <span part="${cssButton}" class="button">
                  ${html`
                    ${icon
                      ? html`<img
                          src=${icon}
                          class="button-icon"
                          alt=${name}
                        />`
                      : ""}
                  `}
                  <span> ${name} </span>
                </span>
              </sl-button>
            `;
          })}
        </span>
        <span part="${footerSlot}" class="footer-slot">
          <slot name="footer"></slot>
        </span>
      </div>
    `;
  }

  render() {
    return html` ${this._renderFields(this.fields)} ${this._renderFooter()} `;
  }
}
