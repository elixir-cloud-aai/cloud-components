import { html, css, LitElement } from "lit";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import { sholelaceLightStyles } from "../../styles/shoelace-styles.js";

export class Button extends LitElement {
  static styles = [
    sholelaceLightStyles,
    css`
      :host {
        display: block;
        padding: 25px;
      }
      sl-button::part(base) {
        --sl-input-height-medium: var(--ecc-button-height);
      }
    `,
  ];

  render() {
    return html`
      <sl-button exportparts="base: button-base">
        <slot></slot>
      </sl-button>
    `;
  }
}
