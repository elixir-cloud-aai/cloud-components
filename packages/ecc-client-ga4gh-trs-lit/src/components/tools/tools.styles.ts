import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    font-family: var(--ecc-font-family, sans-serif);
  }

  .container {
    padding: 1rem;
  }

  .tools-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .tool-item {
    padding: 1rem;
    border: 1px solid var(--ecc-border-color, #ccc);
    margin-bottom: 1rem;
    border-radius: 4px;
  }

  .loading {
    text-align: center;
    padding: 2rem;
  }

  .error {
    color: var(--ecc-error-color, red);
    padding: 1rem;
    border: 1px solid var(--ecc-error-color, red);
    border-radius: 4px;
    margin: 1rem 0;
  }
`;
