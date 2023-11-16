import { html, css, LitElement, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import getShoelaceStyles from "../../styles/shoelace.styles.js";
import "@shoelace-style/shoelace/dist/components/details/details.js";
import "@shoelace-style/shoelace/dist/components/badge/badge.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/select/select.js";
import "@shoelace-style/shoelace/dist/components/option/option.js";
import "@shoelace-style/shoelace/dist/components/button-group/button-group.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/skeleton/skeleton.js";
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
  selectConfig?: {
    multiple?: boolean;
  };
  placeholder?: string;
}

export default class Collection extends LitElement {
  static styles = [
    getShoelaceStyles(
      document.querySelector("html")?.classList.contains("dark")
    ),
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
        align-items: center;
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
      .skeleton-title {
        width: 30%;
        height: 1.5rem;
      }
      .skeleton-body {
        width: 100%;
        height: 1rem;
      }
      .lazy {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .badge {
        height: 1.5rem;
      }
      .hidden {
        visibility: hidden;
      }
    `,
  ];

  @property({ type: Array }) private items: ItemProp[] = [];
  @property({ type: Array }) private filters: FilterProp[] = [];
  @property({ type: Number }) private totalItems = -1;
  @property({ type: Number }) private pageSize = 5;

  @state() private _page = 1;
  @state() private _pagesRendered = 1; // Only used when totalItems is not provided

  public setPage(page: number) {
    this._page = page;
  }

  private _renderSearchFilter(filter: FilterProp): TemplateResult {
    return html`<sl-input
      type="search"
      placeholder="${filter.placeholder || "Search"}"
      clearable
      @sl-input=${(e: Event) => {
        this._page = 1;
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
      .multiple=${filter.selectConfig?.multiple || false}
      clearable
      @sl-change=${(e: CustomEvent) => {
        this._page = 1;
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
    if (!this.filters || this.filters.length === 0) return html``;
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
          &lt;&lt;
        </sl-button>
        ${[
          ...Array(
            Math.max(this._pagesRendered, this.totalItems / this.pageSize)
          ).keys(),
        ].map(
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
        ${this.totalItems === -1
          ? html` <sl-button disabled> ... </sl-button> `
          : ""}
        <sl-button
          @click=${() => {
            if (this.totalItems === -1 && this._page === this._pagesRendered) {
              this._pagesRendered += 1;
            }
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
          this._page === Math.ceil(this.totalItems / this.pageSize)}
        >
          &gt;&gt;
        </sl-button>
      </sl-button-group>
    </div>`;
  }

  private _renderItem(
    item: ItemProp,
    loading?: boolean,
    hidden?: boolean
  ): TemplateResult {
    return html`<sl-details
      name="${item.key}"
      class="${hidden ? "hidden" : ""}"
      @sl-show=${() => {
        this.dispatchEvent(
          new CustomEvent("expand-item", {
            detail: {
              key: item.key,
            },
          })
        );
      }}
      .disabled=${loading || false}
    >
      <div class="title" slot="summary">
        ${loading
          ? html`
              <sl-skeleton class="skeleton-title" effect="sheen"></sl-skeleton>
            `
          : html` <div>${item.name}</div>`}
        ${item.tag && !loading
          ? html`<sl-badge
              class="badge"
              variant="${item.tag.type || "primary"}"
            >
              ${item.tag.name}
            </sl-badge>`
          : ""}
      </div>
      <slot name="${item.key}">
        ${item.lazy
          ? html`<div class="lazy">
              <sl-skeleton class="skeleton-body" effect="sheen"></sl-skeleton
              ><sl-skeleton class="skeleton-body" effect="sheen"></sl-skeleton
              ><sl-skeleton class="skeleton-body" effect="sheen"></sl-skeleton>
            </div>`
          : html`<div>No content</div>`}
      </slot>
    </sl-details>`;
  }

  private _renderItems(): TemplateResult {
    const itemsToRender = this.items.filter(
      (item) =>
        item.index > (this._page - 1) * this.pageSize &&
        item.index <= this._page * this.pageSize
    );
    // remove duplicates by index
    const uniqueItems = new Map();
    itemsToRender.forEach((item) => {
      uniqueItems.set(item.index, item);
    });
    // create new array from map
    const uniqueItemsArray = Array.from(uniqueItems.values());
    return html` ${[...Array(this.pageSize).keys()].map((index) => {
      const itemIndex = this.pageSize * (this._page - 1) + index + 1;
      if (this.totalItems !== -1 && this.totalItems < itemIndex) {
        return this._renderItem(
          {
            index: itemIndex,
            key: `item-${itemIndex}`,
            name: "Hidden",
          },
          false,
          true
        );
      }
      const item = uniqueItemsArray.find(
        (itrItem) => itrItem.index === itemIndex
      );
      if (item) {
        return this._renderItem(item);
      }
      return this._renderItem(
        {
          index: itemIndex,
          key: `item-${itemIndex}`,
          name: "Loading",
        },
        true,
        false
      );
    })}`;
  }

  render() {
    return html`<div class="collection">
      ${this._renderHeader()} ${this._renderItems()} ${this._renderFooter()}
    </div>`;
  }
}
