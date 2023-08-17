import {
  provideFASTDesignSystem,
  fastSkeleton,
  fastAccordion,
  fastAccordionItem,
  fastSelect,
  fastOption,
  fastTextField,
} from '@microsoft/fast-components';
import { html, when, repeat } from '@microsoft/fast-element';
import WESRuns from './wesRuns.js';

provideFASTDesignSystem().register(
  fastAccordion(),
  fastAccordionItem(),
  fastSkeleton(),
  fastSelect(),
  fastOption(),
  fastTextField()
);

const state: string[] = [
  'UNKNOWN',
  'QUEUED',
  'INITIALIZING',
  'RUNNING',
  'PAUSED',
  'COMPLETE',
  'EXECUTOR_ERROR',
  'SYSTEM_ERROR',
  'CANCELED',
  'CANCELING',
  'PREEMPTED',
];

const template = html<WESRuns>`
  <div class="container">
    <div class="search">
      <h2>Workflow Runs</h2>
      <fast-select
        :value=${(x) => x.stateInput}
        @input=${(x, c) => x.handleStateInput(c.event)}
      >
        <fast-option value="ALL">All</fast-option>
        ${repeat(
          () => state,
          html`
            <fast-option value=${(curr_state) => curr_state}
              >${(curr_state) => curr_state}</fast-option
            >
          `
        )}
      </fast-select>
    </div>
    <div class="list">
      <fast-accordion>
        <!-- If data is being fetched or base URL not provided then load skeleton -->
        ${when(
          (x) => x.isLoading || x.baseURL.length === 0,
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
        ${when(
          (x) => !x.isLoading,
          html`
            ${repeat(
              (x) => x.data,
              html`
                <ecc-client-ga4gh-wes-run
                  class="run-item"
                  baseURL=${(x, c) => c.parent.baseURL}
                  id=${(x) => x.run_id}
                  state=${(x) => x.state}
                >
                </ecc-client-ga4gh-wes-run>
              `
            )}
          `
        )}
      </fast-accordion>
    </div>
    <div class="pagination">
      ${when(
        (x) => x.isLoading,
        html` ${repeat(
          () => Array.from(Array(3)),
          html`
            <fast-button appearance="outline">
              <fast-skeleton
                style="border-radius: 4px;height: 100%;margin-bottom: 10px;"
                shape="rect"
                slot="heading"
              ></fast-skeleton>
            </fast-button>
          `
        )}`
      )}
      ${when(
        (x) => !x.isLoading,
        html`
          <fast-button
            appearance="neutral"
            ?disabled=${(x) => x.pageNumber === 1}
            @click=${(x) => x.handlePrev()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <path
                d="M9.195 18.44c1.25.713 2.805-.19 2.805-1.629v-2.34l6.945 3.968c1.25.714 2.805-.188 2.805-1.628V8.688c0-1.44-1.555-2.342-2.805-1.628L12 11.03v-2.34c0-1.44-1.555-2.343-2.805-1.629l-7.108 4.062c-1.26.72-1.26 2.536 0 3.256l7.108 4.061z"
              />
            </svg>
          </fast-button>
          <fast-button appearance="outline" style="color:black"
            >${(x) => x.pageNumber}</fast-button
          >
          <fast-button
            appearance="neutral"
            ?disabled=${(x) =>
              x.tokens[x.pageNumber + 1] === undefined ||
              Object.entries(x.data).length === 0}
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
        `
      )}
    </div>
  </div>
`;

export default template;
