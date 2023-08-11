import { css, ElementStyles } from "@microsoft/fast-element";
import { backgroundColor, textColor } from "../../design-system/tokens.js";
import "@shoelace-style/shoelace/dist/themes/light.css" assert { type: "css" };

export const styles: ElementStyles = css`
  :host[hidden] {
    display: none;
  }
  .button {
    background-color: ${backgroundColor};
    color: ${textColor};
    cursor: pointer;
  }
`;
