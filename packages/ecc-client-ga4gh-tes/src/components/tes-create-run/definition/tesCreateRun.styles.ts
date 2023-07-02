import { css } from '@microsoft/fast-element';

const styles = css`
  /* CSS styles for the form */
  .container {
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  label {
    display: flex;
    align-items: center;
    text-align: center;
    margin-right: 1rem;
  }

  .label-input {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 7px;
  }

  .checkbox-field {
    margin-bottom: 10px;
  }

  .submit-button:hover {
    background-color: #45a049;
  }

  .executor-container {
    margin: 30px 0;
    padding: 20px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }

  .executor-container .delete {
    display: flex;
    justify-content: flex-end;
  }

  .executor-container .heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .executors {
    margin-bottom: 30px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .executors .command {
    grid-column: 1/3;
    width: 100%;
  }

  .executors label {
    width: 70px;
    margin-right: 20px;
  }

  .executors fast-text-field {
    width: calc(100% - 120px);
  }

  .df {
    display: flex;
  }

  .sec {
    padding: 0.2rem 0.6rem;
    margin: 0.2rem 0.6rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .sub-sec {
    width: 100%;
    height: 100%;
    padding: 0.2rem 0.6rem;
  }

  /* Media query for responsive layout */
  @media screen and (max-width: 600px) {
    .form-container {
      max-width: 100%;
    }
  }
`;

export default styles;
