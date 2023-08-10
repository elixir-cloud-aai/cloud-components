import { html, repeat, when } from "@microsoft/fast-element";
import {
  fastAccordion,
  fastAccordionItem,
  fastButton,
  fastOption,
  fastSelect,
  fastTab,
  fastTabPanel,
  fastTabs,
  fastTextField,
  fastTooltip,
  provideFASTDesignSystem,
} from "@microsoft/fast-components";
import type { TRSToolsList } from "./trs-list.js";
import type {
  Tool,
  ToolClass,
  Version,
  FilterFields,
  IEnhancedTool,
} from "./trs-list.types.js";
import {
  filterIcon,
  tooltipIcon,
  plusIcon,
  minusIcon,
  deleteIcon,
  editIcon,
  okIcon,
} from "../../../../assets/icons.js";

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

function renderField(key, valueExtractor, isEditing) {
  return isEditing
    ? `<input type="text" data-key="${key}" value="${valueExtractor}" />`
    : `<p data-key="${key}" data-value="${valueExtractor}">${key}: ${valueExtractor}</p>`;
}

const searchTemplate = html<TRSToolsList>`
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

const filtersTemplate = html<TRSToolsList>` ${when(
  (x) => x.isOpenFilter,
  html<TRSToolsList>`<div class="filterContainer">
    <h3>Filter</h3>
    <div class="filterContainer--grid">
      ${repeat(
        (x) => x.filterFields,
        html<FilterFields>`
          <div class="filterContainer--label">
            <div class="filterContainer--label">
              <div className="filterContainer--tooptip">
                <label for="${(field) => field.key}"
                  >${(field) => field.name}</label
                >
                <custom-tooltip>
                  ${tooltipIcon} ${(x) => x.tooltipText}
                </custom-tooltip>
              </div>
              ${(x) =>
                x.textFieldName === "toolclass"
                  ? html` <fast-select
                      id="${(x) => x.key}"
                      name="${(x) => x.key}"
                      value="${(x, c) => c.parent.filterParams[x.key]}"
                      @change="${(x, c) =>
                        c.parent.handleSelectToolClass(c.event)}"
                    >
                      ${repeat(
                        (x, c) => x.toolClasses,
                        html<ToolClass>`
                          <fast-option value="${(toolClass) => toolClass.name}"
                            >${(toolClass) => toolClass.name}</fast-option
                          >
                        `
                      )}
                    </fast-select>`
                  : html`<fast-text-field
                      id="${(x) => x.key}"
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

const accordionTemplate = html<TRSToolsList>`
  <fast-accordion expand-mode="multi">
    ${repeat(
      (x) => x.tools,
      html<IEnhancedTool>` <fast-accordion-item class="accordionItem">
        <table class="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Meta Version</th>
              <th>Tool Class</th>
              <th>Description</th>
              <th>Organization</th>
              <th>Checker</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr class="active-row">
              <! -- ID is unchangeable -->
              <td>${(x) => x.id}</td>

              <! -- name -->
              <td>
                ${(x) =>
                  x.isEditing
                    ? html`<fast-text-field
                        value="${(x) => x.name}"
                        name="name"
                        @input="${(x, c) =>
                          c.parent.handleInputChangeToolEdit(x, c.event)}"
                      ></fast-text-field>`
                    : x.name}
              </td>

              <! -- meta version -->
              <td>
                ${(x) =>
                  x.isEditing
                    ? html`<fast-text-field
                        value="${(x) => x.meta_version}"
                        name="meta_version"
                        @input="${(x, c) =>
                          c.parent.handleInputChangeToolEdit(x, c.event)}"
                      ></fast-text-field>`
                    : x.meta_version}
              </td>

              <! -- toolclass name -->
              <td>
                ${(x) =>
                  x.isEditing
                    ? html`<fast-text-field
                        value="${(x) => x.toolclass.name}"
                        name="toolclass"
                        @input="${(x, c) =>
                          c.parent.handleInputChangeToolEdit(x, c.event)}"
                      ></fast-text-field>`
                    : x.toolclass.name}
              </td>

              <! -- description -->
              <td>
                ${(x) =>
                  x.isEditing
                    ? html`<fast-text-field
                        value="${(x) => x.description}"
                        name="description"
                        @input="${(x, c) =>
                          c.parent.handleInputChangeToolEdit(x, c.event)}"
                      ></fast-text-field>`
                    : x.description}
              </td>

              <! -- organization -->
              <td>
                ${(x) =>
                  x.isEditing
                    ? html`<fast-text-field
                        value="${(x) => x.organization}"
                        name="organization"
                        @input="${(x, c) =>
                          c.parent.handleInputChangeToolEdit(x, c.event)}"
                      ></fast-text-field>`
                    : x.organization}
              </td>

              <! -- checker -->
              <td>
                ${(x) =>
                  x.has_checker
                    ? x.isEditing
                      ? html`<fast-text-field
                          value="${(x) => x.checker_url}"
                          @input="${(e) => (x.checker_url = e.target.value)}"
                        ></fast-text-field>`
                      : x.checker_url
                    : "No checker"}
              </td>

              <! -- actions -->
              <td class="actions">
                ${when(
                  (x) => !x.isEditing,
                  html` <a
                      class="edit"
                      title="Edit"
                      data-toggle="tooltip"
                      @click="${(x) => x.editTool(x.id)}"
                    >
                      <custom-tooltip>
                        ${editIcon} Edit the tool
                      </custom-tooltip>
                    </a>

                    <a
                      class="delete"
                      title="Delete"
                      data-toggle="tooltip"
                      @click="${(x) => x.delete()}"
                    >
                      <custom-tooltip>
                        ${deleteIcon} Delete the tool
                      </custom-tooltip></a
                    >`
                )}
                ${when(
                  (x) => x.isEditing,
                  html`<a
                    class="save"
                    title="Save"
                    data-toggle="tooltip"
                    @click="${(x) => x.saveTool(x.id)}"
                  >
                    <custom-tooltip> ${okIcon} Save the tool </custom-tooltip>
                  </a>`
                )}
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
            html<Version>` <fast-tab slot="tab" class="tab--version"
                >Version ${(x) => x.name}</fast-tab
              >
              <fast-tab-panel slot="tabpanel" class="tabContent">
                <div class="version-section">
                  <div class="horizontal">
                    <h1 data-key="Version" data-value="${(x) => x.name}">
                      Version ${(x) => x.name}
                    </h1>
                    ${when(
                      (x) => !x.isEditing,
                      html` <a
                          class="edit"
                          title="Edit"
                          data-toggle="tooltip"
                          @click="${(x) => x.editTool(x.id)}"
                        >
                          <custom-tooltip>
                            ${editIcon} Edit the tool
                          </custom-tooltip>
                        </a>

                        <a
                          class="delete"
                          title="Delete"
                          data-toggle="tooltip"
                          @click="${(x) => x.delete()}"
                        >
                          <custom-tooltip>
                            ${deleteIcon} Delete the tool
                          </custom-tooltip></a
                        >`
                    )}
                    ${when(
                      (x) => x.isEditing,
                      html`<a
                        class="save"
                        title="Save"
                        data-toggle="tooltip"
                        @click="${(x) => x.saveTool(x.id)}"
                      >
                        <custom-tooltip>
                          ${okIcon} Save the tool
                        </custom-tooltip>
                      </a>`
                    )}
                  </div>
                  <p data-key="ID" data-value="${(x) => x.id}">
                    ID: ${(x) => x.id}
                  </p>
                  <p data-key="Name" data-value="${(x) => x.name}">
                    Name: ${(x) => x.name}
                  </p>
                  <p
                    data-key="Author"
                    data-value="${(x) => x.author.join(", ")}"
                  >
                    Author: ${(x) => x.author.join(", ")}
                  </p>
                  <p
                    data-key="Meta Version"
                    data-value="${(x) => x.meta_version}"
                  >
                    Meta Version: ${(x) => x.meta_version}
                  </p>
                  <p
                    data-key="Descriptor Type"
                    data-value="${(x) => x.descriptor_type}"
                  >
                    Descriptor Type: ${(x) => x.descriptor_type}
                  </p>
                  <p
                    data-key="Is Production"
                    data-value="${(x) => x.is_production}"
                  >
                    Is Production: ${(x) => x.is_production}
                  </p>
                  <p data-key="Is Signed" data-value="${(x) => x.signed}">
                    Is Signed: ${(x) => x.signed}
                  </p>
                  <p
                    data-key="Is Verified"
                    data-value="${(x) =>
                      x.verified ? x.verified_source : "Not verified"}"
                  >
                    Is Verified:
                    ${(x) => (x.verified ? x.verified_source : "Not verified")}
                  </p>
                  <p data-key="URL" data-value="${(x) => x.url}">
                    URL:
                    <a
                      href="${(x) => x.url}"
                      data-key="URL"
                      data-value="${(x) => x.url}"
                      >${(x) => x.url}</a
                    >
                  </p>
                </div>
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

export const template = html<TRSToolsList>`
  <!-- <div class="TRSToolsList-container"> -->
  ${searchTemplate} ${filtersTemplate} ${accordionTemplate}
  <!-- </div> -->
`;
