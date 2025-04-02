import { LitElement, html, TemplateResult } from "lit";
import { state, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import collectionStyles from "./collection.styles.js";
import { errorAlert, findRootElement, parseSearchParams } from "./utils.js";
import EccDCollection from "./collection.js";

/**
 * @element ecc-d-collection-footer
 * @summary A pagination component for collections that handles page navigation.
 * @description
 * The `ecc-d-collection-footer` component provides pagination functionality for collection components.
 * It displays a set of page navigation buttons and handles page changes, with support for URL-based
 * pagination state. The component intelligently displays pagination controls with ellipses for
 * large page counts.
 *
 * @property {Number} page - Current page number
 * @property {Number} numberOfPages - Total number of pages, if known (-1 means auto-calculate)
 * @property {Boolean} paginateUrl - Whether to update URL with page parameter when changing pages
 *
 * @state {Number} itemCount - Total number of items in the collection
 * @state {Number} pageLength - Number of items per page
 * @state {Number} pageCount - Calculated number of pages
 * @state {HTMLElement|undefined} collectionItem - Reference to the parent collection element
 *
 * @method connectedCallback - Lifecycle method called when element is connected to DOM
 * @method setPageCount - Public method that calculates and sets the total page count
 * @method setInitialState - Public method that sets up initial pagination state
 * @method error - Public method that displays an error message
 *
 * @private {method} listenForFilter - Sets up listener for filter events from collection
 * @private {method} firePageChangeEvent - Dispatches page change event
 * @private {method} generatePaginationArray - Generates array of page numbers with ellipses for display
 * @private {method} setPaginationParam - Updates URL with page parameter
 * @private {method} setPageFromURL - Sets current page based on URL parameter
 * @private {method} changePage - Changes to a specific page number
 *
 * @event ecc-page-change - Fired when page changes. Detail contains: {page}
 * @event ecc-filter - Listens for this event from parent collection to update item count
 *
 * @dependency @shoelace-style/shoelace - Uses Shoelace components for UI elements
 */
export default class EccDCollectionFooter extends LitElement {
  static styles = [collectionStyles];

  @property({ type: Number, reflect: true })
  page = 1;

  @property({ type: Number, attribute: "page-count" }) numberOfPages = -1;
  @property({ type: Boolean, attribute: "paginate-url" }) paginateUrl = false;

  // test pagination with react router
  // clean up code, and test check for when certain parameters have not been provided.

  @state() itemCount = -1;
  @state() pageLength = 5;
  @state() pageCount = 1;
  @state() collectionItem: HTMLElement | undefined = undefined;

  connectedCallback(): void {
    super.connectedCallback();

    this.collectionItem =
      this.closest("ecc-d-collection") || findRootElement(this);

    if (this.collectionItem instanceof EccDCollection) {
      this.setInitialState();
      this.listenForFilter();
    }
  }

  public setPageCount = () => {
    this.pageCount =
      this.numberOfPages > 0
        ? this.numberOfPages
        : Math.max(1, Math.ceil(this.itemCount / this.pageLength));
  };

  public setInitialState() {
    if (this.paginateUrl) {
      this.setPageFromURL();
    }
    this.firePageChangeEvent();
    this.setPageCount();
  }

  private listenForFilter() {
    this.collectionItem?.addEventListener("ecc-filter", (e: CustomEvent) => {
      this.itemCount = e.detail.itemCount || 1;
      this.setPageCount();
    });
  }

  private firePageChangeEvent(): void {
    this.dispatchEvent(
      new CustomEvent("ecc-page-change", {
        detail: {
          page: this.page,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private generatePaginationArray(): string[] {
    const { pageCount, page } = this;

    if (pageCount <= 7) {
      return Array.from({ length: pageCount }, (_, i) => (i + 1).toString());
    }

    const addEllipsis = () => {
      if (result[result.length - 1] !== "...") {
        result.push("...");
      }
    };

    const addStart = () => {
      result.push("2", "3", "4");
      addEllipsis();
      result.push((pageCount - 1).toString());
    };

    const addMiddle = () => {
      addEllipsis();
      result.push(
        (pageCount - 4).toString(),
        (pageCount - 3).toString(),
        (pageCount - 2).toString()
      );
      if (result[result.length - 1] !== (pageCount - 1).toString()) {
        result.push((pageCount - 1).toString());
      }
    };

    const addEnd = () => {
      addEllipsis();
      result.push(
        (page - 1).toString(),
        page.toString(),
        (page + 1).toString()
      );
      addEllipsis();
    };

    const result: string[] = [];
    result.push("1");

    if (page <= 4) {
      addStart();
    } else if (page >= pageCount - 3) {
      addMiddle();
    } else {
      addEnd();
    }

    result.push(pageCount.toString());

    return result;
  }

  private setPaginationParam = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());

    window.history.pushState({}, "", url.toString());
    this.page = page;
  };

  private setPageFromURL = () => {
    const page = parseInt(parseSearchParams(window.location.search).page, 10);

    if (!page || Number.isNaN(page)) {
      this.setPaginationParam(1);
    } else {
      this.page = page;
    }
  };

  private changePage = (newPage: number) => {
    if (this.paginateUrl) {
      this.setPaginationParam(newPage);
    } else {
      this.page = newPage;
    }

    this.firePageChangeEvent();
  };

  public error = (message: string) => errorAlert(this, message);

  protected render(): TemplateResult {
    const canGoBack = () => this.page > 1 && this.pageCount > 1;
    const canGoForward = () => this.page < this.pageCount && this.pageCount > 1;

    return html`
      <div class="footer">
        <sl-button-group>
          <sl-button
            ?disabled=${!canGoBack()}
            @click=${() => {
              if (!canGoBack()) return;
              this.changePage(this.page - 1);
            }}
          >
            &lt;
          </sl-button>

          ${repeat(
            this.generatePaginationArray(),
            (page) => page,
            (currentPage) =>
              html`<sl-button
                class=${this.page.toString() === currentPage
                  ? "page active"
                  : "page"}
                @click=${() => {
                  if (currentPage === "...") return;
                  this.changePage(parseInt(currentPage, 10));
                }}
                variant="${this.page.toString() === currentPage
                  ? "primary"
                  : "default"}"
              >
                ${currentPage}
              </sl-button>`
          )}

          <sl-button
            ?disabled=${!canGoForward()}
            @click=${() => {
              if (!canGoForward()) return;
              this.changePage(this.page + 1);
            }}
          >
            &gt;
          </sl-button>
        </sl-button-group>
      </div>
    `;
  }
}

window.customElements.define("ecc-d-collection-footer", EccDCollectionFooter);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-d-collection-footer": EccDCollectionFooter;
  }
}
