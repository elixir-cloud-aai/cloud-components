import { ViewTemplate, html } from "@microsoft/fast-element";
import { Button, ButtonOptions } from "@microsoft/fast-foundation";
import "@shoelace-style/shoelace/dist/components/button/button.js";

export const template: ViewTemplate<Button, ButtonOptions> = html`
  <button class="button">
    <slot></slot>
  </button>
  <sl-button>Button</sl-button>
`;
