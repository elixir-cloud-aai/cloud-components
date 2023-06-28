import { css, ElementStyles } from "@microsoft/fast-element";

export const styles: ElementStyles = css`
  .page {
    font: 14px "Segoe UI", sans-serif;
    list-style: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 50px;
    border-radius: 6px;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.05);
    background: #ffffff;
  }

  .page__numbers,
  .page__btn,
  .page__dots {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 8px;
    font-size: 14px;
    cursor: pointer;
  }

  .page__dots {
    width: 26px;
    height: 26px;
    color: #23adade1;
    cursor: initial;
  }

  .page__numbers {
    width: 26px;
    height: 26px;
    border-radius: 4px;
  }

  .page__numbers:hover {
    color: #23adad;
  }

  .active {
    color: #ffffff;
    background: #23adad;
    font-weight: 600;
    border: 1px solid #23adad;
  }

  .active:hover {
    color: #ffffff;
    background: #23adad;
    font-weight: 600;
    border: 1px solid #23adad;
  }

  .page__btn {
    color: #23adade1;
  }
  .page__btn:hover {
    fill: #23adad;
  }
`;
