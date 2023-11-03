import { html, css, LitElement, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/switch/switch.js";
import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
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
    | "switch";
  fieldOptions?: {
    required?: boolean;
  };
  switchOptions?: {
    default?: boolean;
  };
  error?: string;
  children?: Array<Field>;
}

export class Form extends LitElement {
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
        margin-bottom: 1rem;
      }
      form sl-switch {
        margin-bottom: 1rem;
      }
      .array {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
        border-style: solid;
        border-width: 0px 0px 1px 0px;
        border-color: var(--sl-color-gray-300);
      }
      .array sl-button {
        align-self: flex-end;
      }
      .array sl-input {
        margin-bottom: 1rem;
      }
      .array-container {
      }
      .array-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .array-label {
        margin-bottom: 0.5rem;
      }
      .add-button {
        display: flex;
        width: fit-content;
        items-align: center;
      }
      .delete-icon {
        width: 1.5rem;
        height: 1.5rem;
        margin-bottom: -0.5rem;
      }
      .add-icon {
        width: 1.5rem;
        height: 1.5rem;
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
        border-right: 1px solid #e5e5e5;
        padding-right: 20px;
        padding-left: 20px;
        margin-right: 10px;
      }
      input[type="file"] {
        background-color: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 4px;
        margin-bottom: 1rem;
        height: 2.5rem;
      }
    `,
  ];

  @property({ type: Array }) fields: Array<Field> = [];
  @state() form: object = {};

  connectedCallback() {
    super.connectedCallback();
    this.fields.forEach((field) => {
      if (field.type === "array") {
        const array = [{}];
        field.children?.forEach((child) => {
          if (child.type === "switch") {
            (array[0] as any)[child.key] = child.switchOptions?.default;
          } else {
            (array[0] as any)[child.key] = "";
          }
        });
        (this.form as any)[field.key] = array;
      } else if (field.type === "switch") {
        (this.form as any)[field.key] = field.switchOptions?.default;
      } else {
        (this.form as any)[field.key] = "";
      }
    });
  }

  renderSwitchTemplate(
    field: Field,
    options: { index?: number; parentkey?: string } = {}
  ): TemplateResult {
    if (field.type !== "switch") return html``;
    const { index, parentkey } = options;
    const value =
      parentkey !== undefined && index !== undefined
        ? (this.form as any)[parentkey][index][field.key]
        : (this.form as any)[field.key];
    return html`
      <div class="switch-container">
        <label class="switch-label">${field.label}</label>
        <sl-switch
          class=${parentkey !== undefined && index !== undefined
            ? "child-switch"
            : "switch"}
          label=${field.label}
          ?required=${field.fieldOptions?.required}
          ?checked=${value}
          @sl-change=${(e: any) => {
            const newForm = { ...this.form };
            if (parentkey !== undefined && index !== undefined) {
              (newForm as any)[parentkey][index][field.key] = e.target.checked;
            } else {
              (newForm as any)[field.key] = e.target.checked;
            }
            this.form = newForm;
            this.requestUpdate();
          }}
        ></sl-switch>
      </div>
    `;
  }

  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  renderInputTemplate(
    field: Field,
    options: { index?: number; parentkey?: string } = {}
  ): TemplateResult {
    if (field.type === "array" || field.type === "switch") return html``;
    const { index, parentkey } = options;
    const value =
      parentkey !== undefined && index !== undefined
        ? (this.form as any)[parentkey][index][field.key]
        : (this.form as any)[field.key];
    if (field.type === "file") {
      return html`
        <label>${field.label} ${field.fieldOptions?.required ? "*" : ""}</label>
        <input
          class=${parentkey !== undefined && index !== undefined
            ? "child-input"
            : "input"}
          type="file"
          ?required=${field.fieldOptions?.required}
          .value=${value}
          @change=${async (e: any) => {
            const { files } = e.target;
            const base64 = await this.toBase64(files[0]);
            const newForm = { ...this.form };
            if (parentkey !== undefined && index !== undefined) {
              (newForm as any)[parentkey][index][field.key] = base64;
            } else {
              (newForm as any)[field.key] = base64;
            }
            this.form = newForm;
            this.requestUpdate();
          }}
        />
      `;
    }
    return html`
      <sl-input
        class=${parentkey !== undefined && index !== undefined
          ? "child-input"
          : "input"}
        label=${field.label}
        type=${field.type ? field.type : "text"}
        ?required=${field.fieldOptions?.required}
        value=${value}
        ?password-toggle=${field.type === "password"}
        @sl-change=${(e: any) => {
          const newForm = { ...this.form };
          if (parentkey !== undefined && index !== undefined) {
            (newForm as any)[parentkey][index][field.key] = e.target.value;
          } else {
            (newForm as any)[field.key] = e.target.value;
          }
          this.form = newForm;
          this.requestUpdate();
        }}
      ></sl-input>
    `;
  }

  renderTemplate(field: Field): TemplateResult {
    if (field.type === "array") {
      return html`
        <div class="array-container">
          <div class="array-header">
            <label class="array-label">${field.label}</label>
            <sl-button
              class="add-button"
              @click=${() => {
                const newChild = {};
                field.children?.forEach((child) => {
                  (newChild as any)[child.key] = "";
                });
                const newForm = { ...this.form };
                const currentForm = newForm;
                (currentForm as any)[field.key].push(newChild);
                this.requestUpdate();
              }}
            >
              <svg
                class="add-icon"
                slot="prefix"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="{1.5}"
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
          ${(this.form as any)[field.key].map(
            (_item: any, index: number) => html`
              <div class="array">
                <sl-button
                  variant="text"
                  @click=${() => {
                    const newForm = { ...this.form };
                    const currentForm = newForm;
                    (currentForm as any)[field.key].splice(index, 1);
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

                ${field.children?.map((child) => {
                  if (child.type === "switch") {
                    return this.renderSwitchTemplate(child, {
                      index,
                      parentkey: field.key,
                    });
                  }
                  return this.renderInputTemplate(child, {
                    index,
                    parentkey: field.key,
                  });
                })}
              </div>
            `
          )}
        </div>
      `;
    }
    if (field.type === "switch") {
      return this.renderSwitchTemplate(field);
    }
    return html` ${this.renderInputTemplate(field)} `;
  }

  render() {
    return html`
      <form
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
        ${this.fields.map((field) => this.renderTemplate(field))}
        <sl-button type="submit"> Submit </sl-button>
      </form>
    `;
  }
}
