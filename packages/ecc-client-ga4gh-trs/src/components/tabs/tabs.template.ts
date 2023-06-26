import { html, repeat } from "@microsoft/fast-element";
import {
  allComponents,
  provideFASTDesignSystem,
} from "@microsoft/fast-components";
import { CustomTabs } from "./tabs.js";
import { Version } from "../ecc-trs/ecc-trs.interface.js";

provideFASTDesignSystem().register(allComponents);

export const template = html<CustomTabs>`

`;