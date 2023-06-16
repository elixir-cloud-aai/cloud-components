import {
  provideFASTDesignSystem,
  fastSkeleton,
  fastAccordion,
  fastAccordionItem,
  fastTab,
  fastTabs,
} from "@microsoft/fast-components";
import { html, repeat, when } from "@microsoft/fast-element";
import TESGetRuns from "./tesGetRuns.js";
import TESGetRun from "../../tes-get-run/index.js";

provideFASTDesignSystem().register(
  fastAccordion(),
  fastAccordionItem(),
  fastSkeleton(),
  fastTab(),
  fastTabs()
);

const template = html<TESGetRuns>`
  <div class="container">
    <div class="search"></div>
    <div class="list">
      <fast-accordion>
        ${when(
          (x) => x.isLoading,
          html` ${repeat(
            (x) => Array.from(Array(parseInt(x.pageSize, 10))),
            html`
              <fast-accordion-item>
                <fast-skeleton
                  style="border-radius: 4px;height: 100%;margin-bottom: 10px;"
                  shape="rect"
                  slot="heading"
                ></fast-skeleton>
              </fast-accordion-item>
            `
          )}`
        )}
        ${repeat(
          (x) => x.data,
          html<TESGetRun>`
            <ecc-tes-get-run
              class="run-item"
              id=${(x) => x.id}
              state=${(x) => x.state}
            >
            </ecc-tes-get-run>
          `
        )}
      </fast-accordion>
    </div>
    <div class="pagination">
      ${when(
        (x) => x.isLoading,
        html` ${repeat(
          () => Array.from(Array(4)),
          html`
            <fast-skeleton
              style="border-radius: 4px;height: 100%;margin-bottom: 10px;"
              shape="rect"
              slot="heading"
            ></fast-skeleton>
          `
        )}`
      )}
      ${repeat(
        (x) =>
          Array.from(
            { length: x.pageNumberOffset },
            (_, index) => index + x.firstPageNumber
          ),
        html`<fast-button
          appearance="outline"
          style="color:black"
          @click=${(x, c) => c.parent.handleClick(x)}
          >${(x) => x}</fast-button
        >`
      )}
      <fast-button appearance="neutral" @click=${(x) => x.handleNext()}>
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
    </div>
  </div>
`;

export default template;
