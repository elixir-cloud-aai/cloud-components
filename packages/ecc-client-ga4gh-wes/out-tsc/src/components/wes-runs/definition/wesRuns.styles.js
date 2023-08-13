import { css } from '@microsoft/fast-element';
const styles = css `
  .container {
    display: block;
  }

  .search {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  fast-text-field {
    width: 100%;
  }

  fast-select {
    width: 25%;
  }

  .list {
    padding-bottom: 1rem;
  }

  .pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
    width: 100%;
    align-items: center;
  }

  @media (max-width: 450px) {
    .search {
      flex-direction: column;
    }
    fast-select {
      width: 100%;
    }
  }
`;
export default styles;
//# sourceMappingURL=wesRuns.styles.js.map