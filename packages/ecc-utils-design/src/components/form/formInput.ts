import * as _ from "lodash-es";
import { html, LitElement, TemplateResult } from "lit";
import { property, state, query } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import {
  renderInTooltip,
  noKeyWarning,
  findNearestFormGroup,
} from "./utils.js";
import "@shoelace-style/shoelace/dist/components/alert/alert.js";
import "@shoelace-style/shoelace/dist/components/icon/icon.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/switch/switch.js";
import "@shoelace-style/shoelace/dist/components/details/details.js";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/select/select.js";
import "@shoelace-style/shoelace/dist/components/option/option.js";

export type FormItemType =
  | "text"
  | "date"
  | "number"
  | "email"
  | "password"
  | "tel"
  | "url"
  | "search"
  | "datetime-local"
  | "time"
  | "array"
  | "switch"
  | "file"
  | "group"
  | "select";

type AlertType = "info" | "success" | "warning" | "error";

export default class EccUtilsDesignFormInput extends LitElement {
  @property({ type: String }) label = "";
  @property({ type: String }) key = "";
  @property({ type: String, reflect: true }) type: FormItemType = "text";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String, reflect: true }) tooltip = "";
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: String, reflect: true }) placeholder = "";
  @property({ type: String, reflect: true }) default = "";
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) multiple = false;
  @property({ type: String, reflect: true }) value: any;
  @property({ type: String, reflect: true }) accept = "*";
  @property({ type: String, attribute: "endpoint" }) tusEndpoint = "";
  @property({ type: Array, reflect: true }) options = [];
  @property({ type: String, reflect: true }) protocol: "native" | "tus" =
    "native";

  @state() private alertText = "Something went wrong";
  @state() private alertType: AlertType = "info";
  @state() private showAlert = false;
  @state() path: string | null = "";

  @query("sl-input") input!: HTMLInputElement;

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.key) {
      noKeyWarning("ecc-d-form-group", this.label);
      this.key = _.camelCase(this.label);
    }

    this.path = findNearestFormGroup(this.key, this);

    if (this.type === "switch") {
      this.value = !!this.value;
      this.dispatchEvent(new CustomEvent("ecc-input", this.eventData()));
    }

    if (this.value || this.type === "switch") {
      if (this.type === "switch") {
        this.value = !!this.value;
      }

      this.dispatchEvent(new CustomEvent("ecc-input", this.eventData()));
    }
  }

  private eventData() {
    return {
      detail: {
        inputKey: this.key,
        value: this.value,
        path: this.path,
      },
      bubbles: true,
      composed: true,
    };
  }

  private handleDismissAlert() {
    this.alertText = "";
    this.showAlert = false;
    this.requestUpdate();
  }

  private handleShowAlert(alertType: AlertType, alertText: string) {
    this.alertText = alertText;
    this.alertType = alertType;
    this.showAlert = true;
    this.requestUpdate();
  }

  validity() {
    return this.input.validity;
  }

  checkValidity() {
    return this.input.checkValidity();
  }

  reportValidity() {
    return this.input.reportValidity();
  }

  // private handleFireChangeEvent() {
  //   this.dispatchEvent(new CustomEvent("ecc-change", this.eventData()));
  // }

  // private handleInputEvent() {
  //   this.dispatchEvent(new CustomEvent("ecc-input", this.eventData()));
  // }

  private handleClear() {
    this.dispatchEvent(new CustomEvent("ecc-input", this.eventData()));
    this.dispatchEvent(new CustomEvent("ecc-clear", this.eventData()));
    this.dispatchEvent(new CustomEvent("ecc-change", this.eventData()));
  }

  private handleValueUpdate(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = this.type === "switch" ? target.checked : target.value;

    this.dispatchEvent(new CustomEvent("ecc-input", this.eventData()));
    this.requestUpdate();
  }

  private handleFileUpload(e: Event) {
    const { files } = e.target as HTMLInputElement;

    if (!files?.length) {
      this.handleShowAlert("error", "No file selected for upload.");
      return;
    }

    this.dispatchEvent(new CustomEvent("ecc-input", this.eventData()));

    if (this.protocol === "native") {
      this.value = files;
      this.requestUpdate();
      return;
    }

    if (!this.tusEndpoint) {
      this.handleShowAlert("error", "No tus endpoint provided for tus uploads");
      return;
    }

    Array.from(files).forEach((file) => {
      import("@anurag_gupta/tus-js-client")
        .then(({ Upload }) => {
          this.handleDismissAlert();
          this.handleShowAlert("info", `Uploading ${file.name}: 0%`);
          const upload = new Upload(file, {
            endpoint: this.tusEndpoint,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            metadata: {
              filename: file.name,
              filetype: file.type,
            },
            onError: (error) => {
              this.handleShowAlert("error", `Upload failed: ${error.message}`);
            },
            onProgress: (bytesUploaded, bytesTotal) => {
              const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(
                2
              );

              this.handleShowAlert(
                "info",
                `Uploading ${file.name}: ${percentage}%`
              );
              this.requestUpdate();
            },
            onSuccess: () => {
              this.handleShowAlert("success", `File(s) Uploaded Successfully`);
            },
          });

          upload.findPreviousUploads().then((uploads) => {
            if (uploads.length > 0) {
              upload.resumeFromPreviousUpload(uploads[0]);
            }
          });

          upload.start();
        })
        .catch((error) => {
          // TO-DO: better error message display
          this.handleShowAlert(
            "error",
            `An error occurred while initializing the upload: ${error.message}`
          );
        });
    });
  }

  private renderSwitchTemplate(): TemplateResult {
    const content = html`
      <sl-switch
        size="small"
        class="switch"
        data-label=${this.label}
        data-testid="form-switch"
        label=${this.label}
        ?required=${this.required}
        ?disabled=${this.disabled}
        ?checked=${this.value}
        @sl-input=${this.handleValueUpdate}
        @sl-change=${() =>
          this.dispatchEvent(new CustomEvent("ecc-change", this.eventData()))}
        @sl-invalid=${() =>
          this.dispatchEvent(new CustomEvent("ecc-invalid", this.eventData()))}
      >
        ${this.label}
      </sl-switch>
    `;

    return html`
      <div class="switch-container" data-testid="switch-container">
        ${renderInTooltip(content, this.tooltip)}
      </div>
    `;
  }

  private renderInputTemplate(): TemplateResult {
    const label = html` <label data-testid="label"> ${this.label} </label>`;

    return html`
      <sl-input
        clearable
        class="input"
        data-label=${this.label}
        data-testid="input"
        type=${this.type || "text"}
        ?required=${this.required}
        value=${this.value || ""}
        placeholder=${this.placeholder}
        ?password-toggle=${this.type === "password"}
        @sl-input=${this.handleValueUpdate}
        @sl-clear=${this.handleClear}
        @sl-change=${() =>
          this.dispatchEvent(new CustomEvent("ecc-change", this.eventData()))}
        @sl-invalid=${() =>
          this.dispatchEvent(new CustomEvent("ecc-invalid", this.eventData()))}
      >
        <span slot="label"> ${renderInTooltip(label, this.tooltip)} </span>
      </sl-input>
    `;
  }

  private renderFileTemplate(): TemplateResult {
    const label = html`
      <div>
        <label class="file-input-label" data-testid="form-label">
          ${this.label} ${this.required ? "*" : ""}
        </label>
      </div>
    `;

    return html`
      <div class="file-container" data-testid="file-container">
        ${renderInTooltip(label, this.tooltip)}
        <input
          type="file"
          class="file-input"
          data-type=${this.protocol}
          data-testid="input-file"
          data-label=${this.label}
          accept=${this.accept}
          ?multiple=${this.multiple}
          ?required=${this.required}
          @change=${this.handleFileUpload}
        />
      </div>
    `;
  }

  private renderSelectTemplate(): TemplateResult {
    const label = html`
      <label for=${this.label} class="select-label" data-testid="label">
        ${this.label} ${this.required ? "*" : ""}
      </label>
    `;

    const getSelectValue = () =>
      this.multiple && this.value && Array.isArray(this.value)
        ? this.value.join(" ")
        : this.value;

    const getOptionLabelAndValue = (str: string, labelAttr = true) => {
      const values = str.split(/(?<!\/)-/);
      if (values.length > 1) {
        return labelAttr ? values[0] : _.kebabCase(values[1]);
      }

      return labelAttr ? values[0] : _.kebabCase(values[0]);
    };

    return html`
      <div class="select-container" data-testid="select-container">
        ${renderInTooltip(label, this.tooltip)}
        <sl-select
          clearable
          class="select"
          name=${this.label}
          ?required=${this.required}
          ?multiple=${this.multiple}
          value=${getSelectValue()}
          data-testid="select"
          data-label=${this.label}
          placeholder="${this.placeholder || "Select"}"
          @sl-input=${this.handleValueUpdate}
          @sl-clear=${this.handleClear}
          @sl-change=${() =>
            this.dispatchEvent(new CustomEvent("ecc-change", this.eventData()))}
          @sl-invalid=${() =>
            this.dispatchEvent(
              new CustomEvent("ecc-invalid", this.eventData())
            )}
          @sl-show=${() =>
            this.dispatchEvent(new CustomEvent("ecc-show", this.eventData()))}
          @sl-after-show=${() =>
            this.dispatchEvent(
              new CustomEvent("ecc-after-show", this.eventData())
            )}
          @sl-hide=${() =>
            this.dispatchEvent(
              new CustomEvent("ecc-after-show", this.eventData())
            )}
          @sl-after-hide=${() =>
            this.dispatchEvent(
              new CustomEvent("ecc-after-show", this.eventData())
            )}
        >
          ${repeat(
            this.options,
            (opt) => html`
              <sl-option
                data-testid="select-option"
                data-label=${_.kebabCase(getOptionLabelAndValue(opt))}
                value=${getOptionLabelAndValue(opt, false)}
              >
                ${getOptionLabelAndValue(opt)}
              </sl-option>
            `
          )}
        </sl-select>
      </div>
    `;
  }

  private renderTemplate(): TemplateResult {
    const { type } = this;
    if (type === "switch") return this.renderSwitchTemplate();
    if (type === "file") return this.renderFileTemplate();
    if (type === "select") return this.renderSelectTemplate();

    return this.renderInputTemplate();
  }

  render() {
    return html`
      <sl-alert ?open=${this.showAlert} @click=${this.handleDismissAlert}>
        ${this.alertType === "error"
          ? html`<sl-icon slot="icon" name="x-circle"></sl-icon>`
          : html` <sl-icon slot="icon" name="info-circle"></sl-icon>`}
        ${this.alertText}
      </sl-alert>

      ${this.renderTemplate()}
    `;
  }
}
