import { css } from '@microsoft/fast-element';

const styles = css`
  .slot-heading {
    color: black;
  }

  .collapsed-container {
    display: flex;
    border: none;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .template-container {
    margin: 0.3rem;
    border: 1px solid #ccc;
    padding: 0.5rem;
    border-radius: 10px;
  }

  .right {
    margin-right: 10px;
  }

  .left {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .id {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .title {
    font-weight: bold;
    font-size: 0.8rem;
  }
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
  }

  .object-value {
  }

  .obj-name {
    font-weight: bold;
    color: #333;
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
    color: #333;
    flex-basis: 30%;
    text-transform: uppercase;
  }

  .value {
    color: black;
    flex-basis: 70%;
    overflow-x: scroll;
  }

  .value::-webkit-scrollbar {
    display: none;
  }

  /* Responsive styles for mobile devices */
  @media (max-width: 770px) {
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
