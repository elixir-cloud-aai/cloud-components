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
  }

  .title {
    margin-right: 5px;
    font-weight: bold;
    font-size: 0.8rem;
  }

  .delete-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 10px;
    transition: color 0.2s ease, transform 0.2s ease;
  }

  .delete-icon:hover {
    transform: scale(1.1);
  }

  .expanded-container {
    padding: 1rem;
    color: black;
  }

  .meta-data {
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
  }

  .name,
  .description,
  .creation-time {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  .section-heading {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  .executor {
    padding: 0.5rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .image {
    margin-bottom: 0.5rem;
  }

  .command-list {
    margin-top: 0.5rem;
  }

  .command {
    padding: 0.2rem 1rem;
  }

  .log-entry {
    padding: 0.5rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .start-time,
  .end-time {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  .stdout,
  .exit-code,
  .user-id {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
`;

export default styles;
