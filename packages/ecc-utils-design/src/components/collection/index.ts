import EccUtilsDesignCollection from "./collection.js";
import EccUtilsDesignCollectionHeader from "./collectionHeader.js";
import EccUtilsDesignCollectionItem from "./collectionItem.js";
import EccUtilsDesignCollectionFooter from "./collectionFooter.js";
import EccUtilsDesignCollectionFilter from "./collectionFilter.js";

export * from "./collection.js";
export default EccUtilsDesignCollection;
export {
  EccUtilsDesignCollectionHeader,
  EccUtilsDesignCollectionItem,
  EccUtilsDesignCollectionFooter,
  EccUtilsDesignCollectionFilter,
};

window.customElements.define("ecc-d-collection", EccUtilsDesignCollection);
window.customElements.define(
  "ecc-d-collection-header",
  EccUtilsDesignCollectionHeader
);
window.customElements.define(
  "ecc-d-collection-item",
  EccUtilsDesignCollectionItem
);
window.customElements.define(
  "ecc-d-collection-footer",
  EccUtilsDesignCollectionFooter
);
window.customElements.define(
  "ecc-d-collection-filter",
  EccUtilsDesignCollectionFilter
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-d-collection": EccUtilsDesignCollection;
    "ecc-d-collection-header": EccUtilsDesignCollectionHeader;
    "ecc-d-collection-item": EccUtilsDesignCollectionItem;
    "ecc-d-collection-footer": EccUtilsDesignCollectionFooter;
    "ecc-d-collection-filter": EccUtilsDesignCollectionFilter;
  }
}
