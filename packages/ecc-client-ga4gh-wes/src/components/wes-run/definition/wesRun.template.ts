import {
  provideFASTDesignSystem,
  fastAccordionItem,
  fastSkeleton,
  fastButton,
  fastBadge,
} from '@microsoft/fast-components';
import { html, repeat, when } from '@microsoft/fast-element';
import WESRun from './wesRun.js';

provideFASTDesignSystem().register(
  fastSkeleton(),
  fastButton(),
  fastBadge(),
  fastAccordionItem({
    collapsedIcon: `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="16"
      fill="black"
      class="bi bi-arrows-expand"
      viewBox="0 0 16 16"
    >
      <path
        fill-rule="evenodd"
        d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8ZM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2ZM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10Z"
      />
    </svg>`,
    expandedIcon: `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="100%"
      fill="black"
      class="bi bi-arrows-collapse"
      viewBox="0 0 16 16"
    >
      <path
        fill-rule="evenodd"
        d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8Zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0Zm-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793Z"
      />
    </svg>`,
  })
);

const OtherTemplate: any = (x: any) => html`
  <div class="template-container container key-value">
    <div class="key">${x[0]}</div>
    <div class="value">${x[1]}</div>
  </div>
`;

const ArrayTemplate: any = (x: any) => html`
  <div class="template-container">
    <div class="container array-container">
      <div class="key">${x[0]}</div>
      <div class="value array-value">
        ${repeat(
          (arr: any) => arr[1],
          html`
            ${when(
              (val) => Array.isArray(val[1]),
              html`${(val) => ArrayTemplate(val)} `
            )}
            ${when(
              (val) =>
                typeof val[1] === 'object' &&
                val[1] !== null &&
                !Array.isArray(val[1]),
              html` ${(val) => ObjectTemplate(val)} `
            )}
            ${when(
              (val) => typeof val[1] !== 'object',
              html` ${(val) => val} `
            )}
          `
        )}
      </div>
    </div>
  </div>
`;

const ObjectTemplate: any = (x: any) => html`
  <div class="template-container">
    <div class="obj-name">${x[0]}:</div>
    <div class="object-container">
      <div class="value object-value">
        ${when(
          (obj) => Object.entries(obj[1]).length > 0,
          html`
            ${repeat(
              (val) => Object.entries(val[1]),
              html`
                ${when(
                  (val) => Array.isArray(val[1]),
                  html` ${(val) => ArrayTemplate(val)} `
                )}
                ${when(
                  (val) =>
                    typeof val[1] === 'object' &&
                    val[1] !== null &&
                    !Array.isArray(x[1]),
                  html` ${(val) => ObjectTemplate(val)} `
                )}
                ${when(
                  (val) => typeof val[1] !== 'object',
                  html` ${(val) => OtherTemplate(val)} `
                )}
              `
            )}
          `
        )}
      </div>
    </div>
  </div>
`;

const innerTemplate = html`
  <div class="Outer-container">
    ${when(
      (x) => Object.entries(x.data).length > 0,
      html`
        ${repeat(
          (x) => Object.entries(x.data),
          html`
            ${when(
              (val) => Array.isArray(val[1]),
              html` ${(val) => ArrayTemplate(val)} `
            )}
            ${when(
              (val) =>
                typeof val[1] === 'object' &&
                val[1] !== null &&
                !Array.isArray(val[1]),
              html` ${(x) => ObjectTemplate(x)} `
            )}
            ${when(
              (val) => typeof val[1] !== 'object',
              html` ${(val) => OtherTemplate(val)} `
            )}
          `
        )}
      `
    )}
  </div>
`;

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

const template = html<WESRun>` <fast-accordion-item
  @change=${(x) => x.handleFetch()}
>
  <span slot="heading" class="slot-heading">
    ${(x) => html`
      <div class="collapsed-container">
        <div class="right">
          <div class="id">
            <span class="title">RUN ID</span>
            <span>${(w) => w.id}</span>
          </div>
        </div>
        <div class="left">
          <div class="status-badge">
            <div>
              <style>
                /* For example purposes only. App authors need to define */
                fast-badge {
                  --badge-fill-error: #d32f2f;
                  --badge-fill-processing: #ffc107;
                  --badge-fill-cancelled: #cccccc;
                  --badge-fill-complete: #4caf50;
                  --badge-fill-queued: #2196f3;
                  --badge-fill-initializing: #9c27b0;
                  --badge-fill-running: #ff5722;
                  --badge-fill-paused: #607d8b;
                  --badge-fill-executor_error: #b22222;
                  --badge-fill-system_error: #f44336;
                  --badge-fill-canceling: #795548;
                  --badge-fill-preempted: #00bcd4;
                  --badge-fill-transparent: transparent;
                  --badge-color-black: #000000;
                  --badge-color-white: #ffffff;
                }
              </style>
              ${repeat(
                () => state,
                html`
                  ${when(
                    (curr_state, c) => c.parent?.state === curr_state,
                    html`
                      <fast-badge fill=${(s) => s.toLowerCase()} color="white"
                        >${x.state}</fast-badge
                      >
                    `
                  )}
                `
              )}
            </div>
          </div>
        </div>
      </div>
    `}
  </span>
  ${when(
    (x) => x.isLoading,
    html` <fast-skeleton
        style="border-radius: 4px; margin-top: 10px; height: 20px; width: 20%"
        shape="rect"
      ></fast-skeleton>
      <fast-skeleton
        style="border-radius: 4px; margin-top: 10px; height: 20px; width: 40%"
        shape="rect"
      ></fast-skeleton>
      <fast-skeleton
        style="border-radius: 4px; margin-top: 10px; height: 20px; width:25%"
        shape="rect"
      ></fast-skeleton>
      <fast-skeleton
        style="border-radius: 4px;height: 80px;margin-top: 20px;margin-bottom: 10px;"
        shape="rect"
      ></fast-skeleton>
      <fast-skeleton
        style="border-radius: 4px;height: 80px;margin-top: 20px;margin-bottom: 10px;"
        shape="rect"
      ></fast-skeleton>`
  )}
  ${when(
    (x) => !x.isLoading,
    html<WESRun>` ${when((x) => x.data, html` ${innerTemplate} `)} `
  )}
</fast-accordion-item>`;

export default template;
