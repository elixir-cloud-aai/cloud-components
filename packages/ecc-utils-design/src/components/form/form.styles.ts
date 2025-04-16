import { css } from "lit";

const styles = css`
  :host {
    display: block;
  }
  form {
    display: flex;
    flex-direction: column;
  }
  .success-icon {
    height: var(--ecc-input-font-size-medium);
  }
  .error-icon {
    height: var(--ecc-input-font-size-medium);
  }
  form sl-input {
    margin-top: var(--ecc-spacing-medium);
    margin-bottom: var(--ecc-spacing-medium);
  }
  /* Group Styles */
  sl-details::part(base) {
    border: 0px;
    background-color: transparent;
  }
  sl-details::part(header) {
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    border-bottom: var(--ecc-input-border-width) solid
      var(--ecc-input-border-color);
  }
  sl-details::part(header):hover {
    border-color: var(--ecc-input-border-width) solid
      var(--ecc-input-border-color-hover);
  }
  sl-details::part(content) {
    padding-left: 0px;
    padding-right: 0px;
    padding-bottom: 0px;
  }
  sl-details::part(summary) {
    font-size: var(--ecc-input-label-font-size-medium);
    font-family: var(--ecc-input-font-family);
    font-weight: var(--ecc-input-font-weight);
    letter-spacing: var(--ecc-input-letter-spacing);
  }
  .group-container {
    margin-top: var(--ecc-spacing-medium);
    margin-bottom: var(--ecc-spacing-medium);
  }
  .group-label {
    width: 100%;
    font-size: var(--ecc-input-label-font-size-medium);
    font-family: var(--ecc-input-font-family);
    font-weight: var(--ecc-input-font-weight);
    letter-spacing: var(--ecc-input-letter-spacing);
  }
  .group-header {
    padding-bottom: var(--ecc-spacing-medium);
    border-bottom: var(--ecc-input-border-width) solid
      var(--ecc-input-border-color);
  }
  .group-header:hover {
    border-bottom: var(--ecc-input-border-width) solid
      var(--ecc-input-border-color-hover);
  }
  .group-content {
    padding-top: var(--ecc-spacing-medium);
  }
  .group {
    min-height: var(--ecc-input-height-3xlarge);
  }
  /* Array Styles */
  .array-label {
    font-size: var(--ecc-input-label-font-size-medium);
    font-family: var(--ecc-input-font-family);
    font-weight: var(--ecc-input-font-weight);
    letter-spacing: var(--ecc-input-letter-spacing);
  }
  .array {
    border-style: solid;
    border-width: 0px 0px var(--ecc-input-border-width) 0px;
    border-color: var(--ecc-input-border-color-disabled);
  }
  .array {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .array-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--ecc-spacing-medium);
  }
  .array-item-container {
    width: 100%;
  }
  .delete-icon {
    height: var(--ecc-input-font-size-large);
  }
  .add-icon {
    height: var(--ecc-input-font-size-medium);
  }
  /* switch styles */
  .switch-container {
    margin-top: var(--ecc-spacing-medium);
    margin-bottom: var(--ecc-spacing-medium);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .switch-label {
    font-size: var(--ecc-input-label-font-size-medium);
    font-family: var(--ecc-input-font-family);
    font-weight: var(--ecc-input-font-weight);
    letter-spacing: var(--ecc-input-letter-spacing);
  }
  /* file input styles */
  .file-container {
    display: flex;
    flex-direction: column;
  }
  .file-input-label {
    width: max-content;
    font-size: var(--ecc-input-label-font-size-medium);
    font-family: var(--ecc-input-font-family);
    font-weight: var(--ecc-input-font-weight);
    letter-spacing: var(--ecc-input-letter-spacing);
  }
  .file-input::file-selector-button {
    cursor: pointer;
    height: 100%;
    background-color: var(--ecc-color-neutral-0);
    color: var(--ecc-input-color);
    font-size: var(--ecc-input-font-size-medium);
    font-family: var(--ecc-input-font-family);
    font-weight: var(--ecc-input-font-weight);
    letter-spacing: var(--ecc-input-letter-spacing);
    background-color: var(--ecc-input-background-color);
    border: 0px;
    border-right: solid var(--ecc-input-border-width)
      var(--ecc-input-border-color);
    padding: 0px var(--ecc-spacing-2x-large);
    margin-right: var(--ecc-spacing-x-large);
  }
  .file-input {
    background-color: var(--ecc-color-neutral-0);
    border-radius: var(--ecc-input-border-radius-medium);
    font-size: var(--ecc-input-font-size-medium);
    font-family: var(--ecc-input-font-family);
    font-weight: var(--ecc-input-font-weight);
    letter-spacing: var(--ecc-input-letter-spacing);
    color: var(--ecc-input-color);
    border: solid var(--ecc-input-border-width) var(--ecc-input-border-color);
    height: var(--ecc-input-height-medium);
    margin-top: var(--ecc-spacing-medium);
    margin-bottom: var(--ecc-spacing-medium);
  }
  .file-input:hover,
  .file-input::file-selector-button:hover {
    background-color: var(--ecc-input-background-color-hover);
    border-color: var(--ecc-input-border-color-hover);
  }
  .file-input:focus,
  .file-input::file-selector-button:focus {
    background-color: var(--ecc-input-background-color-focus);
    border-color: var(--ecc-input-border-color-focus);
    box-shadow: 0 0 0 var(--ecc-focus-ring-width)
      var(--ecc-input-focus-ring-color);
  }
  .progress-bar-container {
    width: 100%;
    height: 20px;
    background-color: #e0e0e0;
    border-radius: 5px;
    overflow: hidden;
  }
  .progress-bar {
    height: 100%;
    background-color: #76c7c0;
    transition: width 0.2s ease;
  }
  .upload-percentage {
    text-align: center;
  }
  /* Submit Button */
  .submit-button {
    margin-top: var(--ecc-spacing-large);
    margin-bottom: var(--ecc-spacing-large);
  }
`;

export default styles;
