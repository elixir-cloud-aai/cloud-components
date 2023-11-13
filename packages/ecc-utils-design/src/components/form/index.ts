import Form from "./form.js";

export * from "./form.js";
export default Form;

window.customElements.define("ecc-utils-design-form", Form);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-form": Form;
  }
}
