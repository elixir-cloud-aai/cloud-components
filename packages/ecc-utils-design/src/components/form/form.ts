/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */

import { html, css, LitElement, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import {
  resolveClass,
  returnNewObjectCopy,
} from "../../utils/componentHelpers.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/switch/switch.js";
import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
import { sholelaceLightStyles } from "../../styles/shoelace.styles.js";
import { hostStyles } from "../../styles/host.styles.js";

interface Field {
  key: string;
  label: string;
  className?: string;
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
    value?: any;
    multiple?: boolean;
    accept?: string;
    defaultCount?: number;
    max?: number;
    min?: number;
  };
  switchOptions?: {
    default?: boolean;
  };
  error?: string;
  children?: Array<Field>;
  instances?: Array<Field>;
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

  @state() arrayTemplates: Record<string, Field> = {};

  connectedCallback() {
    super.connectedCallback();
    const storeArrayTemplates = (elementName: string, field: Field) => {
      if (field.type === "array") {
        const currentElementName = `${elementName}-${field.key}`;
        this.arrayTemplates[elementName] = field;
        field.instances = Array.from(
          { length: field.fieldOptions?.defaultCount || 0 },
          () => ({ ...returnNewObjectCopy(field) })
        );

        field.children?.forEach((child) => {
          storeArrayTemplates(currentElementName, child);
        });
      }
    };

    this.fields.forEach((field) => {
      const elementName = "";
      storeArrayTemplates(elementName, field);
    });
  }

  renderArrayTemplate(
    field: Field,
    templateName: string,
    depth = 0
  ): TemplateResult {
    const currentDepth = depth + 1;
    const currentTemplateName = `${templateName}-${field.key}`;

    const resolveDeleteButtonIsActive = (
      minElementCount: number | undefined,
      defaultCount: number | undefined,
      numberOfInstances = 0
    ) => {
      if (!defaultCount || !minElementCount) return true;
      if (numberOfInstances > minElementCount) return true;
      return false;
    };

    return html`
      <div
        class="array-container ${resolveClass(field.className, currentDepth)}"
      >
        <div class="array-header">
          <label class="array-label">${field.label}</label>
          <sl-button
            class="add-button"
            @click=${() => {
              if (
                field.fieldOptions?.max &&
                field.instances!.length >= field.fieldOptions?.max
              )
                return;

              field.instances = [
                ...(field.instances || []),
                returnNewObjectCopy(field),
              ];
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
        ${field.instances?.map(
          (child, index) => html`
            <div class="array">
              <sl-button
                variant="text"
                @click=${() => {
                  resolveDeleteButtonIsActive(
                    field.fieldOptions?.min,
                    field.fieldOptions?.defaultCount,
                    field.instances?.length
                  ) &&
                    field.instances!.splice(index, 1) &&
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

              ${child.children?.map((innerChild) =>
                this.renderTemplate(
                  innerChild,
                  currentDepth,
                  currentTemplateName
                )
              )}
            </div>
          `
        )}
      </div>
    `;
  }

  renderInputTemplate(field: Field, depth = 0) {
    if (field.type === "array" || field.type === "switch") return html``;

    if (field.type === "file") {
      return html`
        <label>${field.label} ${field.fieldOptions?.required ? "*" : ""}</label>
        <input
          class=${`input ${resolveClass(field.className, depth)}`}
          type="file"
          accept=${field.fieldOptions?.accept}
          ?multiple=${field.fieldOptions?.multiple}
          ?required=${field.fieldOptions?.required}
          @change=${async (e: Event) => {
            const { files } = e.target as HTMLInputElement;

            field.fieldOptions = {
              ...field.fieldOptions,
              value: files,
            };
            this.requestUpdate();
          }}
        />
      `;
    }
    return html`
      <sl-input
        class=${`input ${resolveClass(field.className, depth)}`}
        label=${field.label}
        type=${field.type || "text"}
        ?required=${field.fieldOptions?.required}
        value=${field.fieldOptions?.value}
        ?password-toggle=${field.type === "password"}
        @sl-input=${(e: Event) => {
          field.fieldOptions = {
            ...field.fieldOptions,
            value: (e.target as HTMLInputElement).value,
          };

          this.requestUpdate();
        }}
      ></sl-input>
    `;
  }

  renderSwitchTemplate(field: Field, depth = 0) {
    if (field.type !== "switch") return html``;
    return html`
      <div class="switch-container ${resolveClass(field.className, depth)}">
        <label class="switch-label">${field.label}</label>
        <sl-switch
          class="switch"
          label=${field.label}
          ?required=${field.fieldOptions?.required}
          ?checked=${field.fieldOptions?.value}
          @sl-change=${(e: any) => {
            field.fieldOptions = {
              ...field.fieldOptions,
              value: e.target.checked,
            };

            this.requestUpdate();
          }}
        ></sl-switch>
      </div>
    `;
  }

  renderTemplate(field: Field, depth = 0, templateName = "") {
    return html`
      ${field.type === "array"
        ? this.renderArrayTemplate(field, templateName, depth)
        : field.type === "switch"
        ? this.renderSwitchTemplate(field, depth)
        : this.renderInputTemplate(field, depth)}
    `;
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
              // try to make this data more presentable
              // the disabled feature on the buttons isn't functioning properly, try to fix
              form: this.fields,
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
