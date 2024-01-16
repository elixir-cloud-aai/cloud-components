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

  @property({ type: String }) code = "";
  @property({ type: String }) language: Language = "YAML";
  @property({ type: Boolean }) lnu = true;

  @state() languages: Language[] = ["YAML", "JSON", "Text"];
  @state() value = "";
  @state() error = false;

  private cssParts = {
    // Parts
    container: "container", // container
    header: "header", // header

    code: "code", // code

    // https://shoelace.style/components/select/#parts
    selectFormControl: "form-control", // select-form-control
    selectFormControlLabel: "form-control-label", // select-form-control-label
    selectFormControlInput: "form-control-input", // select-form-control-input
    selectFormControlHelpText: "form-control-help-text", // select- form-control-help-text
    selectCombobox: "combobox", // select-combobox
    selectPrefix: "prefix", // select-prefix
    selectDisplayInput: "display-input", // select-display-input
    selectListbox: "listbox", // select-listbox
    selectTags: "tags", // select-tags
    selectTag: "tag", // select-tag
    selectTagBase: "tag__base", // tag__base
    selectTagContent: "tag__content", // tag__content
    selectTagRemoveButton: "tag__remove-button", // tag__remove-button
    selectTagRemoveButtonBase: "tag__remove-button__base", // tag__remove-button__base
    selectClearButton: "clear-button", // select-clear-button

    // https://shoelace.style/components/copy-button/#parts
    copyButtonButton: "copy-button-button", // copy-button
    copyButtonCopyIcon: "copy-button-copy-icon", // copy-icon
    copyButtonSuccessIcon: "copy-button-success-icon", // copy-success-icon
    copyButtonErrorIcon: "copy-button-error-icon", // copy-error-icon
    copyButtonTooltipBase: "copy-button-tooltip__base", // copy-tooltip__base
    copyButtonTooltipBasePopup: "copy-button-tooltip__base__popup", // copy-tooltip__base__popup
    copyButtonTooltipBaseArrow: "copy-button-tooltip__base__arrow", // copy-tooltip__base__arrow
    copyButtonTooltipBody: "copy-button-tooltip__body", // copy-tooltip__body
  };

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

  private _setLanguage(event: Event) {
    this.language = (event.target as any).value;
    this._setCode();
  }

  public getCode() {
    return this.value;
  }

  render() {
    const {
      container,
      header,
      code,
      selectFormControl,
      selectFormControlLabel,
      selectFormControlInput,
      selectFormControlHelpText,
      selectCombobox,
      selectPrefix,
      selectDisplayInput,
      selectListbox,
      selectTags,
      selectTag,
      selectTagBase,
      selectTagContent,
      selectTagRemoveButton,
      selectTagRemoveButtonBase,
      selectClearButton,
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
          <sl-select
            exportparts="
        					select-form-control: ${selectFormControl},
        					select-form-control-label: ${selectFormControlLabel},
        					select-form-control-input: ${selectFormControlInput},
        					select-form-control-help-text: ${selectFormControlHelpText},
        					select-combobox: ${selectCombobox},
        					select-prefix: ${selectPrefix},
        					select-display-input: ${selectDisplayInput},
        					select-listbox: ${selectListbox},
        					select-tags: ${selectTags},
        					select-tag: ${selectTag},
        					select-tag-base: ${selectTagBase},
        					select-tag-content: ${selectTagContent},
        					select-tag-remove-button: ${selectTagRemoveButton},
        					select-tag-remove-button-base: ${selectTagRemoveButtonBase},
        					select-clear-button: ${selectClearButton}"
            value=${this.language}
            @sl-change=${(e: Event) => this._setLanguage(e)}
          >
            ${this.languages.map(
              (language) =>
                html` <sl-option value=${language}> ${language} </sl-option> `
            )}
          </sl-select>
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
        <lit-code
          id=${code}
          part=${code}
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
