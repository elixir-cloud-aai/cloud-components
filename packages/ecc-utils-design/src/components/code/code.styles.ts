import { css } from "lit";

const codeStyles = css`
  sl-textarea::part(form-control-label) {
    display: flex;
    gap: var(--sl-spacing-x-small);
  }
  #label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--sl-spacing-x-small);
  }
`;

export default codeStyles;
