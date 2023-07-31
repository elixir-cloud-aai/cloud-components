import { css, ElementStyles } from "@microsoft/fast-element";

export const styles: ElementStyles = css`
  .accordionItem {
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

  .styled-table tbody tr.active-row {
    font-weight: bold;
    color: #009879;
  }

  .table-responsive {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  @media screen and (max-width: 768px) {
    .styled-table thead {
      display: none;
    }

    .styled-table tr {
      margin-bottom: 10px;
      display: block;
      border-bottom: 2px solid #009879;
    }

    .styled-table td {
      display: block;
      text-align: right;
      font-size: 13px;
      border-bottom: 1px dotted #ccc;
    }

    .styled-table td::before {
      content: attr(data-label);
      float: left;
      text-transform: uppercase;
      font-weight: bold;
    }
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

  .tabs {
    justify-content: flex-start;
  }

  .createVersionTabContent {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;
