import { html } from "@microsoft/fast-element";
import {
  allComponents,
  provideFASTDesignSystem,
} from "@microsoft/fast-components";
import type { CopyClipboard } from "./copy.js";
import { copyIcon, doneIcon } from "../../../../assets/icons.js";

provideFASTDesignSystem().register(allComponents);

export const template = html<CopyClipboard>`
  <head>
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/@microsoft/fast-components/dist/fast-components.min.js"
    ></script>
  </head>
  <body>
    <div class="clipboard input">
      <p>${(x) => x.value}</p>
      <fast-button
        class="button"
        href="#"
        appearance="stealth"
        @click="${(x) => x.handleCopy()}"
      >
        ${(x) =>
          x.copied
            ? html`<div class="doneIcon">${doneIcon}</div>`
            : html`<div class="copyIcon">${copyIcon}</div>`}
      </fast-button>
    </div>
  </body>
`;
