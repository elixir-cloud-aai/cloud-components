import { css } from '@microsoft/fast-element';
const styles = css `
  form {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .label-input {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
  }

  label {
    font-weight: bold;
    width: 300px;
  }

  input[type='text'],
  input[type='file'] {
    width: 100%; /* Inputs take 100% width of their parent */
    padding: 0.5rem; /* Use relative units for better responsiveness */
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 1rem; /* Use relative units for better responsiveness */
  }

  .submit {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button[type='submit'] {
    align-self: center;
    padding: 0.5rem 1rem; /* Use relative units for better responsiveness */
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem; /* Use relative units for better responsiveness */
  }

  ::file-selector-button {
    border: none;
    background: white;
    border: 1px solid #007bff;
    color: #007bff;
    transition: 0.8s;
    padding: 0.4rem;
    &:hover,
    &:focus {
      border-color: #007dff;
      color: white;
    }
    border-radius: 2rem;
  }

  ::file-selector-button:hover,
  ::file-selector-button:focus {
    box-shadow: inset 15rem 0 0 0 #007bff;
    color: white;
  }

  /* Media query for responsiveness on smaller screens */
  @media (max-width: 768px) {
    .label-input {
      flex-direction: column;
      align-items: start;
    }
  }
`;
export default styles;
//# sourceMappingURL=wesCreateRun.styles.js.map