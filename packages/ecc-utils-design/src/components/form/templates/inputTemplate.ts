import { html } from "lit";
import { renderLabel } from "../utils.js";
import { Field } from "../types.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";

export default function (
  field: Field,
  parts: Array<string>,
  changeAction: (e: Event) => void,
  emptyFieldAction: () => void,
  value = ""
) {
  if (field.type === "file") {
    return html`
      <div part="${parts[0]}" class="file-container">
        ${renderLabel(
          {
            part: parts[1],
            class: "file-input-label",
            content: field.label,
            required: field.fieldOptions?.required,
          },
          { content: field.fieldOptions?.tooltip }
        )}
        <input
          class="file-input"
          part="${parts[2]}"
          type="file"
          accept=${field.fieldOptions?.accept || "*"}
          ?multiple=${field.fieldOptions?.multiple}
          ?required=${field.fieldOptions?.required}
          @change=${changeAction}
        />
      </div>
    `;
  }

  emptyFieldAction();

  return html`
    <sl-input
      exportparts="${parts[3]}"
      class="input"
      type=${field.type || "text"}
      ?required=${field.fieldOptions?.required}
      value=${value}
      ?password-toggle=${field.type === "password"}
      @sl-input=${changeAction}
    >
      <label slot="label">
        ${renderLabel(
          {
            content: field.label,
          },
          { content: field.fieldOptions?.tooltip }
        )}
      </label>
    </sl-input>
  `;
}
