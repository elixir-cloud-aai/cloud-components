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
import type { Version, EnhancedTool, PutVersion } from "../trs-list.types.js";
import {
  plusIcon,
  minusIcon,
  deleteIcon,
  editIcon,
  okIcon,
  xIcon,
  alertIcon,
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
      html<EnhancedTool>`
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
                <th>Checker Url</th>
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
                          <fast-select
                            value="${(x) => x.toolclass.name}"
                            name="toolclass"
                            @input="${(x, c) =>
                              c.parent.handleInputChangeToolEdit(x, c.event)}"
                          >
                            ${repeat(
                              (x, c) => c.parent.toolClasses,
                              html`
                                <fast-option value="${(x) => x.id}"
                                  >${(x) => x.name}</fast-option
                                >
                              `
                            )}
                          </fast-select>
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
                    x.isEditing
                      ? html`
                          <fast-text-field
                            type="url"
                            value="${(x) => x.checker_url}"
                            name="checker_url"
                            @input="${(x, c) =>
                              c.parent.handleInputChangeToolEdit(x, c.event)}"
                          ></fast-text-field>
                        `
                      : x.checker_url}
                </td>
                <! -- actions -->
                <td class="actions">
                  ${when(
                    (x) => !x.isEditing,
                    html`
                      <i
                        class="edit"
                        title="Edit"
                        data-toggle="tooltip"
                        @click="${(x) => x.editTool(x.id)}"
                      >
                        <custom-tooltip>
                          ${editIcon} Edit the tool
                        </custom-tooltip>
                      </i>
                      <i
                        class="delete"
                        title="Delete"
                        data-toggle="tooltip"
                        @click="${(x) => x.delete()}"
                      >
                        <custom-tooltip>
                          ${deleteIcon} Delete the tool
                        </custom-tooltip>
                      </i>
                    `
                  )}
                  ${when(
                    (x) => x.isEditing,
                    html`
                      <i
                        class="save"
                        title="Save"
                        data-toggle="tooltip"
                        @click="${(x) => x.saveTool(x)}"
                      >
                        <custom-tooltip>
                          ${okIcon} Save the tool
                        </custom-tooltip>
                      </i>
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
          <div class="version-title">
            <h3>Versions:</h3>
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
                    <div class="alert alert-primary" role="alert">
                      <div class="alert-icon">${alertIcon}</div>
                      If you wish to add more than one author, included app, or
                      verified source, please enter them in the text field and
                      separate each entry using a comma (,).
                    </div>
                    <form class="form-container">
                      <div class="container">
                        <div class="inputs">
                          <div class="label-input input-path">
                            <label for="name">Name:</label>
                            <fast-text-field
                              type="text"
                              required
                              id="name"
                              name="name"
                              class="input"
                              :value=${(x, c) =>
                                c.parent.createVersionForm.name}
                              @input=${(x, c) =>
                                c.parent.handleVersionNameChange(c.event)}
                            ></fast-text-field>
                          </div>
                        </div>
                      </div>

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
                                :value=${(x, c) =>
                                  c.parent.createVersionForm.author.join(",")}
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
                                  c.parent.createVersionForm.included_apps.join(
                                    ","
                                  )}
                                @input=${(x, c) =>
                                  c.parent.handleIncludedAppsChange(c.event)}
                              ></fast-text-field>
                            </div>
                          </div>
                        </div>

                        <div class="container">
                          <div class="inputs">
                            <div class="label-input input-path">
                              <label for="descriptor_type"
                                >Descriptor Type:</label
                              >
                              <fast-select
                                id="descriptor_type"
                                name="descriptor_type"
                                :value="${(x, c) =>
                                  c.parent.createVersionForm
                                    .descriptor_type[0]}"
                                @change="${(x, c) =>
                                  c.parent.handleSelectDescriptorType(c.event)}"
                              >
                                ${repeat(
                                  (x, c) => c.parent.descriptorType,
                                  html`
                                    <fast-option
                                      value="${(x) => x}"
                                      >${(x) => x}</fast-option
                                  `
                                )}
                              </fast-select>
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

                        ${when(
                          (x, c) => c.parent.createVersionForm.verified,
                          html`
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
                                      c.parent.createVersionForm.verified_source.join(
                                        ","
                                      )}
                                    @input=${(x, c) =>
                                      c.parent.handleVerifiedSourceChange(
                                        c.event
                                      )}
                                  ></fast-text-field>
                                </div>
                              </div>
                            </div>
                          `
                        )}
                      </div>
                    </form>
                    <fast-button
                      class="create-version"
                      @click="${(x, c) => c.parent.handleSubmitVersion(x.id)}"
                      >Submit</fast-button
                    >
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
                    <div class="alert alert-primary" role="alert">
                      <div class="alert-icon">${alertIcon}</div>
                      Keep in mind that you cannot delete a version if it's the
                      only existing version of the tool. If you wish to delete a
                      specific version that's left alone, please create a new
                      one first.
                    </div>
                    <div class="version-title">
                      <h1 data-key="Version" data-value="${(x) => x.name}">
                        Version ${(x) => x.name}
                      </h1>

                      ${when(
                        (x, c) => !c.parentContext.parent.isVersionEditing,
                        html`
                          <i
                            class="edit"
                            title="Edit"
                            data-toggle="tooltip"
                            @click="${(x, c) =>
                              c.parentContext.parent.editVersionButton(x)}"
                          >
                            <custom-tooltip>
                              ${editIcon} Edit the version
                            </custom-tooltip>
                          </i>
                          <i
                            class="delete"
                            title="Delete"
                            data-toggle="tooltip"
                            @click="${(x, c) =>
                              c.parentContext.parent.deleteVersion(
                                c.parent.id,
                                x.id
                              )}"
                          >
                            <custom-tooltip>
                              ${deleteIcon} Delete the version
                            </custom-tooltip>
                          </i>
                        `
                      )}
                      ${when(
                        (x, c) => c.parentContext.parent.isVersionEditing,
                        html`
                          <i
                            class="save"
                            title="Save"
                            data-toggle="tooltip"
                            @click="${(x, c) =>
                              c.parentContext.parent.saveVersionButton(
                                c.parent.id,
                                x.id
                              )}"
                          >
                            <custom-tooltip>
                              ${okIcon} Save the version
                            </custom-tooltip>
                          </i>
                          <i
                            class="cancel"
                            title="Cancel"
                            data-toggle="tooltip"
                            @click="${(x, c) =>
                              c.parentContext.parent.cancelVersionButton()}"
                          >
                            <custom-tooltip>
                              ${xIcon} Cancel the editing of the version
                            </custom-tooltip>
                          </i>
                        `
                      )}
                    </div>
                    <div class="version-edit-inputs">
                      <! -- DISPLAY OF VERSION DATA -->

                      <div class="row">
                        <span class="key">Version ID:</span>
                        <span class="value">${(x) => x.id}</span>
                      </div>

                      ${(x, c) =>
                        c.parentContext.parent.isVersionEditing
                          ? html<PutVersion>` <div
                              class="version-edit-container"
                            >
                              <label for="name">Name:</label>
                              <fast-text-field
                                class="u-w-full"
                                id="name"
                                data-key="Name"
                                name="name"
                                @change=${(x, c) =>
                                  c.parentContext.parent.handleEditVersionChange(
                                    c.event
                                  )}
                                value="${(x) => x.name}"
                              ></fast-text-field>
                            </div>`
                          : html`<div class="row">
                              <span class="key">Version Name:</span>
                              <span class="value">${(x) => x.name}</span>
                            </div>`}
                      ${(x, c) =>
                        c.parentContext.parent.isVersionEditing
                          ? html<PutVersion>` <div
                              class="version-edit-container"
                            >
                              <label for="name">Author:</label>
                              <fast-text-field
                                class="u-w-full"
                                data-key="Author"
                                name="author"
                                @change=${(x, c) =>
                                  c.parentContext.parent.handleEditVersionChange(
                                    c.event
                                  )}
                                value="${(x) => x.author.join(", ")}"
                              ></fast-text-field>
                            </div>`
                          : html`<div class="row">
                              <span class="key">Authors:</span>
                              <span class="value"
                                >${(x) => x.author.join(", ")}</span
                              >
                            </div>`}

                      <div class="row">
                        <span class="key">Meta Version:</span>
                        <span class="value">${(x) => x.meta_version}</span>
                      </div>

                      ${(x, c) =>
                        c.parentContext.parent.isVersionEditing
                          ? html<PutVersion>` <div
                              class="version-edit-container"
                            >
                              <label for="descriptor_type"
                                >Descriptor Type:</label
                              >
                              <fast-select
                                id="descriptor_type"
                                name="descriptor_type"
                                class="u-w-full"
                                :value="${(x, c) =>
                                  c.parentContext.parent.createVersionForm
                                    .descriptor_type[0]}"
                                @change="${(x, c) =>
                                  c.parentContext.parent.handleSelectDescriptorType(
                                    c.event
                                  )}"
                              >
                                ${repeat(
                                  (x, c) =>
                                    c.parentContext.parent.descriptorType,
                                  html`
                                    <fast-option
                                      value="${(x) => x}"
                                      >${(x) => x}</fast-option
                                  `
                                )}
                              </fast-select>
                            </div>`
                          : html` <div class="row">
                              <span class="key">Descriptor Type:</span>
                              <span class="value"
                                >${(x) => x.descriptor_type}</span
                              >
                            </div>`}
                      ${(x, c) =>
                        c.parentContext.parent.isVersionEditing
                          ? html<PutVersion>` <div
                              class="version-edit-container"
                            >
                              <label for="included_apps">Included Apps:</label>

                              <fast-text-area
                                type="url"
                                required
                                id="included_apps"
                                name="included_apps"
                                class="u-w-full"
                                :value=${(x, c) =>
                                  c.parentContext.parent.createVersionForm.included_apps.join(
                                    ", "
                                  )}
                                @input=${(x, c) =>
                                  c.parentContext.parent.handleEditVersionChange(
                                    c.event
                                  )}
                              ></fast-text-area>
                            </div>`
                          : html`
                              <div class="row">
                                <span class="key"> Included Apps:</span>
                                <span class="value"
                                  >${(x) => x.included_apps.join(", ")}</span
                                >
                              </div>
                            `}
                      ${(x, c) =>
                        c.parentContext.parent.isVersionEditing
                          ? html<PutVersion>` <div
                              class="version-edit-container"
                            >
                              <label for="is_production">Is Production:</label>
                              <fast-checkbox
                                id="is_production"
                                name="is_production"
                                @change=${(x, c) =>
                                  c.parentContext.parent.handleEditVersionChange(
                                    c.event
                                  )}
                                :checked="${(x, c) =>
                                  c.parentContext.parent.createVersionForm
                                    .is_production}"
                              ></fast-checkbox>
                            </div>`
                          : html`<div class="row">
                              <span class="key">Is production:</span>
                              <span class="value"
                                >${(x) => x.is_production}</span
                              >
                            </div>`}
                      ${(x, c) =>
                        c.parentContext.parent.isVersionEditing
                          ? html<PutVersion>` <div
                              class="version-edit-container"
                            >
                              <label for="signed">Is Signed:</label>
                              <fast-checkbox
                                id="signed"
                                name="signed"
                                @change=${(x, c) =>
                                  c.parentContext.parent.handleEditVersionChange(
                                    c.event
                                  )}
                                :checked="${(x, c) =>
                                  c.parentContext.parent.createVersionForm
                                    .signed}"
                              ></fast-checkbox>
                            </div>`
                          : html`<div class="row">
                              <span class="key">Is signed:</span>
                              <span class="value">${(x) => x.signed}</span>
                            </div>`}
                      ${(x, c) =>
                        c.parentContext.parent.isVersionEditing
                          ? html<PutVersion>` <div
                              class="version-edit-container"
                            >
                              <label for="verified">Is Verified:</label>
                              <fast-checkbox
                                id="verified"
                                name="verified"
                                @change=${(x, c) =>
                                  c.parentContext.parent.handleEditVersionChange(
                                    c.event
                                  )}
                                :checked="${(x, c) =>
                                  c.parentContext.parent.createVersionForm
                                    .verified}"
                              ></fast-checkbox>
                            </div>`
                          : html`<div class="row">
                              <span class="key">Is verified:</span>
                              <span class="value">${(x) => x.verified}</span>
                            </div>`}
                      ${when(
                        (x, c) =>
                          c.parentContext.parent.createVersionForm.verified,
                        html`
                          ${(x, c) =>
                            c.parentContext.parent.isVersionEditing
                              ? html<PutVersion>` <div
                                  class="version-edit-container"
                                >
                                  <label for="verified_source"
                                    >Verified Sources:</label
                                  >
                                  <fast-text-field
                                    type="text"
                                    required
                                    id="verified_source"
                                    name="verified_source"
                                    class="u-w-full"
                                    :value=${(x, c) =>
                                      c.parentContext.parent.createVersionForm.verified_source.join(
                                        ", "
                                      )}
                                    @input=${(x, c) =>
                                      c.parentContext.parent.handleEditVersionChange(
                                        c.event
                                      )}
                                  ></fast-text-field>
                                </div>`
                              : html` <div class="row">
                                  <span class="key">Verified Sources:</span>
                                  <span class="value">
                                    ${(x) => x.verified_source.join(", ")}</span
                                  >
                                </div>`}
                        `
                      )}

                      <div class="row">
                        <span class="key">Version url:</span>
                        <span class="value">
                          <i href="${(x) => x.url}" value="${(x) => x.url}"
                            >${(x) => x.url}</i
                          ></span
                        >
                      </div>
                    </div>
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
