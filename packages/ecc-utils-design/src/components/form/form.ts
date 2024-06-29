import { html, LitElement, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import _ from "lodash-es";
import getShoelaceStyles from "../../styles/shoelace.styles.js";
import { hostStyles } from "../../styles/host.styles.js";
import formStyles from "./form.styles.js";
import { Field } from "./types.js";
import { primitiveStylesheet } from "../../styles/primitive.styles.js";
import inputTemplate from "./templates/inputTemplate.js";
import arrayTemplate from "./templates/arrayTemplate.js";
import groupTemplate from "./templates/groupTemplate.js";
import errorTemplate from "./templates/errorTemplate.js";
import successTemplate from "./templates/successTemplate.js";
import switchTemplate from "./templates/switchTemplate.js";

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

    const parts = [
      formControl,
      `${label} ${switchLabel}`,
      `control: ${switchControl}, thumb: ${switchThumb}`,
    ];

    const changeAction = (e: Event) => {
      _.set(this.form, path, (e.target as HTMLInputElement).checked);
      this.requestUpdate();
    };

    return switchTemplate(field, parts, _.get(this.form, path), changeAction);
  }

  private renderInputTemplate(field: Field, path: string): TemplateResult {
    if (
      field.type === "array" ||
      field.type === "switch" ||
      field.type === "group"
    )
      return html``;

    const { formControl, formControlLabel, input, inputBase, label } =
      this.cssParts;

    const changeAction =
      field.type === "file"
        ? (e: Event) => {
            const { files } = e.target as HTMLInputElement;
            _.set(this.form, path, files);
            this.requestUpdate();
          }
        : (e: Event) => {
            const { value } = e.target as HTMLInputElement;
            if (!value) {
              _.unset(this.form, path);
            } else {
              _.set(this.form, path, value);
            }

            this.requestUpdate();
          };

    const emptyFieldAction = () => {
      if (!_.get(this.form, path)) {
        if (field.fieldOptions?.default && !this.hasUpdated) {
          _.set(this.form, path, field.fieldOptions.default);
        } else if (field.fieldOptions?.returnIfEmpty) {
          _.set(this.form, path, "");
        }
      }
    };

    return inputTemplate(
      field,
      [
        formControl,
        `${label} ${formControlLabel}`,
        `${inputBase} ${input}`,
        `form-control: ${formControl}, form-control-label: ${formControlLabel}, form-control-label: ${label}, input: ${input}, base: ${inputBase}`,
      ],
      changeAction,
      emptyFieldAction,
      _.get(this.form, path)
    );
  }

  private renderArrayTemplate(field: Field, path: string): TemplateResult {
    const { arrayOptions } = field;

    if (!_.get(this.form, path)) {
      const defaultCount = arrayOptions?.defaultInstances;
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

    const parts = [
      `${container} ${arrayContainer}`,
      `header: ${arrayHeader}, header: ${header}`,
      `${label} ${arrayLabel}`,
      `base: ${button}, base: ${addButton}`,
      `${item} ${arrayItem}`,
      `base: ${button}, base: ${removeButton}`,
    ];

    const addAction = () => {
      if (resolveAddButtonIsActive()) {
        const instances: [] = _.get(this.form, path) || [];
        _.set(this.form, path, [...instances, {}]);
        this.requestUpdate();
      }
    };

    const deleteAction = (index: number) => {
      resolveDeleteButtonIsActive() &&
        _.get(this.form, path).splice(index, 1) &&
        this.requestUpdate();
    };

    const renderChildren = (index: number) => {
      if (field.children?.length)
        return html` ${field.children?.map((child) =>
          this.renderTemplate(child, `${path}[${index}]`)
        )}`;

      return html``;
    };

    return arrayTemplate(
      field,
      parts,
      resolveAddButtonIsActive(),
      resolveDeleteButtonIsActive(),
      addAction,
      deleteAction,
      renderChildren,
      _.get(this.form, path)
    );
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

    const parts = [
      `base: ${groupBase}, header: ${groupHeader}, header: ${header}, summary: ${label}, summary: ${groupLabel}, summary-icon: ${groupToggleIcon}, content: ${groupContent}`,
      `${header} ${groupHeader}`,
      `${label} ${groupLabel}`,
    ];
    const renderChildren = () =>
      html`
        <div part="${item} ${groupItem}" class="group-item">
          ${field.children?.map((child) =>
            this.renderTemplate(child, `${path}`)
          )}
        </div>
      `;

    return groupTemplate(field, parts, renderChildren);
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
    return errorTemplate(this.errorMessage);
  }

  private renderSuccessTemplate(): TemplateResult {
    if (this.formState !== "success") return html``;

    return successTemplate(this.successMessage);
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
          variant="primary"
          class="submit-button"
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

export { Field };
