import { html } from "@microsoft/fast-element";
import {
  fastButton,
  fastTextField,
  provideFASTDesignSystem,
} from "@microsoft/fast-components";
import type { TRSToolsList } from "../trs-list.js";
import { filterIcon } from "../../../../../assets/icons.js";

provideFASTDesignSystem().register(fastTextField(), fastButton());

export const searchTemplate = html<TRSToolsList>`
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
