import { html, repeat, when } from "@microsoft/fast-element";
import { CustomSearch } from "./search.js";
import {
  allComponents,
  provideFASTDesignSystem,
} from "@microsoft/fast-components";
import { Tool } from "../ecc-trs/ecc-trs.interface.js";

provideFASTDesignSystem().register(allComponents);

export const template = html<CustomSearch>`
  <div class="search">
    <div class="input-container">
      <fast-text-field
        class="searchInput"
        placeholder="Search"
        @input="${(x, c) => x.onChange(c.event)}"
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
      html<CustomSearch>`
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
                  A unique identifier of the tool, scoped to this registry, for
                  example 123456.
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
        </div>
      `
    )}
  </div>
`;
