import { css } from "lit";

const styles = css`
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
  .icon {
    height: var(--ecc-input-font-size-large);
    width: var(--ecc-input-font-size-large);
  }

  /* Details */
  .key,
  .value {
    font-size: var(--ecc-input-label-font-size-medium);
    font-family: var(--ecc-input-font-family);
    font-weight: var(--ecc-input-font-weight);
    letter-spacing: var(--ecc-input-letter-spacing);
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

export default styles;
