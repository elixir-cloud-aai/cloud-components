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
import type { Version, IEnhancedTool } from "../trs-list.types.js";
import {
  plusIcon,
  minusIcon,
  deleteIcon,
  editIcon,
  okIcon,
  xIcon,
} from "../../../../../assets/icons.js";
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

export const accordionTemplate = html<TRSToolsList>`
  <fast-accordion expand-mode="multi" class="accordion">
    ${repeat(
      (x) => x.tools,
      html<IEnhancedTool>`
        <fast-accordion-item class="accordionItem">
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
                      ? html`
                          <fast-text-field
                            value="${(x) => x.name}"
                            name="name"
                            @input="${(x, c) =>
                              c.parent.handleInputChangeToolEdit(x, c.event)}"
                          ></fast-text-field>
                        `
                      : x.name}
                </td>
                <! -- meta version -->
                <td>
                  ${(x) =>
                    x.isEditing
                      ? html`
                          <fast-text-field
                            value="${(x) => x.meta_version}"
                            name="meta_version"
                            @input="${(x, c) =>
                              c.parent.handleInputChangeToolEdit(x, c.event)}"
                          ></fast-text-field>
                        `
                      : x.meta_version}
                </td>
                <! -- toolclass name -->
                <td>
                  ${(x) =>
                    x.isEditing
                      ? html`
                          <fast-text-field
                            value="${(x) => x.toolclass.name}"
                            name="toolclass"
                            @input="${(x, c) =>
                              c.parent.handleInputChangeToolEdit(x, c.event)}"
                          ></fast-text-field>
                        `
                      : x.toolclass.name}
                </td>
                <! -- description -->
                <td>
                  ${(x) =>
                    x.isEditing
                      ? html`
                          <fast-text-field
                            value="${(x) => x.description}"
                            name="description"
                            @input="${(x, c) =>
                              c.parent.handleInputChangeToolEdit(x, c.event)}"
                          ></fast-text-field>
                        `
                      : x.description}
                </td>
                <! -- organization -->
                <td>
                  ${(x) =>
                    x.isEditing
                      ? html`
                          <fast-text-field
                            value="${(x) => x.organization}"
                            name="organization"
                            @input="${(x, c) =>
                              c.parent.handleInputChangeToolEdit(x, c.event)}"
                          ></fast-text-field>
                        `
                      : x.organization}
                </td>
                <! -- checker -->
                <td>
                  ${(x) =>
                    x.has_checker
                      ? x.isEditing
                        ? html`
                            <fast-text-field
                              value="${(x) => x.checker_url}"
                              @input="${(e) =>
                                (x.checker_url = e.target.value)}"
                            ></fast-text-field>
                          `
                        : x.checker_url
                      : "No checker"}
                </td>
                <! -- actions -->
                <td class="actions">
                  ${when(
                    (x) => !x.isEditing,
                    html`
                      <a
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
                        </custom-tooltip>
                      </a>
                    `
                  )}
                  ${when(
                    (x) => x.isEditing,
                    html`
                      <a
                        class="save"
                        title="Save"
                        data-toggle="tooltip"
                        @click="${(x) => x.saveTool(x.id)}"
                      >
                        <custom-tooltip>
                          ${okIcon} Save the tool
                        </custom-tooltip>
                      </a>
                    `
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
              html<string>`
                <custom-copy value="${(alias) => alias}"></custom-copy>
                <div class="space"></div>
              `
            )}
          </div>
          <div class="space"></div>
          <div class="horizontal">
            <h1>Versions:</h1>
            <div @click="${(x, c) => c.parent.modalButtonClick()}">
              ${plusIcon}
            </div>
          </div>
          <!------------------------ MODAL ------------------------>
          ${when(
            (x, c) => c.parent.isOpenVersionModal,
            html`
              <fast-dialog
                id="modal-container"
                modal
                :hidden="${(x, c) => !c.parent.isOpenVersionModal}"
              >
                <div class="modalVersion">
                  <div class="modalVersion__upper">
                    <h2>Create a Version</h2>
                    <div
                      class="modalVersion__close"
                      @click="${(x, c) => c.parent.closeModal()}"
                    >
                      ${xIcon}
                    </div>
                  </div>
                  <div class="modalVersion__body">
                    <form class="form-container">
                      <div class="container meta">
                        <div class="container authors-container">
                          <div class="inputs">
                            <div class="label-input input-path">
                              <label for="authors">Authors:</label>
                              <fast-text-field
                                type="text"
                                id="authors"
                                required
                                name="authors"
                                class="input"
                                :value=${(x, c) => c.parent.authors.join(",")}
                                @input=${(x, c) =>
                                  c.parent.handleInputAuthorsChange(c.event)}
                              ></fast-text-field>
                            </div>
                          </div>
                        </div>

                        <div class="container apps-container">
                          <div class="inputs">
                            <div class="label-input input-path">
                              <label for="included_apps">Included Apps:</label>
                              <fast-text-field
                                type="url"
                                required
                                id="included_apps"
                                name="included_apps"
                                class="input"
                                :value=${(x, c) =>
                                  c.parent.includedApps.join(",")}
                                @input=${(x, c) =>
                                  c.parent.handleIncludedAppsChange(c.event)}
                              ></fast-text-field>
                            </div>
                          </div>
                        </div>

                        <div class="container apps-container">
                          <div class="inputs">
                            <div class="label-input input-path">
                              <label for="verified_source"
                                >Verified Sources:</label
                              >
                              <fast-text-field
                                type="text"
                                required
                                id="verified_source"
                                name="verified_source"
                                class="input"
                                :value=${(x, c) =>
                                  c.parent.verifiedSource.join(",")}
                                @input=${(x, c) =>
                                  c.parent.handleVerifiedSourceChange(c.event)}
                              ></fast-text-field>
                            </div>
                          </div>
                        </div>

                        <fieldset class="checkbox-container">
                          <legend>Tool Properties</legend>
                          <fast-checkbox
                            checked
                            name="is_production"
                            @change=${(x, c) =>
                              c.parent.handleCheckboxChange(c.event)}
                            >Is Production</fast-checkbox
                          >
                          <fast-checkbox
                            checked
                            name="signed"
                            @change=${(x, c) =>
                              c.parent.handleCheckboxChange(c.event)}
                            >Is Signed</fast-checkbox
                          >
                          <fast-checkbox
                            checked
                            name="verified"
                            @change=${(x, c) =>
                              c.parent.handleCheckboxChange(c.event)}
                            >Is Verified</fast-checkbox
                          >
                        </fieldset>

                        <fast-button @click="${(x, c) => c.parent.addAuthor()}"
                          >Submit</fast-button
                        >
                      </div>
                    </form>
                  </div>
                </div>
              </fast-dialog>
            `
          )}
          <fast-tabs orientation="vertical">
            ${repeat(
              (x) => x.versions,
              html<Version>`
                <fast-tab slot="tab" class="tab--version"
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
                        html`
                          <a
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
                            </custom-tooltip>
                          </a>
                        `
                      )}
                      ${when(
                        (x) => x.isEditing,
                        html`
                          <a
                            class="save"
                            title="Save"
                            data-toggle="tooltip"
                            @click="${(x) => x.saveTool(x.id)}"
                          >
                            <custom-tooltip>
                              ${okIcon} Save the tool
                            </custom-tooltip>
                          </a>
                        `
                      )}
                    </div>
                    <! -- DISPLAY OF VERSION DATA -->
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
                      ${(x) =>
                        x.verified ? x.verified_source : "Not verified"}
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
                </fast-tab-panel>
              `
            )}
          </fast-tabs>
          <div slot="heading" class="accordionItem">
            <h3 class="toolName">
              Tool #${(x) => x.id}${(x) => (x.name ? ` (${x.name})` : "")}
            </h3>
          </div>
          ${plusIcon} ${minusIcon}
        </fast-accordion-item>
      `
    )}
  </fast-accordion>
`;
