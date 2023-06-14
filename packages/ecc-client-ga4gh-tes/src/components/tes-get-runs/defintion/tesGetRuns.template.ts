import {
  provideFASTDesignSystem,
  fastAccordion,
} from "@microsoft/fast-components";
import { html, repeat, when } from "@microsoft/fast-element";
import TESGetRuns from "./tesGetRuns.js";
import TESGetRun from "../../tes-get-run/index.js";

provideFASTDesignSystem().register(fastAccordion());

const loading = html<string>`<div class="loader">Loading</div>`;

const template = html<TESGetRuns>`
  ${when((x) => x.isLoading, loading)}
  <div class="container">
    <fast-accordion>
      ${repeat(
        (x) => x.data,
        html<TESGetRun>`
          <ecc-tes-get-run
            class="run-item"
            id=${(x) => x.id}
            state=${(x) => x.state}
          >
          </ecc-tes-get-run>
        `
      )}
    </fast-accordion>
  </div>
`;

export default template;
