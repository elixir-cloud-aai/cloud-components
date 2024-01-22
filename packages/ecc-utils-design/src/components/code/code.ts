import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import jsyaml from "js-yaml";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/badge/badge.js";
import "@shoelace-style/shoelace/dist/components/alert/alert.js";
import "@shoelace-style/shoelace/dist/components/option/option.js";
import "@shoelace-style/shoelace/dist/components/copy-button/copy-button.js";
import { hostStyles } from "../../styles/host.styles.js";
import getShoelaceStyles from "../../styles/shoelace.styles.js";
import "prismjs";
import "lit-code";

type Language = "YAML" | "JSON" | "Text";

export default class EccUtilsDesignCode extends LitElement {
  static styles = [
    getShoelaceStyles(
      document.querySelector("html")?.classList.contains("dark")
    ),
    hostStyles,
    css`
      .container {
        display: grid;
      }

      .error {
        --editor-text-color: var(--sl-color-danger-500);
        --editor-caret-color: var(--sl-color-danger-500);
        --editor-sel-color: var(--sl-color-danger-500);

        --lines-text-color: var(--sl-color-danger-500);
        --scroll-track-color: var(--sl-color-danger-500);
        --scroll-thumb-color: var(--sl-color-danger-500);

        /*lit-theme colors for default highlight tokens */
        --hl-color-string: var(--sl-color-danger-500);
        --hl-color-function: var(--sl-color-danger-500);
        --hl-color-number: var(--sl-color-danger-500);
        --hl-color-operator: var(--sl-color-danger-500);
        --hl-color-class-name: var(--sl-color-danger-500);
        --hl-color-punctuation: var(--sl-color-danger-500);
        --hl-color-keyword: var(--sl-color-danger-500);
        --hl-color-comment: var(--sl-color-danger-500);
      }

      .header {
        color: var(--sl-color-gray-500);
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        border-bottom: 1px solid var(--sl-panel-border-color);
      }
    `,
  ];

  @state() code = "";
  @property({ type: String }) language: Language = "YAML";
  @property({ type: Boolean }) lnu = true;

  @state() value = "";
  @state() error = false;

  private cssParts = {
    container: "container",
    header: "header",
    code: "code",
    badgeBase: "base",
    copyButtonButton: "copy-button-button",
    copyButtonCopyIcon: "copy-button-copy-icon",
    copyButtonSuccessIcon: "copy-button-success-icon",
    copyButtonErrorIcon: "copy-button-error-icon",
    copyButtonTooltipBase: "copy-button-tooltip__base",
    copyButtonTooltipBasePopup: "copy-button-tooltip__base__popup",
    copyButtonTooltipBaseArrow: "copy-button-tooltip__base__arrow",
    copyButtonTooltipBody: "copy-button-tooltip__body",
  };

  private _setCode() {
    const code = (this.shadowRoot?.getElementById("code") as any).getCode();
    this.value = code;

    // validation
    if (this.language === "JSON") {
      try {
        JSON.parse(this.value);
        this.error = false;
      } catch (error) {
        this.error = true;
      }
    } else if (this.language === "YAML") {
      try {
        jsyaml.loadAll(this.value);
        this.error = false;
      } catch (error) {
        this.error = true;
      }
    } else this.error = false;

    this.dispatchEvent(
      new CustomEvent("ecc-utils-change", {
        detail: {
          value: this.value,
          language: this.language,
          error: this.error,
        },
      })
    );
  }

  public getCode() {
    const code = (this.shadowRoot?.getElementById("code") as any).getCode();
    return code;
  }

  render() {
    const {
      container,
      header,
      code,
      badgeBase,
      copyButtonButton,
      copyButtonCopyIcon,
      copyButtonSuccessIcon,
      copyButtonErrorIcon,
      copyButtonTooltipBase,
      copyButtonTooltipBasePopup,
      copyButtonTooltipBaseArrow,
      copyButtonTooltipBody,
    } = this.cssParts;
    return html`
      <div part=${container} class=${container}>
        <div part=${header} class=${header}>
          <sl-badge
            exportparts="badge-base: ${badgeBase}"
            variant=${this.error ? "danger" : "primary"}
          >
            ${this.language}
          </sl-badge>
          <sl-copy-button
            exportparts="
        					copy-button: ${copyButtonButton},
        					copy-icon: ${copyButtonCopyIcon},
        					copy-success-icon: ${copyButtonSuccessIcon},
        					copy-error-icon: ${copyButtonErrorIcon},
        					tooltip__base: ${copyButtonTooltipBase},
        					copy-tooltip__base__popup: ${copyButtonTooltipBasePopup},
        					copy-tooltip__base__arrow: ${copyButtonTooltipBaseArrow},
        					copy-tooltip__body: ${copyButtonTooltipBody}"
            value=${this.value}
            error-label="Nothing to copy!"
          ></sl-copy-button>
        </div>
        <!-- TODO: add code that can be passed as attr -->
        <lit-code
          id=${code}
          part=${code}
          class=${this.error ? "error" : ""}
          ?linenumbers=${this.lnu}
          noshadow
          language=${this.language}
          @update=${() => this._setCode()}
        >
        </lit-code>
      </div>
    `;
  }
}
