import { css, ElementStyles } from "@microsoft/fast-element";

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
    position: relative;
  }

  .tooltip-dropdown {
    display: none;
    position: absolute;
    top: 0;
    z-index: 2;
    padding-top: 32px;
    left: 65px;
    right: auto;
    transform: translateX(-127.633px);
  }

  .tooltip-dropdown__content {
    color: white;
    background-color: black;
    border-radius: 4px;
    padding: 8px 12px;
    width: 300px;
    text-align: left;
  }
  div.tooltip:hover div.tooltip-dropdown {
    animation: tooltipFadeIn 0.15s;
    display: block;
  }

  @media (hover: hover) {
    div.tooltip:hover div.tooltip-dropdown {
      animation: tooltipFadeIn 0.15s, -moz-tooltipFadeIn 0.15s; /* Added -moz- prefix for older Firefox versions */
      display: block;
    }
  }
`;
