import EccUtilsDesignPagination, {
  EccUtilsDesignPaginationContent,
  EccUtilsDesignPaginationItem,
  EccUtilsDesignPaginationLink,
  EccUtilsDesignPaginationPrevious,
  EccUtilsDesignPaginationNext,
  EccUtilsDesignPaginationEllipsis,
} from "./pagination.js";

export * from "./pagination.js";
export default EccUtilsDesignPagination;

if (!window.customElements.get("ecc-utils-design-pagination")) {
  window.customElements.define(
    "ecc-utils-design-pagination",
    EccUtilsDesignPagination
  );
}
if (!window.customElements.get("ecc-utils-design-pagination-content")) {
  window.customElements.define(
    "ecc-utils-design-pagination-content",
    EccUtilsDesignPaginationContent
  );
}
if (!window.customElements.get("ecc-utils-design-pagination-item")) {
  window.customElements.define(
    "ecc-utils-design-pagination-item",
    EccUtilsDesignPaginationItem
  );
}
if (!window.customElements.get("ecc-utils-design-pagination-link")) {
  window.customElements.define(
    "ecc-utils-design-pagination-link",
    EccUtilsDesignPaginationLink
  );
}
if (!window.customElements.get("ecc-utils-design-pagination-previous")) {
  window.customElements.define(
    "ecc-utils-design-pagination-previous",
    EccUtilsDesignPaginationPrevious
  );
}
if (!window.customElements.get("ecc-utils-design-pagination-next")) {
  window.customElements.define(
    "ecc-utils-design-pagination-next",
    EccUtilsDesignPaginationNext
  );
}
if (!window.customElements.get("ecc-utils-design-pagination-ellipsis")) {
  window.customElements.define(
    "ecc-utils-design-pagination-ellipsis",
    EccUtilsDesignPaginationEllipsis
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-pagination": EccUtilsDesignPagination;
    "ecc-utils-design-pagination-content": EccUtilsDesignPaginationContent;
    "ecc-utils-design-pagination-item": EccUtilsDesignPaginationItem;
    "ecc-utils-design-pagination-link": EccUtilsDesignPaginationLink;
    "ecc-utils-design-pagination-previous": EccUtilsDesignPaginationPrevious;
    "ecc-utils-design-pagination-next": EccUtilsDesignPaginationNext;
    "ecc-utils-design-pagination-ellipsis": EccUtilsDesignPaginationEllipsis;
  }
}
