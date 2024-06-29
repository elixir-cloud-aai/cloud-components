import { TemplateResult, html } from "lit";
import { Field } from "../types.js";
import { renderLabel } from "../utils.js";
import "@shoelace-style/shoelace/dist/components/details/details.js";

export default (
  field: Field,
  parts: Array<string>,
  renderChildren: () => TemplateResult
) => html` <div class="group-container">
  ${field.groupOptions?.collapsible
    ? html` <sl-details
        summary=${`${field.label} ${field.fieldOptions?.required ? "*" : ""}`}
        exportparts="${parts[0]}"
      >
        ${renderChildren()}
      </sl-details>`
    : html`
        <div part="${parts[1]}" class="group-header">
          ${renderLabel(
            {
              part: parts[2],
              class: "group-label",
              content: field.label,
              required: field.fieldOptions?.required,
            },
            { content: field.fieldOptions?.tooltip }
          )}
        </div>
        <div class="group-content">${renderChildren()}</div>
      `}
</div>`;
