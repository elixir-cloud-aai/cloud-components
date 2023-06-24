import { html, repeat } from "@microsoft/fast-element";
import {
  allComponents,
  provideFASTDesignSystem,
} from "@microsoft/fast-components";
import { Pagination } from "./pagination.js";

provideFASTDesignSystem().register(allComponents);

export const template = html<Pagination>`
   <div class="paginationContainer">
    <button
      class="pageCard"
      ?disabled=${(x) => x.currentPage <= 1}
      @click=${(x) => x.setCurrentPage(x.currentPage - 1)}
    >
      &lt;
    </button>

    ${(x) =>
      x.pageCount < 4
        ? html`${repeat(
            () => Array(x.pageCount).fill(0),
            (_, ctx) => html`
              <button
                class="pageCard"
                ?active=${x.currentPage === ctx.index + 1}
                @click=${() => x.setCurrentPage(ctx.index + 1)}
              >
                ${ctx.index + 1}
              </button>
            `
          )}`
        : ""}

    ${(x) =>
      x.currentPage >= x.pageCount - 2 && x.pageCount > 4
        ? html`
            <button
              class="pageCard"
              ?active=${(x) => x.currentPage === 1}
              @click=${(x) => x.setCurrentPage(1)}
            >
              1
            </button>
            ${(x) =>
              x.pageCount !== 4
                ? html`<div class="morePaginationIconContainer">
                    <span class="more-horizontal-icon"></span>
                  </div>`
                : ""}
          `
        : ""}

    ${(x) =>
      html`${repeat(
        () => x.pageRange,
        (page, ctx) => html`
          <button
            class="pageCard"
            ?active=${x.currentPage === page}
            @click=${() => x.setCurrentPage(page)}
          >
            ${page}
          </button>
        `
      )}`}

    ${(x) =>
      x.currentPage < x.pageCount - 2 && x.pageCount > 4
        ? html`
            ${(x) =>
              x.pageCount !== 4
                ? html`<div class="morePaginationIconContainer">
                    <span class="more-horizontal-icon">...</span>
                  </div>`
                : ""}
            <button
              class="pageCard"
              ?active=${(x) => x.currentPage === x.pageCount}
              @click=${(x) => x.setCurrentPage(x.pageCount)}
            >
              ${x.pageCount}
            </button>
          `
        : ""}

    <button
      class="pageCard"
      ?disabled=${(x) => x.currentPage === x.pageCount}
      @click=${(x) => x.setCurrentPage(x.currentPage + 1)}
    >
      &gt;
    </button>
  </div>
`;
