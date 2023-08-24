import { html, repeat, ViewTemplate, when } from "@microsoft/fast-element";
import type { TRSClasses } from "./trs-classes.js";
import type { ToolClass } from "./trs-classes.types.js";
import {
  allComponents,
  provideFASTDesignSystem,
} from "@microsoft/fast-components";
import {
  deleteIcon,
  editIcon,
  okIcon,
  xIcon,
} from "../../../../assets/icons.js";

provideFASTDesignSystem().register(allComponents);

const classesDataTemplate: ViewTemplate<ToolClass> = html<ToolClass>`
  <tr class="active-row">
    ${(x) =>
      x.isEditing
        ? html`
            <td>${x.id}</td>
            </td>
            <td>
            <fast-text-field
                type="text"
                name="name"
                value="${(x) => x.name}"
                @input="${(x, c) => c.parent.handleInputChange(x, c.event)}"
              />
            </td>
            <td>
            <fast-text-field
                type="text"
                name="description"
                value="${(x) => x.description}"
                @input="${(x, c) => c.parent.handleInputChange(x, c.event)}"
              />
            </td>
              <div class="save-container">
              <i
              class="save"
              title="Save"
              data-toggle="tooltip"
              @click="${(x, ctx) => ctx.parent.save(x.id)}"
            >
              <custom-tooltip>
                ${okIcon} Save the class
              </custom-tooltip>
            </i>
            <i
            class="cancel"
            title="Cancel"
            data-toggle="tooltip"
            @click="${(x, ctx) => ctx.parent.cancel(x.id)}"
          >
            <custom-tooltip>
              ${xIcon} Cancel the editing of the class
            </custom-tooltip>
          </i>
              </div>
            </td>
          `
        : html`
            <td>${x.id}</td>
            <td>${x.name}</td>
            <td>${x.description}</td>
            <td>
              <div class="actions">
                <i
                  class="edit"
                  title="Edit"
                  data-toggle="tooltip"
                  @click="${(x, ctx) => ctx.parent.edit(x.id)}"
                >
                  <custom-tooltip> ${editIcon} Edit the tool </custom-tooltip>
                </i>
                <i
                  class="delete"
                  title="Delete"
                  data-toggle="tooltip"
                  @click="${(x, ctx) => ctx.parent.delete(x.id)}"
                >
                  <custom-tooltip>
                    ${deleteIcon} Delete the tool
                  </custom-tooltip>
                </i>
              </div>
            </td>
          `}
  </tr>
`;

export const template = html<TRSClasses>`
  <div>
    <div class="buttonToolClass">
      <fast-button class="button-toolclass" @click="${(x) => x.openModal()}"
        >Create a Tool Class</fast-button
      >
    </div>
    ${when(
      (x) => x.isModalOpen,
      html`
      <fast-dialog
      id="modal-container"
      modal
      :hidden="${(x) => x.openModal()}"
      >
      <div class="modalClass">
      <div class="modalClass__upper">
         <h2>Create a Version</h2>
         <div
            class="modalClass__close"
            @click="${(x) => x.closeModal()}"
            >
            ${xIcon}
         </div>
      </div>
      <div class="modalClass__body">
         <form class="modalClass__form">
            <div class="modalClass__form-item">
               <label>Name:</label>
               <fast-text-field
                  type="text"
                  required
                  id="name"
                  name="name"
                  class="input"
                  value=${(x) => x.modalName}
               @input="${(x, c) => x.handleNameChange(c.event)}"
               />
            </div>
            <div class="modalClass__form-item">
               <label>Description:</label>
               <fast-text-area
                  type="text"
                  required
                  id="description"
                  name="description"
                  class="input"
                  value=${(x) => x.modalDescription}
               @input=${(x, c) => x.handleDescriptionChange(c.event)}
               />
            </div>
            <div class="button-row-modal">
               <fast-button class="button-toolclass" @click="${(x) =>
                 x.createToolClassFromModal()}"
                  >Submit</fast-button
                  >
               <fast-button class="cancel-toolclass" @click="${(x) =>
                 x.closeModal()}">Cancel</fast-button>
            </div>
         </form>
      </div>
   </fast-dialog>
      `
    )}
    <table class="styled-table">
      <thead>
        <tr>
          <th>Class ID</th>
          <th>Class Name</th>
          <th>Class Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${repeat((x) => x.data, classesDataTemplate)}
      </tbody>
    </table>
  </div>
`;
