import { LitElement, TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/select/select.js";
import "@shoelace-style/shoelace/dist/components/option/option.js";
import EccDCollection from "./collection.js";
import { errorAlert } from "./utils.js";

/**
 * @element ecc-d-collection-filter
 * @summary A filter component for collections that supports search and select filtering.
 * @description
 * The `ecc-d-collection-filter` component provides filtering capabilities for collection components.
 * It supports two types of filters:
 * 1. Search filter - For text-based searching
 * 2. Select filter - For selecting from predefined options
 *
 * It can automatically generate filter options from collection items when the auto-option attribute is enabled.
 *
 * @property {String} type - The type of filter: "search" or "select"
 * @property {String} options - JSON string of options for select filter
 * @property {String} placeholder - Placeholder text for the filter input
 * @property {String} key - Unique identifier for the filter
 * @property {String} value - Current value of the filter
 * @property {Boolean} multiple - Whether multiple selections are allowed (for select type)
 * @property {Boolean} autoOption - Whether to automatically generate options from collection items
 *
 * @method connectedCallback - Lifecycle method called when element is connected to DOM
 * @method error - Public method that displays an error message
 *
 * @private {method} setUpAutoOption - Sets up automatic option generation from collection items
 * @private {method} addToOptions - Adds items to the options array
 * @private {method} handleSetValue - Handles setting the filter value
 * @private {method} renderSearchFilter - Renders the search filter template
 * @private {method} renderSelectFilter - Renders the select filter template
 *
 * @event ecc-input - Fired when the filter value changes. Detail contains: {key, value}
 * @event ecc-filter - Fired when filtering should be applied. Detail contains: {key, value}
 *
 * @dependency @shoelace-style/shoelace - Uses Shoelace components for UI elements
 * @dependency @elixir-cloud/design - Uses Elixir Cloud Design components for form elements
 */
export default class EccDCollectionFilter extends LitElement {
  @property({ type: String, reflect: true }) type = "search";
  @property({ type: String, reflect: true }) options = "[]";
  @property({ type: String, reflect: true }) placeholder = "";
  @property({ type: String, reflect: true }) key = "";
  @property({ type: String, reflect: true }) value = "";
  @property({ type: Boolean, reflect: true }) multiple = false;
  @property({ type: Boolean, reflect: true, attribute: "auto-option" })
  autoOption = false;

  connectedCallback(): void {
    super.connectedCallback();

    // @ts-expect-error - Dynamic import for form components, its is built at the same time as this package
    import("@elixir-cloud/design/dist/components/form/index.js").catch();

    if (this.autoOption) this.setUpAutoOption();
  }

  private setUpAutoOption() {
    console.log("the option", this.options);

    const collection = this.closest("ecc-d-collection");
    if (!(collection instanceof EccDCollection)) return;

    const collectionItems = Array.from(
      collection?.querySelectorAll("ecc-d-collection-item") || []
    );

    if (collectionItems.length) {
      const names: string[] = [];
      const tags: string[] = [];
      collectionItems.forEach((item) => {
        names.push(item.name!);
        tags.push(item.tag!);
      });

      this.addToOptions(names);
      this.addToOptions(tags);
    }

    console.log("options at the end", this.options);
  }

  private addToOptions(items: Array<string>) {
    if (!items?.length) return;

    // Parse the current options
    let optionsArray: Array<string | undefined> = JSON.parse(this.options);

    // Add new items
    optionsArray = [...optionsArray, ...items];

    // Remove duplicates (case-insensitive)
    optionsArray = Array.from(
      new Set(optionsArray.map((item) => item?.toLowerCase()))
    ).map((item) => optionsArray.find((x) => x?.toLowerCase() === item));

    // Convert back to string
    let optionsString = JSON.stringify(optionsArray);

    // Remove comma after '[' if present
    optionsString = optionsString.replace(/^\[\s*,\s*/, "[");

    // Remove comma before ']' if present
    optionsString = optionsString.replace(/,\s*\]$/, "]");

    this.options = optionsString;
  }

  private handleSetValue(e: CustomEvent) {
    this.setAttribute("search-content", e.detail.value);
    this.dispatchEvent(
      new CustomEvent("ecc-input", {
        detail: {
          key: this.key,
          value: this.value,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private renderSearchFilter(): TemplateResult {
    const fireFilterEvent = (e: KeyboardEvent | CustomEvent) => {
      if (
        (e instanceof KeyboardEvent && e.key === "Enter") ||
        e instanceof CustomEvent
      ) {
        this.dispatchEvent(
          new CustomEvent("ecc-filter", {
            detail: {
              key: this.key,
              value: e.detail.value,
            },
          })
        );
      }
    };

    return html`<ecc-d-form-input
      ecc-search
      type="search"
      value=${this.value}
      key=${this.key || "search-filter"}
      placeholder="${this.placeholder || "Search"}"
      @ecc-input=${(e: CustomEvent) => {
        this.handleSetValue(e);
        fireFilterEvent(e);
      }}
      @keydown=${fireFilterEvent}
    ></ecc-d-form-input>`;
  }

  private renderSelectFilter(): TemplateResult {
    return html`
      <ecc-d-form-input
        ecc-filter
        type="select"
        value=${this.value}
        ?multiple=${this.multiple}
        key=${this.key || "select-filter"}
        placeholder="${this.placeholder || "Select"}"
        options=${this.options}
        @ecc-input=${this.handleSetValue}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === "Enter") {
            this.dispatchEvent(
              new CustomEvent("ecc-filter", {
                detail: {
                  key: this.key,
                  value: this.value,
                },
              })
            );
          }
        }}
      >
      </ecc-d-form-input>
    `;
  }

  public error = (message: string) => errorAlert(this, message);

  protected render(): TemplateResult {
    return html`<ecc-d-form no-submit>
      ${this.type === "search" ? this.renderSearchFilter() : ""}
      ${this.type === "select" ? this.renderSelectFilter() : ""}
    </ecc-d-form> `;
  }
}

window.customElements.define("ecc-d-collection-filter", EccDCollectionFilter);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-d-collection-filter": EccDCollectionFilter;
  }
}
