import { attr, css, ElementStyles } from "@microsoft/fast-element";
import { FoundationElement } from "@microsoft/fast-foundation";

export class Button extends FoundationElement {
  // name: used as the identifier for the wrapper styles
  @attr public name = "default";
  styles: ElementStyles = css``;

  connectedCallback() {
    super.connectedCallback();

    // consider another implementation that allows use of pre-registered tokens only
    this.styles = css`
      :host[hidden] {
        display: none;
      }
      .button {
        background-color: var(--${this.name}-background-color);
        color: var(--${this.name}-text-color);
        cursor: pointer;
      }
    `;
  }
}
