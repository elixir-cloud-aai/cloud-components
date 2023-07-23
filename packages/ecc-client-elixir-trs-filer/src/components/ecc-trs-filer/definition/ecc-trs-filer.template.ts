import { html } from "@microsoft/fast-element";
import {
  allComponents,
  provideFASTDesignSystem,
} from "@microsoft/fast-components";
import type { TRS } from "./ecc-trs-filer.js";

provideFASTDesignSystem().register(allComponents);

export const template = html<TRS>`
  <div class="trs-container">
    <h1>TRS</h1>
    <fast-tabs>
      <fast-tab slot="tab">List of tools</fast-tab>
      <fast-tab slot="tab">List of tool classes</fast-tab>
      <fast-tab-panel slot="tabpanel" class="custom-tabpanel">
        <div class="u-mt-md"></div>
        <trs-list
          baseUrl="https://trs-filer-test.rahtiapp.fi/ga4gh/trs/v2"
        ></trs-list
      ></fast-tab-panel>
      <fast-tab-panel slot="tabpanel" class="custom-tabpanel">
        <div class="u-mt-md"></div>

        <trs-classes></trs-classes>
      </fast-tab-panel>
    </fast-tabs>
  </div>
`;
