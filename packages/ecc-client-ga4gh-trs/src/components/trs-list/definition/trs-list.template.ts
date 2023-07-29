import { html, repeat, when } from "@microsoft/fast-element";
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
} from "@microsoft/fast-components";
import { TRS } from "./trs-list.js";
import { ToolClass, Tool, Version, FilterFields } from "./trs-list.types.js";
import {
  filterIcon,
  minusIcon,
  plusIcon,
  tooltipIcon,
} from "../../../assets/icons.template.js";

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

const searchTemplate = html<TRS>`
  <div class="search">
    <div class="input-container">
      <fast-text-field
        class="searchInput"
        placeholder="Search"
        value=${(x) => x.searchQuery}
        @input=${(x, c) => x.handleSearchChange(c.event)}
      >
      </fast-text-field>
      <fast-button @click=${(x) => x.handleOpenFilter()}>
        ${filterIcon}
      </fast-button>
    </div>
  </div>
`;

const filtersTemplate = html<TRS>` ${when(
  (x) => x.isOpenFilter,
  html<TRS>`<div class="filterContainer">
    <h3>Filter</h3>
    <div class="filterContainer--grid">
      ${repeat(
        (x) => x.filterFields,
        html<FilterFields>`
          <div class="filterContainer--label">
            <div class="filterContainer--label">
              <div className="filterContainer--tooptip">
                <span>${(field) => field.name}</span>
                <custom-tooltip>
                  ${tooltipIcon} ${(x) => x.tooltipText}
                </custom-tooltip>
              </div>
              ${(x) =>
                x.textFieldName === "toolclass"
                  ? html` <fast-select
                      name="${(x) => x.key}"
                      value="${(x, c) => c.parent.filterParams[x.key]}"
                      @change="${(x, c) =>
                        c.parent.handleSelectToolClass(c.event)}"
                    >
                      ${repeat(
                        (x, c) => c.parent.toolClasses,
                        html<ToolClass>`
                          <fast-option value="${(toolClass) => toolClass.name}"
                            >${(toolClass) => toolClass.name}</fast-option
                          >
                        `
                      )}
                    </fast-select>`
                  : html`<fast-text-field
                      type="text"
                      name="${(x) => x.key}"
                      value="${(x, c) => c.parent.filterParams[x.key]}"
                      @input="${(x, c) =>
                        c.parent.handleFilterParamChange(c.event)}"
                    ></fast-text-field>`}
            </div>
          </div>
        `
      )}
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
  </div>`
)}`;

const accordionTemplate = html<TRS>`
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
              <td>${(x) => (x.has_checker ? x.checker_url : "No checker")}</td>
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
                      <td>${(x) => x.author.join(", ")}</td>
                      <td>${(x) => x.meta_version}</td>
                      <td>${(x) => x.descriptor_type}</td>
                      <td>${(x) => x.is_production}</td>
                      <td>${(x) => x.signed}</td>
                      <td>
                        ${(x) =>
                          x.verified ? x.verified_source : "Not verified"}
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
            Tool #${(x) => x.id}${(x) => (x.name ? ` (${x.name})` : "")}
          </h3>
        </div>
        ${plusIcon} ${minusIcon}
      </fast-accordion-item>`
    )}
  </fast-accordion>
`;

export const template = html<TRS>`
  ${searchTemplate} ${filtersTemplate} ${accordionTemplate}
`;
