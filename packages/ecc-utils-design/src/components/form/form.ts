import { html, LitElement, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/switch/switch.js";
import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
import "@shoelace-style/shoelace/dist/components/alert/alert.js";
import "@shoelace-style/shoelace/dist/components/details/details.js";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
// import '@elixir-cloud/design/dist/components/code/index.js';
import "../code/index.js";
import * as _ from "lodash-es";
import { ifDefined } from "lit/directives/if-defined.js";
import getShoelaceStyles from "../../styles/shoelace.styles.js";
import { hostStyles } from "../../styles/host.styles.js";
import formStyles from "./form.styles.js";
import { Language } from "../code/code.js";

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
    | "code"
    | "group";
  codeOptions?: {
    language?: Language;
    indentation?: number;
    blurDelay?: number;
  };
  fieldOptions?: {
    disabled?: boolean;
    required?: boolean;
    default?: string | boolean;
    multiple?: boolean;
    accept?: string;
    returnIfEmpty?: string;
    tooltip?: string;
  };
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
    getShoelaceStyles(
      document.querySelector("html")?.classList.contains("dark")
    ),
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

  protected cssParts = {
    switchControl: "switch",
    switchThumb: "switch-thumb",
    switchLabel: "switch-label",
    formControl: "field",
    formControlLabel: "input-label",
    input: "input",
    inputBase: "input-base",
    button: "button",
    addButton: "add-button",
    removeButton: "remove-button",
    submitButton: "submit-button",
    header: "header",
    label: "label",
    arrayHeader: "array-header",
    arrayContainer: "array-container",
    arrayLabel: "array-label",
    arrayItem: "array-item",
    groupBase: "group",
    groupHeader: "group-header",
    groupItem: "group-item",
    groupLabel: "group-label",
    groupToggleIcon: "group-toggle-icon",
    groupContent: "group-content",
    container: "container",
    item: "item",
    form: "form",
  };

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

    const { switchControl, switchThumb, label, switchLabel, formControl } =
      this.cssParts;
    return html`
      <div part="${formControl}" class="switch-container">
        ${field.fieldOptions?.tooltip && field.fieldOptions.tooltip !== ""
          ? html`
              <sl-tooltip content=${field.fieldOptions?.tooltip}>
                <label part="${label} ${switchLabel}" class="switch-label"
                  >${field.label}
                </label>
              </sl-tooltip>
            `
          : html`
              <label part="${label} ${switchLabel}" class="switch-label"
                >${field.label}
              </label>
            `}
        <sl-switch
          exportparts="control: ${switchControl}, thumb: ${switchThumb}"
          size="small"
          class="switch"
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

    const { formControl, formControlLabel, input, inputBase, label } =
      this.cssParts;
    if (field.type === "file") {
      return html`
        <div part="${formControl}" class="row">
          ${field.fieldOptions?.tooltip && field.fieldOptions.tooltip !== ""
            ? html`
                <sl-tooltip
                  id=${field.key}
                  content=${field.fieldOptions?.tooltip}
                >
                  <label part="${label} ${formControlLabel}">
                    ${field.label} ${field.fieldOptions?.required ? "*" : ""}
                  </label>
                </sl-tooltip>
              `
            : html`
                <label part="${label} ${formControlLabel}">
                  ${field.label} ${field.fieldOptions?.required ? "*" : ""}
                </label>
              `}
          <input
            class="input"
            part="${inputBase} ${input}"
            type="file"
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

    if (!_.get(this.form, path)) {
      if (field.fieldOptions?.default && !this.hasUpdated) {
        _.set(this.form, path, field.fieldOptions.default);
      } else if (field.fieldOptions?.returnIfEmpty) {
        _.set(this.form, path, "");
      }
    }

    return html`
      <sl-input
        exportparts="form-control: ${formControl}, form-control-label: ${formControlLabel}, form-control-label: ${label}, input: ${input}, base: ${inputBase}"
        class="input"
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
              <sl-tooltip content=${field.fieldOptions?.tooltip}>
                <label> ${field.label} </label>
              </sl-tooltip>
            </label>
            `
            : html` <label> ${field.label} </label> `}
        </label>
      </sl-input>
    `;
  }

  private renderCodeTemplate(field: Field, path: string): TemplateResult {
    if (field.type !== "code") return html``;
    // TODO: add CSS parts

    const { label, key } = field;
    const { fieldOptions, codeOptions } = field;
    const { formControl, formControlLabel } = this.cssParts;

    return html`<ecc-utils-design-code
      exportparts="form-control: ${formControl},
			form-control-label: ${formControlLabel}, 
			input: ${this.cssParts.input}, 
			base: ${this.cssParts.inputBase},
      label: ${this.cssParts.label},"
      ?required=${fieldOptions?.required}
      ?disabled=${fieldOptions?.disabled}
      key=${key}
      label=${label}
      language=${ifDefined(codeOptions?.language)}
      indentation=${ifDefined(codeOptions?.indentation)}
      blurDelay=${ifDefined(codeOptions?.blurDelay)}
      tooltip=${ifDefined(fieldOptions?.tooltip)}
      @ecc-utils-change=${(e: CustomEvent) => _.set(this.form, path, e.detail)}
    ></ecc-utils-design-code>`;
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

    const {
      button,
      addButton,
      removeButton,
      label,
      header,
      arrayHeader,
      arrayContainer,
      container,
      arrayLabel,
      arrayItem,
      item,
    } = this.cssParts;
    return html`
      <div class="array-container" part="${container} ${arrayContainer}">
        <div
          part="header: ${arrayHeader}, header: ${header}"
          class="array-header"
        >
          ${field.fieldOptions?.tooltip && field.fieldOptions.tooltip !== ""
            ? html`
                <sl-tooltip content=${field.fieldOptions?.tooltip}>
                  <label part="${label} ${arrayLabel}" class="array-label">
                    ${field.label} ${field.fieldOptions?.required ? "*" : ""}
                  </label>
                </sl-tooltip>
              `
            : html`
                <label part="${label} ${arrayLabel}" class="array-label">
                  ${field.label} ${field.fieldOptions?.required ? "*" : ""}
                </label>
              `}
          <sl-button
            variant="text"
            size="small"
            exportparts="base: ${button}, base: ${addButton}"
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
            <div part="${item} ${arrayItem}" class="array-item">
              <sl-button
                variant="text"
                exportparts="base: ${button}, base: ${removeButton}"
                ?disabled=${!resolveDeleteButtonIsActive()}
                @click=${() => {
                  resolveDeleteButtonIsActive() &&
                    _.get(this.form, path).splice(index, 1) &&
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

  private renderGroupTemplate(field: Field, path: string): TemplateResult {
    if (!field.children) return html``;

    const {
      item,
      header,
      label,
      groupItem,
      groupBase,
      groupContent,
      groupHeader,
      groupLabel,
      groupToggleIcon,
    } = this.cssParts;
    const renderChildren = () =>
      html`
        <div part="${item} ${groupItem}" class="group-item">
          ${field.children?.map((child) =>
            this.renderTemplate(child, `${path}`)
          )}
        </div>
      `;

    return html` <div class="group-container">
      ${field.groupOptions?.collapsible
        ? html` <sl-details
            summary=${`${field.label} ${
              field.fieldOptions?.required ? "*" : ""
            }`}
            exportparts="base: ${groupBase}, header: ${groupHeader}, header: ${header}, summary: ${label}, summary: ${groupLabel}, summary-icon: ${groupToggleIcon}, content: ${groupContent}"
          >
            ${renderChildren()}
          </sl-details>`
        : html`
            <div part="${header} ${groupHeader}" class="group-header">
              ${field.fieldOptions?.tooltip && field.fieldOptions.tooltip !== ""
                ? html`
                    <sl-tooltip content=${field.fieldOptions?.tooltip}>
                      <label part="${groupLabel} ${label}" class="group-label">
                        ${field.groupOptions?.collapsible ? "" : field.label}
                      </label>
                    </sl-tooltip>
                  `
                : html`
                    <label part="${groupLabel} ${label}" class="group-label">
                      ${field.groupOptions?.collapsible ? "" : field.label}
                    </label>
                  `}
            </div>
            ${renderChildren()}
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
    if (field.type === "code") {
      return this.renderCodeTemplate(field, newPath);
    }
    if (field.type === "switch") {
      return this.renderSwitchTemplate(field, newPath);
    }
    return this.renderInputTemplate(field, newPath);
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

    const { button, submitButton, form: csspartForm } = this.cssParts;
    return html`
      <form
        part="${csspartForm}"
        @submit=${(e: Event) => {
          e.preventDefault();
          const form = this.shadowRoot?.querySelector("form");
          const isValid = form?.reportValidity();
          if (!isValid) {
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
        }}
      >
        ${this.fields.map((field) => this.renderTemplate(field, "data"))}
        ${this.renderErrorTemplate()} ${toggleButtonState()}

        <sl-button
          type="submit"
          exportparts="base: ${button}, base: ${submitButton}"
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
