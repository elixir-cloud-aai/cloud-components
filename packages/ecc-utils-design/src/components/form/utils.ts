import { html } from "lit";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";

export interface Label {
  part?: string;
  class?: string;
  content: string;
  required?: boolean;
}

export interface Tooltip {
  content: string | undefined;
}

export const renderLabel = (label: Label, tooltip: Tooltip) => {
  const labelComponent = () => html`
    <label part="${label.part}" class="${label.class}">
      ${label.content} ${label.required ? "*" : ""}
    </label>
  `;

  if (tooltip.content) {
    return html`
      <sl-tooltip content="${tooltip.content}">
        ${labelComponent()}
      </sl-tooltip>
    `;
  }

  return labelComponent();
};
