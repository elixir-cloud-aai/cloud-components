import { css, ElementStyles } from "@microsoft/fast-element";

export const styles: ElementStyles = css`
  :host {
    display: block;
    contain: content;
  }

  :host([hidden]) {
    display: none;
  }

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
    color: black;
  }

  .styled-table tbody tr {
    border-bottom: 1px solid #dddddd;
  }

  .styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
  }

  .styled-table tbody tr.active-row {
    // font-weight: bold;
    color: #009879;
  }

  .space {
    height: 10px;
  }

  .tabContent {
    color: black;
  }

  .toolName {
    color: #414141;
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
    color: #000000;
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

  .filterContainer--tooltip {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
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

  .tab--version:hover {
    color: #000;
  }

  .tab--version[aria-selected="true"]:hover {
    color: #fff;
  }

  .edit {
    fill: #ffc107;
    cursor: pointer;
  }

  .delete {
    fill: #e62f63;
    cursor: pointer;
  }

  .styled-table .actions {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .save {
    fill: #009879;
    cursor: pointer;
    align-self: center;
    justify-self: center;
  }

  .horizontal {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }

  svg {
    cursor: pointer;
  }

  .modalVersion {
    padding: 20px;
    height: 100%;
  }

  .modalVersion__upper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .modalVersion__close {
    cursor: pointer;
  }

  .label-input {
    display: flex;
    flex-direction: column;
  }

  .checker-input {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }

  .container.meta {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .button {
    display: flex;
    justify-content: center;
  }

  .accordion {
    margin: 20px 0;
  }

  .data-button {
    display: flex;
    justify-content: flex-end;
    padding-top: 10px;
  }
  .inputs {
    padding-bottom: 10px;
  }

  .checkbox-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  fast-checkbox::part(label) {
    color: #000;
  }

  .checkbox-item {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .create-version {
    height: 30px;
    border-radius: 11px;
    background: var(--outlines-secondary, #b02d55);
    margin: 10px 0 20px 0;
    width: 100%;
  }

  fast-dialog::part(positioning-region)::part(dialog) {
    background-color: #fff;
  }

  .version-edit-inputs {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .version-edit-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }

  label {
    white-space: nowrap;
  }

  .u-w-full {
    width: 100%;
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .key {
    flex: 0.25;
    text-align: left;
    padding-right: 20px;
    font-style: italic;
  }

  .value {
    flex: 1;
  }
`;
