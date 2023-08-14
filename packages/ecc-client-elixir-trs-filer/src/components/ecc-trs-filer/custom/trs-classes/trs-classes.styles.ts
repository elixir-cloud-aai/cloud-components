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

  .clickable {
    font-weight: bold;
    color: blue;
    cursor: pointer;
  }

  .clickable:hover {
    color: white;
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

  .edit {
    fill: #ffc107;
    cursor: pointer;
  }

  .delete {
    fill: #e62f63;
    cursor: pointer;
  }

  .save {
    fill: #009879;
    cursor: pointer;
    margin: 10px;
    align-self: center;
    justify-self: center;
  }

  .actions {
    display: flex;
    gap: 30px;
  }
`;
