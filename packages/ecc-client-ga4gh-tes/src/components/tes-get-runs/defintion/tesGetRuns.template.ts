import { html } from "@microsoft/fast-element";
import TESGetRuns from "./tesGetRuns.js";

const template = html<TESGetRuns>` <div>${(x) => x.data}</div> `;

export default template;
