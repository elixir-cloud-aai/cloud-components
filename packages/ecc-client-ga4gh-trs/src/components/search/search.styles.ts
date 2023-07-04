import { css, ElementStyles } from '@microsoft/fast-element';

export const styles: ElementStyles = css`
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
    font: 400 14px/20px 'Roboto', sans-serif;
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
