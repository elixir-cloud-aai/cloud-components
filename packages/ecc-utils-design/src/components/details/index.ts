import EccUtilsDesignDetails from "./details.js";
import EccUtilsDesignDataItem from "./dataItem.js";

// ... other imports

export * from "./details.js";
export default EccUtilsDesignDetails;

export { EccUtilsDesignDataItem };

window.customElements.define("ecc-d-details", EccUtilsDesignDetails);
window.customElements.define("ecc-d-data-item", EccUtilsDesignDataItem);

// ... rest of the code (declare global, etc.)
