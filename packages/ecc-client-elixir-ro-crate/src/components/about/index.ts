import ECCClientRoCrateAbout from "./about.js";

export * from "./about.js";
export default ECCClientRoCrateAbout;

// SSR guard: customElements is not available in Node.js
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-client-elixir-ro-crate-about")
) {
  window.customElements.define(
    "ecc-client-elixir-ro-crate-about",
    ECCClientRoCrateAbout
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-elixir-ro-crate-about": ECCClientRoCrateAbout;
  }
}
