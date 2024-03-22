import { html, when, repeat } from "@microsoft/fast-element";
import {
  allComponents,
  provideFASTDesignSystem,
} from "@microsoft/fast-components";
import type { TRSFiler } from "./ecc-trs-filer.js";
import { tooltipIcon, xIcon } from "../../../assets/icons.js";

provideFASTDesignSystem().register(allComponents);

export const template = html<TRSFiler>`
  <div class="trs-container">
    <h1>TRS Filer</h1>
    <div class="alert alert-primary" role="alert">
      <div class="alert-icon">${tooltipIcon}</div>
      TRS-filer is an interface for the GA4GH Tool Registry API, streamlining
      tool and workflow management in genomics. It supports standardized
      descriptions for Docker-based tools and workflows like CWL, WDL, and
      Nextflow. Crucially, TRS-filer offers management features: users can
      register service info, and efficiently create, update, or delete tool
      classes, tools, and their versions.
    </div>
    <fast-tabs>
      <fast-tab slot="tab" class="custom-tab">List of tools</fast-tab>
      <fast-tab slot="tab" class="custom-tab">List of tool classes</fast-tab>
      <fast-tab-panel slot="tabpanel" class="custom-tabpanel">
        <div class="button-create-tool">
          <fast-button
            @click="${(x) => x.modalButtonClick()}"
            class="create-tool"
            >Create a Tool</fast-button
          >
          ${when(
            (x) => x.isOpenModal,
            html`
              <fast-dialog
                id="modal-container"
                modal
                :hidden="${(x) => !x.isOpenModal}"
              >
                <div class="modalTool">
                  <div class="modalTool__upper">
                    <h2>Create a tool</h2>
                    <div
                      class="modalTool__close"
                      @click="${(x) => x.closeModal()}"
                    >
                      ${xIcon}
                    </div>
                  </div>

                  <div class="modalTool__body">
                    <form class="modalTool__form">
                      <div class="modalTool__form-item">
                        <label for="name">Name:</label>
                        <fast-text-field
                          id="name"
                          name="name"
                          :value="${(x) => x.createToolForm.name}"
                          @input="${(x, c) =>
                            x.handleCreateToolInputChange(c.event)}"
                        ></fast-text-field>
                      </div>

                      <div class="modalTool__form-item">
                        <label>Aliases:</label>
                        <fast-text-area
                          placeholder="Separate each alias by enter"
                          id="aliases"
                          name="aliases"
                          :value="${(x) => x.createToolForm.aliases.join("\n")}"
                          @input="${(x, c) => x.handleAliasChange(c.event)}"
                        ></fast-text-area>
                      </div>

                      <div class="modalTool__form-item">
                        <fieldset class="modalTool__fieldset">
                          <label for="has_checker">Has checker:</label>
                          <fast-checkbox
                            id="has_checker"
                            name="has_checker"
                            :checked="${(x) => x.createToolForm.has_checker}"
                            @change="${(x, c) =>
                              x.handleCreateToolChexboxChange(c.event)}"
                            class="modalTool__checkbox"
                          ></fast-checkbox>
                        </fieldset>
                      </div>

                      ${when(
                        (x) => x.createToolForm.has_checker,
                        html`
                          <div class="modalTool__form-item">
                            <label for="checker_url">Checker Url:</label>
                            <fast-text-field
                              id="checker_url"
                              name="checker_url"
                              :value="${(x) => x.createToolForm.checker_url}"
                              @input="${(x, c) =>
                                x.handleCreateToolInputChange(c.event)}"
                            ></fast-text-field>
                          </div>
                        `
                      )}

                      <div class="modalTool__form-item">
                        <label for="description">Description:</label>
                        <fast-text-area
                          id="description"
                          name="description"
                          :value="${(x) => x.createToolForm.description}"
                          @input="${(x, c) =>
                            x.handleCreateToolInputChange(c.event)}"
                        ></fast-text-area>
                      </div>

                      <div class="modalTool__form-item">
                        <label for="organization">Organization:</label>
                        <fast-text-field
                          id="organization"
                          name="organization"
                          :value="${(x) => x.createToolForm.organization}"
                          @input="${(x, c) =>
                            x.handleCreateToolInputChange(c.event)}"
                        ></fast-text-field>
                      </div>

                      <div class="modalTool__form-item">
                        <label for="toolclass">Toolclass:</label>
                        <fast-select
                          id="toolclass"
                          name="toolclass"
                          :value="${(x) => x.createToolForm.toolclass.id}"
                          @change="${(x, c) =>
                            x.handleToolClassSelect(c.event)}"
                        >
                          ${repeat(
                            (x) => x.toolClasses,
                            html`
                              <fast-option value="${(x) => x.id}"
                                >${(x) => x.name}</fast-option
                              >
                            `
                          )}
                        </fast-select>
                      </div>
                    </form>

                    <fast-button
                      class="create-tool u-tool"
                      @click=${(x) => x.handleCreateToolSubmit()}
                      >Create Tool</fast-button
                    >
                  </div>
                </div>
              </fast-dialog>
            `
          )}
        </div>
        <div class="u-mt-md"></div>
        ${when(
          (x) => !x.isLoading,
          html`
            <trs-list baseUrl="${(x) => x.baseUrl}" :toolClasses="${(x) => x.toolClasses}"></trs-list>
          `,
        )}
        ${when(
          (x) => x.isLoading,
          html`
            <div class="spinner"></div>
          `,
        )}
      ></fast-tab-panel>
      <fast-tab-panel slot="tabpanel" class="custom-tabpanel">
        <div class="u-mt-md"></div>
        ${when(
          (x) => !x.isLoading,
          html`
            <trs-classes baseUrl="${(x) => x.baseUrl}" :toolClasses="${(x) => x.toolClasses}"></trs-classes>
          `,
        )}
         ${when(
          (x) => x.isLoading,
          html`
            <div class="spinner"></div>
          `,
        )}
      </fast-tab-panel>
    </fast-tabs>
  </div>
`;
