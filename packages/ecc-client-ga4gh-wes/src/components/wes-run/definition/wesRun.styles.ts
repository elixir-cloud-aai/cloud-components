import { css } from '@microsoft/fast-element';

const styles = css`
  .slot-heading {
    color: black;
  }

  .collapsed-container {
    display: flex;
    border: none;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    align-items: center;
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

  .title {
    margin-right: 5px;
    font-weight: bold;
    font-size: 0.8rem;
  }
`;

export default styles;
