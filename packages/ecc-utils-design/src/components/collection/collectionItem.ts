import { LitElement, html, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/details/details.js";
import { repeat } from "lit/directives/repeat.js";
import { hostStyles } from "../../styles/host.styles.js";
import collectionStyles from "./collection.styles.js";
import { primitiveStylesheet } from "../../styles/primitive.styles.js";
import sholelaceStyles from "../../styles/shoelace.styles.js";

export default class EccUtilsDesignCollectionItem extends LitElement {
  static styles = [
    primitiveStylesheet,
    sholelaceStyles,
    hostStyles,
    collectionStyles,
  ];

  @property({ type: String, reflect: true }) key = "";
  @property({ type: String, reflect: true }) name = "";
  @property({ type: String, reflect: true }) tag = "";
  @property({ type: String, attribute: "tag-type" }) tagType = "primary";

  // console.log("this is used to render hidden elements to maintain the size of the container, we can do this with css")
  @property({ type: Boolean, reflect: true }) hide = false;
  @property({ type: Number, attribute: "skeleton-count" }) skeletonCount = 3;

  @state() loading = false;
  @state() contentLoading = true;

  public renderContent() {
    this.contentLoading = false;
    this.requestUpdate();
  }

  public renderTitle() {
    this.loading = false;
    this.requestUpdate();
  }

  protected render(): TemplateResult {
    return html`
      <sl-details
        name="${this.key}"
        class="${this.hide ? "hidden" : ""}"
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
        .disabled=${this.loading}
      >
        <div class="title" slot="summary">
          ${this.loading
            ? html`
                <sl-skeleton
                  class="skeleton-title"
                  effect="sheen"
                ></sl-skeleton>
              `
            : html` <div>${this.name}</div>`}
          ${this.tag && !this.loading
            ? html`<sl-badge
                class="badge"
                variant="${this.tagType || "primary"}"
              >
                ${this.tag}
              </sl-badge>`
            : ""}
        </div>
        <slot name="${this.key}" class="content">
          ${this.contentLoading
            ? html`<div class="lazy">
                ${repeat(
                  Array(this.skeletonCount),
                  () =>
                    html`<sl-skeleton
                      class="skeleton-body"
                      effect="sheen"
                    ></sl-skeleton>`
                )}
              </div>`
            : html`<slot></slot>`}
        </slot>
      </sl-details>
    `;
  }
}
