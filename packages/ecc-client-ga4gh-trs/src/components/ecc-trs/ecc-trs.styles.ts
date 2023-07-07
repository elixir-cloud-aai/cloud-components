import { css, ElementStyles } from "@microsoft/fast-element";

export const styles: ElementStyles = css`
  .trs-container {
    max-width: 1200px;
    margin-inline: auto;
    padding: 10px 20px;
    box-shadow: 0px 11px 20px 0px rgba(5, 16, 55, 0.1);
    border-radius: 10px;
  }
  .accordionItem {
    color: black;
  }

  .styled-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  }

  .styled-table thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
  }

  .styled-table th,
  .styled-table td {
    padding: 12px 15px;
  }

  .styled-table tbody tr {
    border-bottom: 1px solid #dddddd;
  }

  .styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
  }

  .styled-table tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }

  .styled-table tbody tr.active-row {
    font-weight: bold;
    color: #009879;
  }

  .space {
    height: 10px;
  }

  .tabContent {
    color: black;
  }

  .toolName {
    color: #009879;
  }

  .input-container {
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 10px;
  }
  .searchInput {
    width: 100%;
  }

  .filterIcon {
    cursor: pointer;
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    fill: white;
  }

  .filterContainer {
    padding: 8px;
    box-shadow: 0px 11px 20px 0px rgba(5, 16, 55, 0.1);
    background-color: #ffffff;
    font: 400 14px/20px "Roboto", sans-serif;
  }

  .filterContainer--grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .filterContainer--label {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
    align-items: center;
    margin-top: 20px;
  }

  .tooltipIcon {
    cursor: pointer;
    fill: #009879;
  }
`;
