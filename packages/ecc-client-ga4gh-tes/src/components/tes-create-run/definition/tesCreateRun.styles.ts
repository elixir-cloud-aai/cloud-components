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
  }

  .checkbox-field {
    margin-bottom: 10px;
  }

  .submit-button:hover {
    background-color: #45a049;
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
