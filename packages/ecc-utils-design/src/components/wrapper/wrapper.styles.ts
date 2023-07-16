import { css, ElementStyles } from "@microsoft/fast-element";

export const styles: ElementStyles = css`
  :host[hidden] {
    display: none;
  }
  :host[debug] {
    border: 1px solid red;
  }
`;
