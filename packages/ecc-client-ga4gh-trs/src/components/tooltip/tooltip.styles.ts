import { css, ElementStyles } from '@microsoft/fast-element';

export const styles: ElementStyles = css`
  @keyframes tooltipFadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  body {
    padding: 16px;
  }

  .tooltip {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    color: blue;
    cursor: pointer;
    border-bottom: 1px dotted;
    position: relative;
  }

  .tooltip-dropdown {
    display: none;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    padding-top: 32px;
  }

  .tooltip-dropdown__content {
    color: white;
    background-color: black;
    border-radius: 4px;
    padding: 8px 12px;
    width: 300px;
    text-align: left;
  }

  .tooltip--open {
    .tooltip-dropdown {
      animation: tooltipFadeIn 0.15s;
      display: block;
    }
  }

  @media (hover: hover) {
    .tooltip:hover {
      .tooltip-dropdown {
        animation: tooltipFadeIn 0.15s;
        display: block;
      }
    }
  }
`;
