import { provideFASTDesignSystem, fastAccordionItem, fastSkeleton, fastButton, fastBadge, } from '@microsoft/fast-components';
import { html, repeat, when } from '@microsoft/fast-element';
import { state } from '../../wes-runs/definition/wesRuns.template.js';
provideFASTDesignSystem().register(fastSkeleton(), fastButton(), fastBadge(), fastAccordionItem({
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
}));
const conditionalRender = () => html `
  ${when((val) => Array.isArray(val[1]), html `${(val) => ArrayTemplate(val)} `)}
  ${when((val) => typeof val[1] === 'object' && val[1] !== null && !Array.isArray(val[1]), html ` ${(val) => ObjectTemplate(val)} `)}
`;
const OtherTemplate = (x) => html `
  <div class="template-container container key-value">
    <div class="key">${x[0]}</div>
    <div class="value">${x[1]}</div>
  </div>
`;
const ArrayTemplate = (x) => html `
  <div class="template-container">
    <div class="container array-container">
      <div class="key">${x[0]}</div>
      <div class="value array-value">
        ${repeat((arr) => arr[1], html `
            ${conditionalRender()}
            ${when((val) => typeof val[1] !== 'object', html ` ${(val) => val} `)}
          `)}
      </div>
    </div>
  </div>
`;
const ObjectTemplate = (x) => html `
  <div class="template-container">
    <div class="obj-name">${x[0]}:</div>
    <div class="object-container">
      <div class="value object-value">
        ${when((obj) => Object.entries(obj[1]).length > 0, html `
            ${repeat((val) => Object.entries(val[1]), html `
                ${conditionalRender()}
                ${when((val) => typeof val[1] !== 'object', html ` ${(val) => OtherTemplate(val)} `)}
              `)}
          `)}
      </div>
    </div>
  </div>
`;
const innerTemplate = html `
  <div class="Outer-container">
    ${when((x) => Object.entries(x.data).length > 0, html `
        ${repeat((x) => Object.entries(x.data), html `
            ${conditionalRender()}
            ${when((val) => typeof val[1] !== 'object', html ` ${(val) => OtherTemplate(val)} `)}
          `)}
      `)}
  </div>
`;
const template = html ` <fast-accordion-item
  @change=${(x) => x.handleFetch()}
>
  <span slot="start" class="slot-heading">
    <div class="right">
      <div class="id">
        <span class="title">RUN ID</span>
        <span>${(x) => x.id}</span>
      </div>
    </div>
  </span>
  <span slot="end">
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
          ${repeat(() => state, html `
              ${when((x, c) => { var _a; return ((_a = c.parent) === null || _a === void 0 ? void 0 : _a.state) === x; }, html `
                  <fast-badge fill=${(s) => s.toLowerCase()} color="white"
                    >${(_, c) => c.parent.state}</fast-badge
                  >
                `)}
            `)}
        </div>
      </div>
      ${when((x) => x.admin && x.state === 'RUNNING', html ` <fast-button class="delete" @click=${(x) => x.handleDelete()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-trash"
            viewBox="0 0 16 16"
          >
            <path
              d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"
            />
            <path
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"
            />
          </svg>
        </fast-button>`)}
    </div>
  </span>
  ${when((x) => x.isLoading, html ` <fast-skeleton
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
      ></fast-skeleton>`)}
  ${when((x) => !x.isLoading, html ` ${when((x) => x.data, html ` ${innerTemplate} `)} `)}
</fast-accordion-item>`;
export default template;
//# sourceMappingURL=wesRun.template.js.map