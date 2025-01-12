import EccUtilsDesignForm from "./form.js";
import EccUtilsDesignFormInput from "./formInput.js";
import EccUtilsDesignFormGroup from "./formGroup.js";

export * from "./form.js";
export default EccUtilsDesignForm;

export { EccUtilsDesignFormInput, EccUtilsDesignFormGroup };

window.customElements.define("ecc-d-form", EccUtilsDesignForm);
window.customElements.define("ecc-d-form-input", EccUtilsDesignFormInput);
window.customElements.define("ecc-d-form-group", EccUtilsDesignFormGroup);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-d-form": EccUtilsDesignForm;
    "ecc-d-form-input": EccUtilsDesignFormInput;
    "ecc-d-form-group": EccUtilsDesignFormGroup;
  }
}
