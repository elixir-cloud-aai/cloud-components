import { css } from "@microsoft/fast-element";

const styles = css`
  .input-container {
    display: flex;
    width: 280px;
    height: 48px;
    position: relative;
    border-radius: 8px;
    border: 1px solid #c0c0c0;
    padding: 0 16px;
    box-sizing: border-box;
  }

  .input-container input {
    width: 100%;
    height: 80%;
    border: none;
    font-size: 16px;
    font-family: 'Segoe UI';
  }

  .input-container input:focus {
    outline: none;
    // border: 2px solid blue;
  }

  .search-icon {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
  }

  .input-container.search input {
    padding-left: 32px;
  }
`;

export default styles;
