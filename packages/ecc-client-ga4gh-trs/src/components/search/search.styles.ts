import { css } from "@microsoft/fast-element";

const styles = css`
  .search {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .filter-card {
    display: none;
    background-color: #f0f0f0;
    padding: 20px;
    border-radius: 10px;
  }

  .filter-card.active {
    display: block;
  }

  .filter-icon {
    cursor: pointer;
  }
`;

export default styles;
