import { html, repeat, when } from "@microsoft/fast-element";
import TESGetRuns from "./tesGetRuns.js";
import TESGetRun from "../../tes-get-run/index.js";

const loading = html<string>`<div class="loader">Loading</div>`;

const template = html<TESGetRuns>`
  ${when((x) => x.isLoading, loading)}
  <div class="container">
    ${repeat(
      (x) => x.data,
      html<TESGetRun>`
        ${when((x) => x.id === "", loading)}
        <ecc-tes-get-run
          class="run-item"
          @click=${(x) => x.handleClick}
          id=${(x) => x.id}
          state=${(x) => x.state}
        >
        </ecc-tes-get-run>
      `
    )}
  </div>
`;

export default template;
