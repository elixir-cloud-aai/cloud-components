import EccUtilsDesignTable, {
  EccUtilsDesignTableHeader,
  EccUtilsDesignTableBody,
  EccUtilsDesignTableFooter,
  EccUtilsDesignTableRow,
  EccUtilsDesignTableHead,
  EccUtilsDesignTableCell,
  EccUtilsDesignTableCaption,
} from "./table.js";

export * from "./table.js";
export default EccUtilsDesignTable;

// Define the custom element
if (!window.customElements.get("ecc-utils-design-table")) {
  window.customElements.define("ecc-utils-design-table", EccUtilsDesignTable);
}
if (!window.customElements.get("ecc-utils-design-table-header")) {
  window.customElements.define(
    "ecc-utils-design-table-header",
    EccUtilsDesignTableHeader
  );
}
if (!window.customElements.get("ecc-utils-design-table-body")) {
  window.customElements.define(
    "ecc-utils-design-table-body",
    EccUtilsDesignTableBody
  );
}
if (!window.customElements.get("ecc-utils-design-table-footer")) {
  window.customElements.define(
    "ecc-utils-design-table-footer",
    EccUtilsDesignTableFooter
  );
}
if (!window.customElements.get("ecc-utils-design-table-row")) {
  window.customElements.define(
    "ecc-utils-design-table-row",
    EccUtilsDesignTableRow
  );
}
if (!window.customElements.get("ecc-utils-design-table-head")) {
  window.customElements.define(
    "ecc-utils-design-table-head",
    EccUtilsDesignTableHead
  );
}
if (!window.customElements.get("ecc-utils-design-table-cell")) {
  window.customElements.define(
    "ecc-utils-design-table-cell",
    EccUtilsDesignTableCell
  );
}
if (!window.customElements.get("ecc-utils-design-table-caption")) {
  window.customElements.define(
    "ecc-utils-design-table-caption",
    EccUtilsDesignTableCaption
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-table": EccUtilsDesignTable;
    "ecc-utils-design-table-header": EccUtilsDesignTableHeader;
    "ecc-utils-design-table-body": EccUtilsDesignTableBody;
    "ecc-utils-design-table-footer": EccUtilsDesignTableFooter;
    "ecc-utils-design-table-row": EccUtilsDesignTableRow;
    "ecc-utils-design-table-head": EccUtilsDesignTableHead;
    "ecc-utils-design-table-cell": EccUtilsDesignTableCell;
    "ecc-utils-design-table-caption": EccUtilsDesignTableCaption;
  }
}
