import { LitElement, TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/select/select.js";
import "@shoelace-style/shoelace/dist/components/option/option.js";

export default class EccUtilsDesignCollectionFilter extends LitElement {
  @property({ type: String, reflect: true }) type = "search";
  @property({ type: String, reflect: true }) options = [];
  @property({ type: String, reflect: true }) placeholder = "";
  @property({ type: String, reflect: true }) key = "";
  @property({ type: String, reflect: true }) value = "";
  @property({ type: Boolean, reflect: true }) multiple = false;

  connectedCallback(): void {
    super.connectedCallback();

    // @ts-expect-error - this uses the form package which is built at the same time as this package. So tsc cannot find it because it is not built by time the compiler runs
    import("@elixir-cloud/design/dist/components/form/index.js").catch();
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

  private _renderSearchFilter(): TemplateResult {
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

  private _renderSelectFilter(): TemplateResult {
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

    // this._page = 1;
    // if (this.totalItems === -1) this._pagesRendered = 1;
  }

  protected render(): TemplateResult {
    return html`<ecc-d-form no-submit>
      ${this.type === "search" ? this._renderSearchFilter() : ""}
      ${this.type === "select" ? this._renderSelectFilter() : ""}
    </ecc-d-form> `;
  }
}
