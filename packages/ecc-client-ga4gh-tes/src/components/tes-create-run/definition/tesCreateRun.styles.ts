import { css } from '@microsoft/fast-element';

const styles = css`
  /* CSS styles for the form */
  .form-container {
    margin: 0 auto;
    padding: 0.4rem;
  }

  /* All the CSS that deals with labe and input field */
  .label-input {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0.4rem;
  }

  label {
    width: 100px;
  }

  fast-text-field {
    width: 50%;
  }

  .executors,
  .output,
  .resources,
  .tags {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .data-button {
    display: flex;
    justify-content: end;
  }

  fast-button {
    height: 1.8rem;
  }

  .add:hover {
    background-color: #4caf50;
  }

  .delete:hover {
    background-color: #d32f2f;
  }

  .submit-button-container {
    display: flex;
    justify-content: center;
    margin-top: 0.6em;
  }

  .submit-button {
    height: 2.5rem;
  }

  .submit-button:hover {
    background-color: #4caf50;
  }

  .submit-button:active {
    background-color: #4ccf50;
  }

  /* Media query for screens with a maximum width of 1024px */
  @media (max-width: 1024px) {
    fast-text-field {
      width: 65%;
    }
  }

  /* Media query for screens with a maximum width of 768px */
  @media (max-width: 768px) {
    .form-container {
      padding: 0.2rem;
    }

    fast-text-field {
      width: 90%;
    }

    .executors,
    .input,
    .output,
    .resources,
    .tags {
      grid-template-columns: 1fr;
    }

    .submit-button {
      height: 2rem;
    }
  }
`;

export default styles;
