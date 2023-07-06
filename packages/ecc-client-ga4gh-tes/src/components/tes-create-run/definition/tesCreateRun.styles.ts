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
    width: 70%;
  }

  .executors,
  .input,
  .output,
  .resources {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .data-button {
    display: flex;
    justify-content: end;
  }

  fast-button {
    height: 2rem;
  }

  fast-checkbox {
    color: red !important;
  }
`;

export default styles;
