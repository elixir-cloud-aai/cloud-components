import { css } from "lit";

const codeStyles = css`
  #label {
    color: var(--ecc-input-label-color);
    font-size: var(--ecc-input-label-font-size-medium);
    font-family: var(--ecc-font-sans);
    font-weight: var(--ecc-input-font-weight);
    letter-spacing: var(--ecc-input-letter-spacing);
  }
  #editor {
    width: 100%;
    height: 12.5ex;
    resize: vertical;
    overflow: auto;
    font-family: var(--ecc-font-mono);
    background-color: var(--ecc-input-background-color);
    border: solid var(--ecc-input-border-width) var(--ecc-input-border-color);
    border-radius: var(--ecc-input-border-radius-medium);
    font-size: var(--ecc-input-font-size-medium);
    margin-top: var(--ecc-spacing-medium);
    margin-bottom: var(--ecc-spacing-medium);
  }
  #editor:hover {
    background-color: var(--ecc-input-background-color-hover);
    border-color: var(--ecc-input-border-color-hover);
  }
  #editor:focus {
    background-color: var(--ecc-input-background-color-focus);
    border-color: var(--ecc-input-border-color-focus);
    box-shadow: 0 0 0 var(--ecc-focus-ring-width)
      var(--ecc-input-focus-ring-color);
  }
  .disabled {
    background-color: var(--ecc-input-background-color-disabled);
    border-color: var(--ecc-input-border-color-disabled);
    opacity: 0.5;
    cursor: not-allowed !important;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

export default codeStyles;
