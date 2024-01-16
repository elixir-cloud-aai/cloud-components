import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import jsyaml from "js-yaml";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/alert/alert.js";
import "@shoelace-style/shoelace/dist/components/select/select.js";
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
        --editor-text-color: red;
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

  @property({ type: String }) code = "";
  @property({ type: String }) language: Language = "YAML";
  @property({ type: Boolean }) lnu = true;

  @state() languages: Language[] = ["YAML", "JSON", "Text"];
  @state() value = "";
  @state() error = false;

  private _setCode() {
    const code = (this.shadowRoot?.getElementById("code") as any).getCode();
    this.value = code;

    // Validate JSON
    if (this.language === "JSON") {
      try {
        JSON.parse(this.value);
        this.error = false;
      } catch (error) {
        this.error = true;
      }
    }

    // Validate YAML
    if (this.language === "YAML") {
      try {
        jsyaml.loadAll(this.value);
        this.error = false;
      } catch (error) {
        this.error = true;
      }
    }
  }

  public returnCode() {
    return this.value;
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <sl-select
            value=${this.language}
            @sl-change=${(e: Event) =>
              (this.language = (e.target as HTMLSelectElement)
                .value as Language)}
          >
            ${this.languages.map(
              (language) =>
                html` <sl-option value=${language}> ${language} </sl-option> `
            )}
          </sl-select>
          <sl-copy-button
            value=${this.value}
            error-label="Nothing to copy!"
          ></sl-copy-button>
        </div>
        <lit-code
          id="code"
          class=${this.error ? "error" : ""}
          ?linenumbers=${this.lnu}
          noshadow
          language=${this.language}
          code=${this.code}
          @update=${() => this._setCode()}
        >
        </lit-code>
      </div>
    `;
  }
}
