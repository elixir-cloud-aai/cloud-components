import {
  provideFASTDesignSystem,
  fastSkeleton,
  fastAccordion,
  fastAccordionItem,
} from "@microsoft/fast-components";
import { html, repeat, when } from "@microsoft/fast-element";
import TESGetRuns from "./tesGetRuns.js";
import TESGetRun from "../../tes-get-run/index.js";

provideFASTDesignSystem().register(
  fastAccordion(),
  fastAccordionItem(),
  fastSkeleton()
);

const template = html<TESGetRuns>`
  <div class="container">
    <fast-accordion>
      ${when(
        (x) => x.isLoading,
        html` ${repeat(
          (x) => Array.from(Array(parseInt(x.pageSize, 10))),
          html`
            <fast-accordion-item>
              <fast-skeleton
                style="border-radius: 4px;height: 100%;margin-bottom: 10px;"
                shape="rect"
                slot="heading"
              ></fast-skeleton>
            </fast-accordion-item>
          `
        )}`
      )}
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
