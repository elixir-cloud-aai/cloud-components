import { html } from "@microsoft/fast-element";
import type { CustomTooltip } from "./tooltip.js";

export const template = html<CustomTooltip>`
  <div class="tooltip">
    <div
      class="tooltip__label"
      aria-describedby="tooltip-demo-content"
      data-tooltip-placeholder
    >
      <slot name="label"></slot>
    </div>
    <div class="tooltip-dropdown" data-tooltip-dropdown>
      <div
        role="tooltip"
        id="tooltip-demo-content"
        class="tooltip-dropdown__content"
      >
        <slot></slot>
      </div>
    </div>
  </div>
`;
