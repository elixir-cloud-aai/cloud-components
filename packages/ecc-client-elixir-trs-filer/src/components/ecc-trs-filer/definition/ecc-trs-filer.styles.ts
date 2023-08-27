import { css, ElementStyles } from "@microsoft/fast-element";

export const styles: ElementStyles = css`
  .trs-container {
    max-width: 1200px;
    margin-inline: auto;
    padding: 10px 20px;
    box-shadow: 0px 11px 20px 0px rgba(5, 16, 55, 0.1);
    border-radius: 10px;
    font-family: "Segoe UI", sans-serif;
  }

  .u-mt-md {
    margin-top: 1rem;
  }

  .custom-tabpanel {
    padding: 0;
  }

  fast-tabs::part(tablist) {
    padding: 0;
  }

  .button-create-tool {
    display: flex;
    justify-content: flex-end;
  }

  .create-tool {
    height: 25px;
    border-radius: 11px;
    background: var(--outlines-secondary, #b02d55);
  }

  .custom-tab:hover {
    color: black;
  }

  .custom-tab[aria-selected="true"]:hover {
    color: white;
  }

  .modalTool {
    padding: 20px;
    height: 100%;
  }

  .modalTool__upper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: black;
  }

  .modalTool__close {
    cursor: pointer;
  }

  .modalTool__form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: black;
  }

  .modalTool__form-item {
    display: flex;
    flex-direction: column;
    color: black;
  }

  .modalTool__fieldset {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    color: black;
  }

  .modalTool__checkbox {
    color: black;
  }

  .u-tool {
    width: 100%;
    margin: 10px 0 20px 0;
  }

  .alert {
    position: relative;
    top: 10px;
    left: 0;
    width: auto;
    height: auto;
    padding: 10px;
    margin-bottom: 40px;
    border-radius: 5px;
    cursor: pointer;
    font-family: sans-serif;
    font-weight: 200;
    font-size: 14px;
    fill: #999;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .alert-primary {
    background-color: #eee;
    border: 1px solid #ddd;
    color: #999;
  }

  .alert-icon {
    opacity: 0.6;
  }
`;
