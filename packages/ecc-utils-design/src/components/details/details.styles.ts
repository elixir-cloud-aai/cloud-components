import { css } from "lit";

export const detailsStyles = css`
  :host {
    display: block;
    padding: 1rem;
    width: auto;
  }

  /* Actions */
  .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: var(--ecc-spacing-x-large);
  }
  .actions .left {
    display: flex;
    gap: var(--ecc-spacing-medium);
  }
  .actions .right {
    display: flex;
    gap: var(--ecc-spacing-medium);
  }
  .link::part(label) {
    text-decoration: underline;
    padding: 0;
  }
  .action-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    border: var(--ecc-input-border-width) solid black;
    gap: var(--ecc-spacing-large);
    background-color: var(--ecc-color-background-primary);
    padding: var(--ecc-spacing-medium);
    border-radius: var(--ecc-border-radius-medium);
    outline: none;
    cursor: pointer;
    font-family: var(--ecc-input-font-family);
    font-weight: var(--ecc-input-font-weight);
    user-select: none;
    white-space: nowrap;
    font-size: var(--ecc-input-font-size-medium);
  }
  .action-button:active {
    scale: 0.98;
  }
  .action-button.primary {
    color: white;
    background-color: var(--ecc-color-primary-600);
    border: none;
  }
  .action-button.danger {
    color: white;
    background-color: var(--sl-color-danger-600);
    border: none;
  }
  .icon {
    height: var(--ecc-input-font-size-large);
    width: var(--ecc-input-font-size-large);
  }
`;

export const dataItemStyles = css`
  .tab-container {
  }
  .key,
  .value {
    font-size: var(--ecc-input-label-font-size-medium);
    font-family: var(--ecc-input-font-family);
    font-weight: var(--ecc-input-font-weight);
    letter-spacing: var(--ecc-input-letter-spacing);
    position: relative;
  }
  .field {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: var(--ecc-spacing-medium) 0;
  }
  .field .key {
    font-weight: var(--ecc-font-weight-semibold);
    margin-right: var(--ecc-spacing-small);
    flex: 1;
  }
  .field .value {
    margin-left: var(--ecc-spacing-medium);
    flex: 1;
  }
  .field .value.tags {
    display: flex;
    gap: var(--ecc-spacing-small);
  }
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
  sl-details::part(content) {
    padding-left: var(--ecc-spacing-medium);
    padding-right: 0px;
    padding-bottom: 0px;
  }
  sl-details::part(summary) {
    font-size: var(--ecc-input-label-font-size-medium);
    font-family: var(--ecc-input-font-family);
    font-weight: var(--ecc-input-font-weight);
    letter-spacing: var(--ecc-input-letter-spacing);
    font-weight: var(--ecc-font-weight-semibold);
  }
  sl-details {
    margin-bottom: var(--ecc-spacing-medium);
    margin-top: var(--ecc-spacing-medium);
  }
  sl-copy-button::part(copy-icon),
  sl-copy-button::part(success-icon),
  sl-copy-button::part(error-icon) {
    height: var(--ecc-input-font-size-small);
  }
`;
