import { css } from "@microsoft/fast-element";

const styles = css`
  .name-tag {
    width: 200px;
    height: 100px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .name-tag .name {
    font-size: 24px;
    font-weight: bold;
  }

  .name-tag .title {
    font-size: 16px;
  }
`;

export default styles;
