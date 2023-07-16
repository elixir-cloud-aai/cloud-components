import { css, ElementStyles } from "@microsoft/fast-element";
import { color } from "../../design-system/tokens.js";

export const styles: ElementStyles = css`
  :host[hidden] {
    display: none;
  }
  .button {
    background-color: ${color};
  }
`;
