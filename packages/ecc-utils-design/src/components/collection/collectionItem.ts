import { LitElement, html, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/details/details.js";
import "@shoelace-style/shoelace/dist/components/badge/badge.js";
import "@shoelace-style/shoelace/dist/components/skeleton/skeleton.js";
import { hostStyles } from "../../styles/host.styles.js";
import collectionStyles from "./collection.styles.js";
import { primitiveStylesheet } from "../../styles/primitive.styles.js";
import sholelaceStyles from "../../styles/shoelace.styles.js";
import { errorAlert, renderSkeletons } from "./utils.js";

/**
 * @element ecc-d-collection-item
 * @summary A collapsible item component for collections with support for lazy loading.
 * @description
 * The `ecc-d-collection-item` component represents an individual item within a collection.
 * It provides a collapsible interface with a title and content area, and supports lazy loading
 * of both title and content for improved performance with large collections.
 *
 * @property {String} key - Unique identifier for the collection item
 * @property {String} name - Display name for the collection item
 * @property {String} tag - Optional tag text to display alongside the name
 * @property {String} tagType - Type of tag styling: "primary", "success", "neutral", "warning", or "danger"
 * @property {Number} skeletonCount - Number of skeleton lines to display during lazy loading
 * @property {Boolean} lazyTitle - Whether to lazy load the title
 * @property {Boolean} lazyContent - Whether to lazy load the content
 *
 * @method renderContent - Public method that renders content into the item
 * @method renderTitle - Public method that renders the title
 * @method error - Public method that displays an error message
 *
 * @private {method} _renderTitle - Renders the title with optional tag
 *
 * @event ecc-expand - Fired when the item is expanded. Detail contains: {key}
 *
 * @slot - Default slot for item content
 *
 * @dependency @shoelace-style/shoelace - Uses Shoelace components for UI elements
 */
class EccDCollectionItem extends LitElement {
  static styles = [
    primitiveStylesheet,
    sholelaceStyles,
    hostStyles,
    collectionStyles,
  ];

  @property({ type: String, reflect: true })
  key = "";

  @property({ type: String, reflect: true }) name = "";
  @property({ type: String, reflect: true }) tag = "";
  @property({ type: String, attribute: "tag-type" }) tagType = "primary";
  @property({ type: Number, attribute: "skeleton-count" }) skeletonCount = 3;
  @property({ type: Boolean, attribute: "lazy-title", reflect: true })
  lazyTitle = false;

  @property({ type: Boolean, attribute: "lazy-content", reflect: true })
  lazyContent = false;

  private _renderTitle() {
    return html` <div>${this.name}</div>
      ${this.tag
        ? html`<sl-badge class="badge" variant="${this.tagType}">
            ${this.tag}
          </sl-badge>`
        : ""}`;
  }

  declare setHTMLUnsafe: (htmlString: string) => void;
  public renderContent(content?: string) {
    this.lazyContent = false;

    if (content) this.setHTMLUnsafe(content);
    this.requestUpdate();
  }

  public renderTitle() {
    this.lazyTitle = false;
    this.requestUpdate();
  }

  public error = (message: string) => errorAlert(this, message);

  protected render(): TemplateResult {
    return html`
      <sl-details
        name="${this.key}"
        @sl-show=${() => {
          this.dispatchEvent(
            new CustomEvent("ecc-expand", {
              detail: {
                key: this.key,
              },
              bubbles: true,
              composed: true,
            })
          );
        }}
        .disabled=${this.lazyTitle}
      >
        <div class="title" slot="summary">
          ${this.lazyTitle ? renderSkeletons() : this._renderTitle()}
        </div>

        <div class="content">
          ${this.lazyContent
            ? renderSkeletons(this.skeletonCount)
            : html`<slot></slot>`}
        </div>
      </sl-details>
    `;
  }
}

window.customElements.define("ecc-d-collection-item", EccDCollectionItem);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-d-collection-item": EccDCollectionItem;
  }
}

export default EccDCollectionItem;
