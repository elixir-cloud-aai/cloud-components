import { LitElement, TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/select/select.js";
import "@shoelace-style/shoelace/dist/components/option/option.js";
import EccUtilsDesignCollection from "./collection.js";
import { errorAlert } from "./utils.js";

export default class EccUtilsDesignCollectionFilter extends LitElement {
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

    // @ts-expect-error - this uses the form package which is built at the same time as this package. So tsc cannot find it because it is not built by time the compiler runs
    import("@elixir-cloud/design/dist/components/form/index.js").catch();

    if (this.autoOption) this.setUpAutoOption();
  }

  private setUpAutoOption() {
    console.log("the option", this.options[1]);

    const collection = this.closest("ecc-d-collection");
    if (!(collection instanceof EccUtilsDesignCollection)) return;

    const collectionItems = Array.from(
      collection?.querySelectorAll("ecc-d-collection-item") || []
    );

    if (collectionItems.length) {
      const names: string[] = [];
      const tags: string[] = [];
      collectionItems.forEach((item) => {
        names.push(item.getAttribute("name")!);
        tags.push(item.getAttribute("tag")!);
      });

      this.addToOptions(names);
      this.addToOptions(tags);
    }
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
