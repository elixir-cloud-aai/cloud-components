import {
  provideFASTDesignSystem,
  fastAccordion,
  fastAccordionItem,
} from "@microsoft/fast-components";
import { html, when, repeat } from "@microsoft/fast-element";
import TESGetRun from "./tesGetRun.js";

provideFASTDesignSystem().register(
  fastAccordion(),
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

const template = html<TESGetRun>`
  <div class="container">
    <fast-accordion>
      <fast-accordion-item>
        <span slot="heading">
          ${(x) => html`
            <button class="collapsed-container">
              <div class="right">
                <span class="id">
                  <span class="title">RUN ID:</span>
                  <span>${x.id}</span>
                </span>
              </div>
              <div class="left">
                <div class="delete-icon">
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
                </div>
                <div class="status-badge">
                  <ecc-tes-status-badge
                    status=${x.state}
                  ></ecc-tes-status-badge>
                </div>
                <div class="reload-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-arrow-clockwise"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                    />
                    <path
                      d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
                    />
                  </svg>
                </div>
              </div>
            </button>
          `}
        </span>
      </fast-accordion-item>
      ${when(
        (x) => x.isLoading && x.expanded,
        html`<ecc-tes-loader></ecc-tes-loader>`
      )}
      ${when(
        (x) => x.expanded && !x.isLoading,
        html<TESGetRun>`
          <div class="expanded-container">
            <div class="meta-data">
              <div class="name">
                <span class="title"> Name: </span>
                ${(x) => x.data.name}
              </div>
              <div class="description">
                <span class="title"> Description: </span>
                ${(x) => x.data.description}
              </div>
              <div class="creation-time">
                <span class="title"> Creation Time: </span>
                ${(x) => x.data.creation_time}
              </div>
            </div>
            <div class="executors">
              <div class="section-heading">
                <span class="title">Executors: </span>
              </div>
              ${repeat(
                (x) => x.data.executors,
                html`
                  <div class="executor">
                    <div class="image">
                      <span class="title">Image: </span>
                      ${(executor) => executor.image}
                    </div>
                    <div class="command-list">
                      <span class="title">Commands: </span>

                      ${repeat(
                        (executor) => executor.command,
                        html`<li class="command">${(x) => x}</li>`
                      )}
                    </div>
                  </div>
                `
              )}
            </div>
            <div class="logs">
              <div class="section-heading">
                <span class="title"> Logs </span>
              </div>
              ${when(
                (x) => x.data.logs && x.data.logs.length > 0,
                html`
                  ${repeat(
                    (x) => x.data.logs,
                    html`
                      <div class="log-entry">
                        <div class="start-time">
                          <span class="title">Start Time:</span> ${(x) =>
                            x.start_time}
                        </div>
                        <div class="end-time">
                          <span class="title">End Time:</span>
                          ${(x) => x.end_time}
                        </div>
                        ${when(
                          (x) => x.logs && x.logs.length > 0,
                          html`
                            <div class="stdout">
                              <span class="title">Stdout:</span>
                              ${(x) => x.logs[0].stdout}
                            </div>
                            <div class="exit-code">
                              <span class="title">Exit Code: </span>
                              ${(x) => x.logs[0].exit_code}
                            </div>
                          `
                        )}
                        ${when(
                          (x) => x.metadata && x.metadata.USER_ID,
                          html`
                            <div class="user-id">
                              <span class="title">Metadata User ID: </span>
                              ${(x) => x.metadata.USER_ID}
                            </div>
                          `
                        )}
                      </div>
                    `
                  )}
                `
              )}
            </div>
          </div>
        `
      )}
    </div>
    </fast-accordion>
`;

export default template;
