import { html, repeat } from "@microsoft/fast-element";
import TESGetRuns from "./tesGetRuns.js";
import TESGetRun from "../../tes-get-run/index.js";

const template = html<TESGetRuns>`
  <div class="container">
    ${repeat(
      (x) => x.data,
      html<TESGetRun>`
        <ecc-tes-get-run
          class="run-container"
          @click=${(x) => x.handleClick()}
          id=${(x) => x.id}
          state=${(x) => x.state}
        >
        </ecc-tes-get-run>
      `
    )}
  </div>
`;

export default template;
