import { html } from "@microsoft/fast-element";
import TESGetRun from "./tesGetRun.js";

const template = html<TESGetRun>`
  <div class="block-list">
    ${(x) => html`
      <div class="block-component">
        <span class="id">${x.id}</span>
        <span class="status">${x.state}</span>
      </div>
    `}
  </div>
`;

export default template;
