import { html } from "@microsoft/fast-element";
import type { TRSToolsList } from "./trs-list.js";
import { searchTemplate } from "./templates/search.template.js";
import { filtersTemplate } from "./templates/filters.template.js";
import { accordionTemplate } from "./templates/accordion.template.js";

export const template = html<TRSToolsList>`
  ${searchTemplate} ${filtersTemplate} ${accordionTemplate}
`;
