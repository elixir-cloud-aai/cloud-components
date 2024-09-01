import { html, LitElement, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/switch/switch.js";
import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
import "@shoelace-style/shoelace/dist/components/alert/alert.js";
import "@shoelace-style/shoelace/dist/components/details/details.js";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/select/select.js";
import "@shoelace-style/shoelace/dist/components/option/option.js";
import _ from "lodash-es";
import { hostStyles } from "../../styles/host.styles.js";
import formStyles from "./form.styles.js";
import { primitiveStylesheet } from "../../styles/primitive.styles.js";
import sholelaceStyles from "../../styles/shoelace.styles.js";

export interface Field {
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
    | "file"
    | "group"
    | "select";
  fieldOptions?: {
    required?: boolean;
    default?: string | boolean;
    multiple?: boolean;
    accept?: string;
    returnIfEmpty?: boolean;
    tooltip?: string;
  };
  selectOptions?: Array<{ label: string; value: string }>;
  arrayOptions?: {
    defaultInstances?: number;
    max?: number;
    min?: number;
  };
  groupOptions?: {
    collapsible: boolean;
  };
  error?: string;
  children?: Array<Field>;
}

/**
 * @summary This component is used to render a form with the given fields.
 * @since 1.0.0
 *
 * @property {array} fields - Array of fields to be rendered on the form
 *
 * @method idle - Reset the form state to idle. Doesn't affect the form values.
 * @method loading - Set the form state to loading. Disables the submit button.
 * @method success - Set the form state to success. Show the success message.
 *
 * @event ecc-utils-submit - This event is fired when the form is submitted. The event detail contains the form data.
 */

export default class EccUtilsDesignForm extends LitElement {
  static styles = [
    primitiveStylesheet,
    sholelaceStyles,
    hostStyles,
    formStyles,
  ];

  @property({ type: Array, reflect: true }) fields: Array<Field> = [];
  @state() private form: object = {};
  @state() private formState: "idle" | "loading" | "error" | "success" = "idle";
  @state() private canSubmit = false;
  @state() private submitDisabledByUser = false;
  @state() private errorMessage = "Something went wrong";
  @state() private successMessage = "Form submitted successfully";
  @state() private requiredButEmpty: string[] = [];

  connectedCallback() {
    super.connectedCallback();

    if (!this.fields) {
      throw new Error("Fields is required");
    }
  }

  private renderSwitchTemplate(field: Field, path: string): TemplateResult {
    if (field.type !== "switch") return html``;

    if (!_.get(this.form, path) && !this.hasUpdated) {
      _.set(this.form, path, field.fieldOptions?.default || false);
    }

    return html`
      <div class="switch-container" data-testid="form-switch-parent">
        ${field.fieldOptions?.tooltip && field.fieldOptions.tooltip !== ""
          ? html`
              <sl-tooltip
                content=${field.fieldOptions?.tooltip}
                data-testid="form-tooltip"
              >
                <label class="switch-label" data-testid="form-label"
                  >${field.label}
                </label>
              </sl-tooltip>
            `
          : html`
              <label class="switch-label" data-testid="form-label"
                >${field.label}
              </label>
            `}
        <sl-switch
          size="small"
          class="switch"
          data-label=${field.label}
          data-testid="form-switch"
          label=${field.label}
          ?required=${field.fieldOptions?.required}
          ?checked=${_.get(this.form, path)}
          @sl-change=${(e: Event) => {
            _.set(this.form, path, (e.target as HTMLInputElement).checked);
            this.requestUpdate();
          }}
        >
        </sl-switch>
      </div>
    `;
  }

  renderInputTemplate(field: Field, path: string): TemplateResult {
    if (
      field.type === "array" ||
      field.type === "switch" ||
      field.type === "group"
    )
      return html``;

    if (field.type === "file") {
      return html`
        <div class="file-container" data-testid="form-input-file-parent">
          ${field.fieldOptions?.tooltip && field.fieldOptions.tooltip !== ""
            ? html`
                <sl-tooltip
                  id=${field.key}
                  content=${field.fieldOptions?.tooltip}
                  data-testid="form-tooltip"
                >
                  <label class="file-input-label" data-testid="form-label">
                    ${field.label} ${field.fieldOptions?.required ? "*" : ""}
                  </label>
                </sl-tooltip>
              `
            : html`
                <label class="file-input-label" data-testid="form-label">
                  ${field.label} ${field.fieldOptions?.required ? "*" : ""}
                </label>
              `}
          <input
            class="file-input"
            type="file"
            data-label=${field.label}
            data-testid="form-input-file"
            accept=${field.fieldOptions?.accept || "*"}
            ?multiple=${field.fieldOptions?.multiple}
            ?required=${field.fieldOptions?.required}
            @change=${async (e: Event) => {
              const { files } = e.target as HTMLInputElement;
              _.set(this.form, path, files);
              this.requestUpdate();
            }}
          />
        </div>
      `;
    }

    // if the field is empty and has a default value, set the default value on first render
    if (!_.get(this.form, path)) {
      if (field.fieldOptions?.default && !this.hasUpdated) {
        _.set(this.form, path, field.fieldOptions.default);
      } else if (field.fieldOptions?.returnIfEmpty) {
        _.set(this.form, path, "");
      }
    }

    if (field.type === "select") {
      return html`
        <div class="select-container">
          ${field.fieldOptions?.tooltip && field.fieldOptions.tooltip !== ""
            ? html`
                <sl-tooltip
                  id=${field.key}
                  content=${field.fieldOptions?.tooltip}
                >
                  <label class="select-label">
                    ${field.label} ${field.fieldOptions?.required ? "*" : ""}
                  </label>
                </sl-tooltip>
              `
            : html`
                <label class="select-label">
                  ${field.label} ${field.fieldOptions?.required ? "*" : ""}
                </label>
              `}
          <sl-select
            class="select"
            ?required=${field.fieldOptions?.required}
            value=${_.get(this.form, path)?.label || ""}
            @sl-change=${(e: Event) => {
              const selectElement = e.target as HTMLSelectElement;
              const label = selectElement.selectedOptions[0].textContent;
              _.set(this.form, path, label);
              this.requestUpdate();
            }}
          >
            ${field.selectOptions?.map(
              (option) => html`
                <sl-option value=${option.value}> ${option.label} </sl-option>
              `
            )}
          </sl-select>
        </div>
      `;
    }

    return html`
      <sl-input
        class="input"
        data-label=${field.label}
        data-testid="form-input"
        type=${field.type || "text"}
        ?required=${field.fieldOptions?.required}
        value=${_.get(this.form, path)}
        ?password-toggle=${field.type === "password"}
        @sl-input=${(e: Event) => {
          const { value } = e.target as HTMLInputElement;
          if (!value) {
            _.unset(this.form, path);
          } else {
            _.set(this.form, path, value);
          }

          this.requestUpdate();
        }}
      >
        <label slot="label">
          ${field.fieldOptions?.tooltip && field.fieldOptions.tooltip !== ""
            ? html`
              <sl-tooltip content=${field.fieldOptions?.tooltip} data-testid="form-tooltip" >
                <label data-testid="form-label" > ${field.label} </label>
              </sl-tooltip>
            </label>
            `
            : html` <label data-testid="form-label"> ${field.label} </label> `}
        </label>
      </sl-input>
    `;
  }

  private renderArrayTemplate(field: Field, path: string): TemplateResult {
    const { arrayOptions } = field;

    if (!_.get(this.form, path)) {
      const defaultCount = field.arrayOptions?.defaultInstances;
      if (defaultCount) {
        _.set(
          this.form,
          path,
          Array.from({ length: defaultCount }, () => ({}))
        );
      }
    }

    const resolveAddButtonIsActive = () => {
      if (!arrayOptions?.max) return true;
      if (arrayOptions.max > (_.get(this.form, path)?.length || 0)) return true;
      return false;
    };

    const resolveDeleteButtonIsActive = () => {
      if (!arrayOptions?.defaultInstances || !arrayOptions?.min) return true;
      if (_.get(this.form, path).length > arrayOptions.min) return true;
      return false;
    };

    return html`
      <div class="array-container">
        <div class="array-header">
          ${field.fieldOptions?.tooltip && field.fieldOptions.tooltip !== ""
            ? html`
                <sl-tooltip
                  content=${field.fieldOptions?.tooltip}
                  data-testid="form-tooltip"
                >
                  <label data-testid="form-label" class="array-label">
                    ${field.label} ${field.fieldOptions?.required ? "*" : ""}
                  </label>
                </sl-tooltip>
              `
            : html`
                <label data-testid="form-label" class="array-label">
                  ${field.label} ${field.fieldOptions?.required ? "*" : ""}
                </label>
              `}
          <sl-button
            variant="text"
            size="small"
            data-testid="form-array-add"
            ?disabled=${!resolveAddButtonIsActive()}
            class="add-button"
            @click=${() => {
              if (resolveAddButtonIsActive()) {
                const instances: [] = _.get(this.form, path) || [];
                _.set(this.form, path, [...instances, {}]);
                this.requestUpdate();
              }
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
        ${_.get(this.form, path)?.map(
          (_item: any, index: number) => html`
            <div class="array-item" data-testid="form-array-item">
              <sl-button
                variant="text"
                data-testid="form-array-delete"
                ?disabled=${!resolveDeleteButtonIsActive()}
                @click=${() => {
                  if (resolveDeleteButtonIsActive()) {
                    const newInstance = [..._.get(this.form, path)];
                    newInstance.splice(index, 1);
                    _.set(this.form, path, newInstance);
                    this.requestUpdate();
                  }
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

  private renderGroupTemplate(field: Field, path: string): TemplateResult {
    if (!field.children) return html``;

    const renderChildren = () =>
      html`
        <div class="group-item" data-testid="form-group-item">
          ${field.children?.map((child) =>
            this.renderTemplate(child, `${path}`)
          )}
        </div>
      `;

    return html` <div class="group-container" data-testid="form-group">
      ${field.groupOptions?.collapsible
        ? html` <sl-details
            data-testid="form-group-collapsible"
            summary=${`${field.label} ${
              field.fieldOptions?.required ? "*" : ""
            }`}
          >
            ${renderChildren()}
          </sl-details>`
        : html`
            <div data-testid="form-group-non-collapsible" class="group-header">
              ${field.fieldOptions?.tooltip && field.fieldOptions.tooltip !== ""
                ? html`
                    <sl-tooltip
                      content=${field.fieldOptions?.tooltip}
                      data-testid="form-tooltip"
                    >
                      <label data-testid="form-label" class="group-label">
                        ${field.groupOptions?.collapsible ? "" : field.label}
                      </label>
                    </sl-tooltip>
                  `
                : html`
                    <label class="group-label">
                      ${field.groupOptions?.collapsible ? "" : field.label}
                    </label>
                  `}
            </div>
            <div class="group-content">${renderChildren()}</div>
          `}
    </div>`;
  }

  private renderTemplate(field: Field, path: string): TemplateResult {
    const newPath = `${path}.${field.key}`;
    if (field.type === "group") {
      return this.renderGroupTemplate(field, newPath);
    }
    if (field.type === "array") {
      return this.renderArrayTemplate(field, newPath);
    }

    if (field.fieldOptions?.required && !_.get(this.form, newPath)) {
      this.requiredButEmpty.push(field.key);
    }
    if (field.type === "switch") {
      return this.renderSwitchTemplate(field, newPath);
    }
    return this.renderInputTemplate(field, newPath);
  }

  private renderErrorTemplate(): TemplateResult {
    if (this.formState !== "error") return html``;
    return html`<sl-alert data-testid="form-error" variant="danger" open>
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
      <sl-alert data-testid="form-success" variant="success" open>
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

  public disableSubmit(disable = true) {
    this.submitDisabledByUser = disable;
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

  private handleSubmit(e: Event) {
    e.preventDefault();
    const form = this.shadowRoot?.querySelector("form");
    const isValid = form?.reportValidity();
    if (!isValid) {
      return;
    }
    if (Object.keys(this.form).length === 0) {
      this.error({ message: "Form is empty" });
      return;
    }
    const event = new CustomEvent("ecc-utils-submit", {
      detail: {
        form: this.form,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    this.requiredButEmpty = [];
    if (!this.fields || this.fields.length === 0) {
      throw new Error("Fields is required & should not be empty array");
    }
    if (this.formState === "success") {
      return html` ${this.renderSuccessTemplate()} `;
    }

    const toggleButtonState = () => {
      if (this.requiredButEmpty.length > 0) {
        this.canSubmit = false;
      } else {
        this.canSubmit = true;
      }

      return "";
    };

    return html`
      <form data-testid="form" @submit=${this.handleSubmit}>
        ${this.fields.map((field) => this.renderTemplate(field, "data"))}
        ${this.renderErrorTemplate()} ${toggleButtonState()}

        <sl-button
          type="submit"
          data-testid="form-submit"
          variant="primary"
          class="submit-button"
          ?loading=${this.formState === "loading"}
          ?disabled=${this.submitDisabledByUser ||
          !this.canSubmit ||
          this.formState === "loading"}
        >
          Submit
        </sl-button>
      </form>
    `;
  }
}
