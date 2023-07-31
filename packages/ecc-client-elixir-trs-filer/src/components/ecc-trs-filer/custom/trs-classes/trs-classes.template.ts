import { html, repeat, ViewTemplate, when } from "@microsoft/fast-element";
import type { TRSClasses } from "./trs-classes.js";
import type { IToolClass } from "./trs-classes.interface.js";
import {
  allComponents,
  provideFASTDesignSystem,
} from "@microsoft/fast-components";

provideFASTDesignSystem().register(allComponents);

const classesDataTemplate: ViewTemplate<IToolClass> = html<IToolClass>`
  <tr class="active-row">
    ${(x) =>
      x.isEditing
        ? html`
            <td>${x.id}</td>
            </td>
            <td>
              <input
                type="text"
                name="name"
                value="${(x) => x.name}"
                @input="${(x, c) => c.parent.handleInputChange(x, c.event)}"
              />
            </td>
            <td>
              <input
                type="text"
                name="description"
                value="${(x) => x.description}"
                @input="${(x, c) => c.parent.handleInputChange(x, c.event)}"
              />
            </td>
              <div>
                <p
                  class="clickable"
                  @click="${(x, ctx) => ctx.parent.save(x.id)}"
                >
                  Save
                </p>
              </div>
            </td>
          `
        : html`
            <td>${x.id}</td>
            <td>${x.name}</td>
            <td>${x.description}</td>
            <td>
              <div>
                <p
                  class="clickable"
                  @click="${(x, ctx) => ctx.parent.edit(x.id)}"
                >
                  Edit
                </p>
                <p
                  class="clickable"
                  @click="${(x, ctx) => ctx.parent.delete(x.id)}"
                >
                  Delete
                </p>
              </div>
            </td>
          `}
  </tr>
`;

export const template = html<TRSClasses>`
  <div>
    <div class="buttonToolClass">
      <fast-button class="button" @click="${(x) => x.openModal()}"
        >Create Tool Class</fast-button
      >
    </div>
    ${when(
      (x) => x.isModalOpen,
      html`
        <div class="modal">
          <label>Description:</label>
          <input
            type="text"
            value=${(x) => x.modalDescription}
            @input=${(x, c) => x.handleDescriptionChange(c.event)}
          />

          <label>Name:</label>
          <input
            type="text"
            value=${(x) => x.modalName}
            @input="${(x, c) => x.handleNameChange(c.event)}"
          />

          <fast-button @click="${(x) => x.createToolClassFromModal()}"
            >Submit</fast-button
          >
          <fast-button @click="${(x) => x.closeModal()}">Cancel</fast-button>
        </div>
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
