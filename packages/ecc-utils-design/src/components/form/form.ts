import { html, LitElement, PropertyValues, TemplateResult } from "lit";
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
import * as _ from "lodash-es";
import { hostStyles } from "../../styles/host.styles.js";
import formStyles from "./form.styles.js";
import { primitiveStylesheet } from "../../styles/primitive.styles.js";
import sholelaceStyles from "../../styles/shoelace.styles.js";
import { setupCustomInputs } from "./utils.js";

/**
 * @element ecc-d-form
 * @summary This component is used to render a form with the given fields.
 * @description A customizable form component that handles form state, validation, and submission.
 *
 * @property {Boolean} noSubmit - When true, hides the submit button
 *
 * @state {Object} form - The form data object
 * @state {String} formState - Current state of the form: "idle" | "loading" | "error" | "success"
 * @state {Boolean} canSubmit - Whether the form can be submitted
 * @state {Boolean} submitDisabledByUser - Whether the submit button is disabled by the user
 * @state {String} errorMessage - Error message to display when form is in error state
 * @state {String} successMessage - Success message to display when form is in success state
 * @state {Array<String>} requiredButEmpty - Array of required fields that are empty
 * @state {Array<Element>} content - Array of form content elements
 *
 * @method disableSubmit - Public method that disables the submit button
 * @method loading - Public method that sets the form state to loading
 * @method success - Public method that sets the form state to success and displays a success message
 * @method error - Public method that sets the form state to error and displays an error message
 * @method idle - Public method that resets the form state to idle
 *
 * @private {method} renderErrorTemplate - Renders the error message template
 * @private {method} renderSuccessTemplate - Renders the success message template
 * @private {method} handleSubmit - Handles form submission events
 *
 * @event ecc-submit - Fired when the form is submitted. Detail contains: {form: Object}
 * @event ecc-input - Listens for this event from child components to update form data
 *
 * @dependency @shoelace-style/shoelace - Uses Shoelace components for UI elements
 */
export default class EccUtilsDesignForm extends LitElement {
  static styles = [
    primitiveStylesheet,
    sholelaceStyles,
    hostStyles,
    formStyles,
  ];

  @property({ type: Boolean, attribute: "no-submit" }) noSubmit = false;

  @state() private form: object = {};
  @state() private formState: "idle" | "loading" | "error" | "success" = "idle";
  @state() private canSubmit = true;
  @state() private submitDisabledByUser = false;
  @state() private errorMessage = "Something went wrong";
  @state() private successMessage = "Form submitted successfully";
  @state() private requiredButEmpty: string[] = [];
  @state() private content: Element[] = [];

  declare setHTMLUnsafe: (htmlString: string) => void;
  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    this.content = Array.from(this.querySelectorAll(":scope > *"));
    // we will have to do this from the individual group components

    this.setHTMLUnsafe("");

    this.addEventListener("ecc-input", (e) => {
      if (e.detail.path && !e.detail.groupType) {
        _.set(this.form, e.detail.path, e.detail.value);
      }
    });
  }

  protected updated(): void {
    setupCustomInputs(
      this.shadowRoot?.querySelectorAll("[ecc-key]:not([ecc-input-path])")
    );
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
    const event = new CustomEvent("ecc-submit", {
      detail: {
        form: this.form,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    const contentDiv = document.createElement("div");
    contentDiv.append(...this.content);

    if (this.formState === "success") {
      return html` ${this.renderSuccessTemplate()} `;
    }

    if (this.formState === "error") {
      return html` ${this.renderErrorTemplate()} `;
    }

    return html`
      <form ecc-form @submit=${this.handleSubmit}>
        ${contentDiv}
        ${!this.noSubmit
          ? html`
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
            `
          : html``}
      </form>
    `;
  }
}

window.customElements.define("ecc-d-form", EccUtilsDesignForm);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-d-form": EccUtilsDesignForm;
  }
}
