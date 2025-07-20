import {
  EccUtilsDesignCard,
  EccUtilsDesignCardHeader,
  EccUtilsDesignCardTitle,
  EccUtilsDesignCardDescription,
  EccUtilsDesignCardContent,
  EccUtilsDesignCardFooter,
} from "./card.js";

// Define the custom elements
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-card")
) {
  window.customElements.define("ecc-utils-design-card", EccUtilsDesignCard);
}
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-card-header")
) {
  window.customElements.define(
    "ecc-utils-design-card-header",
    EccUtilsDesignCardHeader
  );
}
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-card-title")
) {
  window.customElements.define(
    "ecc-utils-design-card-title",
    EccUtilsDesignCardTitle
  );
}
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-card-description")
) {
  window.customElements.define(
    "ecc-utils-design-card-description",
    EccUtilsDesignCardDescription
  );
}
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-card-content")
) {
  window.customElements.define(
    "ecc-utils-design-card-content",
    EccUtilsDesignCardContent
  );
}
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-card-footer")
) {
  window.customElements.define(
    "ecc-utils-design-card-footer",
    EccUtilsDesignCardFooter
  );
}

export * from "./card.js";
export default EccUtilsDesignCard;

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-card": EccUtilsDesignCard;
    "ecc-utils-design-card-header": EccUtilsDesignCardHeader;
    "ecc-utils-design-card-title": EccUtilsDesignCardTitle;
    "ecc-utils-design-card-description": EccUtilsDesignCardDescription;
    "ecc-utils-design-card-content": EccUtilsDesignCardContent;
    "ecc-utils-design-card-footer": EccUtilsDesignCardFooter;
  }
}
