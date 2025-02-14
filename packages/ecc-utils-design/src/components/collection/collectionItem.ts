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

export default class EccUtilsDesignCollectionItem extends LitElement {
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
