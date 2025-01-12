import { LitElement, html, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { repeat } from "lit/directives/repeat.js";
import { renderInTooltip } from "./utils.js";
import "@shoelace-style/shoelace/dist/components/details/details.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import formStyles from "./form.styles.js";

export default class EccUtilsDesignFormGroup extends LitElement {
  static styles = [
    // primitiveStylesheet,
    // sholelaceStyles,
    // hostStyles,
    formStyles,
  ];

  // TODO
  // build required but empty functionality
  // add functionality to collect all ecc-input fields in the group
  // same for the form
  @property({ type: String, reflect: true }) label = "";
  @property({ type: String, reflect: true }) key = "";
  @property({ type: String, reflect: true }) type: "array" | "group" = "group";
  @property({ type: Boolean, reflect: true }) required = "";
  @property({ type: String, reflect: true }) tooltip = "";

  // array item options
  @property({ type: Number, reflect: true })
  instances = 0;

  @property({ type: Number, attribute: "max-instances" }) maxInstances = "";
  @property({ type: Number, attribute: "min-instances" }) minInstances = "";

  // group item options
  @property({ type: Boolean, reflect: true }) collapsible = false;

  @state() private arrayItems: Array<{ id: number; items: Element[] }> = [];
  @state() private originalInstance: Element[] = [];

  protected firstUpdated(): void {
    if (this.type === "array") {
      this.originalInstance = Array.from(this.querySelectorAll(":scope > *"));
      this.arrayItems = Array.from({ length: this.instances }, (_, index) => ({
        id: index,
        items: this.originalInstance,
      }));
    }
  }

  private renderGroupTemplate(): TemplateResult {
    return this.collapsible
      ? html`
          <sl-details
            data-testid="group-collapsible"
            summary=${`${this.label} ${this.required ? "*" : ""}`}
          >
            <slot></slot>
          </sl-details>
        `
      : html`
          <div
            data-testid="group-non-collapsible"
            class="group-header"
            data-label="${this.label}"
          >
            ${renderInTooltip(
              html`
                <label class="group-label" data-testid="label">
                  ${this.label} ${this.required ? "*" : ""}
                </label>
              `,
              this.tooltip
            )}
          </div>
          <div class="group-content"><slot></slot></div>
        `;
  }

  private renderArrayTemplate(): TemplateResult {
    const resolveAddButtonIsActive = () => {
      if (!this.maxInstances) return true;
      if (Number(this.maxInstances) > this.arrayItems.length || 0) return true;
      return false;
    };

    const resolveDeleteButtonIsActive = () => true;

    const addItem = () => {
      if (resolveAddButtonIsActive()) {
        this.arrayItems.push({
          id: this.arrayItems.length,
          items: this.originalInstance,
        });

        this.requestUpdate();
        this.dispatchEvent(
          new CustomEvent("ecc-utils-array-add", {
            detail: {
              key: this.key,
              instances: this.arrayItems.length,
            },
            bubbles: true,
            composed: true,
          })
        );
      }
    };

    const deleteItem = (index: number) => {
      if (resolveDeleteButtonIsActive()) {
        const newItems = [...this.arrayItems];
        newItems.splice(index, 1);

        this.arrayItems = newItems;
        this.requestUpdate();
        this.dispatchEvent(
          new CustomEvent("ecc-utils-array-delete", {
            detail: {
              key: this.key,
              instances: this.arrayItems.length,
            },
            bubbles: true,
            composed: true,
          })
        );
      }
    };

    return html`
      <div
        class="array-container"
        data-testid="array-container"
        data-label="${this.label}"
      >
        <div class="array-header">
          ${renderInTooltip(
            html`
              <label data-testid="label" class="array-label">
                ${this.label} ${this.required ? "*" : ""}
              </label>
            `,
            this.tooltip
          )}
          <sl-button
            variant="text"
            size="small"
            data-label="${this.key}-add"
            data-testid="array-add"
            ?disabled=${!resolveAddButtonIsActive()}
            class="add-button"
            @click=${addItem}
          >
            <svg
              class="add-icon"
              slot="prefix"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add
          </sl-button>
        </div>
        ${repeat(
          this.arrayItems,
          (item) => item.id,
          (items, index) => html`
            <div
              class="array-item"
              data-testid="array-item"
              data-label=${`${this.label}-${index}`}
            >
              <sl-button
                variant="text"
                data-testid="array-delete"
                data-label="${this.key}-delete-${index}"
                ?disabled=${!resolveDeleteButtonIsActive()}
                @click=${() => {
                  deleteItem(index);
                }}
              >
                <svg
                  class="delete-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </sl-button>
              <div class="array-item-container">
                ${repeat(
                  items.items,
                  (item) => item.id,
                  (item) => html`${unsafeHTML(item.outerHTML)}`
                )}
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  render() {
    if (this.type === "array") {
      return this.renderArrayTemplate();
    }

    return this.renderGroupTemplate();
  }
}
