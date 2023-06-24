import { html, repeat } from "@microsoft/fast-element";
import {
  allComponents,
  provideFASTDesignSystem,
} from "@microsoft/fast-components";
import { CustomTabs } from "./tabs.js";
import { Version } from "../trs/trs.interface.js";

provideFASTDesignSystem().register(allComponents);

export const template = html<CustomTabs>`
<fast-tabs orientation="vertical">
    ${repeat(x => x.versions, html<Version>`
        <fast-tab slot="tab">${x => x.name}</fast-tab>
        <fast-tab-panel slot="tabpanel">
            <div>ID: ${x => x.id}</div>
            <div>Author: ${x => x.author.join(", ")}</div>
            <div>Meta Version: ${x => x.meta_version}</div>
        </fast-tab-panel>
    `)}
</fast-tabs>
`;