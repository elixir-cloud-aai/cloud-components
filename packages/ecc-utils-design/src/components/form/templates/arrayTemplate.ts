import { TemplateResult, html } from "lit";
import { Field } from "../types.js";
import { renderLabel } from "../utils.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";

export default (
  field: Field,
  parts: Array<string>,
  addButtonIsActive: boolean,
  deleteButtonIsActive: boolean,
  addAction: () => void,
  deleteAction: (index: number) => void,
  renderChildren: (index: number) => TemplateResult,
  children = []
) => {
  const arrayItem = (index: number) => html`
    <div part="${parts[4]}" class="array-item">
      <sl-button
        variant="text"
        exportparts="${parts[5]}"
        ?disabled=${!deleteButtonIsActive}
        @click=${() => deleteAction(index)}
      >
        <svg
          class="delete-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </sl-button>
      <div class="array-item-container">${renderChildren(index)}</div>
    </div>
  `;

  return html`
    <div class="array-container" part="${parts[0]}">
      <div part="${parts[1]}" class="array-header">
        ${renderLabel(
          {
            part: parts[2],
            class: "array-label",
            content: field.label,
            required: field.fieldOptions?.required,
          },
          { content: field.fieldOptions?.tooltip }
        )}
        <sl-button
          variant="text"
          size="small"
          exportparts="${parts[3]}"
          ?disabled=${!addButtonIsActive}
          class="add-button"
          @click=${addAction}
        >
          <svg
            class="add-icon"
            slot="prefix"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add
        </sl-button>
      </div>
      ${children.map((_item: any, index: number) => arrayItem(index))}
    </div>
  `;
};
