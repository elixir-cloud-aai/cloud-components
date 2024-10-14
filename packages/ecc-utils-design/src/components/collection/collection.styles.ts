import { css } from "lit";

const styles = css`
  :host {
    display: block;
  }
  /* Header */
  .header {
    margin-bottom: var(--ecc-spacing-x-large);
  }
  .filters {
    display: flex;
    justify-content: flex-end;
    gap: var(--ecc-spacing-medium);
  }
  /* Error Popup */
  .error {
    width: 100%;
    position: absolute;
    top: var(--ecc-spacing-x-large);
    display: flex;
    justify-content: center;
    z-index: var(--ecc-z-index-tooltip);
  }
  /* Footer */
  .footer {
    margin-top: var(--ecc-spacing-x-large);
    display: flex;
    justify-content: center;
  }
  .page {
    height: var(--ecc-input-height-medium);
    width: var(--ecc-input-height-medium);
  }
  .page::part(base) {
    background-color: var(--ecc-color-neutral-0);
  }
  .page.disabled::part(base) {
    cursor: not-allowed;
  }
  .page.active::part(base) {
    background-color: var(--ecc-color-primary-500);
  }
  /* Items */
  sl-details::part(base) {
    background-color: transparent;
  }
  sl-details {
    margin-bottom: var(--ecc-spacing-medium);
    margin-top: var(--ecc-spacing-medium);
  }
  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: var(--ecc-spacing-medium);
    height: var(--ecc-input-height-small);
    font-size: var(--ecc-font-size-medium);
    font-family: var(--ecc-input-font-family);
    font-weight: var(--ecc-input-font-weight);
    letter-spacing: var(--ecc-input-letter-spacing);
  }
  .skeleton-title {
    width: 30%;
    height: var(--ecc-font-size-medium);
  }
  .badge {
    height: var(--ecc-input-height-small);
  }
  .badge::part(base) {
    font-size: var(--ecc-font-size-small);
    font-family: var(--ecc-input-font-family);
    font-weight: var(--ecc-input-font-weight);
    letter-spacing: var(--ecc-input-letter-spacing);
    border-radius: var(--ecc-input-border-radius-small);
  }
  .lazy {
    display: flex;
    flex-direction: column;
    gap: var(--ecc-spacing-medium);
  }
  .skeleton-body {
    width: 100%;
    height: var(--ecc-font-size-medium);
  }
  sl-skeleton::part(base) {
    border-radius: var(--ecc-input-border-radius-medium);
    overflow: hidden;
  }
  .content {
    font-size: var(--ecc-font-size-medium);
    font-family: var(--ecc-input-font-family);
    font-weight: var(--ecc-input-font-weight);
    letter-spacing: var(--ecc-input-letter-spacing);
  }
  .hidden {
    visibility: hidden;
  }
  .collection {
    position: relative;
  }
`;

export default styles;
