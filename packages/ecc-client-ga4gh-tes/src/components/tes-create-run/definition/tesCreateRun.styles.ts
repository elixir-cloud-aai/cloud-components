import { css } from '@microsoft/fast-element';

const styles = css`
  /* CSS styles for the form */
  .form-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .input-field {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .checkbox-field {
    margin-bottom: 10px;
  }

  .submit-button {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .submit-button:hover {
    background-color: #45a049;
  }

  .df{
    display: flex;
  }


  /* Media query for responsive layout */
  @media screen and (max-width: 600px) {
    .form-container {
      max-width: 100%;
    }
  }
`;

export default styles;
