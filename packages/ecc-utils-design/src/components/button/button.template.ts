import { ViewTemplate, html } from "@microsoft/fast-element";
import { Button, ButtonOptions } from "@microsoft/fast-foundation";

export const template: ViewTemplate<Button, ButtonOptions> = html`
  <button class="button">
    <slot></slot>
  </button>
`;
