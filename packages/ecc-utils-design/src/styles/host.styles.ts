import { css } from "lit";

export const hostStyles = css`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }
  :host([hidden]) {
    display: none;
  }
`;
