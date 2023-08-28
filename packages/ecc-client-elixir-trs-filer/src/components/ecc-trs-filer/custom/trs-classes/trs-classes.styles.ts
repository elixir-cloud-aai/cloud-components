import { css, ElementStyles } from "@microsoft/fast-element";

export const styles: ElementStyles = css`
  * {
    color: black;
  }

  .styled-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    width: 100%;
  }

  .styled-table thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
  }

  .styled-table th {
    padding: 12px 15px;
    color: white;
  }
  .styled-table td {
    padding: 12px 15px;
  }

  .styled-table tbody tr {
    border-bottom: 1px solid #dddddd;
  }

  .styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
  }

  .styled-table tbody tr.active-row {
    font-weight: bold;
    color: #009879;
  }

  .styled-table .actions {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-top: 10px;
  }

  .buttonToolClass {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .button-toolclass {
    color: white;
    height: 25px;
    border-radius: 11px;
    background: var(--outlines-secondary, #b02d55);
  }

  .cancel-toolclass {
    color: white;
    height: 25px;
    border-radius: 11px;
    background: var(--outlines-secondary, #bfbfbf);
  }

  .edit {
    fill: #ffc107;
    cursor: pointer;
  }

  .delete {
    fill: #e62f63;
    cursor: pointer;
  }

  .cancel {
    fill: #e62f63;
    cursor: pointer;
  }

  .save {
    fill: #009879;
    cursor: pointer;
    align-self: center;
    justify-self: center;
  }

  .save-container {
    margin-top: 30px;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .actions {
    display: flex;
    gap: 30px;
  }

  .modalClass {
    padding: 20px;
    height: 100%;
  }

  .modalClass__upper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .modalClass__close {
    cursor: pointer;
  }

  fast-dialog::part(control) {
    background: white;
  }

  .modalClass__form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: black;
  }

  .modalClass__form-item {
    display: flex;
    flex-direction: column;
    color: black;
  }

  .button-row-modal {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 20px;
  }
`;
