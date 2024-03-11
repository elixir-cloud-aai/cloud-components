import { css } from "lit";

const styles = css`
  :host {
    display: block;
  }
  form {
    display: flex;
    flex-direction: column;
  }
  form sl-input {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  form sl-dropdown {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  form sl-switch {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .group-container {
    margin: 1rem 0;
  }
  .array-item,
  .group-item {
    margin: 1rem 0;
    border-style: solid;
    border-width: 0px 0px 1px 0px;
    border-color: var(--sl-color-gray-300);
  }
  .array-item {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .array-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .array-item-container {
    width: 100%;
  }
  .delete-icon {
    height: 1.25rem;
  }
  .add-icon {
    height: 1.1rem;
  }
  .switch-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  input[type="file"]::file-selector-button {
    height: 100%;
    background-color: #fff;
    border: 0px;
    border-right: 1px solid #d4d4d8;
    padding-right: 20px;
    padding-left: 20px;
    margin-right: 10px;
    font-size: 1rem;
  }
  input[type="file"] {
    background-color: #fff;
    border: 1px solid #d4d4d8;
    border-radius: 4px;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    height: 2.5rem;
    font-size: 1rem;
    color: #000;
  }
  .row {
    display: flex;
    flex-direction: column;
  }
  .success-icon {
    height: 1.25rem;
  }
  .error-icon {
    height: 1.25rem;
  }
`;

export default styles;
