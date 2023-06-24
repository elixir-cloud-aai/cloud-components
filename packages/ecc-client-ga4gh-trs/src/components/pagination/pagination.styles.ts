import { css, ElementStyles } from "@microsoft/fast-element";

export const styles: ElementStyles = css`

.paginationContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 50px 0;
  }

  .pageCard {
    height: 36px;
    padding: 0 9px;
    background: transparent;
    border: 1px solid #b3b3b3;
    box-sizing: border-box;
    border-radius: 4px;
    margin: 0 2px;
    color: #333;
    cursor: pointer;

    &:hover:not([disabled]) {
      border: 1px solid #333;
      color: #333;
    }

    &.active {
      background: #333;
      border: 1px solid #333;
      color: #fff;

      &:hover {
        color: #fff;
      }
    }

    &[disabled] {
      cursor: not-allowed;
      color: #b3b3b3;
    }
  }

  .morePaginationIconContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    color: #b3b3b3;
  }

  .more-horizontal-icon {
  }

`;