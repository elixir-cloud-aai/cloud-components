import { html, css, LitElement, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { sholelaceLightStyles } from "../../styles/shoelace.styles.js";
import "@shoelace-style/shoelace/dist/components/details/details.js";
import "@shoelace-style/shoelace/dist/components/badge/badge.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/select/select.js";
import "@shoelace-style/shoelace/dist/components/option/option.js";
import "@shoelace-style/shoelace/dist/components/button-group/button-group.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import { hostStyles } from "../../styles/host.styles.js";

interface ItemProp {
  index: number;
  name: string;
  key: string;
  lazy?: boolean;
  tag?: {
    name: string;
    type?: "primary" | "success" | "neutral" | "warning" | "danger";
  };
}

interface FilterProp {
  key: string;
  type: "search" | "select";
  options?: string[];
  selectOptions?: {
    multiple?: boolean;
  };
  placeholder?: string;
}

export class Collection extends LitElement {
  static styles = [
    sholelaceLightStyles,
    hostStyles,
    css`
      :host {
        display: block;
      }
      .title {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-right: 1rem;
      }
      .filters {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
      }
      .header {
        margin-bottom: 1rem;
      }
      .footer {
        margin-top: 1rem;
        display: flex;
        justify-content: center;
      }
    `,
  ];

  @property({ type: Array }) private items: ItemProp[] = [];
  @property({ type: Array }) private filters: FilterProp[] = [];
  @property({ type: Number }) private totalItems = -1;

  @state() private _page = 1;
  @state() private _pageSize = 5;

  private _renderSearchFilter(filter: FilterProp): TemplateResult {
    return html`<sl-input
      type="search"
      placeholder="${filter.placeholder || "Search"}"
      clearable
      @sl-input=${(e: Event) => {
        this.dispatchEvent(
          new CustomEvent("filter", {
            detail: {
              key: filter.key,
              value: (e.target as HTMLInputElement)?.value,
            },
          })
        );
      }}
    ></sl-input>`;
  }

  private _renderSelectFilter(filter: FilterProp): TemplateResult {
    return html`<sl-select
      placeholder="${filter.placeholder || "Select"}"
      .multiple=${filter.selectOptions?.multiple || false}
      clearable
      @sl-change=${(e: CustomEvent) => {
        this.dispatchEvent(
          new CustomEvent("filter", {
            detail: {
              key: filter.key,
              value: (e.target as HTMLInputElement)?.value,
            },
          })
        );
      }}
    >
      <!-- <sl-option value="">All</sl-option> -->
      ${filter.options?.map(
        (option) => html`<sl-option value="${option}">${option}</sl-option>`
      )}
    </sl-select>`;
  }

  private _renderHeader(): TemplateResult {
    return html`<div class="header">
      <div class="filters">
        ${this.filters.map((filter) => {
          if (filter.type === "search") {
            return this._renderSearchFilter(filter);
          }
          if (filter.type === "select") {
            return this._renderSelectFilter(filter);
          }
          return html``;
        })}
      </div>
    </div>`;
  }

  private _renderFooter(): TemplateResult {
    return html` <div class="footer">
      <sl-button-group>
        <sl-button
          @click=${() => {
            this._page -= 1;
            this.dispatchEvent(
              new CustomEvent("page-change", {
                detail: {
                  page: this._page,
                },
              })
            );
          }}
          ?disabled=${this._page === 1}
        >
          Previous
        </sl-button>
        <!-- Render buttons for all the pages less than this._page -->
        ${[...Array(this._page).keys()].map(
          (page) => html`<sl-button
            @click=${() => {
              this._page = page + 1;
              this.dispatchEvent(
                new CustomEvent("page-change", {
                  detail: {
                    page: this._page,
                  },
                })
              );
            }}
            variant="${this._page === page + 1 ? "primary" : "default"}"
          >
            ${page + 1}
          </sl-button>`
        )}
        <!-- Check if totalItems is povided -->
        ${this.totalItems > 0
          ? html`
              ${[
                ...Array(
                  Math.ceil(this.totalItems / this._pageSize) - this._page
                ).keys(),
              ].map(
                (page) => html`<sl-button
                  @click=${() => {
                    this._page = this._page + page + 1;
                    this.dispatchEvent(
                      new CustomEvent("page-change", {
                        detail: {
                          page: this._page,
                        },
                      })
                    );
                  }}
                >
                  ${this._page + page + 1}
                </sl-button>`
              )}
            `
          : html` <sl-button disabled> ... </sl-button> `}
        <sl-button
          @click=${() => {
            this._page += 1;
            this.dispatchEvent(
              new CustomEvent("page-change", {
                detail: {
                  page: this._page,
                },
              })
            );
          }}
          ?disabled=${this.totalItems > 0 &&
          this._page === Math.ceil(this.totalItems / this._pageSize)}
        >
          Next
        </sl-button>
      </sl-button-group>
    </div>`;
  }

  private _renderItem(item: ItemProp): TemplateResult {
    return html`<sl-details
      name="${item.key}"
      @sl-show=${() => {
        this.dispatchEvent(
          new CustomEvent("expand-item", {
            detail: {
              key: item.key,
            },
          })
        );
      }}
    >
      <div class="title" slot="summary">
        <div>${item.name}</div>
        ${item.tag
          ? html`<sl-badge variant="${item.tag.type || "primary"}">
              ${item.tag.name}
            </sl-badge>`
          : ""}
      </div>
      <slot name="${item.key}">
        ${item.lazy
          ? html`<div class="lazy">Loading...</div>`
          : html`<div>No content</div>`}
      </slot>
    </sl-details>`;
  }

  private _renderItems(): TemplateResult {
    console.log(this.items, this._page, this._pageSize);
    const itemsToRender = this.items.filter(
      (item) =>
        item.index > (this._page - 1) * this._pageSize &&
        item.index <= this._page * this._pageSize
    );
    // remove duplicates by index
    const uniqueItems = new Map();
    itemsToRender.forEach((item) => {
      uniqueItems.set(item.index, item);
    });
    // create new array from map
    const uniqueItemsArray = Array.from(uniqueItems.values());
    uniqueItemsArray.sort((a, b) => a.index - b.index);
    return html` ${uniqueItemsArray.map((item) => this._renderItem(item))}`;
  }

  render() {
    return html`<div class="collection">
      ${this._renderHeader()} ${this._renderItems()} ${this._renderFooter()}
    </div>`;
  }
}
