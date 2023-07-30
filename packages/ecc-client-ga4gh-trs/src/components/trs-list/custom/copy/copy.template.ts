import { html } from "@microsoft/fast-element";
import {
  fastButton,
  provideFASTDesignSystem,
} from "@microsoft/fast-components";
import type { CopyClipboard } from "./copy.js";
import { copyIcon, doneIcon } from "../../../../assets/icons.js";

provideFASTDesignSystem().register(fastButton());

export const template = html<CopyClipboard>`
  <div class="clipboard input">
    <p>${(x) => x.value}dwdwe</p>
    <fast-button
      class="button"
      href="#"
      appearance="stealth"
      @click="${(x) => x.handleCopy()}"
    >
      ${(x) => (x.copied ? html`${doneIcon}` : html`${copyIcon}`)}
    </fast-button>
  </div>
`;
