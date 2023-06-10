import { css } from "@microsoft/fast-element";

const styles = css`
  .container {
    display: block;
  }

  .collapsed-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f5f5f5;
    transition: background-color 0.3s ease;
  }

  .container:hover {
    background-color: #e0e0e0;
  }

  .right {
    margin-right: 10px;
  }

  .left {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .id {
    display: flex;
    align-items: center;
  }

  .id-heading {
    margin-right: 5px;
    font-weight: bold;
    font-size: 0.8rem;
  }

  .delete-icon,
  .reload-icon {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    margin: 10px;
  }

  .delete-icon:hover,
  .reload-icon:hover {
    transform: scale(1.1);
  }
`;

export default styles;
