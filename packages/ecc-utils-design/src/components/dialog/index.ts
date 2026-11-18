import { EccUtilsDesignDialog } from "./dialog.js";

export * from "./dialog.js";
export default EccUtilsDesignDialog;

if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-dialog")
) {
  window.customElements.define("ecc-utils-design-dialog", EccUtilsDesignDialog);
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-dialog": EccUtilsDesignDialog;
  }
}
