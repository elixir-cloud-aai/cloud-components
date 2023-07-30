import { css } from '@microsoft/fast-element';

const styles = css`
  .service-container {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
    background-color: #f9f9f9;
  }

  .service-container > div {
    display: flex;
    margin-bottom: 5px;
  }

  .service-container .key {
    font-weight: bold;
    width: 100px;
    flex-shrink: 0;
    margin-right: 5px;
  }

  .service-container .value {
    flex-grow: 1;
  }

  .subcontainer {
    display: flex;
    flex-wrap: wrap;
  }

  .subcontainer .key,
  .array-value {
    font-weight: bold;
  }

  .subcontainer .value,
  .array-value {
    margin-right: 10px;
  }
`;

export default styles;
