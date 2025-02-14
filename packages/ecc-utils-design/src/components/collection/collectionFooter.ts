import { LitElement, html, TemplateResult } from "lit";
import { state, property } from "lit/decorators.js";
import collectionStyles from "./collection.styles.js";
import { errorAlert, findRootElement } from "./utils.js";
import EccUtilsDesignCollection from "./collection.js";

export default class EccUtilsDesignCollectionFooter extends LitElement {
  static styles = [collectionStyles];

  @property({ type: Number, reflect: true })
  page = 1;

  // test pagination with react router
  // clean up code, and test check for when certain parameters have not been provided.

  @state() private itemCount = -1;
  @state() pageLength = 5;
  @state() pageCount = 1;
  @state() collectionItem: HTMLElement | undefined = undefined;

  connectedCallback(): void {
    super.connectedCallback();

    this.collectionItem = findRootElement(this);
    if (this.collectionItem instanceof EccUtilsDesignCollection) {
      this.setInitialState();
      this.listenForFilter();
    }
  }

  private setInitialState() {
    this.firePageChangeEvent();
    const getAttribute = (attr: string) =>
      parseInt(this.collectionItem?.getAttribute(attr) || "0", 10);

    this.itemCount = getAttribute("item-count") || 1;
    this.pageLength = getAttribute("page-length") || 5;
    this.pageCount = Math.max(1, Math.ceil(this.itemCount / this.pageLength));
  }

  private listenForFilter() {
    this.collectionItem?.addEventListener("ecc-filter", (e: CustomEvent) => {
      this.itemCount = e.detail.itemCount || 1;
      this.pageCount = Math.max(1, Math.ceil(this.itemCount / this.pageLength));
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
              this.page -= 1;
              this.firePageChangeEvent();
            }}
          >
            &lt;
          </sl-button>

          ${this.generatePaginationArray().map(
            (currentPage) => html`<sl-button
              class=${this.page.toString() === currentPage
                ? "page active"
                : "page"}
              @click=${() => {
                if (currentPage === "...") return;
                this.page = parseInt(currentPage, 10);
                this.firePageChangeEvent();
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
              if (!canGoForward()) {
                return;
              }

              this.page += 1;
              this.firePageChangeEvent();
            }}
          >
            &gt;
          </sl-button>
        </sl-button-group>
      </div>
    `;
  }
}
