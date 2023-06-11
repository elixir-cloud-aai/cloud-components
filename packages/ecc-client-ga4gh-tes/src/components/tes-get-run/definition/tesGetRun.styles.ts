import { css } from "@microsoft/fast-element";

const styles = css`
  .container {
    display: block;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .collapsed-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f5f5f5;
    transition: background-color 0.3s ease;
  }

  .container:hover {
    background-color: #e0e0e0;
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

  .delete-icon,
  .reload-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 10px;
    color: #888;
    transition: color 0.2s ease, transform 0.2s ease;
  }

  .delete-icon:hover,
  .reload-icon:hover {
    color: #ff0000;
    transform: scale(1.1);
  }

  .expanded-container {
    padding: 1rem;
  }

  .meta-data {
    margin-bottom: 1rem;
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
    background-color: #f9f9f9;
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
    background-color: #f9f9f9;
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
    color: #555;
  }

  .loader,
  .loader:before,
  .loader:after {
    border-radius: 50%;
    width: 2.5em;
    height: 2.5em;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation: load7 1.8s infinite ease-in-out;
    animation: load7 1.8s infinite ease-in-out;
  }
  .loader {
    color: #ffffff;
    font-size: 10px;
    margin: 80px auto;
    position: relative;
    text-indent: -9999em;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
  .loader:before,
  .loader:after {
    content: "";
    position: absolute;
    top: 0;
  }
  .loader:before {
    left: -3.5em;
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  .loader:after {
    left: 3.5em;
  }
  @-webkit-keyframes load7 {
    0%,
    80%,
    100% {
      box-shadow: 0 2.5em 0 -1.3em;
    }
    40% {
      box-shadow: 0 2.5em 0 0;
    }
  }
  @keyframes load7 {
    0%,
    80%,
    100% {
      box-shadow: 0 2.5em 0 -1.3em;
    }
    40% {
      box-shadow: 0 2.5em 0 0;
    }
  }
`;

export default styles;
