import { html } from "lit";
import { Field } from "../types.js";
import { renderLabel } from "../utils.js";
import "@shoelace-style/shoelace/dist/components/switch/switch.js";

export default (
  field: Field,
  parts: Array<string>,
  checked: boolean,
  changeAction: (e: Event) => void
) => html`
  <div part="${parts[0]}" class="switch-container">
    ${renderLabel(
      {
        part: parts[1],
        class: "switch-label",
        content: field.label,
        required: field.fieldOptions?.required,
      },
      { content: field.fieldOptions?.tooltip }
    )}

    <sl-switch
      exportparts="${parts[2]}"
      size="small"
      class="switch"
      label=${field.label}
      ?required=${field.fieldOptions?.required}
      ?checked=${checked}
      @sl-change=${changeAction}
    >
    </sl-switch>
  </div>
`;
