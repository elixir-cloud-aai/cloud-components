import { html, LitElement, PropertyValues, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/details/details.js";
import "@shoelace-style/shoelace/dist/components/badge/badge.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/select/select.js";
import "@shoelace-style/shoelace/dist/components/option/option.js";
import "@shoelace-style/shoelace/dist/components/button-group/button-group.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/skeleton/skeleton.js";
import "@shoelace-style/shoelace/dist/components/alert/alert.js";
import { repeat } from "lit/directives/repeat.js";
import { hostStyles } from "../../styles/host.styles.js";
import collectionStyles from "./collection.styles.js";
import { primitiveStylesheet } from "../../styles/primitive.styles.js";
import sholelaceStyles from "../../styles/shoelace.styles.js";
import EccUtilsDesignCollectionItem from "./collectionItem.js";
import { itemMatchesFilter, templateToString } from "./utils.js";
import EccDCollectionFooter from "./collectionFooter.js";

/**
 * @element ecc-d-collection
 * @summary A collection component that supports filtering, searching, and pagination.
 * @description
 * The `ecc-d-collection` component provides a structured way to display collections of items
 * with support for filtering, searching, and pagination. It manages the display of items
 * and handles user interactions for filtering and page navigation.
 *
 * @property {Boolean} filter - Whether to enable filtering functionality
 * @property {Boolean} search - Whether to enable search functionality
 * @property {Number} pageLength - Number of items to display per page
 *
 * @state {Number} itemCount - Total number of items in the collection
 * @state {Array<Element>} body - Array of all collection item elements
 * @state {Array<Element>} filteredBody - Array of filtered collection item elements
 * @state {Number} currentPage - Current page number
 * @state {Element|null} headerEl - Reference to the collection header element
 * @state {EccDCollectionFooter|null} footerEl - Reference to the collection footer element
 * @state {Element|null} searchEl - Reference to the search filter element
 * @state {Element|null} filterEl - Reference to the select filter element
 * @state {String} searchContent - Current search/filter content
 * @state {Array<String>} _errors - Array of error messages
 *
 * @method connectedCallback - Lifecycle method called when element is connected to DOM
 * @method disconnectedCallback - Lifecycle method called when element is disconnected from DOM
 * @method updated - Lifecycle method called after the component updates
 * @method renderBody - Public method that renders content into the collection body
 * @method renderContent - Public method that renders content into a specific collection item
 * @method error - Public method that adds an error message to be displayed
 *
 * @private {method} setupElements - Sets up all child elements
 * @private {method} setupHeaderElements - Sets up header elements and event listeners
 * @private {method} setupFooterElement - Sets up footer element and event listeners
 * @private {method} setupPageLength - Sets up page length attribute
 * @private {method} setupCollectionBody - Sets up collection body elements
 * @private {method} removeEventListeners - Removes all event listeners
 * @private {method} updateFilteredBody - Updates the filtered body and dispatches events
 * @private {method} paginateItems - Returns the items for the current page
 * @private {method} filterItems - Filters items based on search/filter criteria
 * @private {method} renderErrors - Renders error messages
 *
 * @event ecc-filter - Fired when items are filtered. Detail contains: {value, itemCount}
 * @event ecc-page-change - Listens for this event from the footer to change pages
 *
 * @slot - Default slot for collection items
 *
 * @dependency @shoelace-style/shoelace - Uses Shoelace components for UI elements
 */
export interface ItemProp {
  index: number;
  name: string;
  key: string;
  lazy?: boolean;
  tag?: {
    name: string;
    type?: "primary" | "success" | "neutral" | "warning" | "danger";
  };
}

export interface FilterProp {
  key: string;
  type: "search" | "select";
  options?: string[];
  selectConfig?: {
    multiple?: boolean;
  };
  placeholder?: string;
}

export default class EccDCollection extends LitElement {
  static styles = [
    primitiveStylesheet,
    sholelaceStyles,
    hostStyles,
    collectionStyles,
  ];

  @property({ type: Boolean, reflect: true }) filter = false;
  @property({ type: Boolean, reflect: true }) search = false;
  @property({ type: Number, reflect: true, attribute: "page-length" })
  pageLength?: number;

  @state() private itemCount = 0;
  @state() private body: Element[] = [];
  @state() private filteredBody: Element[] = [];
  @state() private currentPage = 1;
  @state() private headerEl: Element | null = null;
  @state() private footerEl: EccDCollectionFooter | null = null;
  @state() private searchEl: Element | null = null;
  @state() private filterEl: Element | null = null;
  @state() private searchContent = "";
  @state() private _errors: string[] = [];

  private eventListeners: Record<string, EventListener> = {};

  connectedCallback(): void {
    super.connectedCallback();
    this.setupElements();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListeners();
  }

  protected updated(changedProperties: PropertyValues): void {
    if (changedProperties.has("body")) {
      this.filteredBody = this.body;
      this.footerEl?.setInitialState();
    }

    if (changedProperties.has("itemCount")) {
      this.footerEl!.itemCount = this.itemCount;
      this.footerEl!.pageLength = this.pageLength || 1;
      this.setAttribute("item-count", this.itemCount.toString());
      this.footerEl?.setInitialState();
    }
  }

  private setupElements(): void {
    this.setupHeaderElements();
    this.setupFooterElement();
    this.setupPageLength();
    this.setupCollectionBody();
  }

  private setupHeaderElements(): void {
    const addFilterEventListeners = () => {
      [this.searchEl, this.filterEl].forEach((el) =>
        el?.addEventListener("ecc-input", this.eventListeners.filter)
      );
    };

    this.headerEl = this.querySelector("ecc-d-collection-header");
    if (!this.headerEl) return;

    this.headerEl.setAttribute("slot", "none");
    this.searchEl = this.headerEl.querySelector(
      "ecc-d-collection-filter[type='search']"
    );
    this.filterEl = this.headerEl.querySelector(
      "ecc-d-collection-filter[type='select']"
    );

    if ((this.searchEl && this.search) || (this.filterEl && this.filter)) {
      this.eventListeners.filter = this.filterItems.bind(this);
      addFilterEventListeners();
    }
  }

  private setupFooterElement(): void {
    this.footerEl = this.querySelector("ecc-d-collection-footer");
    if (!this.footerEl) return;

    this.eventListeners.footer = ((e: CustomEvent) => {
      this.currentPage = e.detail.page;
    }) as EventListener;

    this.footerEl.addEventListener(
      "ecc-page-change",
      this.eventListeners.footer
    );
    this.footerEl.setAttribute("slot", "none");
  }

  private setupPageLength(): void {
    if (this.pageLength) {
      this.setAttribute("page-length", this.pageLength.toString());
    }
  }

  private setupCollectionBody(): void {
    const content = this.querySelector("[ecc-collection-body]");
    if (!content) return;

    // content.setAttribute("slot", "none");
    this.body = Array.from(content.querySelectorAll(":scope > *"));
    this.itemCount = this.body.length;
    this.setAttribute("item-count", this.itemCount.toString());
  }

  private removeEventListeners(): void {
    this.searchEl?.removeEventListener("ecc-input", this.eventListeners.filter);
    this.filterEl?.removeEventListener("ecc-input", this.eventListeners.filter);
    this.footerEl?.removeEventListener(
      "ecc-page-change",
      this.eventListeners.footer
    );
  }

  private updateFilteredBody(): void {
    this.currentPage = 1;

    if (this.footerEl) this.footerEl.page = 1;
    this.itemCount = this.filteredBody.length;

    this.dispatchEvent(
      new CustomEvent("ecc-filter", {
        detail: {
          value: this.searchContent,
          itemCount: this.filteredBody.length,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private paginateItems(): Element[] {
    const pageLength = this.pageLength || 1;
    const startIndex = (this.currentPage - 1) * pageLength;

    return this.filteredBody.slice(startIndex, startIndex + pageLength);
  }

  private filterItems(e: Event): void {
    const target = e.target as HTMLElement;
    this.searchContent = target.getAttribute("search-content") || "";

    if (!this.searchContent) {
      this.filteredBody = this.body;
      this.updateFilteredBody();
      return;
    }

    const filters =
      target.getAttribute("type") === "search"
        ? [this.searchContent]
        : this.searchContent.split(",");

    this.filteredBody = this.body.filter((item) =>
      filters.some((filter) => itemMatchesFilter(item, filter))
    );
    this.updateFilteredBody();
  }

  private renderErrors(): TemplateResult {
    return html`${this._errors.map(
      (error) => html`
        <div class="error">
          <sl-alert variant="danger" closable open duration="5000">
            <strong>${error}</strong><br />
          </sl-alert>
        </div>
      `
    )}`;
  }

  public renderBody(content: TemplateResult): void {
    // const collectionBody = this.shadowRoot?.querySelector(
    //   ".collection-body",
    // ) as HTMLElement;

    // render(content, collectionBody);

    this.body = Array.from(
      templateToString(content).querySelectorAll(":scope > *")
    );
    console.log("the string", templateToString(content));

    // this.setupElements();
  }

  public renderContent(key: string, content?: string): void {
    const item = this.shadowRoot?.querySelector(
      `ecc-d-collection-item[key='${key}']`
    );
    if (item instanceof EccUtilsDesignCollectionItem) {
      item.renderContent(content);
    }
  }

  public error(message: string): void {
    this._errors = [...this._errors, message || "Something went wrong"];
  }

  render(): TemplateResult {
    return html`
      <div class="collection">
        ${this.headerEl} ${this.renderErrors()}
        <div class="collection-body">
          ${repeat(
            this.paginateItems(),
            (item) => item.getAttribute("key"),
            (item) => item
          )}
        </div>
        ${this.footerEl}
      </div>
    `;
  }
}

window.customElements.define("ecc-d-collection", EccDCollection);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-d-collection": EccDCollection;
  }
}
