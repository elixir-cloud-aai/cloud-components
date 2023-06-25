import { html, repeat, when } from "@microsoft/fast-element";
import {
  allComponents,
  provideFASTDesignSystem,
} from "@microsoft/fast-components";
import { TRS } from "./trs.js";
import { Tool, Version } from "./trs.interface.js";

provideFASTDesignSystem().register(allComponents);

export const template = html<TRS>`
  ${when((x) => !x.ready, html<TRS>` Loading... `)}
  <div class="trs-container">
    <div class="input-container">
      <fast-text-field
        class="searchInput"
        placeholder="Search"
        :value="${(x) => x.searchQuery}"
        @input="${(x, c) => x.handleSearchChange(c.event)}"
      >
      </fast-text-field>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width="16"
        height="16"
        class="filterIcon"
        @click="${(x) => x.handleOpenFilter()}"
      >
        <path
          d="M15 2.75a.75.75 0 0 1-.75.75h-4a.75.75 0 0 1 0-1.5h4a.75.75 0 0 1 .75.75Zm-8.5.75v1.25a.75.75 0 0 0 1.5 0v-4a.75.75 0 0 0-1.5 0V2H1.75a.75.75 0 0 0 0 1.5H6.5Zm1.25 5.25a.75.75 0 0 0 0-1.5h-6a.75.75 0 0 0 0 1.5h6ZM15 8a.75.75 0 0 1-.75.75H11.5V10a.75.75 0 1 1-1.5 0V6a.75.75 0 0 1 1.5 0v1.25h2.75A.75.75 0 0 1 15 8Zm-9 5.25v-2a.75.75 0 0 0-1.5 0v1.25H1.75a.75.75 0 0 0 0 1.5H4.5v1.25a.75.75 0 0 0 1.5 0v-2Zm9 0a.75.75 0 0 1-.75.75h-6a.75.75 0 0 1 0-1.5h6a.75.75 0 0 1 .75.75Z"
        ></path>
      </svg>
    </div>
    ${when(
      (x) => x.isOpenFilter,
      html<TRS>`
        <div class="filterContainer">
          <h3>Filter</h3>
          <div class="filterContainer--grid">
            <label class="filterContainer--label">
              <span>Tool Id</span>
              <fast-text-field
                type="text"
                name="id"
                :value="${(x) => x.filterParams.id}"
                @input="${(x, c) => x.handleFilterParamChange(c.event)}"
              />
            </label>
            <label class="filterContainer--label">
              <span>Alias</span>
              <fast-text-field
                type="text"
                name="alias"
                :value="${(x) => x.filterParams.alias}"
                @input="${(x, c) => x.handleFilterParamChange(c.event)}"
              />
            </label>
            <label class="filterContainer--label">
              <span>Tool Class</span>
              <fast-select
                :value="${(x) => x.filterParams.toolClass}"
                @change="${(x, c) => x.handleSelectToolClass(c.event)}"
              >
                ${repeat(
                  (x) => x.toolClasses,
                  html<Tool>`
                    <fast-option value="${(x) => x.name}"
                      >${(x) => x.name}</fast-option
                    >
                  `
                )}
              </fast-select>
            </label>
            <label class="filterContainer--label">
              <span>Descriptor Type</span>
              <fast-text-field
                type="text"
                name="descriptorType"
                :value="${(x) => x.filterParams.descriptorType}"
                @input="${(x, c) => x.handleFilterParamChange(c.event)}"
              />
            </label>
            <label class="filterContainer--label">
              <span>Registry</span>
              <fast-text-field
                type="text"
                name="registry"
                :value="${(x) => x.filterParams.registry}"
                @input="${(x, c) => x.handleFilterParamChange(c.event)}"
              />
            </label>
            <label class="filterContainer--label">
              <span>Organization</span>
              <fast-text-field
                type="text"
                name="organization"
                :value="${(x) => x.filterParams.organization}"
                @input="${(x, c) => x.handleFilterParamChange(c.event)}"
              />
            </label>
            <label class="filterContainer--label">
              <span>Name </span>
              <fast-text-field
                type="text"
                name="name"
                :value="${(x) => x.filterParams.name}"
                @input="${(x, c) => x.handleFilterParamChange(c.event)}"
              />
            </label>
            <label class="filterContainer--label">
              <span>Author</span>
              <fast-text-field
                type="text"
                name="author"
                :value="${(x) => x.filterParams.author}"
                @input="${(x, c) => x.handleFilterParamChange(c.event)}"
              />
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
    <fast-accordion expand-mode="multi">
      ${repeat(
        (x) => x.tools,
        html<Tool>`
          <fast-accordion-item class="accordionItem">
            <table class="styled-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                <tr class="active-row">
                  <td>${(x) => x.id}</td>
                  <td>${(x) => x.name}</td>
                  <td>${(x) => x.description}</td>
                  <td><a href=${(x) => x.url}>${(x) => x.url}</a></td>
                </tr>
              </tbody>
            </table>
            <div>
              <h3>Aliases:</h3>
              ${repeat(
                (x) => x.aliases,
                html<string>`
                  <fast-copy value="${(alias) => alias}"></fast-copy>
                  <div class="space"></div>
                `
              )}
            </div>
            <div class="space"></div>
            <h3>Versions:</h3>
            <fast-tabs orientation="vertical">
              ${repeat(
                (x) => x.versions,
                html<Version>`
                  <fast-tab slot="tab">${(x) => x.name}</fast-tab>
                  <fast-tab-panel slot="tabpanel" class="tabContent">
                    <div>ID: ${(x) => x.id}</div>
                    <div>Author: ${(x) => x.author.join(", ")}</div>
                    <div>Meta Version: ${(x) => x.meta_version}</div>
                  </fast-tab-panel>
                `
              )}
            </fast-tabs>

            <div slot="heading" class="accordionItem">
              <h3 class="toolName">Tool #${(x) => x.id} (${(x) => x.name})</h3>
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
              ></path></svg
            ><svg
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
              ></path></svg
          ></fast-accordion-item>
        `
      )}
    </fast-accordion>
    ${when(
      (x) => x.ready,
      html<TRS>`
        <!-- rest of your code -->

        <div class="pagination">
          <fast-button
            @click="${(x) => x.handlePrevPage()}"
            ?disabled=${(x) => x.currentPage === 1}
          >
            Previous
          </fast-button>
          <span>Page ${(x) => x.currentPage} of ${(x) => x.pageCount}</span>
          <fast-button
            @click="${(x) => x.handleNextPage()}"
            ?disabled=${(x) => x.currentPage === x.pageCount}
          >
            Next
          </fast-button>
        </div>
      `
    )}
  </div>
`;
