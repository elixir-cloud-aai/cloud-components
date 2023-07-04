import { html, repeat, when } from '@microsoft/fast-element';
import {
  provideFASTDesignSystem,
  fastTextField,
  fastSelect,
  fastOption,
  fastButton,
  fastAccordion,
  fastAccordionItem,
  fastTabs,
  fastTab,
  fastTabPanel,
  fastTooltip,
} from '@microsoft/fast-components';
import { TRS } from './ecc-trs.js';
import { IToolClass, Tool, Version } from './ecc-trs.interface.js';

provideFASTDesignSystem().register(
  fastTextField(),
  fastSelect(),
  fastOption(),
  fastButton(),
  fastAccordion(),
  fastAccordionItem(),
  fastTabs(),
  fastTab(),
  fastTabPanel(),
  fastTooltip()
);

export const template = html<TRS>`
  <div class="trs-container">
    <div class="search">
      <div class="input-container">
        <fast-text-field
          class="searchInput"
          placeholder="Search"
          value=${(x) => x.searchQuery}
          @change=${(x, c) => x.handleSearchChange(c.event)}
        >
        </fast-text-field>
        <fast-button @click=${(x) => x.handleOpenFilter()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="16"
            height="16"
            class="filterIcon"
          >
            <path
              d="M15 2.75a.75.75 0 0 1-.75.75h-4a.75.75 0 0 1 0-1.5h4a.75.75 0 0 1 .75.75Zm-8.5.75v1.25a.75.75 0 0 0 1.5 0v-4a.75.75 0 0 0-1.5 0V2H1.75a.75.75 0 0 0 0 1.5H6.5Zm1.25 5.25a.75.75 0 0 0 0-1.5h-6a.75.75 0 0 0 0 1.5h6ZM15 8a.75.75 0 0 1-.75.75H11.5V10a.75.75 0 1 1-1.5 0V6a.75.75 0 0 1 1.5 0v1.25h2.75A.75.75 0 0 1 15 8Zm-9 5.25v-2a.75.75 0 0 0-1.5 0v1.25H1.75a.75.75 0 0 0 0 1.5H4.5v1.25a.75.75 0 0 0 1.5 0v-2Zm9 0a.75.75 0 0 1-.75.75h-6a.75.75 0 0 1 0-1.5h6a.75.75 0 0 1 .75.75Z"
            ></path>
          </svg>
        </fast-button>
      </div>
      ${when((x) => !x.ready, html<TRS>` Loading... `)}
      ${when(
        (x) => x.isOpenFilter,
        html`
          <div class="filterContainer">
            <h3>Filter</h3>
            <div class="filterContainer--grid">
              <label class="filterContainer--label">
                <div>
                  <span>Tool Id</span>
                  <custom-tooltip>
                    <svg
                      slot="label"
                      class="tooltipIcon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                      ></path>
                    </svg>
                    A unique identifier of the tool, scoped to this registry,
                    for example 123456.
                  </custom-tooltip>
                </div>
                <fast-text-field
                  type="text"
                  name="id"
                  value="${(x) => x.filterParams.id}"
                  @input="${(x, c) => x.handleFilterParamChange(c.event)}"
                ></fast-text-field>
              </label>
              <label class="filterContainer--label">
                <div>
                  <span>Alias</span>
                  <custom-tooltip>
                    <svg
                      slot="label"
                      class="tooltipIcon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                      ></path>
                    </svg>
                    Support for this parameter is optional for tool registries
                    that support aliases. If provided will only return entries
                    with the given alias.
                  </custom-tooltip>
                </div>
                <fast-text-field
                  type="text"
                  name="alias"
                  value="${(x) => x.filterParams.alias}"
                  @input="${(x, c) => x.handleFilterParamChange(c.event)}"
                ></fast-text-field>
              </label>
              <label class="filterContainer--label">
                <div>
                  <span>Tool Class</span>
                  <custom-tooltip>
                    <svg
                      slot="label"
                      class="tooltipIcon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                      ></path>
                    </svg>
                    Filter tools by the name of the subclass.
                  </custom-tooltip>
                </div>
                <fast-select
                  value="${(x) => x.filterParams.toolClass}"
                  @input="${(x, c) => x.handleSelectToolClass(c.event)}"
                >
                  ${repeat(
                    (x) => x.toolClasses,
                    html<IToolClass>`
                      <fast-option value="${(x) => x.name}"
                        >${(x) => x.name}</fast-option
                      >
                    `
                  )}
                </fast-select>
              </label>
              <label class="filterContainer--label">
                <div>
                  <span>Descriptor Type</span>
                  <custom-tooltip>
                    <svg
                      slot="label"
                      class="tooltipIcon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                      ></path>
                    </svg>
                    Filter tools by the name of the descriptor type.
                  </custom-tooltip>
                </div>
                <fast-text-field
                  type="text"
                  name="descriptorType"
                  value="${(x) => x.filterParams.descriptorType}"
                  @input="${(x, c) => x.handleFilterParamChange(c.event)}"
                ></fast-text-field>
              </label>
              <label class="filterContainer--label">
                <div>
                  <span>Registry</span>
                  <custom-tooltip>
                    <svg
                      slot="label"
                      class="tooltipIcon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                      ></path>
                    </svg>
                    The image registry that contains the image.
                  </custom-tooltip>
                </div>
                <fast-text-field
                  type="text"
                  name="registry"
                  value="${(x) => x.filterParams.registry}"
                  @input="${(x, c) => x.handleFilterParamChange(c.event)}"
                ></fast-text-field>
              </label>
              <label class="filterContainer--label">
                <div>
                  <span>Organization</span>
                  <custom-tooltip>
                    <svg
                      slot="label"
                      class="tooltipIcon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                      ></path>
                    </svg>
                    The organization in the registry that published the image.
                  </custom-tooltip>
                </div>
                <fast-text-field
                  type="text"
                  name="organization"
                  value="${(x) => x.filterParams.organization}"
                  @input="${(x, c) => x.handleFilterParamChange(c.event)}"
                ></fast-text-field>
              </label>
              <label class="filterContainer--label">
                <div>
                  <span>Name </span>
                  <custom-tooltip>
                    <svg
                      slot="label"
                      class="tooltipIcon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                      ></path>
                    </svg>
                    The name of the image.
                  </custom-tooltip>
                </div>
                <fast-text-field
                  type="text"
                  name="name"
                  value="${(x) => x.filterParams.name}"
                  @input="${(x, c) => x.handleFilterParamChange(c.event)}"
                ></fast-text-field>
              </label>
              <label class="filterContainer--label">
                <div>
                  <span>Author</span>
                  <custom-tooltip>
                    <svg
                      slot="label"
                      class="tooltipIcon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                      ></path>
                    </svg>
                    The author of the tool.
                  </custom-tooltip>
                </div>
                <fast-text-field
                  type="text"
                  name="author"
                  value="${(x) => x.filterParams.author}"
                  @input="${(x, c) => x.handleFilterParamChange(c.event)}"
                ></fast-text-field>
              </label>
            </div>
            <fast-button
              class="filterContainer--button"
              @click="${(x) => x.handleApplyFilter()}"
              >Apply</fast-button
            >
            <fast-button
              class="filterContainer--clear"
              @click="${(x) => x.handleClearFilter()}"
              >Clear</fast-button
            >
          </div>
        `
      )}
    </div>
    <fast-accordion expand-mode="multi">
      ${repeat(
        (x) => x.tools,
        html<Tool>` <fast-accordion-item class="accordionItem">
          <table class="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Meta Version</th>
                <th>Tool Class</th>
                <th>Description</th>
                <th>Organization</th>
                <th>URL</th>
                <th>Checker</th>
              </tr>
            </thead>
            <tbody>
              <tr class="active-row">
                <td>${(x) => x.id}</td>
                <td>${(x) => x.name}</td>
                <td>${(x) => x.meta_version}</td>
                <td>${(x) => x.toolclass.name}</td>
                <td>${(x) => x.description}</td>
                <td>${(x) => x.organization}</td>
                <td><a href=${(x) => x.url}>${(x) => x.url}</a></td>
                <td>
                  ${(x) => (x.has_checker ? x.checker_url : 'No checker')}
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            ${when(
              (x) => x && x.aliases && x.aliases.length !== 0,
              html` <h3>Aliases:</h3> `
            )}
            ${repeat(
              (x) => x.aliases,
              html<string>` <custom-copy
                  value="${(alias) => alias}"
                ></custom-copy>
                <div class="space"></div>`
            )}
          </div>
          <div class="space"></div>
          <h3>Versions:</h3>
          <fast-tabs orientation="vertical">
            ${repeat(
              (x) => x.versions,
              html<Version>` <fast-tab slot="tab"
                  >Version ${(x) => x.name}</fast-tab
                >
                <fast-tab-panel slot="tabpanel" class="tabContent">
                  <table class="styled-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Author</th>
                        <th>Meta Version</th>
                        <th>Descriptor Type</th>
                        <th>Is Production</th>
                        <th>Is Signed</th>
                        <th>Is Verified</th>
                        <th>URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="active-row">
                        <td>${(x) => x.id}</td>
                        <td>${(x) => x.name}</td>
                        <td>${(x) => x.author.join(', ')}</td>
                        <td>${(x) => x.meta_version}</td>
                        <td>${(x) => x.descriptor_type}</td>
                        <td>${(x) => x.is_production}</td>
                        <td>${(x) => x.signed}</td>
                        <td>
                          ${(x) =>
                            x.verified ? x.verified_source : 'Not verified'}
                        </td>
                        <td><a href=${(x) => x.url}>${(x) => x.url}</a></td>
                      </tr>
                    </tbody>
                  </table>
                </fast-tab-panel>`
            )}
          </fast-tabs>
          <div slot="heading" class="accordionItem">
            <h3 class="toolName">
              Tool #${(x) => x.id}${(x) => (x.name ? ` (${x.name})` : '')}
            </h3>
          </div>
          <svg
            style="stroke: #e62f63;"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            slot="collapsed-icon"
          >
            <path
              d="M15.2222 1H2.77778C1.79594 1 1 1.79594 1 2.77778V15.2222C1 16.2041 1.79594 17 2.77778 17H15.2222C16.2041 17 17 16.2041 17 15.2222V2.77778C17 1.79594 16.2041 1 15.2222 1Z"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M9 5.44446V12.5556"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M5.44446 9H12.5556"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
          <svg
            style="stroke: #e62f63;"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            slot="expanded-icon"
          >
            <path
              d="M15.2222 1H2.77778C1.79594 1 1 1.79594 1 2.77778V15.2222C1 16.2041 1.79594 17 2.77778 17H15.2222C16.2041 17 17 16.2041 17 15.2222V2.77778C17 1.79594 16.2041 1 15.2222 1Z"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M5.44446 9H12.5556"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </fast-accordion-item>`
      )}
    </fast-accordion>
  </div>
`;
