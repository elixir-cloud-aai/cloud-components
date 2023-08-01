import { css } from '@microsoft/fast-element';

const styles = css`
  /* Common styles for all containers */
  .container {
    display: flex;
  }

  /* Styling for the main container */
  .outer-container {
    padding: 1rem;
    background-color: #f9f9f9;
  }

  /* Styling for arrays */
  .array-container {
  }

  .array-value {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  /* Styling for objects */
  .object-container {
    border-bottom: 1px solid #ccc;
    // margin: 0.4rem 0rem;
  }

  .object-value {
  }

  .obj-name {
    margin-bottom: 1rem;
    font-weight: bold;
    color: #333;
    flex-basis: 30%;
    text-transform: uppercase;
    border-top: 1px solid #ccc;
  }

  /* Styling for key-value pairs */
  .key-value {
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .key {
    font-weight: bold;
    color: #333;
    flex-basis: 30%;
    text-transform: uppercase;
  }

  .value {
    flex-basis: 70%;
  }

  /* Responsive styles for mobile devices */
  @media (max-width: 550px) {
    /* 48rem equals 768px (768px / 16px = 48rem) */
    /* Reduce padding for the main container */
    .outer-container {
      padding: 0.5rem;
    }

    .container {
      flex-direction: column;
    }

    .key-value {
      display: block;
    }

    .value {
      font-size: smaller;
    }
  }
`;

export default styles;
