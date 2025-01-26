import { html, LitElement, PropertyValues, TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/switch/switch.js";
import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
import "@shoelace-style/shoelace/dist/components/alert/alert.js";
import "@shoelace-style/shoelace/dist/components/details/details.js";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";
import "@shoelace-style/shoelace/dist/components/select/select.js";
import "@shoelace-style/shoelace/dist/components/option/option.js";
import * as _ from "lodash-es";
import { repeat } from "lit/directives/repeat.js";
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
    readonly?: boolean;
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
  fileOptions?: {
    protocol?: "native" | "tus";
    tusOptions?: {
      endpoint: string;
    };
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

  @state() private form: object = {};
  @state() private formState: "idle" | "loading" | "error" | "success" = "idle";
  @state() private canSubmit = false;
  @state() private submitDisabledByUser = false;
  @state() private errorMessage = "Something went wrong";
  @state() private successMessage = "Form submitted successfully";
  @state() private requiredButEmpty: string[] = [];
  @state() private items: Array<Element> = [];

  declare setHTMLUnsafe: (htmlString: string) => void;
  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    this.items = Array.from(this.querySelectorAll(":scope > *"));
    this.setHTMLUnsafe("");

    this.addEventListener("ecc-utils-change", (e) => {
      if (e.detail.path) {
        _.set(this.form, e.detail.path, e.detail.value);
      }
    });
  }

  private renderErrorTemplate(): TemplateResult {
    if (this.formState !== "error") return html``;
    return html`<sl-alert data-testid="error" variant="danger" open>
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
      <sl-alert data-testid="success" variant="success" open>
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
    return html`
      <div ecc-form>
        ${repeat(
          this.items,
          () => _.uniqueId("ecc-form-item-"),
          (item) => html`${item}`
        )}

        <sl-button
          type="submit"
          data-testid="submit"
          variant="primary"
          class="submit-button"
          ?loading=${this.formState === "loading"}
          ?disabled=${this.submitDisabledByUser ||
          !this.canSubmit ||
          this.formState === "loading"}
        >
          Submit
        </sl-button>
      </div>
    `;
    // if (!this.fields || this.fields.length === 0) {
    //   throw new Error("Fields is required & should not be empty array");
    // }
    // if (this.formState === "success") {
    //   return html` ${this.renderSuccessTemplate()} `;
    // }

    // const toggleButtonState = () => {
    //   if (this.requiredButEmpty.length > 0) {
    //     this.canSubmit = false;
    //   } else {
    //     this.canSubmit = true;
    //   }

    //   return "";
    // };

    // return html`
    //   <form data-testid="form" @submit=${this.handleSubmit}>
    //     ${this.fields.map((field) => this.renderTemplate(field, "data"))}
    //     ${this.renderErrorTemplate()} ${toggleButtonState()}

    //     <sl-button
    //       type="submit"
    //       data-testid="form-submit"
    //       variant="primary"
    //       class="submit-button"
    //       ?loading=${this.formState === "loading"}
    //       ?disabled=${this.submitDisabledByUser ||
    //       !this.canSubmit ||
    //       this.formState === "loading"}
    //     >
    //       Submit
    //     </sl-button>
    //   </form>
    // `;
  }
}
