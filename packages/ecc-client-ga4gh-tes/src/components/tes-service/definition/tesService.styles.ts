import { css } from '@microsoft/fast-element';

const styles = css`
  /* Common styles for all containers */
  .container {
    display: flex;
  }

  .template-container {
    border: 1px solid #ccc;
    margin: 0.4rem;
    padding: 0.3rem;
    border-radius: 0.4rem;
  }

  /* Styling for the main container */
  .outer-container {
  }

  /* Styling for arrays */
  .array-container {
  }

  .array-value {
    display: flex;
    flex-direction: column;
  }

  /* Styling for objects */
  .object-container {
  }

  .object-value {
  }

  .obj-name {
    font-weight: bold;
    flex-basis: 30%;
    text-transform: uppercase;
  }

  /* Styling for key-value pairs */
  .key-value {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .key {
    font-weight: bold;
    font-size: small;
    flex-basis: 30%;
    text-transform: uppercase;
  }

  .value {
    font-size: small;
    flex-basis: 70%;
  }

  /* Responsive styles for mobile devices */
  @media (max-width: 550px) {
    .outer-container {
    }

    .container {
      flex-direction: column;
    }

    .key-value {
      display: block;
    }

    .key {
      font-size: smaller;
    }

    .value {
      font-size: smaller;
    }
  }
`;

export default styles;
