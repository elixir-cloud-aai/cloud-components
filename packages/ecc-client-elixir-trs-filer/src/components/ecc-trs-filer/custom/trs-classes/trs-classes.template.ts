/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { html, repeat, ViewTemplate } from "@microsoft/fast-element";
import type { TRSClasses } from "./trs-classes.js";
import type { IToolClass } from "./trs-classes.interface.js";

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
