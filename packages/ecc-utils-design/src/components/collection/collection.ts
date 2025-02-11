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

/**
 * @summary This component is used to render a collection of items. It can be used to render a filters & pagination component for a list of items.
 * @since 1.0.0
 *
 * @property {array} items - An array of items to render
 * @property {array} filters - An array of filters to render
 * @property {number} totalItems - The total number of items in the collection. If not provided, the collection will render pagination without fixed page numbers.
 * @property {number} pageSize - The number of items per pagination.
 *
 * @method setPage - Can be used to set the page of the collection.
 * @method error - Can be used to display error alert to the user.
 *
 * @event ecc-page-change - Fired when the page is changed.
 * @event ecc-expand - Fired when an item is expanded.
 * @event ecc-filter - Fired when a filter is applied.
 */
export default class EccUtilsDesignCollection extends LitElement {
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

  @state() itemCount = -1;
  @state() body: Array<Element> = [];
  @state() filteredBody: Array<Element> = [];
  @state() currentPage = 1;
  @state() headerEl: Element | null = null;
  @state() footerEl: Element | null = null;
  @state() searchEl: Element | null = null;
  @state() filterEl: Element | null = null;
  @state() searchContent: string | null = "";

  @property({ type: Array, reflect: true }) items: ItemProp[] = [];
  @property({ type: Array, reflect: true }) filters: FilterProp[] = [];
  @property({ type: Number, reflect: true }) totalItems = -1;
  @property({ type: Number, reflect: true }) pageSize = 5;

  @state() private _errors: string[] = [];

  private eventListeners: Record<string, any> = {};

  connectedCallback(): void {
    super.connectedCallback();

    this.footerEl = this.querySelector("ecc-d-collection-footer");
    this.headerEl = this.querySelector("ecc-d-collection-header");

    if (this.headerEl) {
      this.headerEl.setAttribute("slot", "none");

      this.searchEl = this.headerEl.querySelector(
        "ecc-d-collection-filter[type='search']"
      );
      this.filterEl = this.headerEl.querySelector(
        "ecc-d-collection-filter[type='select']"
      );

      if ((this.searchEl && this.search) || (this.filterEl && this.filter)) {
        this.eventListeners.filter = this.filterItems.bind(this);

        this.searchEl?.addEventListener(
          "ecc-input",
          this.eventListeners.filter
        );
        this.filterEl?.addEventListener(
          "ecc-input",
          this.eventListeners.filter
        );
      }
    }

    if (this.footerEl) {
      this.eventListeners.footer = (e: CustomEvent) => {
        this.currentPage = e.detail.page;
      };

      this.footerEl.addEventListener(
        "ecc-page-change",
        this.eventListeners.footer
      );
      this.footerEl.setAttribute("slot", "none");
    }

    if (this.pageLength) {
      this.setAttribute("page-length", this.pageLength.toString());
    }

    const content = this.querySelector("[ecc-collection-body]");

    if (content) {
      content.setAttribute("slot", "none");
      this.body = Array.from(content.querySelectorAll(":scope > *"));
      this.itemCount = content.querySelectorAll(":scope > *").length || -1;
      this.setAttribute("item-count", this.itemCount.toString());
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.searchEl?.removeEventListener("ecc-input", this.eventListeners.filter);
    this.filterEl?.removeEventListener("ecc-input", this.eventListeners.filter);

    this.footerEl?.removeEventListener(
      "ecc-page-change",
      this.eventListeners.footer
    );
  }

  protected updated(_changedProperties: PropertyValues): void {
    if (_changedProperties.has("itemCount")) {
      this.setAttribute("item-count", this.itemCount.toString());
    }

    if (_changedProperties.has("body")) {
      this.filteredBody = this.body;
    }

    if (_changedProperties.has("filteredBody")) {
      this.currentPage = 1;
      this.footerEl?.setAttribute("page", "1");
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

    if (_changedProperties.has("itemCount")) {
      this.setAttribute("item-count", this.itemCount.toString());
    }
  }

  public error(message: string) {
    this._errors = [...this._errors, message || "Something went wrong"];
  }

  private paginateItems() {
    const pageLength = this.pageLength || 1;

    const currentPage = Math.max(1, this.currentPage);

    const startIndex = (currentPage - 1) * pageLength;
    const endIndex = startIndex + pageLength;

    return this.filteredBody.slice(startIndex, endIndex);
  }

  private filterItems(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    this.searchContent = target.getAttribute("search-content");

    if (!this.searchContent) {
      this.filteredBody = this.body;
      return;
    }

    if (target.getAttribute("type") === "search") {
      this.filteredBody = this.body.filter((item) => {
        const searchRegex = new RegExp(this.searchContent!, "i");

        return (
          searchRegex.test(item.textContent || "") ||
          searchRegex.test(item.getAttribute("name") || "")
        );
      });
    } else {
      const filters = this.searchContent.split(",");

      this.filteredBody = this.body.filter((item) =>
        filters.some((filter) => {
          const searchRegex = new RegExp(filter, "i");

          return (
            searchRegex.test(item.textContent || "") ||
            searchRegex.test(item.getAttribute("name") || "")
          );
        })
      );
    }
  }

  private _renderErrors(): TemplateResult {
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

  render() {
    return html`<div class="collection">
      ${this.headerEl}
      ${repeat(
        this.paginateItems(),
        (item) => item.getAttribute("key"),
        (item) => item
      )}
      ${this._renderErrors()} ${this.footerEl}
    </div> `;
  }
}
