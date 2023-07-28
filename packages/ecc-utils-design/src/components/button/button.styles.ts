import { css, ElementStyles } from "@microsoft/fast-element";
import { backgroundColor, textColor } from "../../design-system/tokens.js";

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
