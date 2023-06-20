import { provideFASTDesignSystem, fastSkeleton, fastAccordion, fastAccordionItem, fastSelect, fastOption, fastTextField, } from "@microsoft/fast-components";
import { html, repeat, when } from "@microsoft/fast-element";
provideFASTDesignSystem().register(fastAccordion(), fastAccordionItem(), fastSkeleton(), fastSelect(), fastOption(), fastTextField());
const template = html `
  <div class="container">
    <div class="search">
      <fast-text-field
        placeholder="Search by name_prefix"
        :value=${(x) => x.searchInput}
        @input=${(x, c) => x.handleNameInput(c.event)}
      >
      </fast-text-field>
      <fast-select
        :value=${(x) => x.stateInput}
        @input=${(x, c) => x.handleStateInput(c.event)}
      >
        <fast-option value="ALL">All</fast-option>
        <fast-option value="COMPLETE">Completed</fast-option>
        <fast-option value="PROCESSING">Processing</fast-option>
        <fast-option value="SYSTEM_ERROR">Error</fast-option>
        <fast-option value="CANCELED">Cancelled</fast-option>
      </fast-select>
    </div>
    <div class="list">
      <fast-accordion>
        ${when((x) => x.isLoading, html ` ${repeat((x) => Array.from(Array(parseInt(x.pageSize, 10))), html `
              <fast-accordion-item>
                <fast-skeleton
                  style="border-radius: 4px;height: 100%;margin-bottom: 10px;"
                  shape="rect"
                  slot="heading"
                ></fast-skeleton>
              </fast-accordion-item>
            `)}`)}
        ${repeat((x) => x.data, html `
            <ecc-tes-get-run
              class="run-item"
              id=${(x) => x.id}
              state=${(x) => x.state}
            >
            </ecc-tes-get-run>
          `)}
      </fast-accordion>
    </div>
    <div class="pagination">
      ${when((x) => x.isLoading, html ` ${repeat(() => Array.from(Array(4)), html `
            <fast-button appearance="outline">
              <fast-skeleton
                style="border-radius: 4px;height: 100%;margin-bottom: 10px;"
                shape="rect"
                slot="heading"
              ></fast-skeleton>
            </fast-button>
          `)}`)}
      ${when((x) => !x.isLoading, html `
          ${repeat((x) => Array.from({ length: x.pageNumberOffset }, (_, index) => index + x.firstPageNumber), html `<fast-button
              appearance="outline"
              style="color:black"
              @click=${(x, c) => c.parent.handleClick(x)}
              >${(x) => x}</fast-button
            >`)}
          <fast-button
            appearance="neutral"
            ?disabled=${(x) => x.nextPageToken === undefined}
            @click=${(x) => x.handleNext()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <path
                d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L14.805 7.06C13.555 6.346 12 7.25 12 8.688v2.34L5.055 7.06z"
              />
            </svg>
          </fast-button>
        `)}
    </div>
  </div>
`;
export default template;
//# sourceMappingURL=tesGetRuns.template.js.map