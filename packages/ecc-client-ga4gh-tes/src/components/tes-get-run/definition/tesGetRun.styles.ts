import { css } from "@microsoft/fast-element";

const styles = css`
  .block-list {
    margin: 16px;
  }

  .block-component {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    border: 1px solid #ccc;
    margin-bottom: 8px;
  }

  .block-component .id {
    font-weight: bold;
    margin-right: 16px;
  }

  .block-component .status {
    flex-grow: 1;
    text-align: right;
  }
`;

export default styles;
