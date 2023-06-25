// import { buttonTemplate as template } from "@microsoft/fast-foundation";
import { html } from "@microsoft/fast-element";
import { styles } from "./button.styles.js";

export const definition = {
  baseName: "button",
  template: html`
    <button>
      <slot></slot>
    </button>
  `,
  styles,
};
