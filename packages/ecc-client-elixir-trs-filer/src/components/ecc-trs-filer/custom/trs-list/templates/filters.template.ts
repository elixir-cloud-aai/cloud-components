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
import type { TRSToolsList } from "../trs-list.js";
import type { ToolClass, FilterFields } from "../trs-list.types.js";
import { tooltipIcon } from "../../../../../assets/icons.js";

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

export const filtersTemplate = html<TRSToolsList>` ${when(
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
                <label
                  for="${(field) => field.key}"
                  class="filterContainer--text"
                  >${(field) => field.name}</label
                >
                <custom-tooltip>
                  ${tooltipIcon} ${(x) => x.tooltipText}
                </custom-tooltip>
              </div>
              ${(x) =>
                x.textFieldName === "toolclass"
                  ? html`
                      <fast-select
                        id="${x.key}"
                        name="${x.key}"
                        value="${(x, c) => c.parent.filterParams[x.key]}"
                        @change="${(x, c) =>
                          c.parent.handleSelectToolClass(c.event)}"
                      >
                        ${repeat(
                          (x, c) => c.parent.toolClasses,
                          html<ToolClass>`
                            <fast-option value="${(c) => c.name}"
                              >${(c) => c.name}</fast-option
                            >
                          `
                        )}
                      </fast-select>
                    `
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
