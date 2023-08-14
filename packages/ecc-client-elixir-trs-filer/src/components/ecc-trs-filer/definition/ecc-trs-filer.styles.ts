import { css, ElementStyles } from "@microsoft/fast-element";

export const styles: ElementStyles = css`
  .trs-container {
    max-width: 1200px;
    margin-inline: auto;
    padding: 10px 20px;
    box-shadow: 0px 11px 20px 0px rgba(5, 16, 55, 0.1);
    border-radius: 10px;
    font-family: "Segoe UI", sans-serif;
  }

  .u-mt-md {
    margin-top: 1rem;
  }

  .custom-tabpanel {
    padding: 0;
  }

  fast-tabs::part(tablist) {
    padding: 0;
  }

  .button-create-tool {
    display: flex;
    justify-content: flex-end;
  }

  .create-tool {
    height: 25px;
    border-radius: 11px;
    background: var(--outlines-secondary, #b02d55);
  }

  .custom-tab:hover {
    color: black;
  }

  .custom-tab[aria-selected="true"]:hover {
    color: white;
  }
`;
