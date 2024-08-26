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
  .ace_gutter-cell.ace_error,
  .ace_icon.ace_error,
  .ace_icon.ace_error_fold {
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"> <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>');
    background-color: var(--ecc-color-danger-400);
    color: var(--ecc-color-neutral-1000);
    background-repeat: no-repeat;
    background-position: 2px center;
  }
  .ace_gutter-cell.ace_warning,
  .ace_icon.ace_warning,
  .ace_icon.ace_warning_fold {
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>');
    background-color: var(--ecc-color-warning-400);
    color: var(--ecc-color-neutral-1000);
    background-repeat: no-repeat;
    background-position: 2px center;
  }
  .ace_gutter-cell {
    color: var(--ecc-color-neutral-1000);
  }
`;

export default codeStyles;
