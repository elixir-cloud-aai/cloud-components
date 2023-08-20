import { css, ElementStyles } from "@microsoft/fast-element";
import "@shoelace-style/shoelace/dist/themes/light.css";

// get the sl-button-font-size-medium from the css passed to the host component

export const styles: ElementStyles = css`
  :host[hidden] {
    display: none;
  }
  sl-button::part(base) {
    --sl-input-height-medium: var(--ecc-button-height);
  }
`;
