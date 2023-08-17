import { css, ElementStyles } from "@microsoft/fast-element";
import { backgroundColor, textColor } from "../../design-system/tokens.js";
import "@shoelace-style/shoelace/dist/themes/light.css";

export const styles: ElementStyles = css`
  :host[hidden] {
    display: none;
  }

  sl-button::part(base) {
    background-color: ${backgroundColor};
    color: ${textColor};
    cursor: pointer;
  }
`;
