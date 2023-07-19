import {
  provideFASTDesignSystem,
  fastAccordionItem,
  fastSkeleton,
  fastButton,
  fastBadge,
} from '@microsoft/fast-components';
import { html, when } from '@microsoft/fast-element';
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

const template = html<WESRun>` <fast-accordion-item>
  <span slot="heading" class="slot-heading">
    ${(x) => html`
      <div class="collapsed-container">
        <div class="right">
          <span class="id">
            <span class="title">RUN ID:</span>
            <span>${x.id}</span>
          </span>
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
                  --badge-fill-system-error: #f44336;
                  --badge-fill-canceling: #795548;
                  --badge-fill-preempted: #00bcd4;
                  --badge-fill-transparent: transparent;
                  --badge-color-black: #000000;
                  --badge-color-white: #ffffff;
                }
              </style>
              ${when(
                () => x?.state === 'COMPLETE',
                html`
                  <fast-badge fill="complete" color="white"
                    >${x.state}</fast-badge
                  >
                `
              )}
              ${when(
                () => x?.state === 'SYSTEM_ERROR',
                html`
                  <fast-badge fill="system-error" color="white"
                    >${x.state}</fast-badge
                  >
                `
              )}
              ${when(
                () => x?.state === 'PROCESSING',
                html`
                  <fast-badge fill="processing" color="white"
                    >${x.state}</fast-badge
                  >
                `
              )}
              ${when(
                () => x?.state === 'CANCELED',
                html`
                  <fast-badge fill="cancelled" color="white"
                    >${x.state}</fast-badge
                  >
                `
              )}
              ${when(
                () => x?.state === 'QUEUED',
                html`
                  <fast-badge fill="queued" color="white"
                    >${x.state}</fast-badge
                  >
                `
              )}
              ${when(
                () => x?.state === 'INITIALIZING',
                html`
                  <fast-badge fill="initializing" color="white"
                    >${x.state}</fast-badge
                  >
                `
              )}
              ${when(
                () => x?.state === 'RUNNING',
                html`
                  <fast-badge fill="running" color="white"
                    >${x.state}</fast-badge
                  >
                `
              )}
              ${when(
                () => x?.state === 'PAUSED',
                html`
                  <fast-badge fill="paused" color="white"
                    >${x.state}</fast-badge
                  >
                `
              )}
              ${when(
                () => x?.state === 'EXECUTOR_ERROR',
                html`
                  <fast-badge fill="error" color="white">${x.state}</fast-badge>
                `
              )}
              ${when(
                () => x?.state === 'CANCELING',
                html`
                  <fast-badge fill="canceling" color="white"
                    >${x.state}</fast-badge
                  >
                `
              )}
              ${when(
                () => x?.state === 'PREEMPTED',
                html`
                  <fast-badge fill="preempted" color="white"
                    >${x.state}</fast-badge
                  >
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
    html<WESRun>` ${when((x) => x.data.request, html``)} `
  )}
</fast-accordion-item>`;

export default template;
