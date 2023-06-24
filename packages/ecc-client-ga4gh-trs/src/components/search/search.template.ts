import { html } from "@microsoft/fast-element";
import type { SearchField } from "./search.js";
import {
  allComponents,
  provideFASTDesignSystem,
} from "@microsoft/fast-components";

provideFASTDesignSystem().register(allComponents);

export const template = html<SearchField>`
   <div>
    <fast-text-field
      class = "searchInput"
      placeholder="Search"
      value="${x => x.searchQuery}"
      @input="${x => x.handleSearchChange}"
    ></fast-text-field>
    <fast-button @click="${x => x.toggleCard}">
      Filter
    </fast-button>
    <div style="display: ${x => (x.showCard ? "block" : "none")}">
      <fast-card>
        <h3>Filters</h3>
        ${x => x.inputFields.map(input => html`
          <div>
            <fast-label>${input.label}</fast-label>
            <fast-tooltip>${input.description}</fast-tooltip>
            <fast-text-field
              placeholder="${input.placeholder}"
              name="${input.name}"
              @input="${(e) => x.handleInputChange(e)}"
            ></fast-text-field>
          </div>
        `)}
        <fast-button @click="${x => x.onApply}">
          Apply
        </fast-button>
      </fast-card>
    </div>
  </div>
`;
