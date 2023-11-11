import { html, css, LitElement, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/switch/switch.js";
import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
import "@shoelace-style/shoelace/dist/components/alert/alert.js";
import _ from "lodash-es";
import { sholelaceLightStyles } from "../../styles/shoelace.styles.js";
import { hostStyles } from "../../styles/host.styles.js";

interface Field {
  key: string;
  label: string;
  type?:
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
    | "file";
  fieldOptions?: {
    required?: boolean;
  };
  switchOptions?: {
    default?: boolean;
  };
  error?: string;
  children?: Array<Field>;
}

export default class Form extends LitElement {
  static styles = [
    sholelaceLightStyles,
    hostStyles,
    css`
      :host {
        display: block;
      }
      form {
        display: flex;
        flex-direction: column;
      }
      form sl-input {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
      }
      form sl-switch {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
      }
      .array-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 1rem;
        border-style: solid;
        border-width: 0px 0px 1px 0px;
        border-color: var(--sl-color-gray-300);
      }
      .array-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .array-item-container {
        width: 100%;
      }
      .array-label {
        margin-bottom: 0.5rem;
      }
      .delete-icon {
        height: 1.25rem;
      }
      .add-icon {
        height: 1.1rem;
      }
      .switch-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      input[type="file"]::file-selector-button {
        height: 100%;
        background-color: #fff;
        border: 0px;
        border-right: 1px solid #d4d4d8;
        padding-right: 20px;
        padding-left: 20px;
        margin-right: 10px;
        font-size: 1rem;
      }
      input[type="file"] {
        background-color: #fff;
        border: 1px solid #d4d4d8;
        border-radius: 4px;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        height: 2.5rem;
        font-size: 1rem;
        color: #000;
      }
      .row {
        display: flex;
        flex-direction: column;
      }
      .success-icon {
        height: 1.25rem;
      }
      .error-icon {
        height: 1.25rem;
      }
    `,
  ];

  @property({ type: Array }) private fields: Array<Field> = [];
  @state() private form: object = {};
  @state() private formState: "idle" | "loading" | "error" | "success" = "idle";
  @state() private errorMessage = "Form submitted successfully";
  @state() private successMessage = "Something went wrong";

  connectedCallback() {
    super.connectedCallback();
    if (!this.fields) {
      throw new Error("Fields is required");
    }
  }

  private renderSwitchTemplate(field: Field, path: string): TemplateResult {
    if (field.type !== "switch") return html``;
    return html`
      <div part="field" class="switch-container">
        <label part="label" class="switch-label">${field.label}</label>
        <sl-switch
          exportparts="control: switch, thumb: switch-thumb"
          class="switch"
          label=${field.label}
          ?required=${field.fieldOptions?.required}
          ?checked=${_.get(this.form, path, false)}
          @sl-change=${(e: any) => {
            const newForm = { ...this.form };
            _.set(newForm, path, e.target.checked);
            this.form = newForm;
            this.requestUpdate();
          }}
        ></sl-switch>
      </div>
    `;
  }

  private toBase64 = (file: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  private renderInputTemplate(field: Field, path: string): TemplateResult {
    if (field.type === "array" || field.type === "switch") return html``;
    if (field.type === "file") {
      return html`
        <div part="field" class="row">
          <label part="label">
            ${field.label} ${field.fieldOptions?.required ? "*" : ""}
          </label>
          <input
            class="input"
            part="input-base input"
            type="file"
            ?required=${field.fieldOptions?.required}
            @change=${async (e: any) => {
              const { files } = e.target;
              const base64 = await this.toBase64(files[0]);
              const newForm = { ...this.form };
              _.set(newForm, path, base64);
              this.form = newForm;
              this.requestUpdate();
            }}
          />
        </div>
      `;
    }
    return html`
      <sl-input
        exportparts="form-control: field, form-control-label: label, input: input, base: input-base"
        class="input"
        label=${field.label}
        type=${field.type ? field.type : "text"}
        ?required=${field.fieldOptions?.required}
        value=${_.get(this.form, path, "")}
        ?password-toggle=${field.type === "password"}
        @sl-change=${(e: any) => {
          const newForm = { ...this.form };
          _.set(newForm, path, e.target.value);
          this.form = newForm;
          this.requestUpdate();
        }}
      ></sl-input>
    `;
  }

  private renderArrayTemplate(field: Field, path: string): TemplateResult {
    const doesExit = _.get(this.form, path, false);
    if (!doesExit) {
      const newForm = { ...this.form };
      _.set(newForm, path, [{}]);
      this.form = newForm;
    }
    return html`
      <div class="array-container">
        <div part="array-header" class="array-header">
          <label part="label array-label" class="array-label">
            ${field.label}
          </label>
          <sl-button
            variant="text"
            exportparts="base: button, base: add-button"
            class="add-button"
            @click=${() => {
              const newForm = { ...this.form };
              _.get(newForm, path).push({});
              this.form = newForm;
              this.requestUpdate();
            }}
          >
            <svg
              class="add-icon"
              slot="prefix"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add
          </sl-button>
        </div>
        ${_.get(this.form, path).map(
          (_item: any, index: number) => html`
            <div part="array-item" class="array-item">
              <sl-button
                variant="text"
                exportparts="base: button, base: remove-button"
                @click=${() => {
                  const newForm = { ...this.form };
                  _.get(newForm, path).splice(index, 1);
                  this.form = newForm;
                  this.requestUpdate();
                }}
              >
                <svg
                  class="delete-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </sl-button>
              <div class="array-item-container">
                ${field.children?.map((child) =>
                  this.renderTemplate(child, `${path}[${index}]`)
                )}
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  private renderTemplate(field: Field, path: string): TemplateResult {
    if (field.type === "array") {
      return this.renderArrayTemplate(field, `${path}.${field.key}`);
    }
    if (field.type === "switch") {
      return this.renderSwitchTemplate(field, `${path}.${field.key}`);
    }
    return this.renderInputTemplate(field, `${path}.${field.key}`);
  }

  private renderErrorTemplate(): TemplateResult {
    if (this.formState !== "error") return html``;
    return html`<sl-alert variant="danger" open>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        slot="icon"
        class="error-icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <strong>${this.errorMessage}</strong>
    </sl-alert> `;
  }

  private renderSuccessTemplate(): TemplateResult {
    if (this.formState !== "success") return html``;
    return html`
      <sl-alert variant="success" open>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          slot="icon"
          class="success-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <strong>${this.successMessage}</strong>
      </sl-alert>
    `;
  }

  public loading() {
    this.formState = "loading";
  }

  public success({ message }: { message?: string }) {
    this.formState = "success";
    this.successMessage = message || "Form submitted successfully";
  }

  public error({ message }: { message?: string }) {
    this.formState = "error";
    this.errorMessage = message || "Something went wrong";
  }

  public idle() {
    this.formState = "idle";
  }

  render() {
    if (!this.fields || this.fields.length === 0) {
      throw new Error("Fields is required & should not be empty array");
    }
    if (this.formState === "success") {
      return html` ${this.renderSuccessTemplate()} `;
    }
    return html`
      <form
        part="form"
        @submit=${(e: any) => {
          e.preventDefault();
          const form = this.shadowRoot?.querySelector("form");
          const isValid = form?.reportValidity();
          if (!isValid) {
            return;
          }
          const event = new CustomEvent("form-submit", {
            detail: {
              form: this.form,
            },
            bubbles: true,
            composed: true,
          });
          this.dispatchEvent(event);
        }}
      >
        ${this.fields.map((field) => this.renderTemplate(field, "data"))}
        ${this.renderErrorTemplate()}
        <sl-button
          type="submit"
          exportparts="base: button, base: submit-button"
          ?loading=${this.formState === "loading"}
          ?disabled=${this.formState === "loading"}
        >
          Submit
        </sl-button>
      </form>
    `;
  }
}
